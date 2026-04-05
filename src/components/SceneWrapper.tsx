import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Preload } from '@react-three/drei';
import { useInView } from 'motion/react';
import { useTheme } from '../ThemeContext';

interface SceneWrapperProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  fov?: number;
  mobileScale?: number;
}

export const SceneWrapper: React.FC<SceneWrapperProps> = ({
  children,
  cameraPosition = [0, 0, 5],
  fov = 45,
  mobileScale = 0.8
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.1, once: false });
  const { theme } = useTheme();

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isInView ? (
        <Canvas
          camera={{ position: cameraPosition, fov }}
          dpr={[1, 2]} // Cap pixel ratio for performance
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          <Suspense fallback={null}>
            {/* Common Lighting Setup */}
            <ambientLight intensity={theme === 'dark' ? 0.2 : 0.6} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={theme === 'dark' ? 0.8 : 1.2}
              color={theme === 'dark' ? '#aaa' : '#fff'}
            />
            {theme === 'dark' && (
              <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00ffcc" /> // Cyberpunk accent
            )}

            {/* Environment map for reflections */}
            <Environment preset={theme === 'dark' ? "city" : "studio"} />

            {/* The actual 3D content */}
            <group scale={window.innerWidth < 768 ? mobileScale : 1}>
              {children}
            </group>

            <Preload all />
          </Suspense>
        </Canvas>
      ) : (
        // Fallback or empty div when out of view for performance
        <div className="w-full h-full bg-transparent flex items-center justify-center">
            {/* Optional 2D fallback or loading state */}
        </div>
      )}
    </div>
  );
};
