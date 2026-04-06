import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../ThemeContext';
import { useFaceTracking } from '../hooks/useFaceTracking';

export const SignatureBrandObject = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();

  const { hasCamera, faceRotationRef } = useFaceTracking();

  // load model
  const { scene } = useGLTF('/models/eyes2.glb');

  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetZ = useRef(0);
  const baseScale = 5;

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());

    scene.position.sub(center); // move model so center = (0,0,0)
  }, [scene]);

  const amplify = (value: number, factor: number) => {
    return Math.sign(value) * Math.pow(Math.abs(value), 0.7) * factor;
  };

  useFrame((state) => {
    if (hasCamera) {
      // Use actual head rotation (pitch, yaw) with a multiplier for high intensity.
      // Mediapipe outputs angles in radians. We apply a multiplier of 2 to make it intense.
      targetRotation.current.x = -faceRotationRef.current.pitch * 2;
      targetRotation.current.y = -faceRotationRef.current.yaw * 2;

      // Highly intense roll
      targetRotation.current.z = faceRotationRef.current.roll * 2;

      // Extract Z translation for distance.
      // Mediapipe Z can be slightly noisy. Assuming neutral Z ~ -50.
      // Let's normalize it to create a strong effect.
      // We map Z directly to position.z.
      // Note: Values depend on distance. Closer to camera = higher Z or lower negative.
      // We will map Z to an offset
      const zOffset = (faceRotationRef.current.z + 50) * 0.5; // Highly intense distance
      targetZ.current = zOffset;

    } else {
      // Fallback to mouse position
      targetRotation.current.x = (-state.pointer.y * Math.PI) / 4;
      targetRotation.current.y = (state.pointer.x * Math.PI) / 4;

      // Combination of both X and Y for tilt
      targetRotation.current.z = (state.pointer.x * state.pointer.y * Math.PI) / 2;

      // Distance based on distance from center (edges = further away, center = closer)
      // pointer ranges from -1 to 1
      const distFromCenter = Math.sqrt(state.pointer.x * state.pointer.x + state.pointer.y * state.pointer.y);
      // max distance is sqrt(2) ~ 1.414. We want edges to be further away (lower Z).
      // so when distFromCenter is large, targetZ is negative. When distFromCenter is small, targetZ is positive.
      targetZ.current = (1 - distFromCenter) * 15 - 5; // Intense translation
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.35;
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.25;
      meshRef.current.rotation.z += (targetRotation.current.z - meshRef.current.rotation.z) * 0.25;

      meshRef.current.position.z += (targetZ.current - meshRef.current.position.z) * 0.1;
    }
  });

  return (
    <Float floatIntensity={2}>
      <primitive
        ref={meshRef}
        object={scene}
        scale={baseScale}   // adjust if too big/small
      />
    </Float>
  );
};