// src/components/TunnelSystem.jsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import TunnelChunk from './TunnelChunk'

const SPEED = 10
const CHUNK_LENGTH = 200 // Must match the length in TunnelChunk

export default function TunnelSystem() {
  const group1 = useRef()
  const group2 = useRef()

  useFrame((state, delta) => {
    const safeDelta = delta > 0.1 ? 0.1 : delta
    const moveDistance = SPEED * safeDelta

    // Move both chunks forward
    if (group1.current) group1.current.position.z += moveDistance
    if (group2.current) group2.current.position.z += moveDistance

    // THE TREADMILL LOGIC
    // If a chunk goes too far past the camera (+20), 
    // snap it to the back of the other chunk.
    
    if (group1.current && group1.current.position.z > CHUNK_LENGTH+30) {
      group1.current.position.z = group2.current.position.z - CHUNK_LENGTH
    }

    if (group2.current && group2.current.position.z > CHUNK_LENGTH+30) {
      group2.current.position.z = group1.current.position.z - CHUNK_LENGTH
    }
  })

  return (
    <>
      {/* Chunk 1 starts at 0 */}
      <group ref={group1} position={[0, 0, 0]}>
        <TunnelChunk length={CHUNK_LENGTH} />
      </group>

      {/* Chunk 2 starts behind Chunk 1 */}
      <group ref={group2} position={[0, 0, -CHUNK_LENGTH]}>
        <TunnelChunk length={CHUNK_LENGTH} />
      </group>
    </>
  )
}