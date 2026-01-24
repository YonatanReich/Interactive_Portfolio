// src/components/BallManager.jsx
import { useState, useRef, useEffect, use } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import wallHitEffect from '/wall_sound.wav'
import {Howl} from 'howler'

// --- CONFIGURATION ---
const BALL_SPEED = 60 // Fast throw
const GRAVITY = 30    // Heavy metal ball
const TUNNEL_SPEED = 10 // Must match TunnelSystem speed to sync perfectly
const wallHitSound = new Howl({
  src: [wallHitEffect],
    html5: false
});

function Ball({ id, startPos, startDir, onRemove }) {
  const mesh = useRef()
  const velocity = useRef(startDir.clone().multiplyScalar(BALL_SPEED))
    const isStuck = useRef(false)
    const hitObjects = useRef(new Set())
    

  useFrame((state, delta) => {
    if (!mesh.current) return
    
    const safeDelta = Math.min(delta, 0.1) // Prevent glitching on lag spikes

    // 1. BEHAVIOR: IF STUCK
    if (isStuck.current) {
      // Move backwards with the tunnel
      mesh.current.position.z += TUNNEL_SPEED * safeDelta
      
      // If it goes behind the camera, delete it
      if (mesh.current.position.z > 50) {
        onRemove(id)
      }
      return
    }

    // 2. BEHAVIOR: IF FLYING
    // Apply Gravity
    velocity.current.y -= GRAVITY * safeDelta
    
    // Move ball
    mesh.current.position.addScaledVector(velocity.current, safeDelta)

    // 3. COLLISION DETECTION
    // Raycast forward to see if we hit a wall
    const raycaster = new THREE.Raycaster(
        mesh.current.position, 
        velocity.current.clone().normalize(), 
        0, 
        2 // Check 2 units ahead
    )
    
    // Check intersection with anything named "TunnelWall"
    const hits = raycaster.intersectObjects(state.scene.children, true)
    for (const hit of hits) {
        
        // HIT GLASS (Trigger)
        if (hit.object.name === "GlassPanel") {
            if (!hitObjects.current.has(hit.object.uuid)) {
                hitObjects.current.add(hit.object.uuid)
                
                // FIX 3: Store the ORIGINAL color, then flash
                const originalColor = hit.object.material.color.getHex()
                hit.object.material.color.set('#ff4444') 

                setTimeout(() => {
                    // Restore the exact color it had before
                    hit.object.material.color.setHex(originalColor)
                }, 300)
            }
            // Do NOT break here. The ball passes through glass, 
            // so we might still need to hit a wall behind it in the same frame.
        }

        // HIT WALL (Solid)
        else if (hit.object.name === "TunnelWall") {

           wallHitSound.play();
                

            isStuck.current = true
            const normal = hit.face.normal.clone()
            normal.transformDirection(hit.object.matrixWorld)
            const radiusOffset = normal.multiplyScalar(0.4)
            mesh.current.position.copy(hit.point).add(radiusOffset)

            
            
            // BREAK! We hit a solid wall. Stop checking things behind it.
            break; 
        }
    }

    

    // Cleanup if missed and flew into void
    if (mesh.current.position.y < -50 || mesh.current.position.z < -300) {
      onRemove(id)
    }
  })

  return (
    <mesh ref={mesh} position={startPos}>
      <sphereGeometry args={[0.4, 32, 32]} />
      {/* SHINY CHROME MATERIAL */}
      <meshStandardMaterial 
        color="#0084ff" 
        metalness={1} 
        roughness={0.4} 
        envMapIntensity={2} 
      />
    </mesh>
  )
}

export default function BallManager() {
  const [balls, setBalls] = useState([])
  const { camera, pointer, raycaster, gl } = useThree()

  useEffect(() => {
    const handlePointerDown = () => {
      // 1. Calculate Throw Direction based on where user clicked
      raycaster.setFromCamera(pointer, camera)
      
      const direction = raycaster.ray.direction.clone()
      // Adjust start position slightly below camera (like holding a gun)
      const startPos = camera.position.clone().add(new THREE.Vector3(0.5, -1, 0))

      const newBall = {
        id: Date.now() + Math.random(),
        startPos: startPos,
        startDir: direction
      }

      setBalls((prev) => [...prev, newBall])
    }

    // Attach to the canvas DOM element specifically
    gl.domElement.addEventListener('pointerdown', handlePointerDown)
    return () => gl.domElement.removeEventListener('pointerdown', handlePointerDown)
  }, [camera, pointer, raycaster, gl])

  const removeBall = (id) => {
    setBalls((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <>
      {balls.map((ball) => (
        <Ball key={ball.id} {...ball} onRemove={removeBall} />
      ))}
    </>
  )
}