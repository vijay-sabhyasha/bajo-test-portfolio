import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

export const PermissionDialog: React.FC = () => {
  const { cameraPermissionStatus, setCameraPermissionStatus, setRequestCamera } = useAppStore();

  const handleEnable = () => {
    setCameraPermissionStatus('prompting');
    setRequestCamera(true);
  };

  const handleDismiss = () => {
    setCameraPermissionStatus('dismissed');
  };

  return (
    <AnimatePresence>
      {cameraPermissionStatus === 'idle' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-black/5 dark:border-white/5"
          >
            <div className="mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Camera Access</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                For the best interactive experience with the 3D scene, please enable camera access. The camera is used locally for face tracking to control the 3D elements and no video is recorded or sent anywhere.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleEnable}
                className="w-full py-3 px-4 bg-black text-white dark:bg-white dark:text-black rounded-xl font-medium transition-transform active:scale-[0.98] hover:opacity-90"
              >
                Enable Camera
              </button>
              <button
                onClick={handleDismiss}
                className="w-full py-3 px-4 bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-transform active:scale-[0.98] hover:bg-gray-200 dark:hover:bg-white/10"
              >
                Continue Without Camera
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
