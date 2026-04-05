import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../ThemeContext';

export const SignatureBrandObject = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();

  // load model
  const { scene } = useGLTF('/models/eyes2.glb');

  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    targetRotation.current.x = (state.pointer.y * Math.PI) / 4;
    targetRotation.current.y = (state.pointer.x * Math.PI) / 4;

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