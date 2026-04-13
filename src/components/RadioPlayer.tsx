import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import ReactPlayer from "react-player";
import { FaRadio } from "react-icons/fa6";
import { LuSpeaker } from "react-icons/lu";
import { GiSpeaker } from "react-icons/gi";
import {
  motion,
  useSpring,
  useMotionValue,
  useTime,
  useTransform,
} from "motion/react";

export const RadioPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const floatingRef = useRef<HTMLDivElement>(null);

  // base repel motion
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // floating animation (independent)
  const time = useTime();
  const floatY = useTransform(time, (t) => Math.sin(t / 1000) * 8);

  // combine repel + float
  const finalY = useTransform([springY, floatY], ([repel, float]) => repel + float);

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

      const dx = clientX - centerX;
      const dy = clientY - centerY;

      const distance = Math.sqrt(dx * dx + dy * dy);
      const threshold = 150;

      if (distance === 0) return;

      if (distance < threshold) {
        const force = Math.pow((threshold - distance) / threshold, 2);

        const dirX = -dx / distance;
        const dirY = -dy / distance;

        const maxRepel = 120;

        x.set(dirX * force * maxRepel);
        y.set(dirY * force * maxRepel);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [playing, x, y]);

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying((prev) => !prev);
  };

  const mainIconContent = (
    <button
      onClick={handlePlayPause}
      className={`relative z-10 flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 rounded-full transition-all duration-300 ${
        playing
          ? "text-[#F05641] bg-white dark:bg-gray-800 shadow-lg border border-black/5 dark:border-white/10"
          : "text-gray-500 hover:text-black dark:hover:text-white"
      }`}
    >
      {playing ? (
        <GiSpeaker className="w-5 h-5 lg:w-6 lg:h-6" />
      ) : (
        <FaRadio className="w-5 h-5 lg:w-6 lg:h-6" />
      )}
    </button>
  );

  return (
    <>
      {!playing && (
        <div className="flex items-center justify-center w-10 h-10">
          <motion.div layoutId="radio-player">
            {mainIconContent}
          </motion.div>
        </div>
      )}

      {playing &&
        createPortal(
          <motion.div
            layoutId="radio-player"
            ref={floatingRef}
            className="fixed right-6 z-[100]"
            style={{
              top: "50%",
              x: springX,
              y: finalY, // combined motion
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {mainIconContent}
          </motion.div>,
          document.body
        )}

      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          src="https://www.youtube.com/playlist?list=PLtd07o84uPAEz3PeRm87JkSSHqHdJ1Rhu"
          playing={playing}
          width="0"
          height="0"
        />
      </div>
    </>
  );
};