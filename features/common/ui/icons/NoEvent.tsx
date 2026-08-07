interface NoEventProps {
  className?: string;
}

export const NoEvent = ({ className }: NoEventProps) => (
  <svg className={className} viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="calendar" x1="210" y1="40" x2="210" y2="180">
        <stop stopColor="#43484F" />
        <stop offset="1" stopColor="#24282D" />
      </linearGradient>

      <linearGradient id="plus" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#9D7DFF" />
        <stop offset="1" stopColor="#6707FF" />
      </linearGradient>

      <filter id="shadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#000000" floodOpacity=".35" />
      </filter>

      <filter id="glow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Background Clouds */}

    <ellipse cx="120" cy="200" rx="36" ry="22" fill="#262A2F" />
    <ellipse cx="100" cy="205" rx="22" ry="16" fill="#262A2F" />
    <ellipse cx="148" cy="208" rx="28" ry="18" fill="#262A2F" />

    <ellipse cx="305" cy="205" rx="36" ry="22" fill="#262A2F" />
    <ellipse cx="285" cy="210" rx="22" ry="16" fill="#262A2F" />
    <ellipse cx="333" cy="212" rx="28" ry="18" fill="#262A2F" />

    {/* Stars */}

    <g opacity=".5">
      <path d="M74 90l3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8z" fill="#9BA3A8" />
      <path d="M340 72l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" fill="#EDEFF0" />
      <circle cx="318" cy="110" r="2" fill="#826BFF" />
      <circle cx="103" cy="58" r="2" fill="#E8FF6B" />
    </g>

    {/* Calendar */}

    <g filter="url(#shadow)">

      <g transform="translate(150 40) rotate(4 50 60)">
        <rect width="110" height="120" rx="10" fill="url(#calendar)" stroke="#6C7278" />

        <rect y="22" width="110" height="2" fill="#5B6760" />

        {/* Rings */}

        <rect x="20" y="-6" width="8" height="22" rx="4" fill="#7B8285" />
        <rect x="82" y="-6" width="8" height="22" rx="4" fill="#7B8285" />

        {/* Calendar grid */}

        <g fill="#4B5055">
          <rect x="18" y="38" width="14" height="14" rx="2" />
          <rect x="38" y="38" width="14" height="14" rx="2" />
          <rect x="58" y="38" width="14" height="14" rx="2" />
          <rect x="78" y="38" width="14" height="14" rx="2" />

          <rect x="18" y="58" width="14" height="14" rx="2" />
          <rect x="38" y="58" width="14" height="14" rx="2" />
          <rect x="58" y="58" width="14" height="14" rx="2" />
          <rect x="78" y="58" width="14" height="14" rx="2" />

          <rect x="18" y="78" width="14" height="14" rx="2" />
          <rect x="38" y="78" width="14" height="14" rx="2" />
          <rect x="58" y="78" width="14" height="14" rx="2" />
          <rect x="78" y="78" width="14" height="14" rx="2" />
        </g>

        {/* Highlighted date */}

        <rect
          x="58"
          y="58"
          width="14"
          height="14"
          rx="2"
          fill="#E8FF6B"
          filter="url(#glow)"
        />

      </g>

    </g>

    {/* Plus Button */}

    <g transform="translate(275 160)">
      <circle r="26" fill="url(#plus)" filter="url(#shadow)" />
      <path d="M0-10V10M-10 0H10"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round" />
    </g>

    {/* Ground */}

    <line x1="120" y1="232" x2="300" y2="232"
      stroke="#43484F"
      strokeWidth="2"
      strokeLinecap="round" />
  </svg>
);