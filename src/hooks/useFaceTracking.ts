import { useState, useEffect, useRef } from 'react';
import * as faceapi from '@vladmandic/face-api';

export const useFaceTracking = () => {
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [facePos, setFacePos] = useState({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let isTracking = true;

    const startCamera = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 320, height: 240 },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setHasCamera(true);

        const detectFace = async () => {
          if (!isTracking) return;
          if (videoRef.current && videoRef.current.readyState === 4) {
            const detections = await faceapi.detectSingleFace(
              videoRef.current,
              new faceapi.TinyFaceDetectorOptions({ inputSize: 160 })
            );

            if (detections) {
              const { box } = detections;
              // Normalize coordinates to -1 to 1 based on video dimensions
              // Note: camera image is mirrored, handle carefully if needed
              // x center, y center
              const videoWidth = videoRef.current.videoWidth;
              const videoHeight = videoRef.current.videoHeight;

              const centerX = box.x + box.width / 2;
              const centerY = box.y + box.height / 2;

              // Mirror X so moving left physically moves model left
              const normalizedX = (-(centerX / videoWidth) * 2) + 1;
              // Standard Y
              const normalizedY = -((centerY / videoHeight) * 2) + 1;

              setFacePos({
                x: normalizedX,
                y: normalizedY,
              });
            }
          }
          requestAnimationFrame(detectFace);
        };

        videoRef.current?.addEventListener('play', () => {
          detectFace();
        });

      } catch (err) {
        console.warn('Camera access denied or error loading models:', err);
        setHasCamera(false);
      }
    };

    const videoEl = document.createElement('video');
    videoEl.autoplay = true;
    videoEl.muted = true;
    videoEl.playsInline = true;
    videoRef.current = videoEl;

    startCamera();

    return () => {
      isTracking = false;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  return { hasCamera, facePos };
};
