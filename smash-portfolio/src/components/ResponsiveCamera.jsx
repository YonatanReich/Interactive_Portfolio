import { useEffect, useRef } from 'react' // Removed the broken 'use' import
import { CameraControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../store'

export default function ResponsiveCamera() {
  const controls = useRef()
  const isEntered = useStore((state) => state.isEntered)
  const activeTarget = useStore((state) => state.activeTarget)
  const getHomeZ = useStore((state) => state.getHomeZ)
  const homeZ = getHomeZ()
  const setCameraZ = useStore((state) => state.setCameraZ)
  const isTransitioning = useStore((state) => state.isTransitioning);

  // 🚀 1. Make the "Focused Panel" distance responsive!
  const getActiveZ = () => {
    if (typeof window === 'undefined') return -10;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // The panel sits at -20. A higher number pushes the camera further back.
    if (width < 768) return 15; // 📱 Phone: Pushes camera WAY back (Distance = 35)
    if (width <= 1024 && height > width) return 0; // 💊 Portrait Tablet (Distance = 20)
    return -10; // 💻 Desktop: Default close-up (Distance = 10)
  };

  useEffect(() => {
    if (!controls.current) return;

    if (!isEntered && !isTransitioning) {
      controls.current.setLookAt(0, 0, 150, 0, 0, 0, true);
    } 
    else {
      // 🚀 2. Use the new responsive activeZ instead of the hardcoded -10!
      const targetZ = activeTarget ? getActiveZ() : homeZ;
      const lookAtZ = activeTarget ? -20 : 0;
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
      smoothTime={0.7} 
      maxDistance={250} 
    />
  )
}