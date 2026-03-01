import { useState, useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Howl } from 'howler'
import { useStore } from '../store.js'
import { useScrollVelocity } from '../hooks/useScrollVelocity.jsx'

// --- CONFIGURATION ---
const BALL_SPEED = 60
const GRAVITY = 30
const upaward_arc = 8

// Wall Hit Sound
const wallHitSound = new Howl({
  src: ['/wall_sound.wav'],
  html5: false,
});

// Throw Sound
const throwSound = new Howl({
    src: ['/ball_hit.mp3'], 
    volume: 0.5,
    html5: false
});

function Ball({ id, startPos, startDir, onRemove }) {
  const isMuted = useStore((state) => state.isMuted)
  
  const mesh = useRef()
// 1. Calculate the initial velocity vector first
  const initialVel = startDir.clone().multiplyScalar(BALL_SPEED);
  
  // 2. Adding the upward aim assist 
  initialVel.y += upaward_arc; // Or use your UPWARD_ARC variable
  // 3. Pass the final calculated vector into the ref
  const velocity = useRef(initialVel);
  const isStuck = useRef(false)
  const hitObjects = useRef(new Set())

  // 1. NEW REFS FOR SYNCING
  const stuckTo = useRef(null)               // The actual wall mesh we hit
  const stuckOffset = useRef(new THREE.Vector3()) // The position relative to that wall

  useFrame((state, delta) => {
    if (!mesh.current) return
    const safeDelta = Math.min(delta, 0.1)

    // 2. FIXED STUCK BEHAVIOR
    if (isStuck.current && stuckTo.current) {
        // Instead of moving Z manually, we calculate where the anchor point is now
        // This ensures perfect sync even if the tunnel scrolls, jumps, or stops.
        const worldPos = stuckOffset.current.clone()
        stuckTo.current.localToWorld(worldPos)
        mesh.current.position.copy(worldPos)

        // Check if it has moved out of view (using World Position)
        if (mesh.current.position.z > 50) {
            onRemove(id)
        }
        return
    }

    // 3. FLYING BEHAVIOR
    velocity.current.y -= GRAVITY * safeDelta 
    mesh.current.position.addScaledVector(velocity.current, safeDelta)

    // 4. COLLISION
    const raycaster = new THREE.Raycaster(
        mesh.current.position, 
        velocity.current.clone().normalize(), 
        0, 
        2 
    )
    
    const hits = raycaster.intersectObjects(state.scene.children, true)
    
    for (const hit of hits) {
      if (hit.object.name === "GlassPanel") {
        if (!hitObjects.current.has(hit.object.uuid)) {
          hitObjects.current.add(hit.object.uuid)
          const targetId = hit.object.userData.id
          if (targetId) useStore.getState().setTarget(targetId)
        }
      }
      else if (hit.object.name === "TunnelWall") {
        if (!isMuted) wallHitSound.play();
        
        isStuck.current = true
        
        // A. Visual Snap
        const normal = hit.face.normal.clone()
        normal.transformDirection(hit.object.matrixWorld)
        mesh.current.position.copy(hit.point).add(normal.multiplyScalar(0.42))

        // B. PARENTING LOGIC (The Fix)
        // We save the wall we hit and calculate our offset relative to it
        stuckTo.current = hit.object
        stuckOffset.current.copy(mesh.current.position)
        stuckTo.current.worldToLocal(stuckOffset.current) // Converts world pos -> local pos

        break; 
      }
    }

    // Cleanup void balls
    if (mesh.current.position.y < -50 || mesh.current.position.z < -300) {
      onRemove(id)
    }
  })

  return (
    <mesh ref={mesh} position={startPos}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshPhysicalMaterial 
          color="#ffffff" transmission={0.95} opacity={0.1} metalness={0} roughness={0}       
          ior={1.5} thickness={2} envMapIntensity={2} clearcoat={1}       
        />
    </mesh>
  )
}

export default function BallManager() {
  const [balls, setBalls] = useState([])
  const { gl, get } = useThree() 
  
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (e.target !== gl.domElement) return;
      if (useStore.getState().target) return; 

      const { camera, raycaster, pointer } = get() 
      raycaster.setFromCamera(pointer, camera)
      const direction = raycaster.ray.direction.clone()
      const startPos = camera.position.clone().add(new THREE.Vector3(0.5, -1, 0))

      const newBall = {
        id: Date.now() + Math.random(),
        startPos: startPos,
        startDir: direction
      }

      setBalls((prev) => [...prev, newBall])
      
      if (!useStore.getState().isMuted) {
          throwSound.play()
      }
    }

    gl.domElement.addEventListener('pointerdown', handlePointerDown)
    return () => gl.domElement.removeEventListener('pointerdown', handlePointerDown)
    
  }, [gl])

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