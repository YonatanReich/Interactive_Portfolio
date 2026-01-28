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
      controls.current.setLookAt(0, 0, -10, 0, 0, -20, true)
    } else {
  const timer = setTimeout(() => {
          
        // 1. Re-enable Controls
        controls.current.mouseButtons.left = 1 
        controls.current.mouseButtons.right = 2
        controls.current.mouseButtons.wheel = 8
        
        // 2. Move Camera Home
        controls.current.setLookAt(
          0, 0, homeZ, 
          0, 0, 0,     
          true         
        )
      }, 300) // <--- 800ms DELAY HERE

      // Cleanup: If user clicks a panel quickly before the timer ends, 
      // cancel this timer so we don't accidentally zoom out while zooming in.
      return () => clearTimeout(timer)
    }
  }, [activeTarget, homeZ])

  return (
    <CameraControls 
      ref={controls}
      enabled={false}
      smoothTime={0.8} 
      maxDistance={40} // increased max distance to allow mobile view
    />
  )
}