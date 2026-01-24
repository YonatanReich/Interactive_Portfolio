import { useRef, useMemo, use } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function BackgroundParticles({ count = 100 }) {
    const mesh = useRef()
    const light = useRef()

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100
            const factor = 20 + Math.random() * 100
            const speed = 0.01 + Math.random() / 200
            const xPos = -50 + Math.random() * 100
            const yPos = -50 + Math.random() * 100
            const zPos = -50 + Math.random() * 100
            temp.push({ t, factor, speed, xPos, yPos, zPos, mx: 0, my: 0 })
        }
        return temp
    }, [count])

    const dummy = new THREE.Object3D()

    useFrame((state, delta) => {
        particles.forEach((particle, i) => {
            const safeDelta = delta > 0.1 ? 0.1 : delta
            particle.zPos += 15 * safeDelta

            if (particle.zPos > 10) {
                particle.zPos = -60
            }

            dummy.position.set(
                particle.xPos,
                particle.yPos,
                particle.zPos
            )
            
    
            dummy.updateMatrix()
            mesh.current.setMatrixAt(i, dummy.matrix)
        })
        mesh.current.instanceMatrix.needsUpdate = true
    })

    return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <boxGeometry args={[0.2, 0.2, 0.8]} /> {/* Long thin boxes look like "warp speed" lines */}
      <meshStandardMaterial color="#606060" transparent opacity={0.6} />
    </instancedMesh>
  )
}