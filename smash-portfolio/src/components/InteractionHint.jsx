import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store';

export default function InteractionHint() {
  const groupRef = useRef();
  const coreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  
  const { camera } = useThree();
  const hintStep = useStore((state) => state.hintStep);
  const currentBotPos = useRef(new THREE.Vector3(0, 0, 0));
  

  // 🚀 1. GENERATE SMOOTH GLOW TEXTURE (Hook stays at the top)
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.88)');
    gradient.addColorStop(0.2, 'rgba(0, 255, 255, 0.58)');
    gradient.addColorStop(0.5, 'rgba(146, 190, 255, 0.38)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const calculateTargets = () => {
    if (hintStep === 0) return;
    const targetZ = camera.position.z - 4; 

    const getBotPos = (selector, placement) => {
      const el = document.querySelector(selector);
      if (!el) return new THREE.Vector3(0, 0, targetZ);
      
      const rect = el.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768; // 🚀 Detect screen size
      const isTabletVertical = window.innerWidth <= 1024 && window.innerHeight > window.innerWidth;
      const isTabletPortrait = window.innerWidth > 1024 && window.innerHeight < window.innerWidth;
      
      // Center X is always the same
      let targetX = rect.left + rect.width / 2;
      let targetY; 

      if (placement === 'under') {
        // 🚀 Mobile: 30px below (closer). Desktop: 70px below.
        targetY = rect.bottom + (isMobile  ? 30 : 70); 
      } else {
        // 🚀 'above' (default)
        // Mobile: 120px above (higher up). Desktop: 75px above.
        targetY = rect.top - (isMobile ? 140 : 75, isTabletVertical? 120 : 75, isTabletPortrait ? 120 : 75); 
      }

      // Convert pixel coordinates to 3D space
      const botVec = new THREE.Vector3(
        (targetX / window.innerWidth) * 2 - 1, 
        -(targetY / window.innerHeight) * 2 + 1,
        0.5
      );
      
      botVec.unproject(camera).sub(camera.position).normalize();
      const botDist = (targetZ - camera.position.z) / botVec.z;
      
      return new THREE.Vector3().copy(camera.position).add(botVec.multiplyScalar(botDist));
    };

    switch (hintStep) {
      case 1: currentBotPos.current.copy(getBotPos('.mute-and-hint-btn-container', 'above')); break;
      case 2: currentBotPos.current.copy(getBotPos('.tabs', 'under')); break;
      case 3: currentBotPos.current.copy(getBotPos('.scroll-btn-container', 'above')); break;
      case 4: currentBotPos.current.copy(getBotPos('.mute-btn', 'above')); break;
      default: currentBotPos.current.copy(getBotPos('.hint-drawer-mask', 'under'));
    }
  };

  useEffect(() => {
    calculateTargets();
    window.addEventListener('resize', calculateTargets);
    return () => window.removeEventListener('resize', calculateTargets);
  }, [hintStep]);

  // 🚀 2. FORCE HIGH RENDER ORDER (Always on top)
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((obj) => {
        obj.renderOrder = 999;
        if (obj.material) obj.material.depthTest = false;
      });
    }
  }, [hintStep]);

  useFrame((state, delta) => {
    if (hintStep === 0 || !groupRef.current) return;
    
    groupRef.current.position.lerp(currentBotPos.current, delta * 4);
    groupRef.current.quaternion.slerp(camera.quaternion, delta * 4);

    if (coreRef.current) coreRef.current.rotation.y += delta * 1.5; 
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 2;
      ring1Ref.current.rotation.y += delta * 1.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 1.2;
      ring2Ref.current.rotation.x -= delta * 1;
    }
  });

  // 🚀 3. CONDITIONAL RETURN (Must stay below all Hooks)
  if (hintStep === 0) return null;

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
      <group ref={groupRef} raycast={null}>
        {/* Core */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>

        {/* 🚀 Smooth Sprite Glow */}
        <sprite scale={[0.8, 0.8, 1]} raycast={null}>
          <spriteMaterial 
            map={glowTexture} 
            blending={THREE.AdditiveBlending} 
            transparent={true} 
            depthWrite={false}
          />
        </sprite>

        {/* Inner Ring */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[0.15, 0.005, 16, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
        </mesh>

        {/* Outer Ring */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[0.22, 0.008, 16, 32]} />
          <meshBasicMaterial color="#00ffff" transparent opacity={0.7} />
        </mesh>

       
      </group>
    </Float>
  );
}