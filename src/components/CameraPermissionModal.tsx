import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraPermissionModalProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({ isOpen, onAllow, onDeny }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-black/10 dark:border-white/10"
          >
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
              Camera Access Required
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm leading-relaxed">
              This site uses your camera to make the 3D object dynamically track your face.
              No video or images are recorded or sent to any server.
              Would you like to enable camera access?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={onDeny}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Not Now
              </button>
              <button
                onClick={onAllow}
                className="px-4 py-2 text-sm font-medium text-white bg-[#F05641] hover:bg-[#d94a36] rounded-lg transition-colors shadow-sm"
              >
                Allow Camera
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
