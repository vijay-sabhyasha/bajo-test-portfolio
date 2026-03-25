import React from "react";
import { motion } from "motion/react";

import {
  RiJavascriptFill,
  RiReactjsLine,
  RiTailwindCssFill,
  RiNodejsLine,
} from "react-icons/ri";

import { FiGithub } from "react-icons/fi";
import { SiPython } from "react-icons/si";
import { BiLogoDjango } from "react-icons/bi";
import { DiDjango } from "react-icons/di";
import { BiTransfer } from "react-icons/bi";
import { BiLogoGoogleCloud } from "react-icons/bi";
import { SiPandas } from "react-icons/si";
import { DiRedis } from "react-icons/di";
import { BiLogoPostgresql } from "react-icons/bi";
import { TbBrandMysql } from "react-icons/tb";
import { TbWorldDownload } from "react-icons/tb";
import { SiPostman } from "react-icons/si";



const StackCard = () => {
const stack = [
  { name: "Python", icon: SiPython },
  { name: "Django", icon: DiDjango },
  { name: "Django REST", icon: BiLogoDjango },
  { name: "MySQL", icon: TbBrandMysql },
  { name: "PostgreSQL", icon: BiLogoPostgresql },
  { name: "Redis", icon: DiRedis },
  { name: "WebSockets", icon: BiTransfer },
  { name: "Pandas", icon: SiPandas },
  { name: "Postman", icon: SiPostman },
  { name: "Git", icon: FiGithub },
  { name: "Web Scraping", icon: TbWorldDownload },
  { name: "Google Cloud", icon: BiLogoGoogleCloud },
];

  return (
    <div>
      <span className="text-[10px] lg:text-xs uppercase tracking-widest opacity-40 mb-2 lg:mb-4 block">
        Stack I use
      </span>

      <div className="flex flex-wrap gap-2 lg:gap-3">
        {stack.map((tech, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.05,
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
            className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2 py-1 md:px-4 md:py-2 lg:px-3 lg:py-1.5 rounded-full border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-default"
          >
            <tech.icon className="w-3.5 h-3.5 lg:w-4.5 lg:h-4.5 opacity-60" />
            <span className="text-xs lg:text-sm font-light">{tech.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StackCard;
