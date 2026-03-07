// src/components/ParticleLandingTitle.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../store';


export default function ParticleLandingTitle() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
    const [scale, setScale] = useState(1);
    const isEntered = useStore((state) => state.isEntered); 
    const isTransitioning = useStore((state) => state.isTransitioning);

  // --- 1. RESPONSIVE SCALING ---
  // Adjusts the UI hitbox size for mobile, but keeps canvas 1:1 with screen
  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth - 40;
      setScale(availableWidth < 800 ? availableWidth / 800 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- 2. THE UNIFIED ENGINE ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const dpr = window.devicePixelRatio || 1;

    // Canvas internal resolution matches the full window for infinite drift
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };
    updateCanvasSize();

    const state = {
      phase: 'typing1',
      text1: "YONATAN REICH",
      text2: "SOFTWARE DEVELOPER.",
      idx1: 0,
      idx2: 0,
      lastTime: performance.now(),
      cursorOn: true,
      lastBlink: performance.now(),
    };

    const typeSpeed = 60;
    const blinkSpeed = 500;

    // 🚀 STEP A: PRE-COMPUTE PARTICLES CENTERED ON SCREEN
    const preComputeParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Line 1 Sizing
      ctx.font = '900 56px Orbitron';
      ctx.letterSpacing = "2.4px";
      const w1 = ctx.measureText(state.text1).width;
      const startX1 = centerX - w1 / 2;

      // Line 2 Sizing
      ctx.font = '700 24px Orbitron';
      ctx.letterSpacing = "2.4px";
      const w2 = ctx.measureText(state.text2).width;
      const startX2 = centerX - w2 / 2;

      // Draw hidden text to extract pixels
      ctx.fillStyle = '#ffffff';
      ctx.fillText(state.text1, startX1, centerY - 30);
      ctx.fillStyle = '#4CB4BB';
      ctx.fillText(state.text2, startX2, centerY + 30);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const particles = [];
      const step = Math.ceil(dpr) * 2;

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          if (data[index + 3] > 128) {
            particles.push({
              x: x / dpr,
              y: y / dpr,
              baseX: x / dpr,
              baseY: y / dpr,
              vx: 0,
              vy: 0,
              disturbed: false,
              color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, 1)`
            });
          }
        }
      }
      particlesRef.current = { particles, startX1, startX2, centerY };
    };

    // 🚀 STEP B: ANIMATION LOOP
    const loop = (time) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const centerX = window.innerWidth / 2;
      const { particles, startX1, startX2, centerY } = particlesRef.current;
      if (!particles) return;

      // CURSOR BLINK
      if (time - state.lastBlink > blinkSpeed) {
        state.cursorOn = !state.cursorOn;
        state.lastBlink = time;
      }

      // TYPING LOGIC
      if (state.phase === 'typing1') {
        if (time - state.lastTime > typeSpeed) {
          state.idx1++;
          state.lastTime = time;
          if (state.idx1 > state.text1.length) state.phase = 'delay';
        }
      } else if (state.phase === 'delay') {
        if (time - state.lastTime > 500) {
          state.phase = 'typing2';
          state.lastTime = time;
        }
      } else if (state.phase === 'typing2') {
        if (time - state.lastTime > typeSpeed) {
          state.idx2++;
          state.lastTime = time;
          if (state.idx2 > state.text2.length) state.phase = 'done';
        }
      }

      // CALCULATE REVEAL WIDTHS
      ctx.font = '900 56px Orbitron';
      const revealX1 = startX1 + ctx.measureText(state.text1.substring(0, state.idx1)).width;
      ctx.font = '700 24px Orbitron';
      const revealX2 = startX2 + ctx.measureText(state.text2.substring(0, state.idx2)).width;

      // DRAW CURSOR
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      if (state.phase === 'typing1' || state.phase === 'delay') {
        ctx.fillStyle = '#ffffff';
        if (state.cursorOn || state.phase === 'typing1') ctx.fillText('█', revealX1 + 5, centerY - 30);
      } else if (state.phase === 'typing2' || state.phase === 'done') {
        ctx.fillStyle = '#4CB4BB';
        if (state.cursorOn || state.phase === 'typing2') ctx.fillText('█', revealX2 + 5, centerY + 30);
      }

      // DRAW & UPDATE PARTICLES
      const mouse = mouseRef.current;
      const isHovering = mouse.x !== -1000;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Reveal logic
        let isVisible = false;
        if (p.baseY < centerY && p.baseX <= revealX1) isVisible = true;
        if (p.baseY >= centerY && p.baseX <= revealX2) isVisible = true;

        if (!isVisible) continue;

        if (isHovering) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const interactionRadius = 50;

          if (dist < interactionRadius) {
            p.disturbed = true;
            const force = (interactionRadius - dist) / interactionRadius;
            p.vx += (dx / dist) * force * 4;
            p.vy += (dy / dist) * force * 4;
          }

          if (p.disturbed) {
            p.vx += (Math.random() - 0.5) * 0.12;
            p.vy += (Math.random() - 0.5) * 0.12 - 0.02;
            p.vx *= 0.97;
            p.vy *= 0.97;
            p.x += p.vx;
            p.y += p.vy;
          }
        } else {
          p.disturbed = false;
          p.vx += (p.baseX - p.x) * 0.12;
          p.vy += (p.baseY - p.y) * 0.12;
          p.vx *= 0.75;
          p.vy *= 0.75;
          p.x += p.vx;
          p.y += p.vy;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 1.8, 1.8);
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    document.fonts.ready.then(() => {
      preComputeParticles();
      animationRef.current = requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const handleMouseMove = (e) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseLeave = () => {
    mouseRef.current = { x: -1000, y: -1000 };
  };

  return (
    <div
  className="title-hitbox"
  onMouseMove={handleMouseMove}
  onMouseLeave={handleMouseLeave}
  style={{
    width: `${800 * scale}px`,
    height: `${250 * scale}px`,
    position: 'relative',
    margin: '0 auto',
    overflow: 'visible',
    /* 🚀 FIXED: lowercase 'none' */
    pointerEvents: isEntered ? 'none' : 'auto', 
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    /* 🚀 ADDITION: Ensure children follow the leader */
    visibility: isEntered && isTransitioning ? 'hidden' : 'visible'
  }}
>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', // 🚀 Lock to viewport for drift
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: -1,
          filter: 'drop-shadow(0 0 8px rgba(76, 180, 187, 0.6))',
        }}
      />
    </div>
  );
}