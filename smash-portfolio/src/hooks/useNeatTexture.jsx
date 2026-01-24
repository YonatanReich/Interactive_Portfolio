import { useEffect, useRef, useState } from 'react'
import { NeatGradient } from '@firecms/neat'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

export function useNeatTexture(config = {}) {
  const textureRef = useRef(null)
  const [_, forceUpdate] = useState(0)

  useEffect(() => {
    // 1. Create Canvas
    const canvas = document.createElement('canvas')
    // Keep resolution moderate (256x256 is good for performance/quality balance)
    canvas.width = 256
    canvas.height = 256

    // 2. CSS: Make it technically "visible" but hidden behind everything
    // We do NOT set width/height to 1px anymore. We let it be full size.
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '256px' 
    canvas.style.height = '256px'
    
    // Z-Index -9999 puts it behind the 3D canvas
    canvas.style.zIndex = '-9999' 
    
    // Opacity 0 makes it invisible, but the browser still renders it
    canvas.style.opacity = '0' 
    
    // Important: Prevent it from capturing mouse clicks
    canvas.style.pointerEvents = 'none'

    document.body.appendChild(canvas)

    // 3. Initialize Neat Gradient
    const neat = new NeatGradient({
      ref: canvas,
      ...config
    })

    // 4. Create Texture
    textureRef.current = new THREE.CanvasTexture(canvas)
    
    // Force re-render
    forceUpdate((n) => n + 1)

    // 5. Cleanup
    return () => {
      neat.destroy()
      if (textureRef.current) textureRef.current.dispose()
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas)
      }
    }
  }, []) // Empty dependency array = run once on mount

  useFrame(() => {
    // Simple, robust update every single frame.
    // No skipping, no complex logic.
    if (textureRef.current) {
      textureRef.current.needsUpdate = true
    }
  })

  return textureRef.current
}