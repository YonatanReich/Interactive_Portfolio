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

const isTransitioning = useStore((state) => state.isTransitioning);

useEffect(() => {
  if (!controls.current) return;

  // 🚀 Only go to Boot Screen position if we are NOT entered AND NOT transitioning
  if (!isEntered && !isTransitioning) {
    controls.current.setLookAt(0, 0, 150, 0, 0, 0, true);
  } 
  else {
    const targetZ = activeTarget ? -10 : homeZ;
    const lookAtZ = activeTarget ? -20 : 0
    controls.current.setLookAt(0, 0, targetZ, 0, 0, lookAtZ, true);
  }
}, [isEntered, isTransitioning, activeTarget, homeZ]);

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