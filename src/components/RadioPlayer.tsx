import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ReactPlayer from "react-player";
import { FaRadio } from "react-icons/fa6";
import { LuSpeaker } from "react-icons/lu";
import { motion, useSpring, useMotionValue } from "motion/react";

export const RadioPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const playerRef = useRef<any>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  // Springs for repelling motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!playing || !floatingRef.current) {
        x.set(0);
        y.set(0);
        return;
      }

      const { clientX, clientY } = e;
      const rect = floatingRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const threshold = 150; // Distance within which the repelling starts

      if (distance < threshold) {
        // Calculate a repelling vector
        // The closer the mouse, the stronger the repel
        const force = (threshold - distance) / threshold;
        // Direction is away from the mouse
        const dirX = -distanceX / distance;
        const dirY = -distanceY / distance;

        const maxRepelDistance = 100;
        x.set(dirX * force * maxRepelDistance);
        y.set(dirY * force * maxRepelDistance);
      } else {
        // Return to original position slowly
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [playing, x, y]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(!playing);
  };

  const mainIconContent = (
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
      
      {/* We use framer-motion layoutId to automatically morph between the two positions */}
      
      {!playing && (
        <div className="relative flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 min-[2000px]:w-[2.5vw] min-[2000px]:h-[2.5vw]">
          <motion.div
            layoutId="radio-player"
            className="relative"
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {mainIconContent}
          </motion.div>
        </div>
      )}

      {/* Render the floating state via portal so it escapes the backdrop-filter */}
      {playing && createPortal(
        <motion.div
          layoutId="radio-player"
          ref={floatingRef}
          className="fixed right-4 lg:right-6 min-[2000px]:right-[4vw] z-[100] floating-bounce"
          style={{ top: "50%", x: springX, y: springY }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          {mainIconContent}
        </motion.div>,
        document.body
      )}

      {/* Hidden YouTube Player (kept out of layout morphing to never unmount/reload) */}
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          src="https://www.youtube.com/playlist?list=PLtd07o84uPAEz3PeRm87JkSSHqHdJ1Rhu"
          playing={playing}
          volume={1}
          width="0"
          height="0"
          onReady={() => setIsReady(true)}
          {...{
            config: {
              youtube: {
                playerVars: {
                  listType: 'playlist',
                  list: 'PLtd07o84uPAEz3PeRm87JkSSHqHdJ1Rhu'
                } as any
              } as any
            }
          }}
        />
      </div>
    </>
  );
};
