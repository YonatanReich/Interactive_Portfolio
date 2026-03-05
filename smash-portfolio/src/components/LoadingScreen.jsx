// src/components/LoadingScreen.jsx
import React, { useEffect, useRef, useState } from 'react';
import { NeatGradient } from '@firecms/neat';
import { useStore } from '../store';
import './LoadingScreen.css';
import TextType from './TextType';
import { btnStyle } from '../App';


const LOADING_NEAT_CONFIG = {
    colors: [
        { color: '#899D99', enabled: true },
        { color: '#5f2727', enabled: true },
        { color: '#373c38', enabled: true },
        { color: '#0099bb', enabled: true },
        { color: '#303B42', enabled: true },
        { color: '#2E7075', enabled: true },
    ],
    speed: 5,
    horizontalPressure: 5,
    verticalPressure: 4,
    waveFrequencyX: 4,
    waveFrequencyY: 5,
    waveAmplitude: 0,
    shadows: 4,
    highlights: 4,
    colorBrightness: 1,
    colorSaturation: 0,
    wireframe: true,
    colorBlending: 3,
    backgroundColor: '#202020',
    backgroundAlpha: 1,
    grainScale: 2,
    grainSparsity: 0,
    grainIntensity: 0.575,
    grainSpeed: 0.1,
    resolution: 1,
    yOffset: 0,
    yOffsetWaveMultiplier: 5.5,
    yOffsetColorMultiplier: 5.2,
    yOffsetFlowMultiplier: 6,
    flowDistortionA: 3.7,
    flowDistortionB: 1.4,
    flowScale: 2.9,
    flowEase: 0.32,
    flowEnabled: true,
    mouseDistortionStrength: 0.12,
    mouseDistortionRadius: 0.37,
    mouseDecayRate: 0.921,
    mouseDarken: 0.24,
    enableProceduralTexture: true,
    textureVoidLikelihood: 0.27,
    textureVoidWidthMin: 60,
    textureVoidWidthMax: 420,
    textureBandDensity: 1.2,
    textureColorBlending: 0.06,
    textureSeed: 333,
    textureEase: 1,
    proceduralBackgroundColor: '#0E0707',
    textureShapeTriangles: 20,
    textureShapeCircles: 15,
    textureShapeBars: 15,
    textureShapeSquiggles: 10,
};

const LoadingScreen = () => {
  const isEntered = useStore((state) => state.isEntered);
  const isTransitioning = useStore((state) => state.isTransitioning);
  const [nameDone, setNameDone] = useState(false);
  const canvasRef = useRef(null);
  const gradientRef = useRef(null);

  const isWarping = isEntered && !isTransitioning;

  useEffect(() => {
    if (!canvasRef.current) return;



    gradientRef.current = new NeatGradient({
      ref: canvasRef.current,
      ...LOADING_NEAT_CONFIG
    });

    return () => {
      if (gradientRef.current) gradientRef.current.destroy();
    };
  }, []);

  return (
    <>
      
      {/* 🚀 THE MASTER CANVAS */}
      <canvas
        id="shared-neat-canvas"
        ref={canvasRef}
        style={{
          position: "fixed", // Keeps it locked to the screen
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9998, // 🚀 Just above the 3D scene, but below the UI!
          opacity: isWarping ? 0.02 : 1,
          transform: isWarping ? "scale(15)" : "scale(1)", // 🚀 Zooms in smoothly with the gate!
          transition: "opacity 1.5s ease-in-out, transform 2s ease-in-out",
          pointerEvents: isWarping ? "none" : "auto"
        }}
      />
     
      {/* THE UI OVERLAY */}
      <div 
        className={`gate-wrapper ${isWarping ? 'is-warping' : ''}`}
        style={{ 
            backgroundColor: 'transparent',
            pointerEvents: 'none'
        }}
      >
       <div className="terminal-card" style={{ pointerEvents: isWarping ? 'none' : 'auto' }}>
  
  <div className ="title-container">
  <TextType 
    as="h1"
    text="YONATAN REICH"
    loop={false}
    typingSpeed={60}
    showCursor={!nameDone} 
    cursorCharacter="█"
    onSentenceComplete={() => setNameDone(true)} 
    style={{ margin: 0 }}
  />

  
  {nameDone && (
    <TextType 
      as="h2"
      text="SOFTWARE DEVELOPER."
      loop={false}
      typingSpeed={60}
      showCursor={true}
      cursorCharacter="█"
      initialDelay={500} // 🚀 Slight pause before starting line 2
      style={{ margin: 0 }}
    />
  )}
</div>
  <button 
    className="warp-trigger-btn cursor-target" style={btnStyle} 
    onClick={() => useStore.getState().setEntered()}
  >
    Learn more
  </button>
</div>
        
        <div className="vignette"></div>
      </div>
    </>
  );
};

export default LoadingScreen;