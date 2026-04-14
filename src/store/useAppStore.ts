import { create } from 'zustand';

interface AppState {
  cameraPermissionStatus: 'idle' | 'prompting' | 'granted' | 'denied' | 'dismissed';
  setCameraPermissionStatus: (status: 'idle' | 'prompting' | 'granted' | 'denied' | 'dismissed') => void;
  requestCamera: boolean;
  setRequestCamera: (val: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  cameraPermissionStatus: 'idle',
  setCameraPermissionStatus: (status) => set({ cameraPermissionStatus: status }),
  requestCamera: false,
  setRequestCamera: (val) => set({ requestCamera: val })
}));
