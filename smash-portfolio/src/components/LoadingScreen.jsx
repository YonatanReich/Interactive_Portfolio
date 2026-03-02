import React from 'react';
import { useStore } from '../store';
import './LoadingScreen.css';

const LoadingScreen = () => {
  const isEntered = useStore((state) => state.isEntered);
  const setEntered = useStore((state) => state.setEntered);

  return (
    <div className={`gate-wrapper ${isEntered ? 'is-warping' : ''}`}>
      <div className="terminal-card">
        <h1 className="terminal-title">SYSTEM_READY</h1>
        <p className="terminal-status"> INITIALIZING NEURAL_LINK...</p>
        
        <button 
          className="warp-trigger-btn cursor-target" 
          onClick={setEntered}
        >
          [ INITIALIZE_WARP ]
        </button>
      </div>
      <div className="vignette"></div>
    </div>
  );
};

export default LoadingScreen;