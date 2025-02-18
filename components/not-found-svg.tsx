export function NotFoundSVG({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 400"
      xmlns="http://www.w3.org/2000/svg">
      <style>
        {`
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-float-reverse {
            animation: float 6s ease-in-out infinite reverse;
          }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          .gradient-text {
            fill: url(#gradient);
          }
        `}
      </style>
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            className="text-primary"
            style={{ stopColor: "currentColor" }}
          />
          <stop
            offset="100%"
            className="text-primary/60"
            style={{ stopColor: "currentColor" }}
          />
        </linearGradient>
      </defs>
      <g className="animate-float">
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="gradient-text font-mono"
          style={{ fontSize: "180px", fontWeight: "bold" }}>
          404
        </text>
      </g>
      <g className="animate-float-reverse">
        <path
          d="M200,200 Q400,150 600,200"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary/20"
        />
        <circle
          cx="200"
          cy="200"
          r="5"
          className="text-primary"
          fill="currentColor"
        />
        <circle
          cx="600"
          cy="200"
          r="5"
          className="text-primary"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
