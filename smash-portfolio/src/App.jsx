import { Canvas } from '@react-three/fiber'
import { GradientTexture, Environment } from '@react-three/drei' 
import * as THREE from 'three'
import { useEffect,Suspense } from 'react'
import { useStore } from './store.js'
import TargetCursor from './components/TargetCursor.jsx';
import GlassPanel from './components/GlassPanel.jsx'
import TunnelSystem from './components/TunnelSystem.jsx'
import ResponsiveCamera from './components/ResponsiveCamera.jsx'
import BallManager from './components/BallManager.jsx'
import InteractionHint from './components/InteractionHint.jsx'
import LandingPage from './components/LoadingScreen.jsx'
import './HomePage.css'


// --- VISUAL PALETTE ---
const TOP_COLOR = '#000000'     
const HORIZON_COLOR = '#ffffff' 
const BOTTOM_COLOR = '#000000'
const FOG_COLOR = HORIZON_COLOR 

function GradientBackground() {
  return (
    <mesh scale={[400, 400, 400]}>
      <sphereGeometry args={[1, 16, 16]} />
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
  const isEntered = useStore((state) => state.isEntered)
  const resetEntered = useStore((state) => state.resetEntered)
  const triggerPanelReset = useStore((state) => state.triggerPanelReset)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 480;
 const hintStep = useStore((state) => state.hintStep);
const startHint = useStore((state) => state.startHint);
const advanceHint = useStore((state) => state.advanceHint);
  const cancelHint = useStore((state) => state.cancelHint);
  const previousHint = useStore((state) => state.previousHint);
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

  // 🚀 THE DYNAMIC UI MEASURER
  useEffect(() => {
    const updateUIHeights = () => {
      // Find the top and bottom bars in the DOM
      const topBar = document.querySelector('.nav-style');
      const bottomBar = document.querySelector('.bottom-bar-glass');

      // If they exist, measure their exact pixel height and save them as CSS variables
      if (topBar) {
        document.documentElement.style.setProperty('--nav-height', `${topBar.offsetHeight}px`);
      }
      if (bottomBar) {
        document.documentElement.style.setProperty('--footer-height', `${bottomBar.offsetHeight}px`);
      }
    };

    // Run once on load
    updateUIHeights();

    // Re-run anytime the phone rotates or screen resizes
    window.addEventListener('resize', updateUIHeights);
    return () => window.removeEventListener('resize', updateUIHeights);
  }, []);

  useEffect(() => {
  const checkClick = (e) => {
    console.log("Element being clicked:", e.target);
    console.log("Z-Index of element:", window.getComputedStyle(e.target).zIndex);
  };
  window.addEventListener('click', checkClick);
  return () => window.removeEventListener('click', checkClick);
}, []);

  // Add this inside the App component, before the return statement
  const getHintContent = (step) => {
    switch (step) {
      case 1: 
        return <>Welcome to my portfolio.<br/>Click 'NEXT HINT' to explore.</>;
      case 2: 
        return <>Click tabs or shoot panels to open them.</>;
      case 3: 
        return (
          <>
            Use the arrow buttons 
            <img width="20" height="20" src="https://img.icons8.com/ultraviolet/40/long-arrow-up.png" className="pixel-icon inline-icon" alt="up" />
            <img width="20" height="20" src="https://img.icons8.com/ultraviolet/40/long-arrow-down.png" className="pixel-icon inline-icon" alt="down" />
            or the scroll button on the mouse to navigate the tunnel.<br/>
            Use the reset button 
            <img width="20" height="20" src="/reset-svgrepo-com.svg" className="pixel-icon inline-icon reset-icon" alt="reset" />
            to snap the panels in location.
          </>
        );
      case 4: 
        return <>Toggle audio here.</>;
      default: 
        return null;
    }
  };
 return (
  <div style={{ position: 'relative', height: '100vh', width: '100vw', background: '#000', overflow: 'hidden' }}>
    
    {/* 1. BACKGROUND LAYER: The 3D Scene */}
     <Canvas camera={{ position: [0, 0, 12], fov: 60 }} dpr={isMobile? 1: [1, 1.5] }>
       <color attach="background" args={['#202020']} />
      <ResponsiveCamera />
      <GradientBackground />
      <fog attach="fog" args={[FOG_COLOR, 40, 300]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
      
      <Environment resolution={256} background={false}>
        <mesh scale={100}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial side={THREE.BackSide}>
             <GradientTexture stops={[0, 1]} colors={['#002266', '#ffffff']} size={1024} />
          </meshBasicMaterial>
        </mesh>
      </Environment>
      
      <TunnelSystem />
      <BallManager />

      
        <GlassPanel position={[-5, 2, 0]} label="Projects" range={0.5} speed={1.2} id="modal_projects" />
        <GlassPanel position={[0, -3, -4]} label="About Me" range={0.8} speed={0.8} id="modal_about" />
        <GlassPanel position={[5, 1, -2]} label="Skills" range={0.6} speed={1.0} id="modal_skills" />
       <GlassPanel position={[0, 2, -1]} label="Contact me" range={1} speed={1} id="modal_contact" />
       <Suspense fallback={null}>
         <InteractionHint />
        </Suspense>
    </Canvas>

    {/* 2. LOADING LAYER: Sits on top of Canvas but below UI HUD */}
    <LandingPage />

    {/* 3. UI HUD LAYER: Navigation, Footer, and Buttons */}
    <div 
      style={{
        position: 'absolute', 
        top: 0, 
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 999,
        opacity: isEntered ? 1 : 0, 
        transition: 'opacity 1s ease 1s', 
        pointerEvents: 'none', /* Clicks pass through to 3D scene */
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <nav className="nav-style" style={{ pointerEvents: 'auto' }}>
        <div className={`tabs ${hintStep === 2 ? 'neon-target-active' : ''}`}>
          <button className="cursor-target nav-btn" onClick={() => { resetEntered(); setTarget(null); triggerPanelReset(); }} style={btnStyle}>Exit tunnel</button>
          <button className="cursor-target nav-btn" onClick={() => setTarget(null)} style={btnStyle}>Main menu</button>        
          <button className="cursor-target nav-btn" onClick={() => setTarget('modal_projects')} style={btnStyle}>Projects</button>
          <button className="cursor-target nav-btn" onClick={() => setTarget('modal_about')} style={btnStyle}>About Me</button>
          <button className="cursor-target nav-btn" onClick={() => setTarget('modal_skills')} style={btnStyle}>Skills</button>
           <button className="cursor-target nav-btn" onClick={() => setTarget('modal_contact')} style={btnStyle}>Contact Me</button>
           {hintStep === 0 ? (
    <button 
      className="hint-toggle-btn hint-btn-primary cursor-target" 
      onClick={startHint}
    >
      SHOW HINT
    </button>
  ) : (
    <>
      <button 
        className="hint-toggle-btn hint-btn-danger cursor-target" 
        onClick={cancelHint}
      >
        CANCEL
      </button>

      {/* Only show PREVIOUS if we are on Step 2, 3, or 4 */}
      {hintStep > 1 && (
        <button 
          className="hint-toggle-btn hint-btn-primary cursor-target" 
          onClick={previousHint}
        >
          ⭠ PREV
        </button>
      )}

      <button 
        className="hint-toggle-btn hint-btn-primary cursor-target" 
        onClick={advanceHint}
      >
        {/* Dynamically change the text if it's the last step */}
        {hintStep >= 4 ? "FINISH ⭢" : "NEXT HINT ⭢"}
      </button>
    </>
           )}
           <button 
  className={`mute-btn cursor-target nav-btn ${hintStep === 4 ? 'neon-target-active' : ''}`} 
  onClick={toggleMute}
> 
  <img 
    src={isMuted ? "/sound-max-svgrepo-com.svg" : "/sound-min-svgrepo-com.svg"} 
    className="pixel-icon-mute" 
    alt="Volume Control" 
  />
</button>
        </div>

      <div className="hint-drawer-mask">
        <div className={`hint-drawer ${hintStep > 0 && hintStep < 5 ? 'open' : ''}`}>
          
          {/* The scanline overlay */}
          <div className="hint-drawer-scanlines"></div>
          
          {/* 🚀 The `key` forces React to replay the CSS animation when the step changes! */}
          <div className="hint-drawer-content" key={hintStep}>
            {getHintContent(hintStep)}
          </div>
          
          {/* The glowing hardware lip */}
          <div className="hint-drawer-lip"></div>
          
        </div>
      </div>
      </nav>
      
      <footer className="bottom-bar-glass" style={{ pointerEvents: 'auto' }}>
        <div className="nav-nameplate cursor-target">
  <span className="Name" >
    YONATAN REICH
  </span>
  
    <span className="Role">
      SOFTWARE DEVELOPER.
    </span>
  
</div>
         <div className={`scroll-btn-container ${hintStep === 3 ? 'neon-target-active' : ''}`} >
          <button className="scroll-up-btn cursor-target" onPointerDown={startForward} onPointerUp={stop} onPointerLeave={stop}>
            <img width="40" height="40" src="https://img.icons8.com/ultraviolet/40/long-arrow-up.png" className='pixel-icon' alt="up" style={{ pointerEvents: 'none' }} />
          </button>
          <button className="scroll-down-btn cursor-target" onPointerDown={startBackward} onPointerUp={stop} onPointerLeave={stop}>
            <img width="40" height="40" src="https://img.icons8.com/ultraviolet/40/long-arrow-down.png" className="pixel-icon" alt="down" style={{ pointerEvents: 'none' }} />
           </button>
           <button 
  className="scroll-down-btn cursor-target" 
  onClick={() => { triggerPanelReset(); console.log("Reset Triggered"); }} 
>
  <img 
    width="40" 
    height="40" 
    src="/reset-svgrepo-com.svg" 
    className="pixel-icon" 
    alt="reset panels" 
    
  />
</button>
        </div>
        
        <div className="CV-btn-container ">
          <a href="YonatanR_Resume.pdf" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <button className="cursor-target nav-btn" style={btnStyle}>My Resume 📄</button>
          </a>
        </div>
      </footer>
    </div>

    
    <TargetCursor 
      spinDuration={1.5}
      hideDefaultCursor
      parallaxOff={false}
      hoverDuration={1}
    />  
    
    <audio id="bg_sound" src="/Hole In One - Spiritual Ideas For Virtual Reality.mp3" loop />

  </div>
);
}






export const btnStyle = {
  background: 'transparent',
  bordercolor: 'white',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '1rem',
  fontWeight: '700',
  textTransform: 'uppercase',
  marginRight: '0.1rem',
  cursor: 'pointer',
}

