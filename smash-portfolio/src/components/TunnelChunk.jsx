// src/components/TunnelChunk.jsx
import { useLayoutEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'


export default function TunnelChunk({ 
  position, 
  wallOffset = 15, 
  ceilingOffset = 10, 
  length = 300, 
  blockCount =500,
  texture
}) {
  const mesh = useRef()
  const dummy = new THREE.Object3D()
  

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
          map={texture}
        >
         
        </meshStandardMaterial>
      </instancedMesh>
    </group>
  )
}