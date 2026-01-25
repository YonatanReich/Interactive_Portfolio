// src/components/GlassPanel.jsx
import { useBox } from '@react-three/cannon'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { useStore } from '../store.js'
import { easing } from 'maath'
import * as THREE from 'three'

export default function GlassPanel({ position, label, speed = 1, range = 1, id }) {
  // 1. Physics Body
  const [ref, api] = useBox(() => ({
    type: 'Kinematic', 
    position: position,
    args: [3, 2, 0.2] 
  }))

  const activeTarget = useStore((state) => state.activeTarget)
  const isTargeted = activeTarget === id

  // FIX: Convert the 'position' array to a Vector3 so we can use .x / .y / .z later
  const startPos = useRef(new THREE.Vector3(...position))
  const meshRef = useRef()

  useLayoutEffect(() => {
    if (meshRef.current) {
        meshRef.current.name = "GlassPanel"
        meshRef.current.userData = { id }
    }
  }, [id])
   
  // 2. Animation Loop
  useFrame((state, delta) => {
    // Safety check: ensure ref exists before animating
    if (!ref.current) return

    // 1. Determine our Goal Position & Scale based on state
    const goalPos = new THREE.Vector3()
    const goalScale = new THREE.Vector3()

    if (isTargeted) {
      // === ACTIVE MODE ===
      // Move to center of tunnel (z=-15) and grow huge
      goalPos.set(0, 0, -20)
      goalScale.set(2, 2, 1) 
    } else {
      // === IDLE MODE ===
      // Float around original start position
      const t = state.clock.getElapsedTime() * speed
      const hoverY = Math.cos(t) * range
      
      // FIX: Now startPos.current.x works because it's a Vector3
      goalPos.set(
        startPos.current.x, 
        startPos.current.y + hoverY, 
        startPos.current.z
      )
      goalScale.set(1, 1, 1) // Reset to normal size
    }

    // 2. Smoothly Animate the VISUAL GROUP (ref)
    easing.damp3(ref.current.position, goalPos, 0.3, delta)
    easing.damp3(ref.current.scale, goalScale, 0.3, delta)
    
    // 3. Sync the PHYSICS BODY
    // "Teleport" the physics box to match our smooth visual animation
    api.position.set(
      ref.current.position.x, 
      ref.current.position.y, 
      ref.current.position.z
    )

    // 4. Child Mesh Effects (Color/Opacity)
    if (meshRef.current) {
      const targetColor = isTargeted ? "#000000" : "#34648a"
      const targetOpacity = isTargeted ? 0.8 : 0.2
      
      easing.dampC(meshRef.current.material.color, targetColor, 0.2, delta)
      easing.damp(meshRef.current.material, 'opacity', targetOpacity, 0.2, delta)
    }
  })

  return (
    <group ref={ref}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 2, 0.2]} />
        <meshPhysicalMaterial 
          color="#34648a" 
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

      <Text 
        position={[0, 0, 0.15]} 
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>

    </group>
  )
}