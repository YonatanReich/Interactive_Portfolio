// src/App.jsx
import { Canvas } from '@react-three/fiber'
import { GradientTexture, Environment } from '@react-three/drei' 
import { Physics } from '@react-three/cannon'
import * as THREE from 'three'
import { useEffect } from 'react'
import { useStore } from './store.js'

import GlassPanel from './components/GlassPanel.jsx'
import TunnelSystem from './components/TunnelSystem.jsx'
import ResponsiveCamera from './components/ResponsiveCamera.jsx'
import BallManager from './components/BallManager.jsx'
import UI_Bars from './components/UI_Bars.jsx'

// --- VISUAL PALETTE ---
const TOP_COLOR = '#000000'     
const HORIZON_COLOR = '#ffffff' 
const BOTTOM_COLOR = '#000000'
const FOG_COLOR = HORIZON_COLOR 
// ❌ DELETE THIS LINE: const isMuted = useStore() (Hooks can't be here)

function GradientBackground() {
  return (
    <mesh scale={[400, 400, 400]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial side={THREE.BackSide} >
        <GradientTexture
          stops={[0, 0.45, 0.55, 1]}
          colors={[TOP_COLOR, HORIZON_COLOR, HORIZON_COLOR, BOTTOM_COLOR]}
          size={1024}
        />
      </meshBasicMaterial>
    </mesh>
  )
}

export default function App() {
  // ✅ FIX 1: Move hook INSIDE the component
  const isMuted = useStore((state) => state.isMuted)

  // --- BACKGROUND MUSIC LOGIC ---
  useEffect(() => {
    const audio = document.getElementById('bg_sound')
    
    // 1. Handle Muting/Unmuting immediately
    if (audio) {
      audio.muted = isMuted
      if (!isMuted) {
         // Attempt to play if unmuted
         audio.play().catch(() => console.log("Waiting for interaction..."))
      }
    }

    const tryPlay = () => {
      if (audio && !isMuted) {
        audio.volume = 0.3
        audio.play().catch(() => {})
      }
    }

    // 2. Play on first interaction (Browser requirement)
    window.addEventListener('click', tryPlay, { once: true })
    window.addEventListener('touchstart', tryPlay, { once: true })

    return () => {
      window.removeEventListener('click', tryPlay)
      window.removeEventListener('touchstart', tryPlay)
    }
  }, [isMuted]) // ✅ FIX 2: Re-run this logic when 'isMuted' changes

  return (
    <div style={{position: 'relative', height: '100vh', width: '100vw', background: '#000' }}>
      <audio 
        id="bg_sound" 
        src="/Hole In One - Spiritual Ideas For Virtual Reality.mp3" 
        loop 
      />
      
      <UI_Bars />
      
      
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 1.5]}>
        
        <ResponsiveCamera />
        <GradientBackground />
        
        <fog attach="fog" args={[FOG_COLOR, 40, 200]} />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        
        <Environment resolution={256} background={false}>
          <mesh scale={100}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial side={THREE.BackSide}>
               <GradientTexture 
                 stops={[0, 1]} 
                 colors={['#002266', '#ffffff']} 
                 size={1024} 
               />
            </meshBasicMaterial>
          </mesh>
        </Environment>
        
        <TunnelSystem />
        <BallManager />

        <Physics gravity={[0, -5, 0]}>
          <GlassPanel position={[-5, 2, 0]} label="Projects" range={0.5} speed={1.2} id="modal_projects" />
          <GlassPanel position={[0, -3, -4]} label="About Me" range={0.8} speed={0.8} id="modal_about" />
          <GlassPanel position={[5, 1, -2]} label="Skills" range={0.6} speed={1.0} id="modal_skills" />
        </Physics>
        
      </Canvas>
    </div>
  )
}