export function CircuitBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M10 10h30v30h-30z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle cx="25" cy="25" r="3" fill="currentColor" />
            <path
              d="M25 10v12 M10 25h12 M25 28v12 M28 25h12"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>
    </div>
  );
}
