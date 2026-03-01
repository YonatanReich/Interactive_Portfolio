import { useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true
}) => {
  const cursorRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const dotRef = useRef(null);

  const isActiveRef = useRef(false);
  const activeTargetRef = useRef(null); // 🚨 Tracks the actual element for ticker
  const targetCornerPositionsRef = useRef(null);
  const tickerFnRef = useRef(null);
  const activeStrengthRef = useRef(0);

  const isMobile = useMemo(() => {
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return (hasTouchScreen && isSmallScreen) || /android|iphone|ipad|ipod/i.test(userAgent);
  }, []);

  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, {
      x,
      y,
      duration: 0.1,
      ease: 'power3.out'
    });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) document.body.style.cursor = 'none';

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    const tickerFn = () => {
      // 🚨 UPDATED: If we have an active target, re-calculate its bounds every frame
      if (activeTargetRef.current) {
        const rect = activeTargetRef.current.getBoundingClientRect();
        const { borderWidth, cornerSize } = constants;
        targetCornerPositionsRef.current = [
          { x: rect.left - borderWidth, y: rect.top - borderWidth },
          { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
          { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
          { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
        ];
      }

      if (!targetCornerPositionsRef.current || !cursor || !cornersRef.current) return;

      const strength = activeStrengthRef.current;
      if (strength === 0) return;

      const cursorX = gsap.getProperty(cursor, 'x');
      const cursorY = gsap.getProperty(cursor, 'y');

      Array.from(cornersRef.current).forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x');
        const currentY = gsap.getProperty(corner, 'y');

        const targetX = targetCornerPositionsRef.current[i].x - cursorX;
        const targetY = targetCornerPositionsRef.current[i].y - cursorY;

        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;

        // Snaps faster when lock-on is nearly complete
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;

        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration: duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const createSpinTimeline = () => {
      if (spinTl.current) spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };
    createSpinTimeline();

    const moveHandler = e => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const enterHandler = e => {
      const target = e.target.closest(targetSelector);
      if (!target || activeTargetRef.current === target) return;

      activeTargetRef.current = target;
      
      // Stop rotation and lock to 0 for a clean frame
      spinTl.current?.pause();
      gsap.to(cursor, { rotation: 0, duration: 0.2 });

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current);

      gsap.to(activeStrengthRef, {
        current: 1,
        duration: hoverDuration,
        ease: 'power2.out'
      });
    };

    const leaveHandler = () => {
      gsap.ticker.remove(tickerFnRef.current);
      activeTargetRef.current = null;
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      gsap.set(activeStrengthRef, { current: 0, overwrite: true });

      const corners = Array.from(cornersRef.current);
      const { cornerSize } = constants;
      const positions = [
        { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
        { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
        { x: cornerSize * 0.5, y: cornerSize * 0.5 },
        { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
      ];

      corners.forEach((corner, index) => {
        gsap.to(corner, {
          x: positions[index].x,
          y: positions[index].y,
          duration: 0.3,
          ease: 'power3.out'
        });
      });

      // Resume spin
      if (spinTl.current) spinTl.current.play();
    };

    window.addEventListener('mouseover', enterHandler);
    window.addEventListener('mouseout', leaveHandler);
    window.addEventListener('mousedown', () => {
      if (dotRef.current) gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
    });
    window.addEventListener('mouseup', () => {
      if (dotRef.current) gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
    });

    return () => {
      gsap.ticker.remove(tickerFnRef.current);
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('mouseout', leaveHandler);
      document.body.style.cursor = originalCursor;
      spinTl.current?.kill();
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
};

export default TargetCursor;