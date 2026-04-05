import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../ThemeContext';
import { useFaceTracking } from '../hooks/useFaceTracking';

export const SignatureBrandObject = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();

  const { hasCamera, facePosRef } = useFaceTracking();

  // load model
  const { scene } = useGLTF('/models/eyes2.glb');

  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (hasCamera) {
      // Use face position if camera is available
      targetRotation.current.x = (facePosRef.current.y * Math.PI) / 4;
      targetRotation.current.y = (facePosRef.current.x * Math.PI) / 4;
    } else {
      // Fallback to mouse position
      targetRotation.current.x = (state.pointer.y * Math.PI) / 4;
      targetRotation.current.y = (state.pointer.x * Math.PI) / 4;
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.05;
    }
  });

  return (
    <Float floatIntensity={2}>
      <primitive
        ref={meshRef}
        object={scene}
        scale={6}   // adjust if too big/small
      />
    </Float>
  );
};