// src/components/LoadingScreen.jsx
import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import './LoadingScreen.css';
import PrismaticBurst from './PrismaticBurst';

const LoadingScreen = () => {
  const isEntered = useStore((state) => state.isEntered);
  const isTransitioning = useStore((state) => state.isTransitioning); // 🚀 Add this
  const [shouldRender, setShouldRender] = useState(!isEntered);

  useEffect(() => {
    if (isEntered) {
      // 🚀 Warp Out: Wait for CSS transition before unmounting
      const timer = setTimeout(() => setShouldRender(false), 2600);
      return () => clearTimeout(timer);
    } else {
      // 🚀 Warp In: Mount immediately when going back to boot
      setShouldRender(true);
    }
  }, [isEntered]);

  if (!shouldRender) return null;

  return (
    /* 🚀 We use 'is-warping' when entered, but also check 'isTransitioning' 
       to ensure the CSS classes trigger correctly during the reset */
    <div className={`gate-wrapper ${isEntered || isTransitioning ? 'is-warping' : ''}`}>
      <div className="shader-layer">
        <PrismaticBurst
          animationType="rotate3d"
          intensity={2}
          speed={0.5}
          distort={isEntered ? 0.8 : 0.3} // 🚀 Increase distortion during the warp
          colors={['#ff007a', '#4d3dff', '#000000']}
          mixBlendMode="screen"
        />
      </div>

      <div className="terminal-card">
        <h1 className="terminal-title">SYSTEM_READY</h1>
        <p className="terminal-status"> INITIALIZING NEURAL_LINK...</p>
        <button className="warp-trigger-btn cursor-target" onClick={() => useStore.getState().setEntered()}>
          [ INITIALIZE_WARP ]
        </button>
      </div>
      <div className="vignette"></div>
    </div>
  );
};

export default LoadingScreen;