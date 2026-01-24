// src/components/TunnelChunk.jsx
import { useLayoutEffect, useRef, useMemo } from 'react'

import * as THREE from 'three'
import { useNeatTexture } from '../hooks/useNeatTexture.jsx'

const NEAT_CONFIG = {
        colors: [
        {
            color: '#899D99',
            enabled: true,
        },
        {
            color: '#5f2727',
            enabled: true,
        },
        {
            color: '#373c38',
            enabled: true,
        },
        {
            color: '#0099bb',
            enabled: true,
        },
        {
            color: '#303B42',
            enabled: true,
        },
        {
            color: '#2E7075',
            enabled: true,
        },
    ],
    speed: 5,
    horizontalPressure: 5,
    verticalPressure: 4,
    waveFrequencyX: 4,
    waveFrequencyY: 5,
    waveAmplitude: 0,
    shadows: 4,
    highlights: 4,
    colorBrightness: 1,
    colorSaturation: 0,
    wireframe: true,
    colorBlending: 3,
    backgroundColor: '#202020',
    backgroundAlpha: 0.95,
    grainScale: 2,
    grainSparsity: 0,
    grainIntensity: 0.575,
    grainSpeed: 0.1,
    resolution: 1.45,
    yOffset: 0,
    yOffsetWaveMultiplier: 5.5,
    yOffsetColorMultiplier: 5.2,
    yOffsetFlowMultiplier: 6,
    flowDistortionA: 3.7,
    flowDistortionB: 1.4,
    flowScale: 2.9,
    flowEase: 0.32,
    flowEnabled: true,
    mouseDistortionStrength: 0.12,
    mouseDistortionRadius: 0.37,
    mouseDecayRate: 0.921,
    mouseDarken: 0.24,
    enableProceduralTexture: true,
    textureVoidLikelihood: 0.27,
    textureVoidWidthMin: 60,
    textureVoidWidthMax: 420,
    textureBandDensity: 1.2,
    textureColorBlending: 0.06,
    textureSeed: 333,
    textureEase: 1,
    proceduralBackgroundColor: '#0E0707',
    textureShapeTriangles: 20,
    textureShapeCircles: 15,
    textureShapeBars: 15,
    textureShapeSquiggles: 10,
}

export default function TunnelChunk({ 
  position, 
  wallOffset = 15, 
  ceilingOffset = 10, 
  length = 200, 
  blockCount = 300 
}) {
  const mesh = useRef()
  const dummy = new THREE.Object3D()
  const myNeatTexture = useNeatTexture(NEAT_CONFIG)

  const layout = useMemo(() => {
    // ... (Your existing layout loop code is fine, keep it same) ...
    // Keeping this short for readability, paste your loop here
    const temp = []
    for (let i = 0; i < blockCount; i++) {
        // ... paste existing loop logic ...
        const lane = Math.floor(Math.random() * 4) 
        let x = 0, y = 0, z = 0, w = 0, h = 0, d = 0
        z = -Math.random() * length
        switch (lane) {
            case 0: x = (Math.random() - 0.5) * (wallOffset * 1.2); y = -ceilingOffset; w = 10 + Math.random() * 10; h = 4 + Math.random() * 6; d = 20 + Math.random() * 30; break;
            case 1: x = (Math.random() - 0.5) * (wallOffset * 1.2); y = ceilingOffset; w = 10 + Math.random() * 10; h = 4 + Math.random() * 6; d = 20 + Math.random() * 30; break;
            case 2: x = -wallOffset - (Math.random() * 2); y = (Math.random() - 0.5) * (ceilingOffset * 1.2); w = 4 + Math.random() * 6; h = 8 + Math.random() * 10; d = 20 + Math.random() * 30; break;
            case 3: x = wallOffset + (Math.random() * 2); y = (Math.random() - 0.5) * (ceilingOffset * 1.2); w = 4 + Math.random() * 6; h = 8 + Math.random() * 10; d = 20 + Math.random() * 30; break;
        }
        temp.push({ x, y, z, w, h, d }) 
    }
    return temp
  }, [blockCount, length, wallOffset, ceilingOffset])

  useLayoutEffect(() => {
    if (!mesh.current) return
    layout.forEach((data, i) => {
      dummy.position.set(data.x, data.y, data.z)
      dummy.scale.set(data.w, data.h, data.d)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  }, [layout])

  return (
    <group position={position}>
      <instancedMesh ref={mesh} args={[null, null, blockCount]} name ="TunnelWall">
        <boxGeometry args={[1, 1, 1]} />
        
        {/* OPTIMIZATION: Use StandardMaterial instead of Physical */}
        <meshStandardMaterial 
          transparent={false} // Solid blocks are much faster than transparent ones
          opacity={1}         
          metalness={0.6}     // Keep the reflections
          roughness={0.1} 
          envMapIntensity={2}
          map={myNeatTexture}
        >
         
        </meshStandardMaterial>
      </instancedMesh>
    </group>
  )
}