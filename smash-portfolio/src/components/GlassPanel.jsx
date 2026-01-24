// src/GlassPanel.jsx
import { useBox } from '@react-three/cannon'
import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useRef, useState } from 'react'

export default function GlassPanel({ position, label, speed = 1, range = 1, id }) {
  // 1. Physics Body: 'Kinematic' means it moves but isn't affected by gravity
  const [ref, api] = useBox(() => ({
    type: 'Kinematic', 
    position: position,
    args: [3, 2, 0.2] 
  }))

  // Store the initial starting position
  // We use a "ref" so the value persists without causing re-renders
  const startPos = useRef(position)

  const meshRef = useRef()
  

    useLayoutEffect(() => {
        if (meshRef.current) {
            meshRef.current.name = "GlassPanel"
            meshRef.current.userData = { id }
        }
    }, [id])
            





    
  // 2. Animation Loop
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    
    // Calculate new positions based on a Sine wave
    // x: oscillates slightly left/right
    // y: oscillates up/down (floating effect)
    const newX = startPos.current[0] + Math.sin(t) * (range * 0.5)
    const newY = startPos.current[1] + Math.cos(t) * range

    // Apply the new position to the PHYSICS body
    api.position.set(newX, newY, startPos.current[2])
  })

  return (
    <group ref={ref}>
      <mesh ref={meshRef}>
        <boxGeometry args={[3, 2, 0.2]} />
        <meshPhysicalMaterial 
          color="#34648a" 
          transmission={0.95} // High transparency
          opacity={0.1} 
          metalness={0} 
          roughness={0}       // Perfectly smooth glass
          ior={1.5}           // Index of Refraction (standard glass)
          thickness={2}       // Important: gives the glass volume
                  envMapIntensity={2}
            clearcoat={1}       // Super shiny
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
          <mesh/>
    </group>
  )
}