// src/components/ResponsiveCamera.jsx
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'

export default function ResponsiveCamera() {
  const { camera, size } = useThree()

  useEffect(() => {
    // Check screen aspect ratio or width
    const isMobile = size.width < 1000 // Standard mobile breakpoint

    // Desktop Position: 12
    // Mobile Position: 20 (Pull back to see more)
    const targetZ = isMobile ? 30 : 12

    camera.position.z = targetZ
    camera.updateProjectionMatrix()
    
  }, [size, camera])

  return null
}