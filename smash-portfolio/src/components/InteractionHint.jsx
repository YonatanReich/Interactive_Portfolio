// src/components/InteractionHint.jsx
import React, { useRef, useEffect } from 'react';
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

  const calculateTargets = () => {
    if (hintStep === 0) return;
    const targetZ = camera.position.z - 4; 

    const getBotPos = (selector, placement) => {
      const el = document.querySelector(selector);
      if (!el) return new THREE.Vector3(0, 0, targetZ);
      
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      
      let botY = placement === 'under' ? rect.bottom + 60 : rect.top - 60;

      const botVec = new THREE.Vector3(
        (centerX / window.innerWidth) * 2 - 1,
        -(botY / window.innerHeight) * 2 + 1,
        0.5
      );
      botVec.unproject(camera).sub(camera.position).normalize();
      const botDist = (targetZ - camera.position.z) / botVec.z;
      
      return new THREE.Vector3().copy(camera.position).add(botVec.multiplyScalar(botDist));
    };

    switch (hintStep) {
      case 1: currentBotPos.current.set(0, 0, targetZ); break;
      case 2: currentBotPos.current.copy(getBotPos('.tabs', 'under')); break;
      case 3: currentBotPos.current.copy(getBotPos('.scroll-btn-container', 'above')); break;
      case 4: currentBotPos.current.copy(getBotPos('.mute-btn', 'under')); break;
      default: currentBotPos.current.set(0, 0, targetZ);
    }
  };

  useEffect(() => {
    calculateTargets();
    window.addEventListener('resize', calculateTargets);
    return () => window.removeEventListener('resize', calculateTargets);
  }, [hintStep]);

  useFrame((state, delta) => {
    if (hintStep === 0 || !groupRef.current) return;
    
    groupRef.current.position.lerp(currentBotPos.current, delta * 4);
    groupRef.current.quaternion.slerp(camera.quaternion, delta * 4);

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 1.5; 
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 2;
      ring1Ref.current.rotation.y += delta * 1.5;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 1.2;
      ring2Ref.current.rotation.x -= delta * 1;
    }
  });

  if (hintStep === 0) return null;

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
      <group ref={groupRef}>
        
        {/* --- 🚀 THE CHROME DRONE --- */}
        
        {/* The Core (Solid Chrome Diamond) */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[0.08, 0]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={1}    /* 100% Metal */
            roughness={0.1}  /* Highly Polished */
          />
        </mesh>

        {/* Inner Tech Ring (Chrome Wireframe) */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[0.15, 0.005, 16, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={1} 
            roughness={0.1} 
            wireframe 
          />
        </mesh>

        {/* Outer Nav Ring (Solid Chrome) */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[0.22, 0.008, 16, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            metalness={1} 
            roughness={0.0} /* Perfect Mirror Finish */
          />
        </mesh>

        {/* Changed light to clean white so it doesn't tint the UI green anymore */}
        <pointLight color="#ffffff" intensity={10} distance={6} decay={2} />

      </group>
    </Float>
  );
}