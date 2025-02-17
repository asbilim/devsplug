export function DevsplugLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-foreground">
      {/* Outer hexagon */}
      <path
        d="M20 2L35 11V29L20 38L5 29V11L20 2Z"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Code brackets */}
      <path
        d="M15 14L10 20L15 26"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M25 14L30 20L25 26"
        className="stroke-primary"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Connection dots */}
      <circle cx="20" cy="12" r="2" className="fill-primary" />
      <circle cx="20" cy="28" r="2" className="fill-primary" />
      <circle cx="12" cy="20" r="2" className="fill-primary" />
      <circle cx="28" cy="20" r="2" className="fill-primary" />
    </svg>
  );
}
