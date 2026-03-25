import React from "react";

const IntroCard = () => {
  return (
    <div>
      <h3 className="text-lg md:text-2xl lg:text-2xl min-[2000px]:text-[2vw] font-semibold mb-2 lg:mb-3 min-[2000px]:mb-[1.5vh]">
        Hi, I'm Vijay
      </h3>

      <p className="text-xs md:text-[2vw] lg:text-base min-[2000px]:text-[1.2vw] opacity-60 leading-relaxed min-[2000px]:leading-[2vw]">
        I’m a backend developer passionate about building scalable, reliable, and efficient systems. I enjoy designing clean APIs and handling complex business logic using Django, Node.js, and SQL, and I’m always exploring better ways to improve performance, data consistency, and system architecture.
      </p>
    </div>
  );
};

export default IntroCard;