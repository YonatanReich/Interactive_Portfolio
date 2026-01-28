import { useState, useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Howl } from 'howler'
import { useStore } from '../store.js'

// --- CONFIGURATION ---
const BALL_SPEED = 60
const GRAVITY = 30
const TUNNEL_SPEED = 10 

// Wall Hit Sound (Global)
const wallHitSound = new Howl({
  src: ['/wall_sound.wav'],
  html5: false,
});

// Throw Sound (Global - Preloaded)
const throwSound = new Howl({
    src: ['/ball_hit.mp3'], // Make sure this filename matches your project
    volume: 0.5,
    html5: false
});

function Ball({ id, startPos, startDir, onRemove }) {
  const mesh = useRef()
  const velocity = useRef(startDir.clone().multiplyScalar(BALL_SPEED))
  const isStuck = useRef(false)
  const hitObjects = useRef(new Set())
  const isMuted = useStore((state) => state.activeTarget)

  useFrame((state, delta) => {
    if (!mesh.current) return
    const safeDelta = Math.min(delta, 0.1)

    // 1. STUCK BEHAVIOR
    if (isStuck.current) {
      mesh.current.position.z += TUNNEL_SPEED * safeDelta
      if (mesh.current.position.z > 50) onRemove(id)
      return
    }

    // 2. FLYING BEHAVIOR
    velocity.current.y -= GRAVITY * safeDelta
    mesh.current.position.addScaledVector(velocity.current, safeDelta)

    // 3. COLLISION
    const raycaster = new THREE.Raycaster(
        mesh.current.position, 
        velocity.current.clone().normalize(), 
        0, 
        2 
    )
    
    const hits = raycaster.intersectObjects(state.scene.children, true)
    
    for (const hit of hits) {
      // HIT GLASS
      if (hit.object.name === "GlassPanel") {
        if (!hitObjects.current.has(hit.object.uuid)) {
          hitObjects.current.add(hit.object.uuid)
          const targetId = hit.object.userData.id
          if (targetId) useStore.getState().setTarget(targetId)
        }
      }
      // HIT WALL
      else if (hit.object.name === "TunnelWall") {
        if (!isMuted) wallHitSound.play();
        
        isStuck.current = true
        const normal = hit.face.normal.clone()
        normal.transformDirection(hit.object.matrixWorld)
        mesh.current.position.copy(hit.point).add(normal.multiplyScalar(0.42))
        break; 
      }
    }

    // CLEANUP
    if (mesh.current.position.y < -50 || mesh.current.position.z < -300) {
      onRemove(id)
    }
  })

  return (
    <mesh ref={mesh} position={startPos}>
      <sphereGeometry args={[0.4, 32, 32]} />
      <meshPhysicalMaterial 
          color="#ffffff" 
          transmission={0.95} 
          opacity={0.1} 
          metalness={0} 
          roughness={0}       
          ior={1.5}           
          thickness={2}       
          envMapIntensity={2}
          clearcoat={1}       
        />
    </mesh>
  )
}

export default function BallManager() {
  const [balls, setBalls] = useState([])
  
  // 1. ACCESS STORE
  const target = useStore((state) => state.target)
  const isMuted = useStore((state) => state.isMuted)

  // 2. CREATE A LIVE REF FOR THE TARGET
  // This ensures the event listener always sees the REAL value instantly
  const targetRef = useRef(target)

  // Sync ref whenever target changes
  useEffect(() => {
    targetRef.current = target
  }, [target])

  const { gl, get } = useThree() 
  
  useEffect(() => {
    const handlePointerDown = (e) => {
        
      // 🛑 STOP SIGN: Check the REF, not the state variable directly
      if (targetRef.current) return 

      // Prevent clicking through UI buttons (extra safety)
      if (e.target.closest('button') || e.target.closest('a')) return

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
      
      // Play Throw Sound
      if (!isMuted) {
          throwSound.play()
      }
    }

    // Attach listener
    gl.domElement.addEventListener('pointerdown', handlePointerDown)
    return () => gl.domElement.removeEventListener('pointerdown', handlePointerDown)
    
  }, [gl, isMuted]) // Depend only on gl/mute

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