import React from 'react';

interface CuteGirlWaitAnimationProps {
  progress: number;
}

export const CuteGirlWaitAnimation: React.FC<CuteGirlWaitAnimationProps> = ({ progress }) => {
  // Only shown after 98% (i.e. 98% and 99%), and automatically removed at 100%
  if (progress < 98 || progress >= 100) {
    return null;
  }

  return (
    <div
      id="cute-girl-pop-container"
      className="mt-4 pt-3 border-t-2 border-dashed border-orange-200 animate-cute-pop"
    >
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-2 border-orange-300 rounded-2xl p-4 sm:p-5 shadow-lg shadow-orange-500/10 relative overflow-hidden flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Floating background decorative sparkles */}
        <div className="absolute top-2 right-4 text-orange-400 opacity-60 animate-twinkle pointer-events-none">
          ✦
        </div>
        <div className="absolute bottom-2 left-6 text-amber-500 opacity-70 animate-twinkle pointer-events-none text-xs" style={{ animationDelay: '0.6s' }}>
          ✨
        </div>
        <div className="absolute top-1/2 right-12 text-rose-400 opacity-40 animate-twinkle pointer-events-none text-[10px]" style={{ animationDelay: '1.1s' }}>
          ♥
        </div>

        {/* The Cute Girl Animated Character Avatar */}
        <div className="relative shrink-0 animate-cute-float">
          {/* Subtle glow aura behind character */}
          <div className="absolute -inset-2 bg-gradient-to-tr from-orange-400/20 via-amber-300/30 to-rose-300/20 rounded-full blur-md" />

          <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            <svg
              viewBox="0 0 160 160"
              className="w-full h-full drop-shadow-md overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Back Hair */}
              <path
                d="M45 55 C35 70, 30 110, 48 135 C52 140, 58 130, 58 120 C58 95, 52 75, 56 60 Z"
                fill="#8C3A16"
              />
              <path
                d="M115 55 C125 70, 130 110, 112 135 C108 140, 102 130, 102 120 C102 95, 108 75, 104 60 Z"
                fill="#8C3A16"
              />

              {/* Left Hair Bun with Orange Bow */}
              <circle cx="36" cy="46" r="16" fill="#A8481E" />
              <circle cx="36" cy="46" r="13" fill="#BF5524" />
              <path
                d="M32 46 Q24 40, 26 48 Q28 54, 34 50"
                fill="#FF6B00"
              />
              <path
                d="M40 46 Q48 40, 46 48 Q44 54, 38 50"
                fill="#FF6B00"
              />
              <circle cx="36" cy="48" r="3.5" fill="#FFE58F" />

              {/* Right Hair Bun with Orange Bow */}
              <circle cx="124" cy="46" r="16" fill="#A8481E" />
              <circle cx="124" cy="46" r="13" fill="#BF5524" />
              <path
                d="M120 46 Q112 40, 114 48 Q116 54, 122 50"
                fill="#FF6B00"
              />
              <path
                d="M128 46 Q136 40, 134 48 Q132 54, 126 50"
                fill="#FF6B00"
              />
              <circle cx="124" cy="48" r="3.5" fill="#FFE58F" />

              {/* Neck */}
              <rect x="74" y="102" width="12" height="15" rx="5" fill="#FFDFC4" />

              {/* Shoulders / Shirt */}
              <path
                d="M46 142 C46 118, 62 110, 80 110 C98 110, 114 118, 114 142 Z"
                fill="#EA580C"
              />
              {/* White Shirt Collar */}
              <path d="M72 110 L80 125 L88 110 Z" fill="#FFFFFF" />
              <path d="M64 110 L76 122 L80 110 Z" fill="#FFF7ED" />
              <path d="M96 110 L84 122 L80 110 Z" fill="#FFF7ED" />
              <circle cx="80" cy="130" r="2.5" fill="#FFFFFF" />

              {/* Ears */}
              <circle cx="48" cy="78" r="7" fill="#FFCEB4" />
              <circle cx="112" cy="78" r="7" fill="#FFCEB4" />

              {/* Head / Face */}
              <path
                d="M48 68 C48 42, 112 42, 112 68 C112 96, 98 110, 80 110 C62 110, 48 96, 48 68 Z"
                fill="#FFDFC4"
              />

              {/* Rosy Blush */}
              <ellipse cx="60" cy="85" rx="8" ry="4" fill="#FFAAA6" opacity="0.65" />
              <ellipse cx="100" cy="85" rx="8" ry="4" fill="#FFAAA6" opacity="0.65" />

              {/* Anime Eyes with Blinking Animation */}
              <g className="animate-cute-blink">
                {/* Left Eye */}
                <ellipse cx="64" cy="74" rx="7" ry="9" fill="#2E1C14" />
                <ellipse cx="64" cy="73" rx="5.5" ry="7" fill="#6B331A" />
                {/* Highlights */}
                <circle cx="62" cy="70" r="3" fill="#FFFFFF" />
                <circle cx="66" cy="77" r="1.5" fill="#FFFFFF" />
                {/* Lashes */}
                <path d="M56 68 Q64 64, 72 67" stroke="#1F130E" strokeWidth="2.5" strokeLinecap="round" />

                {/* Right Eye */}
                <ellipse cx="96" cy="74" rx="7" ry="9" fill="#2E1C14" />
                <ellipse cx="96" cy="73" rx="5.5" ry="7" fill="#6B331A" />
                {/* Highlights */}
                <circle cx="94" cy="70" r="3" fill="#FFFFFF" />
                <circle cx="98" cy="77" r="1.5" fill="#FFFFFF" />
                {/* Lashes */}
                <path d="M88 67 Q96 64, 104 68" stroke="#1F130E" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Eyebrows */}
              <path d="M58 63 Q64 60, 69 63" stroke="#8C3A16" strokeWidth="2" strokeLinecap="round" />
              <path d="M91 63 Q96 60, 102 63" stroke="#8C3A16" strokeWidth="2" strokeLinecap="round" />

              {/* Cute Nose */}
              <ellipse cx="80" cy="80" rx="1" ry="1.5" fill="#F09B7D" />

              {/* Cute Happy Open Smile */}
              <path
                d="M74 88 Q80 97, 86 88 Z"
                fill="#D9383A"
              />
              <path
                d="M76 90 Q80 94, 84 90"
                fill="#FF8587"
              />

              {/* Front Hair / Bangs */}
              <path
                d="M46 64 C48 38, 112 38, 114 64 C104 54, 94 56, 88 64 C84 55, 74 54, 70 66 C66 56, 54 56, 46 64 Z"
                fill="#BF5524"
              />
              {/* Hair strands and highlights */}
              <path
                d="M58 48 Q80 44, 102 48"
                stroke="#FFBE98"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.7"
              />

              {/* Left Side Tendril */}
              <path
                d="M48 68 C45 80, 48 94, 52 98 C50 94, 48 85, 50 72 Z"
                fill="#A8481E"
              />
              {/* Right Side Tendril */}
              <path
                d="M112 68 C115 80, 112 94, 108 98 C110 94, 112 85, 110 72 Z"
                fill="#A8481E"
              />

              {/* Waving Right Hand */}
              <g className="animate-cute-wave">
                <path
                  d="M118 126 C124 120, 136 102, 138 92 C139 88, 134 86, 131 90 C128 94, 122 108, 118 116 Z"
                  fill="#FFDFC4"
                />
                {/* Sleeve cuff */}
                <ellipse cx="120" cy="120" rx="6" ry="4" fill="#FFFFFF" />
                {/* Little palm and fingers */}
                <circle cx="136" cy="91" r="5" fill="#FFDFC4" />
                <circle cx="139" cy="87" r="2.5" fill="#FFDFC4" />
                <circle cx="136" cy="85" r="2.3" fill="#FFDFC4" />
                <circle cx="132" cy="87" r="2.3" fill="#FFDFC4" />
              </g>

              {/* Heart floating near hand */}
              <g className="animate-pulse">
                <path
                  d="M142 75 C142 72, 138 70, 136 73 C134 70, 130 72, 130 75 C130 79, 136 83, 136 83 C136 83, 142 79, 142 75 Z"
                  fill="#F43F5E"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Speech Bubble / Message Content */}
        <div className="flex-1 text-center sm:text-left relative z-10 py-1">
          {/* Primary User-Requested Announcement */}
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2">
            <span>please hold on</span>
            <span className="text-orange-600 animate-bounce">✨</span>
          </h4>

          {/* User Requested Waiting Time Description */}
          <p className="text-sm sm:text-base font-bold text-orange-950 mt-1 leading-snug">
            it will take upto 1 minute because of large data
          </p>
        </div>
      </div>
    </div>
  );
};
