// src/components/ParticleLandingTitle.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../store';

export default function ParticleLandingTitle() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const [hitboxScale, setHitboxScale] = useState(1);
  const isEntered = useStore((state) => state.isEntered); 
  const isTransitioning = useStore((state) => state.isTransitioning);

  // --- 1. RESPONSIVE HITBOX SCALING ---
  useEffect(() => {
    const handleResize = () => {
      const availableWidth = window.innerWidth - 40;
      setHitboxScale(availableWidth < 800 ? availableWidth / 800 : 1);
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
    
    // Setup state
    const state = {
      phase: 'typing1',
      text1: "YONATAN REICH", //
      text2: "SOFTWARE DEVELOPER.", //
      idx1: 0,
      idx2: 0,
      lastTime: performance.now(),
      cursorOn: true,
      lastBlink: performance.now(),
    };

    const typeSpeed = 50;
    const blinkSpeed = 500;

    // 🚀 STEP A: PRE-COMPUTE PARTICLES WITH DYNAMIC SCALING
    const preComputeParticles = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // 🚀 CALCULATE RESPONSIVE SCALE 
      // Limits scale to 1 on desktop, shrinks proportionally on mobile/tablets
      const currentScale = Math.min(1, (window.innerWidth - 40) / 800);
      
      // Scale fonts, spacing, and vertical offsets
      const nameSize = Math.max(20, Math.floor(64 * currentScale));
      const roleSize = Math.max(10, Math.floor(32 * currentScale));
      const spacingVal = Math.max(1, Math.floor(4 * currentScale));
      const spacing = `${spacingVal}px`;

      const fontName = `900 ${nameSize}px "Orbitron", sans-serif`;
      const fontRole = `700 ${roleSize}px "Orbitron", sans-serif`;

      const y1 = centerY - (40 * currentScale);
      const y2 = centerY + (30 * currentScale);

      // Sizing (Name)
      ctx.font = fontName;
      ctx.letterSpacing = spacing;
      const w1 = ctx.measureText(state.text1).width;
      const startX1 = centerX - w1 / 2;

      // Sizing (Role)
      ctx.font = fontRole;
      ctx.letterSpacing = spacing;
      const w2 = ctx.measureText(state.text2).width;
      const startX2 = centerX - w2 / 2;

      // Extract Text Pixels
      ctx.font = fontName;
      ctx.fillStyle = '#ffffff'; 
      ctx.fillText(state.text1, startX1, y1);
      
      ctx.font = fontRole;
      ctx.fillStyle = '#ffffff'; 
      ctx.fillText(state.text2, startX2, y2);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const particles = [];
      const step = Math.ceil(dpr) * 2;

      for (let y = 0; y < canvas.height; y += step) {
        for (let x = 0; x < canvas.width; x += step) {
          const index = (y * canvas.width + x) * 4;
          if (data[index + 3] > 128) {
            particles.push({
              x: x / dpr, y: y / dpr,
              baseX: x / dpr, baseY: y / dpr,
              vx: 0, vy: 0, disturbed: false,
              color: `rgba(${data[index]}, ${data[index + 1]}, ${data[index + 2]}, 1)`
            });
          }
        }
      }

      // 🚀 SCALE CURSOR PARTICLES PROPORTIONALLY
      const cursor1Particles = [];
      const c1W = Math.floor(32 * currentScale); 
      const c1H = Math.floor(54 * currentScale); 
      for (let y = -c1H / 2; y < c1H / 2; y += step) {
        for (let x = 0; x < c1W; x += step) {
          cursor1Particles.push({
            x: startX1 + x, y: y1 + y,
            relX: x, relY: y, 
            vx: 0, vy: 0, disturbed: false, color: '#4CB4BB'
          });
        }
      }

      const cursor2Particles = [];
      const c2W = Math.floor(12 * currentScale); 
      const c2H = Math.floor(22 * currentScale);
      for (let y = -c2H / 2; y < c2H / 2; y += step) {
        for (let x = 0; x < c2W; x += step) {
          cursor2Particles.push({
            x: startX2 + x, y: y2 + y,
            relX: x, relY: y,
            vx: 0, vy: 0, disturbed: false, color: '#4CB4BB'
          });
        }
      }

      // Save calculated data to Ref so the loop can use it
      particlesRef.current = { 
        particles, startX1, startX2, y1, y2, centerY, 
        cursor1Particles, cursor2Particles,
        fontName, fontRole, spacing, currentScale
      };
    };

    // 🚀 STEP B: ANIMATION LOOP
    const loop = (time) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const { 
        particles, startX1, startX2, y1, y2, centerY, 
        cursor1Particles, cursor2Particles, fontName, fontRole, spacing, currentScale 
      } = particlesRef.current;
      
      if (!particles) return;

      if (time - state.lastBlink > blinkSpeed) {
        state.cursorOn = !state.cursorOn;
        state.lastBlink = time;
      }

      if (state.phase === 'typing1') {
        if (time - state.lastTime > typeSpeed) {
          state.idx1++;
          state.lastTime = time;
          if (state.idx1 >= state.text1.length) state.phase = 'delay';
        }
      } else if (state.phase === 'delay') {
        if (time - state.lastTime > 600) {
          state.phase = 'typing2';
          state.lastTime = time;
        }
      } else if (state.phase === 'typing2') {
        if (time - state.lastTime > typeSpeed) {
          state.idx2++;
          state.lastTime = time;
          if (state.idx2 >= state.text2.length) state.phase = 'done';
        }
      }

      // Use the pre-computed responsive fonts to measure current typing progress
      ctx.font = fontName;
      ctx.letterSpacing = spacing;
      const revealX1 = startX1 + ctx.measureText(state.text1.substring(0, state.idx1)).width;
      
      ctx.font = fontRole;
      ctx.letterSpacing = spacing;
      const revealX2 = startX2 + ctx.measureText(state.text2.substring(0, state.idx2)).width;

      let activeCursor = null;
      let cursorTargetX = 0;
      let cursorTargetY = 0;

      if (state.phase === 'typing1' || state.phase === 'delay') {
        activeCursor = cursor1Particles;
        cursorTargetX = revealX1 + (8 * currentScale); // Scale cursor offset
        cursorTargetY = y1;
      } else if (state.phase === 'typing2' || state.phase === 'done') {
        activeCursor = cursor2Particles;
        cursorTargetX = revealX2 + (6 * currentScale); // Scale cursor offset
        cursorTargetY = y2;
      }

      const mouse = mouseRef.current;
      const isHovering = mouse.x !== -1000;

      // 1. UPDATE & DRAW TEXT PARTICLES
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        let isVisible = false;

        if (p.baseY < centerY && p.baseX <= revealX1) isVisible = true;
        if (p.baseY >= centerY && p.baseX <= revealX2) isVisible = true;

        if (!isVisible) continue;

        if (isHovering) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 50) {
            p.disturbed = true;
            const force = (50 - dist) / 50;
            p.vx += (dx / dist) * force * 5;
            p.vy += (dy / dist) * force * 5;
          }

          if (p.disturbed) {
            p.vx += (Math.random() - 0.5) * 0.15;
            p.vy += (Math.random() - 0.5) * 0.15 - 0.02;
            p.vx *= 0.96; p.vy *= 0.96;
            p.x += p.vx; p.y += p.vy;
          }
        } else {
          p.disturbed = false;
          p.vx += (p.baseX - p.x) * 0.12;
          p.vy += (p.baseY - p.y) * 0.12;
          p.vx *= 0.75; p.vy *= 0.75;
          p.x += p.vx; p.y += p.vy;
        }

        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 2, 2);
      }

      // 2. UPDATE & DRAW DYNAMIC CURSOR PARTICLES
      if (activeCursor) {
        for (let i = 0; i < activeCursor.length; i++) {
          const cp = activeCursor[i];

          cp.baseX = cursorTargetX + cp.relX;
          cp.baseY = cursorTargetY + cp.relY;

          if (isHovering) {
            const dx = cp.x - mouse.x;
            const dy = cp.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 50) {
              cp.disturbed = true;
              const force = (50 - dist) / 50;
              cp.vx += (dx / dist) * force * 6;
              cp.vy += (dy / dist) * force * 6;
            }

            if (cp.disturbed) {
              cp.vx += (Math.random() - 0.5) * 0.2;
              cp.vy += (Math.random() - 0.5) * 0.2;
              cp.vx *= 0.95; cp.vy *= 0.95;
              cp.x += cp.vx; cp.y += cp.vy;
            }
          } else {
            cp.disturbed = false;
            cp.vx += (cp.baseX - cp.x) * 0.3; 
            cp.vy += (cp.baseY - cp.y) * 0.3;
            cp.vx *= 0.65; cp.vy *= 0.65;
            cp.x += cp.vx; cp.y += cp.vy;
          }

          if (state.cursorOn || cp.disturbed) {
            ctx.fillStyle = cp.color;
            ctx.fillRect(cp.x, cp.y, 2, 2);
          }
        }
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    // 🚀 Wait for font, then initialize
    document.fonts.ready.then(() => {
      preComputeParticles();
      animationRef.current = requestAnimationFrame(loop);
    });

    // 🚀 Add listener to re-compute particle layouts on window resize or device rotation
    window.addEventListener('resize', preComputeParticles);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', preComputeParticles);
    };
  }, []);

  const handleMouseMove = (e) => mouseRef.current = { x: e.clientX, y: e.clientY };
  const handleMouseLeave = () => mouseRef.current = { x: -1000, y: -1000 };

  return (
    <div
      className="title-hitbox"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: `${800 * hitboxScale}px`,
        height: `${250 * hitboxScale}px`,
        position: 'relative',
        margin: '0 auto',
        overflow: 'visible',
        pointerEvents: isEntered ? 'none' : 'auto', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        visibility: isEntered && isTransitioning ? 'hidden' : 'visible'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', 
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none', 
          zIndex: -1,
          filter: 'drop-shadow(0 0 10px rgba(76, 180, 187, 1.3))',
        }}
      />
    </div>
  );
}