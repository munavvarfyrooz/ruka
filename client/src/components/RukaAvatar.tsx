import { useEffect, useState } from "react";

interface RukaAvatarProps {
  mood?: "happy" | "thinking" | "excited" | "winking" | "speaking";
  size?: "sm" | "md" | "lg";
  message?: string;
  className?: string;
}

export function RukaAvatar({ 
  mood = "happy", 
  size = "md",
  message,
  className = "" 
}: RukaAvatarProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [currentMood, setCurrentMood] = useState(mood);

  useEffect(() => {
    setCurrentMood(mood);
  }, [mood]);

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-40 animate-pulse"></div>
        
        {/* Main avatar */}
        <svg
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 animate-float"
        >
          {/* Hair - flowing style */}
          <path
            d="M60 80 Q 50 50, 80 40 T 120 35 T 150 40 Q 170 50, 160 80"
            fill="url(#hairGradient)"
            className="animate-subtle-wave"
          />
          <path
            d="M55 90 Q 45 100, 50 120 L 55 140"
            fill="url(#hairGradient)"
            className="animate-subtle-wave"
            style={{ animationDelay: "0.2s" }}
          />
          <path
            d="M145 90 Q 155 100, 150 120 L 145 140"
            fill="url(#hairGradient)"
            className="animate-subtle-wave"
            style={{ animationDelay: "0.4s" }}
          />
          
          {/* Face */}
          <ellipse cx="100" cy="100" rx="45" ry="50" fill="#FFE4E1" />
          
          {/* Blush */}
          <ellipse cx="70" cy="110" rx="8" ry="5" fill="#FFB6C1" opacity="0.6" />
          <ellipse cx="130" cy="110" rx="8" ry="5" fill="#FFB6C1" opacity="0.6" />
          
          {/* Eyes */}
          {currentMood === "winking" ? (
            <>
              <path d="M 75 95 Q 85 90, 90 95" stroke="#333" strokeWidth="2" strokeLinecap="round" />
              <g className={isBlinking ? "scale-y-0" : ""} style={{ transformOrigin: "110px 95px", transition: "transform 0.15s" }}>
                <ellipse cx="110" cy="95" rx="8" ry="10" fill="white" />
                <ellipse cx="110" cy="96" rx="5" ry="7" fill="#9333EA" />
                <ellipse cx="112" cy="94" rx="2" ry="3" fill="white" />
              </g>
            </>
          ) : (
            <g className={isBlinking ? "scale-y-0" : ""} style={{ transformOrigin: "100px 95px", transition: "transform 0.15s" }}>
              {/* Left eye */}
              <ellipse cx="85" cy="95" rx="8" ry="10" fill="white" />
              <ellipse cx="85" cy="96" rx="5" ry="7" fill="#9333EA" />
              <ellipse cx="87" cy="94" rx="2" ry="3" fill="white" />
              
              {/* Right eye */}
              <ellipse cx="115" cy="95" rx="8" ry="10" fill="white" />
              <ellipse cx="115" cy="96" rx="5" ry="7" fill="#9333EA" />
              <ellipse cx="117" cy="94" rx="2" ry="3" fill="white" />
            </g>
          )}
          
          {/* Eyebrows */}
          <path
            d={currentMood === "thinking" ? "M 75 85 Q 85 82, 90 85" : "M 75 85 Q 85 83, 90 85"}
            stroke="#D8A7CA"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={currentMood === "thinking" ? "M 110 85 Q 115 82, 125 85" : "M 110 85 Q 115 83, 125 85"}
            stroke="#D8A7CA"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Nose */}
          <path
            d="M 100 100 L 95 108 L 100 110"
            stroke="#E6B8B0"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          
          {/* Mouth */}
          {currentMood === "speaking" ? (
            <ellipse cx="100" cy="120" rx="8" ry="6" fill="#FF69B4" className="animate-speak" />
          ) : currentMood === "excited" ? (
            <path
              d="M 85 115 Q 100 130, 115 115"
              stroke="#FF69B4"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <path
              d="M 90 115 Q 100 122, 110 115"
              stroke="#FF69B4"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}
          
          {/* Earrings */}
          <circle cx="55" cy="105" r="3" fill="#EC4899" />
          <circle cx="145" cy="105" r="3" fill="#EC4899" />
          
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EC4899" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Speech bubble */}
        {message && (
          <div className="absolute -top-14 left-1/2 -translate-x-1/2 min-w-max animate-fade-in">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-2xl text-sm font-medium shadow-lg">
              {message}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-purple-600"></div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes subtle-wave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(2px); }
        }
        
        @keyframes speak {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.6); }
        }
        
        .animate-subtle-wave {
          animation: subtle-wave 3s ease-in-out infinite;
        }
        
        .animate-speak {
          animation: speak 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}