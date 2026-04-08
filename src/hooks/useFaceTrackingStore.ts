import { create } from 'zustand';

interface FaceTrackingState {
  hasCamera: boolean | null;
  isFaceDetected: boolean;
  permissionRequested: boolean;
  setHasCamera: (has: boolean | null) => void;
  setIsFaceDetected: (detected: boolean) => void;
  setPermissionRequested: (requested: boolean) => void;
}

export const useFaceTrackingStore = create<FaceTrackingState>((set) => ({
  hasCamera: null,
  isFaceDetected: false,
  permissionRequested: false,
  setHasCamera: (has) => set({ hasCamera: has }),
  setIsFaceDetected: (detected) => set({ isFaceDetected: detected }),
  setPermissionRequested: (requested) => set({ permissionRequested: requested }),
}));
