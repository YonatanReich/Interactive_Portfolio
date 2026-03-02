import { use, useEffect, useRef } from 'react'
import { CameraControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useStore } from '../store'

export default function ResponsiveCamera() {
  const controls = useRef()
  const isEntered = useStore((state) => state.isEntered)
  const activeTarget = useStore((state) => state.activeTarget)
  const getHomeZ = useStore((state) => state.getHomeZ)
  const homeZ = getHomeZ()
  const setCameraZ = useStore((state) => state.setCameraZ)

  useEffect(() => {
    if (!controls.current) return

    if (!isEntered) {
      // --- STATE A: THE BOOT SCREEN (Backwards) ---
      controls.current.setLookAt(0, 0, 150, 0, 0, 0, true) 

      controls.current.mouseButtons.left = 0
      controls.current.touches.one = 0
    } 
    else {
      // --- STATE B: THE TUNNEL VIEW (Forwards) ---
      // 🚀 Determine destination: -10 for panels, homeZ for main tunnel
      const targetZ = activeTarget ? -10 : homeZ
      const lookAtZ = activeTarget ? -20 : 0
      
      // 🚀 BUG FIX: Use targetZ and lookAtZ here!
      controls.current.setLookAt(0, 0, targetZ, 0, 0, lookAtZ, true)

      // Restore navigation controls only if not viewing a panel
      controls.current.mouseButtons.left = activeTarget ? 0 : 1
      controls.current.touches.one = activeTarget ? 0 : 1
    }
  }, [isEntered, activeTarget, homeZ])

  useFrame((state) => {
    setCameraZ(state.camera.position.z)
  })
  return (
    <CameraControls 
      ref={controls} 
      enabled={false} 
      smoothTime={0.7} // Balanced speed for both forward and reverse dollying
      maxDistance={250} // Must be higher than 150 to allow the boot position
    />
  )
}