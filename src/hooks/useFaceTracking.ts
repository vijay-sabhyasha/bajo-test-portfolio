import { useEffect, useRef } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { useFaceTrackingStore } from './useFaceTrackingStore';

// Singleton for tracking data so we don't have to put it in zustand state (which triggers too many renders)
export const globalFaceRotation = { pitch: 0, yaw: 0, roll: 0, z: 0 };

export const useFaceTracking = () => {
  const {
    hasCamera, setHasCamera,
    isFaceDetected, setIsFaceDetected,
    permissionRequested, setPermissionRequested
  } = useFaceTrackingStore();

  const faceRotationRef = useRef(globalFaceRotation);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);

  const startCamera = async () => {
    setPermissionRequested(true);
    let stream: MediaStream | null = null;
    let isTracking = true;
    let animationFrameId: number;
    let facesMissingCount = 0;

    const videoEl = document.createElement('video');
    videoEl.autoplay = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
    // Flip video horizontally since front camera is usually mirrored
    videoEl.style.transform = 'scaleX(-1)';
    videoRef.current = videoEl;

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
                setIsFaceDetected(true);
                facesMissingCount = 0;
                // The matrix is a 4x4 array representing the pose.
                // We can extract pitch (x-axis rotation) and yaw (y-axis rotation).
                const matrix = results.facialTransformationMatrixes[0].data;
                
                // Extract yaw (around Y axis)
                let yaw = Math.atan2(-matrix[8], Math.sqrt(matrix[9] * matrix[9] + matrix[10] * matrix[10]));
                
                // Extract pitch (around X axis)
                let pitch = Math.atan2(matrix[9], matrix[10]);

                // Extract roll (around Z axis)
                let roll = Math.atan2(matrix[4], matrix[0]);

                // Extract z translation
                // Column-major array, translation is usually at indices 12, 13, 14
                let z = matrix[14];

                // The output depends slightly on the camera mirror state and orientation.
                // We'll flip yaw and roll to match mirroring if needed
                
                globalFaceRotation.pitch = pitch;
                globalFaceRotation.yaw = -yaw;
                globalFaceRotation.roll = -roll;
                globalFaceRotation.z = z;

                faceRotationRef.current = globalFaceRotation;
              } else {
                facesMissingCount++;
                if (facesMissingCount > 10) {
                  setIsFaceDetected(false);
                }
              }
            }
          }
          if (isTracking) {
            animationFrameId = requestAnimationFrame(detectFace);
          }
        };

        const cleanup = () => {
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

        // Attach cleanup to videoRef for unmounting
        if (videoRef.current) {
          (videoRef.current as any).cleanup = cleanup;
        }

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

  useEffect(() => {
    return () => {
      if (videoRef.current && (videoRef.current as any).cleanup) {
        (videoRef.current as any).cleanup();
      }
    };
  }, []);

  const requestPermission = () => {
    setPermissionRequested(true);
    startCamera();
  };

  const denyPermission = () => {
    setPermissionRequested(true);
    setHasCamera(false);
  };

  return { hasCamera, faceRotationRef, isFaceDetected, requestPermission, denyPermission, permissionRequested };
};
