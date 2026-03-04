// src/hooks/useNeatTexture.jsx
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function useNeatTexture() {
  const [texture, setTexture] = useState(null);
  const textureRef = useRef(null);

  useEffect(() => {
    // 🚀 1. Find the single source of truth canvas from the Boot Screen
    const canvas = document.getElementById('shared-neat-canvas');
    if (!canvas) return;

    // 🚀 2. Convert it into a Three.js material
     // Ensure colors are vibrant and not washed out
    const newTexture = new THREE.CanvasTexture(canvas);
    
    newTexture.wrapS = THREE.RepeatWrapping;
    newTexture.wrapT = THREE.RepeatWrapping;
    newTexture.minFilter = THREE.LinearFilter; 
    newTexture.colorSpace=THREE.SRGBColorSpace; // Ensure correct color rendering
    textureRef.current = newTexture;
    setTexture(newTexture);

    return () => {
      if (textureRef.current) textureRef.current.dispose();
    };
  }, []);

  // 🚀 3. Throttle the upload to ~30fps. 
  // This keeps the liquid looking smooth while eliminating GPU lag!
  let lastUpdate = 0;
  useFrame((state) => {
    if (textureRef.current && state.clock.elapsedTime - lastUpdate > 0.033) {
      textureRef.current.needsUpdate = true;
      lastUpdate = state.clock.elapsedTime;
    }
  });

  return texture;
}