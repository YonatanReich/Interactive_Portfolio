// src/GlassPanel.jsx
import { useBox } from '@react-three/cannon'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { useStore } from '../store.js'
import { easing } from 'maath'

export default function GlassPanel({ position, label, speed = 1, range = 1, id }) {
  // 1. Physics Body
  const [ref, api] = useBox(() => ({
    type: 'Kinematic', 
    position: position,
    args: [3, 2, 0.2] 
  }))

  const activeTarget = useStore((state) => state.activeTarget)
  const isTargeted = activeTarget === id

  const startPos = useRef(position)
  const meshRef = useRef()

  useLayoutEffect(() => {
    if (meshRef.current) {
        meshRef.current.name = "GlassPanel"
        meshRef.current.userData = { id }
    }
  }, [id])
   
  // 2. Animation Loop
  // FIX: Pass (state, delta) correctly as two separate arguments
  useFrame((state, delta) => {
    // FIX: Access .clock from the 'state' variable
    const t = state.clock.getElapsedTime() * speed
    
    const newX = startPos.current[0] + Math.sin(t) * (range * 0.5)
    const newY = startPos.current[1] + Math.cos(t) * range
    
    api.position.set(newX, newY, startPos.current[2])

    if (meshRef.current) {
      const targetScale = isTargeted ? 1.15 : 1
      const targetColor = isTargeted ? "white" : "#34648a"

      easing.damp3(meshRef.current.scale, targetScale, 0.2, delta)
      easing.dampC(meshRef.current.material.color, targetColor, 0.2, delta)
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