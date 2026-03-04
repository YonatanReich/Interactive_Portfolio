import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import TunnelChunk from './TunnelChunk'
import { useNeatTexture } from '../hooks/useNeatTexture.jsx'
import { useScrollVelocity } from '../hooks/useScrollVelocity.jsx'
import { useStore } from '../store.js'

const CHUNK_LENGTH = 700 

export default function TunnelSystem() {
  const group1 = useRef()
  const group2 = useRef()
  
  const isEntered = useStore((state) => state.isEntered)
  const velocity = useScrollVelocity()
  const sharedTexture = useNeatTexture()
  const isTransitioning = useStore((state) => state.isTransitioning);
  const warpVelocity = useRef(1)
  const hasReachedPeak = useRef(false) // 🚨 Track if we've already hit the high speed



useFrame((state, delta) => {
  const safeDelta = delta > 0.1 ? 0.1 : delta;

  // --- 1. DEFINE VELOCITY & STRETCH ---
  if (isTransitioning) {
    // ⏪ REVERSE WARP: Blast backwards during the 2s transition
    warpVelocity.current = THREE.MathUtils.lerp(warpVelocity.current, 60, 0.08);
    group1.current.scale.z = THREE.MathUtils.lerp(group1.current.scale.z, 2.5, 0.02);
    group2.current.scale.z = THREE.MathUtils.lerp(group2.current.scale.z, 2.5, 0.02);
    hasReachedPeak.current = false; // Reset for next entry
  } 
  else if (isEntered) {
    // ⏩ FORWARD WARP: Standard entry
    if (!hasReachedPeak.current) {
      warpVelocity.current = THREE.MathUtils.lerp(warpVelocity.current, 60, 0.08);
      group1.current.scale.z = THREE.MathUtils.lerp(group1.current.scale.z, 2.5, 0.02);
      group2.current.scale.z = THREE.MathUtils.lerp(group2.current.scale.z, 2.5, 0.02);
      if (warpVelocity.current > 25) hasReachedPeak.current = true;
    } else {
      // Settle to idle
      warpVelocity.current = THREE.MathUtils.lerp(warpVelocity.current, 1, 0.05);
      group1.current.scale.z = THREE.MathUtils.lerp(group1.current.scale.z, 1, 0.05);
      group2.current.scale.z = THREE.MathUtils.lerp(group2.current.scale.z, 1, 0.05);
    }
  } 
  else {
    // 💤 IDLE
    warpVelocity.current = THREE.MathUtils.lerp(warpVelocity.current, 1, 0.05);
    group1.current.scale.z = THREE.MathUtils.lerp(group1.current.scale.z, 1, 0.05);
    group2.current.scale.z = THREE.MathUtils.lerp(group2.current.scale.z, 1, 0.05);
  }

  // --- 2. APPLY MOVEMENT ---
  // If transitioning, we multiply by -1 to ensure the tunnel moves OUTWARDS
  const directionMultiplier = isTransitioning ? -1 : 1;
  const moveDistance = velocity.total.current * safeDelta * warpVelocity.current * directionMultiplier;

  if (group1.current) group1.current.position.z += moveDistance;
  if (group2.current) group2.current.position.z += moveDistance;

  // --- 3. INFINITE LOOP LOGIC ---
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