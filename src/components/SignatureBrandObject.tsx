import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../ThemeContext';
import { useFaceTracking } from '../hooks/useFaceTracking';

export const SignatureBrandObject = () => {
  const meshRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();

  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showDialog, setShowDialog] = useState(true);

  const { hasCamera, faceRotationRef } = useFaceTracking(permissionGranted);

  const { scene } = useGLTF('/models/eyes2.glb');

  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const targetZ = useRef(0);
  const baseScale = 5;

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
  }, [scene]);

  useFrame((state) => {
    if (hasCamera) {

      targetRotation.current.x = -faceRotationRef.current.pitch * 1.5;
      targetRotation.current.y = -faceRotationRef.current.yaw * 1.5;
      targetRotation.current.z = -faceRotationRef.current.roll * 1.35;


      const zOffset = (faceRotationRef.current.z + 40) * 0.2;
      targetZ.current = zOffset;

    } else {
      targetRotation.current.x = (-state.pointer.y * Math.PI) / 4;
      targetRotation.current.y = (state.pointer.x * Math.PI) / 4;

      targetRotation.current.z = (state.pointer.x * state.pointer.y * Math.PI) / 4;

      const distFromCenter = Math.sqrt(
        state.pointer.x * state.pointer.x +
        state.pointer.y * state.pointer.y
      );

      const rawZ = 2.5 - distFromCenter * 8;     // Base distance minus an additional offset based on how far the pointer is from the center

      targetZ.current = Math.min(rawZ, -1); // Cap how close it gets
    }

    if (meshRef.current) {
      meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.35;
      meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.25;
      meshRef.current.rotation.z += (targetRotation.current.z - meshRef.current.rotation.z) * 0.25;

      meshRef.current.position.z += (targetZ.current - meshRef.current.position.z) * 0.1;
    }
  });

  return (
    <>
      <Float floatIntensity={2}>
        <primitive
          ref={meshRef}
          object={scene}
          scale={baseScale}
        />
      </Float>

      {showDialog && (
        <Html center zIndexRange={[100, 0]}>
          <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-black/10 dark:border-white/10 flex flex-col gap-4 text-center w-80 max-w-[90vw]">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Camera Access</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This experience requires camera access for facial tracking.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <button
                className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
                onClick={() => {
                  setPermissionGranted(true);
                  setShowDialog(false);
                }}
              >
                Allow
              </button>
              <button
                className="px-4 py-2 bg-transparent text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setPermissionGranted(false);
                  setShowDialog(false);
                }}
              >
                Continue without
              </button>
            </div>
          </div>
        </Html>
      )}
    </>
  );
};