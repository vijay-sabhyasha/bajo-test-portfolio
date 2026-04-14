import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';

export const TutorialOverlay: React.FC = () => {
  const { cameraPermissionStatus } = useAppStore();
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {cameraPermissionStatus === 'granted' && isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute z-40 bottom-24 right-4 md:bottom-28 md:right-8 min-[2000px]:bottom-[10vh] min-[2000px]:right-[4vw] flex flex-col items-center pointer-events-auto"
        >
          <div className="relative p-2 md:p-3 rounded-2xl md:rounded-3xl bg-[#f7f7f7]/80 dark:bg-black/20 backdrop-blur-lg border border-black/5 dark:border-white/5 shadow-lg flex flex-col items-center">
            <button
              onClick={handleDismiss}
              className="absolute -top-2 -right-2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors z-10"
              aria-label="Close tutorial"
            >
              <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-24 h-32 md:w-32 md:h-40 min-[2000px]:w-[8vw] min-[2000px]:h-[10vw] rounded-xl md:rounded-2xl overflow-hidden bg-black/5 dark:bg-white/5">
              <video
                src="/videos/tutorial.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-2 text-center">
              <p className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Calibration
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
