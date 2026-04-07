import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { FaRadio } from "react-icons/fa6";
import { LuSpeaker, LuPlay, LuPause, LuSkipForward, LuVolume2, LuVolumeX } from "react-icons/lu";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";

export const RadioPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isHovered, setIsHovered] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(!playing);
  };

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (playerRef.current) {
      // react-player wrapper for youtube next video in playlist
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (internalPlayer && typeof internalPlayer.nextVideo === "function") {
        internalPlayer.nextVideo();
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

  const renderControls = () => (
    <div
      className={`absolute right-0 top-full pt-2 lg:pt-3 min-[2000px]:pt-[1vh] transition-all duration-300 origin-top-right ${
        isHovered ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div
        className="p-2 lg:p-3 min-[2000px]:p-[0.8vw] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-black/5 dark:border-white/10 flex items-center gap-3 lg:gap-4 min-[2000px]:gap-[1vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handlePlayPause}
          className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          title={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <LuPause className="w-4 h-4 lg:w-5 lg:h-5 min-[2000px]:w-[1.2vw] min-[2000px]:h-[1.2vw]" />
          ) : (
            <LuPlay className="w-4 h-4 lg:w-5 lg:h-5 min-[2000px]:w-[1.2vw] min-[2000px]:h-[1.2vw]" />
          )}
        </button>

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

  // The hidden YouTube player must stay mounted regardless of whether the UI is floating or not
  const renderPlayer = () => (
      <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden">
        {/* Note: ReactPlayer needs url prop instead of src, and must not have display:none */}
        <ReactPlayer
          ref={playerRef}
          // @ts-ignore - ReactPlayer types might be incorrect regarding url prop
          url="https://www.youtube.com/playlist?list=PLtd07o84uPAEz3PeRm87JkSSHqHdJ1Rhu"
          playing={playing}
          volume={volume}
          width="0"
          height="0"
          onReady={() => setIsReady(true)}
          config={{
            youtube: {
              // Ensure looping if possible, though playlists naturally play through
              playlist: 'PLtd07o84uPAEz3PeRm87JkSSHqHdJ1Rhu'
            }
          }}
        />
      </div>
  );

  return (
    <>
      {/* Docked State in Navbar */}
      <div className="relative flex items-center justify-center h-full w-8 lg:w-10 min-[2000px]:w-[2.5vw]">
        {!playing && (
          <motion.div
            layoutId="radio-player-icon"
            className="absolute z-10"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              onClick={handlePlayPause}
              className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 min-[2000px]:w-[2.5vw] min-[2000px]:h-[2.5vw] rounded-full transition-all duration-300 focus:outline-none text-gray-500 hover:text-black dark:hover:text-white"
              title="Radio"
            >
              <FaRadio className="w-5 h-5 lg:w-6 lg:h-6 min-[2000px]:w-[1.5vw] min-[2000px]:h-[1.5vw]" />
            </button>
            {renderControls()}
          </motion.div>
        )}
      </div>

      {/* Floating State on Screen */}
      <AnimatePresence>
        {playing && typeof window !== "undefined" && createPortal(
          <motion.div
            layoutId="radio-player-icon"
            drag
            dragMomentum={false}
            className="fixed bottom-10 right-10 z-[100] cursor-grab active:cursor-grabbing flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
                x: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 4,
                ease: "easeInOut"
              }}
            >
              <button
                onClick={handlePlayPause}
                className="relative flex items-center justify-center w-12 h-12 lg:w-14 lg:h-14 min-[2000px]:w-[3.5vw] min-[2000px]:h-[3.5vw] rounded-full bg-white dark:bg-gray-800 shadow-xl border border-black/5 dark:border-white/10 text-[#F05641] transition-all duration-300 focus:outline-none"
                title="Radio"
              >
                <LuSpeaker className="w-6 h-6 lg:w-8 lg:h-8 min-[2000px]:w-[2vw] min-[2000px]:h-[2vw]" />
              </button>
              {renderControls()}
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

      {renderPlayer()}
    </>
  );
};
