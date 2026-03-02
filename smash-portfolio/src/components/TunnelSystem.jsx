import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import TunnelChunk from './TunnelChunk'
import { useNeatTexture } from '../hooks/useNeatTexture.jsx'
import { useScrollVelocity } from '../hooks/useScrollVelocity.jsx'
import { useStore } from '../store.js'

const NEAT_CONFIG = {
    colors: [
        { color: '#899D99', enabled: true },
        { color: '#5f2727', enabled: true },
        { color: '#373c38', enabled: true },
        { color: '#0099bb', enabled: true },
        { color: '#303B42', enabled: true },
        { color: '#2E7075', enabled: true },
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

const CHUNK_LENGTH = 700 

export default function TunnelSystem() {
  const group1 = useRef()
  const group2 = useRef()
  
  const isEntered = useStore((state) => state.isEntered)
  const velocity = useScrollVelocity()
  const sharedTexture = useNeatTexture(NEAT_CONFIG)
  
  const warpVelocity = useRef(1)
  const hasReachedPeak = useRef(false) // 🚨 Track if we've already hit the high speed

  useFrame((state, delta) => {
    const safeDelta = delta > 0.1 ? 0.1 : delta
    
if (isEntered) {
    if (!hasReachedPeak.current) {
      warpVelocity.current = THREE.MathUtils.lerp(warpVelocity.current, 80, 0.03); // 🚀 Higher peak
      
      // 🚀 STRETCH EFFECT: Scale the tunnel chunks to make them feel longer
      group1.current.scale.z = THREE.MathUtils.lerp(group1.current.scale.z, 2.5, 0.02);
      group2.current.scale.z = THREE.MathUtils.lerp(group2.current.scale.z, 2.5, 0.02);
      
      if (warpVelocity.current > 45) hasReachedPeak.current = true;
    } else {
    // ⏪ REVERSE ACCELERATION: Briefly speed up and stretch while "flying back"
    if (warpVelocity.current < 30 && state.clock.elapsedTime < 2) { // Temporary burst
      warpVelocity.current = THREE.MathUtils.lerp(warpVelocity.current, 30, 0.05);
      group1.current.scale.z = THREE.MathUtils.lerp(group1.current.scale.z, 2.5, 0.02);
      group2.current.scale.z = THREE.MathUtils.lerp(group2.current.scale.z, 2.5, 0.02);
    } else {
      // Settle back to idle speed
      warpVelocity.current = THREE.MathUtils.lerp(warpVelocity.current, 1, 0.05);
      group1.current.scale.z = THREE.MathUtils.lerp(group1.current.scale.z, 1, 0.05);
      group2.current.scale.z = THREE.MathUtils.lerp(group2.current.scale.z, 1, 0.05);
    }
  }
  }

  const moveDistance = velocity.total.current * safeDelta * warpVelocity.current

    if (group1.current) group1.current.position.z += moveDistance
    if (group2.current) group2.current.position.z += moveDistance

    // Infinite Loop Logic
    const REVERSE_LIMIT = -CHUNK_LENGTH
    if (group1.current && group1.current.position.z > CHUNK_LENGTH) {
      group1.current.position.z = group2.current.position.z - CHUNK_LENGTH
    }
    if (group2.current && group2.current.position.z > CHUNK_LENGTH) {
      group2.current.position.z = group1.current.position.z - CHUNK_LENGTH
    }
    if (group1.current && group1.current.position.z < REVERSE_LIMIT) {
       group1.current.position.z = group2.current.position.z + CHUNK_LENGTH
    }
    if (group2.current && group2.current.position.z < REVERSE_LIMIT) {
       group2.current.position.z = group1.current.position.z + CHUNK_LENGTH
    }
  })

  return (
    <>
      <group ref={group1} position={[0, 0, 0]}>
        <TunnelChunk length={CHUNK_LENGTH} texture={sharedTexture} />
      </group>
      <group ref={group2} position={[0, 0, -CHUNK_LENGTH]}>
        <TunnelChunk length={CHUNK_LENGTH} texture={sharedTexture} />
      </group>
    </>
  )
}