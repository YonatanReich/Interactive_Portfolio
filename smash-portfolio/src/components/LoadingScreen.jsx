// src/components/LoadingScreen.jsx
import React, { useEffect, useRef, useState } from 'react';
import { NeatGradient } from '@firecms/neat';
import { useStore } from '../store';
import './LoadingScreen.css';
import ParticleLandingTitle from './ParticleeLandingTitle';
import { btnStyle } from '../App';
import '../HomePage.css';



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
  const canvasRef = useRef(null);
  const gradientRef = useRef(null);
  const isWarping = isEntered && !isTransitioning;
  
 useEffect(() => {
    // 🚀 Only initialize if we are NOT entered and the canvas exists
    if (!isEntered && canvasRef.current) {
      // Cleanup any old instance first
      if (gradientRef.current) {
        gradientRef.current.destroy();
      }

      try {
        gradientRef.current = new NeatGradient({
          ref: canvasRef.current,
          ...LOADING_NEAT_CONFIG
        });
      } catch (err) {
        console.error("Failed to initialize Gradient:", err);
      }
    }

    return () => {
      if (gradientRef.current) {
        gradientRef.current.destroy();
        gradientRef.current = null;
      }
    };
  }, [isEntered]); // 🚀 Re-run logic when isEntered changes

return (
    <>
      {/* 1. Background Canvas */}
      <canvas
        id="shared-neat-canvas"
        ref={canvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 9998,
          opacity: isWarping ? 0 : 1, 
          transform: isWarping ? "scale(15)" : "scale(1)", 
          transition: "opacity 1.5s ease-in-out, transform 2s ease-in-out",
          pointerEvents: isEntered ? 'none' : 'auto'
        }}
      />

      {/* 2. UI Overlay */}
      <div 
        // 🚀 FIX 2: Removed `is-warping` class so the text container NEVER scales/deforms
        className="gate-wrapper" 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 9999,
          pointerEvents: 'none', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* 🚀 FIX 3: The Visibility Delay Trick */}
        <div style={{ 
          pointerEvents: isEntered ? 'none' : 'auto', 
          marginBottom: '40px',
          opacity: isEntered ? 0 : 1,
         
          // Fade out over 0.5s, THEN hide it. On return, show it instantly, THEN fade in.
          transition: isEntered 
            ? 'opacity 0.5s ease, visibility 0s linear 0.5s' 
            : 'opacity 0.5s ease, visibility 0s linear 0s'
        }}>
          <ParticleLandingTitle />
        </div>

        <button 
          className="warp-trigger-btn cursor-target" 
          style={{
            ...btnStyle,
            pointerEvents: isEntered ? 'none' : 'auto',
            opacity: isEntered ? 0 : 1,
            visibility: isEntered ? 'hidden' : 'visible',
            transition: isEntered 
              ? 'opacity 0.5s ease, visibility 0s linear 0.5s' 
              : 'opacity 0.5s ease, visibility 0s linear 0s',
            position: 'relative',
            zIndex: 10000
          }} 
          onClick={() => useStore.getState().setEntered()}
        >
          Learn more
        </button>

        <div 
          className="vignette" 
          style={{ 
            pointerEvents: 'none',
            opacity: isEntered ? 0 : 1,
            transition: 'opacity 2s ease'
          }} 
        />
      </div>
    </>
  );
};

export default LoadingScreen;