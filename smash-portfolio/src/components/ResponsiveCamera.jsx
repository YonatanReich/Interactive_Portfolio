import { useEffect, useRef } from 'react'
import { CameraControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useStore } from '../store'

export default function ResponsiveCamera() {
  const controls = useRef()
  const activeTarget = useStore((state) => state.activeTarget)
  
  // 1. GET SCREEN SIZE
  const { size } = useThree()
  
  // 2. CALCULATE "HOME" POSITION
  // If mobile (<1000px), pull back to z=30. If Desktop, z=12.
  const isMobile = size.width < 1000
  const homeZ = isMobile ? 30 : 12

  useEffect(() => {
    if (!controls.current) return

    if (activeTarget) {
      // === MODE: ZOOMED IN (Tunnel) ===
      // Disable controls so user is locked in
      controls.current.mouseButtons.left = 0 
      controls.current.mouseButtons.right = 0
      controls.current.mouseButtons.wheel = 0
      controls.current.touches.one = 0
      controls.current.touches.two = 0

      // Move camera deep into the tunnel (adjust Z as needed)
      controls.current.setLookAt(0, 0, -5, 0, 0, -20, true)
    } 
    else {
      // === MODE: OVERVIEW (Home) ===
      // Re-enable controls
      controls.current.mouseButtons.left = 1 
      controls.current.mouseButtons.right = 2
      controls.current.mouseButtons.wheel = 8
      
      // FIX: Use the calculated 'homeZ' variable here!
      // This ensures we return to z=30 on mobile, or z=12 on desktop.
      controls.current.setLookAt(
        0, 0, homeZ, // <--- DYNAMIC POSITION
        0, 0, 0,     // Look at center
        true         // Smooth transition
      )
    }
  }, [activeTarget, homeZ]) // <--- Re-run if target changes OR screen resizes

  return (
    <CameraControls 
      ref={controls} 
      smoothTime={0.8} 
      maxDistance={40} // increased max distance to allow mobile view
    />
  )
}