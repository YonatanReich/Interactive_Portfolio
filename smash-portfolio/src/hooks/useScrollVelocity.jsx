// src/hooks/useScrollVelocity.jsx
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store' // Import to check active state

const AUTO_SPEED = 10          // Base speed (Walking)
const SCROLL_SENSITIVITY = 0.1
const MAX_SCROLL_SPEED = 60
const FRICTION = 0.95
const dir_btn_accl = 1.5

export function useScrollVelocity() {
  const totalVelocity = useRef(AUTO_SPEED)
  const userVelocity = useRef(0)
  const momentum = useRef(0)
    const activeTarget = useStore((state) => state.activeTarget)
    const scrollDirection = useStore((state) => state.scrollDirection)

  useEffect(() => {
    const handleWheel = (e) => {
      // 1. Add scroll input to momentum
      momentum.current += e.deltaY * SCROLL_SENSITIVITY
      momentum.current = THREE.MathUtils.clamp(momentum.current, -MAX_SCROLL_SPEED, MAX_SCROLL_SPEED)
    }
    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useFrame((state, delta) => {
    const safeDelta = delta > 0.1 ? 0.1 : delta

    // 2. If a panel is open, FREEZE everything
    if (activeTarget) {
        totalVelocity.current = 0
        userVelocity.current = 0
        momentum.current = 0 // Kill momentum so it doesn't jump when you close
        return
      }
      
      if (scrollDirection !== 0) {
          momentum.current += scrollDirection * dir_btn_accl
      }
    
    // 3. Apply Friction
    momentum.current *= FRICTION
    if (Math.abs(momentum.current) < 0.01) momentum.current = 0
    
    // 4. Calculate Final Velocity
      userVelocity.current = momentum.current
      totalVelocity.current = AUTO_SPEED + momentum.current
      
  })

  return {total: totalVelocity, user: userVelocity }
}