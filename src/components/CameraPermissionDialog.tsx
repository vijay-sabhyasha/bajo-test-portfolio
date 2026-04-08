import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../ThemeContext';

interface CameraPermissionDialogProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const CameraPermissionDialog: React.FC<CameraPermissionDialogProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Show after a tiny delay for a nice entrance
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    setTimeout(onAccept, 300);
  };

  const handleDecline = () => {
    setIsVisible(false);
    setTimeout(onDecline, 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`max-w-md w-full p-6 md:p-8 rounded-2xl shadow-2xl border ${
              theme === 'dark'
                ? 'bg-[#141517] border-white/10 text-white'
                : 'bg-[#EBEAE9] border-black/10 text-black'
            }`}
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Interactive 3D Experience</h3>
            <p className={`text-sm md:text-base mb-8 leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              This experience uses your camera to track your face and rotate the 3D model accordingly.
              <strong> We do not record or store any video data.</strong> Do you want to enable camera access to enhance your experience?
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-end">
              <button
                onClick={handleDecline}
                className={`px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white/5 hover:bg-white/10 text-white'
                    : 'bg-black/5 hover:bg-black/10 text-black'
                }`}
              >
                No, thanks
              </button>
              <button
                onClick={handleAccept}
                className={`px-6 py-2.5 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                Allow Camera
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
