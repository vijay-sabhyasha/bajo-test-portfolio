import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export const MobileDesktopWarning: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if device is mobile based on user agent or screen width
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    
    // Check session storage to see if user already dismissed it this session
    const hasDismissed = sessionStorage.getItem('mobileWarningDismissed') === 'true';

    if (isMobile && !hasDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('mobileWarningDismissed', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-4 left-4 right-4 z-[60] flex items-center justify-between gap-4 p-4 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-2xl shadow-lg border border-black/5 dark:border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium dark:text-white">
              For the best experience, please view this site on a desktop device.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 p-2 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
