import { useState, useEffect, useRef } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export const useFaceTracking = () => {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  // Store estimated pitch and yaw (rotation) instead of position
  const faceRotationRef = useRef({ pitch: 0, yaw: 0 });
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isTracking = true;
    let animationFrameId: number;

    const startCamera = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/models/face_landmarker.task',
            delegate: "GPU"
          },
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: true,
          runningMode: "VIDEO",
          numFaces: 1
        });

        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 320, height: 240 },
          audio: false,
        });

        if (!isTracking) {
          mediaStream.getTracks().forEach((track) => track.stop());
          return;
        }

        stream = mediaStream;

        let lastVideoTime = -1;
        const detectFace = async () => {
          if (!isTracking) return;
          if (videoRef.current && videoRef.current.readyState >= 2 && landmarkerRef.current) {
            const startTimeMs = performance.now();
            if (lastVideoTime !== videoRef.current.currentTime) {
              lastVideoTime = videoRef.current.currentTime;
              const results = landmarkerRef.current.detectForVideo(videoRef.current, startTimeMs);

              if (results.facialTransformationMatrixes && results.facialTransformationMatrixes.length > 0) {
                // The matrix is a 4x4 array representing the pose.
                // We can extract pitch (x-axis rotation) and yaw (y-axis rotation).
                const matrix = results.facialTransformationMatrixes[0].data;

                // Extract yaw (around Y axis)
                let yaw = Math.atan2(-matrix[8], Math.sqrt(matrix[9] * matrix[9] + matrix[10] * matrix[10]));

                // Extract pitch (around X axis)
                let pitch = Math.atan2(matrix[9], matrix[10]);

                // The output depends slightly on the camera mirror state and orientation.
                // We'll flip yaw to match mirroring if needed

                faceRotationRef.current = {
                  pitch: pitch,
                  yaw: -yaw
                };
              }
            }
          }
          animationFrameId = requestAnimationFrame(detectFace);
        };

        videoRef.current?.addEventListener('play', () => {
          detectFace();
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setHasCamera(true);

      } catch (err) {
        console.warn('Camera access denied or error loading models:', err);
        if (isTracking) {
          setHasCamera(false);
        }
      }
    };

    const videoEl = document.createElement('video');
    videoEl.autoplay = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
    // Flip video horizontally since front camera is usually mirrored
    videoEl.style.transform = 'scaleX(-1)';
    videoRef.current = videoEl;

    startCamera();

    return () => {
      isTracking = false;
      cancelAnimationFrame(animationFrameId);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
    };
  }, []);

  return { hasCamera, faceRotationRef };
};
