import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { FaRadio } from "react-icons/fa6";
import { LuSpeaker, LuPlay, LuPause, LuSkipForward, LuVolume2, LuVolumeX } from "react-icons/lu";

export const RadioPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isHovered, setIsHovered] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);

  // Floating animation styles
  const floatingStyle = playing
    ? { animation: "float 2s ease-in-out infinite" }
    : {};

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

  // Pre-load the player but don't play until requested
  return (
    <div
      className="relative flex items-center justify-center h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>

      {/* The main icon */}
      <button
        onClick={handlePlayPause}
        className={`relative z-10 flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 min-[2000px]:w-[2.5vw] min-[2000px]:h-[2.5vw] rounded-full transition-all duration-300 focus:outline-none ${
          playing ? "text-[#F05641]" : "text-gray-500 hover:text-black dark:hover:text-white"
        }`}
        title="Radio"
      >
        {playing ? (
          <LuSpeaker className="w-5 h-5 lg:w-6 lg:h-6 min-[2000px]:w-[1.5vw] min-[2000px]:h-[1.5vw]" style={floatingStyle} />
        ) : (
          <FaRadio className="w-5 h-5 lg:w-6 lg:h-6 min-[2000px]:w-[1.5vw] min-[2000px]:h-[1.5vw]" />
        )}
      </button>

      {/* Hover Controls Popover */}
      <div
        className={`absolute right-0 top-full mt-2 lg:mt-3 min-[2000px]:mt-[1vh] p-2 lg:p-3 min-[2000px]:p-[0.8vw] bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-black/5 dark:border-white/10 flex items-center gap-3 lg:gap-4 min-[2000px]:gap-[1vw] transition-all duration-300 origin-top-right ${
          isHovered ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        }`}
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

      {/* Hidden YouTube Player */}
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
    </div>
  );
};
