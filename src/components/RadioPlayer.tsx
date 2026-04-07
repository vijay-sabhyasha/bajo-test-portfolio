import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ReactPlayer from "react-player";
import { FaRadio } from "react-icons/fa6";
import { LuSpeaker, LuPlay, LuPause, LuSkipForward, LuVolume2, LuVolumeX } from "react-icons/lu";
import { motion, AnimatePresence } from "motion/react";

export const RadioPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isHovered, setIsHovered] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);

  // If playing, we render a portal-like fixed element, else normal element.
  // We'll manage the bounce animation in CSS.

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(!playing);
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playerRef.current) {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer && typeof internalPlayer.nextVideo === "function") {
        internalPlayer.nextVideo();
      } else {
        // Fallback for YouTube iframe API if nextVideo isn't directly exposed
        try {
          internalPlayer.target.nextVideo();
        } catch (err) {
          console.error("Could not skip track", err);
        }
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setVolume(volume === 0 ? 0.5 : 0);
  };

  const navRef = useRef<HTMLDivElement>(null);
  const [navRect, setNavRect] = useState<DOMRect | null>(null);

  // Update original nav position to animate from/to
  useEffect(() => {
    if (navRef.current) {
      setNavRect(navRef.current.getBoundingClientRect());
    }

    const handleResize = () => {
      if (navRef.current && !playing) {
        setNavRect(navRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleResize);
    };
  }, [playing]);

  // Floating styling properties
  const floatingStyle = {
    top: "50%",
    right: "24px",
    x: 0,
    y: "-50%",
  };

  const navPositionStyle = navRect ? {
    top: navRect.top,
    left: navRect.left,
    x: 0,
    y: 0,
  } : {
    top: 0,
    left: 0,
    x: 0,
    y: 0,
  };

  const popoverContent = (
    <div
      className={`absolute right-0 top-full pt-2 lg:pt-3 min-[2000px]:pt-[1vh] transition-all duration-300 origin-top-right z-[110] ${
        isHovered ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
      }`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-2 lg:p-3 min-[2000px]:p-[0.8vw] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-black/5 dark:border-white/10 flex items-center gap-3 lg:gap-4 min-[2000px]:gap-[1vw]">
        {/* Removed play/pause button here since main icon does it */}
        <button
          onClick={handleNextTrack}
          className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          title="Next Track"
        >
          <LuSkipForward className="w-4 h-4 lg:w-5 lg:h-5 min-[2000px]:w-[1.2vw] min-[2000px]:h-[1.2vw]" />
        </button>

        <div className="flex items-center gap-2 min-[2000px]:gap-[0.5vw]">
          <button
            onClick={toggleMute}
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            {volume === 0 ? (
              <LuVolumeX className="w-4 h-4 lg:w-5 lg:h-5 min-[2000px]:w-[1.2vw] min-[2000px]:h-[1.2vw]" />
            ) : (
              <LuVolume2 className="w-4 h-4 lg:w-5 lg:h-5 min-[2000px]:w-[1.2vw] min-[2000px]:h-[1.2vw]" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 lg:w-20 min-[2000px]:w-[5vw] h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-[#F05641]"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          @keyframes floatBounce {
            0% { transform: translateY(-50%); }
            50% { transform: translateY(calc(-50% - 8px)); }
            100% { transform: translateY(-50%); }
          }
          .floating-bounce {
            animation: floatBounce 2s ease-in-out infinite;
          }
        `}
      </style>

      {/* Placeholder in Navbar when playing to collapse smoothly if we wanted to,
          but making it size 0 will make the navbar collapse */}
      <div
        ref={navRef}
        className={`relative flex items-center justify-center transition-all duration-300 ${playing ? "w-0 h-0 overflow-hidden opacity-0" : "w-8 h-8 lg:w-10 lg:h-10 min-[2000px]:w-[2.5vw] min-[2000px]:h-[2.5vw]"}`}
      />

      {/* Render the actual UI via portal so it escapes the backdrop-filter containing block trap */}
      {createPortal(
        <motion.div
          initial={navPositionStyle}
          animate={playing ? floatingStyle : navPositionStyle}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`fixed z-[100] ${playing ? "floating-bounce" : ""}`}
          style={{ position: 'fixed' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* The main icon */}
          <button
            onClick={handlePlayPause}
            className={`relative z-10 flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 min-[2000px]:w-[2.5vw] min-[2000px]:h-[2.5vw] rounded-full transition-all duration-300 focus:outline-none ${
              playing ? "text-[#F05641] bg-white dark:bg-gray-800 shadow-lg border border-black/5 dark:border-white/10" : "text-gray-500 hover:text-black dark:hover:text-white"
            }`}
            title="Radio"
          >
            {playing ? (
              <LuSpeaker className="w-5 h-5 lg:w-6 lg:h-6 min-[2000px]:w-[1.5vw] min-[2000px]:h-[1.5vw]" />
            ) : (
              <FaRadio className="w-5 h-5 lg:w-6 lg:h-6 min-[2000px]:w-[1.5vw] min-[2000px]:h-[1.5vw]" />
            )}
          </button>

          {/* Hover popover */}
          {popoverContent}
        </motion.div>,
        document.body
      )}

      {/* Hidden YouTube Player (kept out of Portal to never unmount/reload) */}
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          src="https://www.youtube.com/playlist?list=PLtd07o84uPAEz3PeRm87JkSSHqHdJ1Rhu"
          playing={playing}
          volume={volume}
          width="0"
          height="0"
          onReady={() => setIsReady(true)}
          config={{
            youtube: {
              playlist: 'PLtd07o84uPAEz3PeRm87JkSSHqHdJ1Rhu'
            }
          }}
        />
      </div>
    </>
  );
};
