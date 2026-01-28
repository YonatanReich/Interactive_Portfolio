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
  // === FIX: SELECT STATE INDIVIDUALLY TO PREVENT INFINITE LOOP ===
  const isMuted = useStore((state) => state.isMuted)
  const toggleMute = useStore((state) => state.toggleMute)
  const setTarget = useStore((state) => state.setTarget)
  const setScrollDirection = useStore((state) => state.setScrollDirection)
  const startForward = () => setScrollDirection(1)
  const startBackward = () => setScrollDirection(-1)
  const stop = () => setScrollDirection(0)
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
  }, [isMuted]) 

  return (
    <div style={{position: 'relative', height: '100vh', width: '100vw', background: '#000' }}>
      <audio 
        id="bg_sound" 
        src="/Hole In One - Spiritual Ideas For Virtual Reality.mp3" 
        loop 
      />
    <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          pointerEvents: 'none', /* Clicks pass through to 3D */
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
          {/* Top Bar */}
          <nav className="nav-style">
              <div className="tabs">
                <button onClick={() => setTarget(null)} style={btnStyle}>Main menu</button>         
                <button onClick={() => setTarget('modal_projects')} style={btnStyle}>Projects</button>
                <button onClick={() => setTarget('modal_about')} style={btnStyle}>About Me</button>
                <button onClick={() => setTarget('modal_skills')} style={btnStyle}>Skills</button>    
              </div>
              <button onClick={toggleMute} style={muteBtnStyle}> 
                  {isMuted ? '🔇 Unmute' : '🔊 Mute'}  
              </button>
          </nav>
          
          {/* Bottom Bar */}
          <footer className="bottom-bar-glass">
              <span className="Name" style={{color: 'white', fontWeight: '700', marginRight: '10px'}}>Yonatan Reich</span>
          <span className="Role" style={{ color: '#4CB4BB' }}>CS student</span>
          <div className = "scroll-btn-container">
          <button
            className="scroll-up-btn"
            onPointerDown={startForward}
            onPointerUp={stop}
            onPointerLeave={stop}
            aria-label="Scroll Forward"
          >
            <img width="40"
              height="40"
              src="https://img.icons8.com/ultraviolet/40/long-arrow-up.png"
              alt="long-arrow-up"
             user-select="none"
            />
          </button>
          <button
            className="scroll-down-btn"
            onPointerDown={startBackward}
            onPointerUp={stop}
            onPointerLeave={stop}
            aria-label="Scroll Backward"
          >
            <img width="40" height="40" src="https://img.icons8.com/ultraviolet/40/long-arrow-down.png" alt="long-arrow-down"/>
          </button>
          </div>
          </footer>
      </div>
      
      <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={[1, 1.5]}>
        
        <ResponsiveCamera />
        <GradientBackground />
        
        <fog attach="fog" args={[FOG_COLOR, 40, 300]} />

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
          <GlassPanel position={[0,2,-1]} label="Contact me" range={1} speed={1} id="modal_contact" />
        </Physics>
        
      </Canvas>
    </div>
  )
}






const btnStyle = {
  background: 'none',
  border: 'none',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '1rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  marginRight: '1.5rem',
  cursor: 'pointer'
}

const muteBtnStyle = {
  background: 'rgba(255, 255, 255, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  color: 'white',
  padding: '0.5rem 1rem',
  borderRadius: '20px',
  cursor: 'pointer'
}