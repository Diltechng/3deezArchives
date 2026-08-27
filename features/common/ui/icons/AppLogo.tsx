import { forwardRef } from "react";

type AppLogoProps = React.ComponentPropsWithoutRef<"svg">;

const AppLogo = forwardRef<SVGSVGElement, AppLogoProps>(
  ({
    xmlns="http://www.w3.org/2000/svg",
    viewBox="0 0 420 120",
    width="100%",
    height="100%",
    ...props
  }, ref) => (
    <svg
      ref={ref}
      xmlns={xmlns}
      viewBox={viewBox}
      width={width}
      height={height}
      {...props}
    >
      <defs>
        <linearGradient id="lumina-lime" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8ff6b" />
          <stop offset="100%" stopColor="#c5ff33" />
        </linearGradient>
        <linearGradient id="lumina-violet" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#774ffd" />
          <stop offset="100%" stopColor="#5a32e0" />
        </linearGradient>
      </defs>

      <rect width="420" height="120" rx="16" fill="#0D1117" />

      <g transform="translate(30, 20)">
        <path
          d="M 29 10 L 61 10 Q 65 10 63.8 14.2 L 46.2 75.8 Q 45 80 41 80 L 9 80 Q 5 80 6.2 75.8 L 23.8 14.2 Q 25 10 29 10 Z"
          fill="url(#lumina-violet)"
          stroke="url(#lumina-violet)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <path
          d="M 15 30 Q 15 25 20 25 L 51 25 Q 55 25 53.8 29.2 L 37.8 57.2 Q 36 60 40 60 L 71 60 Q 75 60 73.8 64.2 L 66.8 78.2 Q 65 80 61 80 L 20 80 Q 15 80 15 75 Z"
          fill="url(#lumina-lime)"
          stroke="url(#lumina-lime)"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <circle cx="68" cy="23" r="5" fill="#e8ff6b" />
      </g>

      <text
        x="135"
        y="72"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="42"
        fontWeight="800"
        letterSpacing="6"
        fill="#FFFFFF"
      >
        LUMINA
      </text>

      <text
        x="350"
        y="72"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontSize="16"
        fontWeight="600"
        letterSpacing="3"
        fill="#e8ff6b"
      >
        HQ
      </text>
    </svg>
  )
);

export { AppLogo };