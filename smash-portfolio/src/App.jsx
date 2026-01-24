// src/App.jsx
import { Canvas } from '@react-three/fiber'
import { GradientTexture, Environment } from '@react-three/drei' 
import { Physics } from '@react-three/cannon'
import * as THREE from 'three'
import { useEffect } from 'react'

import GlassPanel from './components/GlassPanel.jsx'
import TunnelSystem from './components/TunnelSystem.jsx'
import ResponsiveCamera from './components/ResponsiveCamera.jsx'
import BallManager from './components/BallManager.jsx'

// --- VISUAL PALETTE ---
const TOP_COLOR = '#000000'     
const HORIZON_COLOR = '#ffffff' 
const BOTTOM_COLOR = '#000000'
const FOG_COLOR = HORIZON_COLOR 

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

 // --- BACKGROUND MUSIC LOGIC ---
  useEffect(() => {
    const startMusic = () => {
      const audio = document.getElementById('bg_sound')
      if (audio) {
        // Set volume low so it doesn't overpower sound effects
        audio.volume = 0.3 
        audio.play().catch(e => console.log("Waiting for interaction..."))
      }
    }

    // Try to play immediately (works on some desktops if user engaged previously)
    startMusic()

    // Add listener to force play on first click/tap (Required for iOS/Chrome)
    window.addEventListener('click', startMusic, { once: true })
    window.addEventListener('touchstart', startMusic, { once: true })

    return () => {
      window.removeEventListener('click', startMusic)
      window.removeEventListener('touchstart', startMusic)
    }
  }, [] )

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#000' }}>
      <audio 
        id="bg_sound" 
        src="/Hole In One - Spiritual Ideas For Virtual Reality.mp3" 
        loop 
      />
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 1.5]}> 
      
        
        <ResponsiveCamera />
        <GradientBackground />
        
        {/* Fog matches the horizon to hide the infinite tunnel generation */}
        <fog attach="fog" args={[FOG_COLOR, 20, 120]} />

        {/* --- LIGHTING --- */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        {/* Blue backlight for cool rim-lighting on blocks */}
        <spotLight position={[0, 10, -20]} intensity={5} color="#0088ff" />

        {/* --- THE FIX: PURE ABSTRACT REFLECTIONS --- */}
        {/* We removed preset="city". Now we define our own "World" */}
        <Environment resolution={256} background={false}>
          {/* This sphere is INVISIBLE to the camera, but VISIBLE to reflections.
              It wraps the blocks in a gradient of light from Deep Blue to White. */}
          <mesh scale={100}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial side={THREE.BackSide}>
               <GradientTexture 
                 stops={[0, 1]} 
                 colors={['#002266', '#ffffff']} // Deep Blue bottom -> White top
                 size={1024} 
               />
            </meshBasicMaterial>
          </mesh>
        </Environment>
        
        <TunnelSystem />
        <BallManager />

        <Physics gravity={[0, -5, 0]}>
          <GlassPanel position={[-5, 2, 0]} label="Projects" range={0.5} speed={1.2} id = "modal_projects" />
          <GlassPanel position={[0, -3, -4]} label="About Me" range={0.8} speed={0.8} id = "modal_about" />
          <GlassPanel position={[5, 1, -2]} label="Skills" range={0.6} speed={1.0} id = "modal_skills" />
        </Physics>
        
      </Canvas>
    </div>
  )
}