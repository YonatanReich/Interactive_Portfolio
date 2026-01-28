import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import TunnelChunk from './TunnelChunk'
import { useNeatTexture } from '../hooks/useNeatTexture.jsx'
import { useScrollVelocity } from '../hooks/useScrollVelocity.jsx'

// ... [KEEP YOUR EXISTING NEAT_CONFIG HERE] ...
// (I am omitting the long object to save space, but DO NOT DELETE IT from your file)
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

const CHUNK_LENGTH = 350 
export default function TunnelSystem() {
  const group1 = useRef()
  const group2 = useRef()
  const sharedTexture = useNeatTexture(NEAT_CONFIG)
  
  // 1. USE THE SHARED VELOCITY
  const velocity = useScrollVelocity()

  useFrame((state, delta) => {
    const safeDelta = delta > 0.1 ? 0.1 : delta
    const moveDistance = velocity.total.current * safeDelta // <--- Use Hook Velocity

    // Move chunks
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