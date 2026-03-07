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

    const typeSpeed = 50;
    const blinkSpeed = 500;

    const fontName = '900 64px "Orbitron", sans-serif';
    const fontRole = '700 32px "Orbitron", sans-serif';
    const spacing = "4px";

    // 🚀 STEP A: PRE-COMPUTE TEXT & CURSOR PARTICLES
    const preComputeParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Sizing (Name)
      ctx.font = fontName;
      ctx.letterSpacing = spacing;
      const w1 = ctx.measureText(state.text1).width;
      const startX1 = centerX - w1 / 2;
      const y1 = centerY - 40;

      // Sizing (Role)
      ctx.font = fontRole;
      ctx.letterSpacing = spacing;
      const w2 = ctx.measureText(state.text2).width;
      const startX2 = centerX - w2 / 2;
      const y2 = centerY + 30;

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

      // 🚀 GENERATE CURSOR 1 PARTICLES (Big White Block)
      const cursor1Particles = [];
      const c1W = 32; const c1H = 54; 
      for (let y = -c1H / 2; y < c1H / 2; y += step) {
        for (let x = 0; x < c1W; x += step) {
          cursor1Particles.push({
            x: startX1 + x, y: y1 + y, // Start near the first letter
            relX: x, relY: y, // Memory of its shape
            vx: 0, vy: 0, disturbed: false, color: '#4CB4BB'
          });
        }
      }

      // 🚀 GENERATE CURSOR 2 PARTICLES (Small Cyan Block)
      const cursor2Particles = [];
      const c2W = 12; const c2H = 22;
      for (let y = -c2H / 2; y < c2H / 2; y += step) {
        for (let x = 0; x < c2W; x += step) {
          cursor2Particles.push({
            x: startX2 + x, y: y2 + y,
            relX: x, relY: y,
            vx: 0, vy: 0, disturbed: false, color: '#4CB4BB'
          });
        }
      }

      particlesRef.current = { 
        particles, startX1, startX2, y1, y2, centerY, 
        cursor1Particles, cursor2Particles 
      };
    };

    // 🚀 STEP B: ANIMATION LOOP
    const loop = (time) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const { particles, startX1, startX2, y1, y2, centerY, cursor1Particles, cursor2Particles } = particlesRef.current;
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

      ctx.font = fontName;
      ctx.letterSpacing = spacing;
      const revealX1 = startX1 + ctx.measureText(state.text1.substring(0, state.idx1)).width;
      
      ctx.font = fontRole;
      ctx.letterSpacing = spacing;
      const revealX2 = startX2 + ctx.measureText(state.text2.substring(0, state.idx2)).width;

      // 🚀 DETERMINE WHICH CURSOR IS ACTIVE
      let activeCursor = null;
      let cursorTargetX = 0;
      let cursorTargetY = 0;

      if (state.phase === 'typing1' || state.phase === 'delay') {
        activeCursor = cursor1Particles;
        cursorTargetX = revealX1 + 8; // Follow line 1
        cursorTargetY = y1;
      } else if (state.phase === 'typing2' || state.phase === 'done') {
        activeCursor = cursor2Particles;
        cursorTargetX = revealX2 + 6; // Follow line 2
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

          // Set the target coordinates for the cursor's current position
          cp.baseX = cursorTargetX + cp.relX;
          cp.baseY = cursorTargetY + cp.relY;

          if (isHovering) {
            const dx = cp.x - mouse.x;
            const dy = cp.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 50) {
              cp.disturbed = true;
              const force = (50 - dist) / 50;
              cp.vx += (dx / dist) * force * 6; // Cursor scatters slightly faster
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
            // 🚀 Stiffer spring (0.3) so the cursor swarm quickly catches up to the typing
            cp.vx += (cp.baseX - cp.x) * 0.3; 
            cp.vy += (cp.baseY - cp.y) * 0.3;
            cp.vx *= 0.65; cp.vy *= 0.65;
            cp.x += cp.vx; cp.y += cp.vy;
          }

          // 🚀 Draw if blink is ON, OR if the cursor is scattered (visible glitch effect)
          if (state.cursorOn || cp.disturbed) {
            ctx.fillStyle = cp.color;
            ctx.fillRect(cp.x, cp.y, 2, 2);
          }
        }
      }

      animationRef.current = requestAnimationFrame(loop);
    };

    document.fonts.ready.then(() => {
      preComputeParticles();
      animationRef.current = requestAnimationFrame(loop);
    });

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const handleMouseMove = (e) => mouseRef.current = { x: e.clientX, y: e.clientY };
  const handleMouseLeave = () => mouseRef.current = { x: -1000, y: -1000 };

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
          filter: 'drop-shadow(0 0 10px rgba(76, 180, 187, 1.2))',
        }}
      />
    </div>
  );
}