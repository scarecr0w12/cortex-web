interface LogoMarkProps {
  size?: number;
  className?: string;
}

/**
 * Geometric prism icon for CortexPrism branding.
 * A triangular prism with a two-tone indigo/purple split and a highlight facet,
 * giving a 3-D appearance without requiring SVG gradient IDs.
 */
export function LogoMark({ size = 24, className }: LogoMarkProps) {
  const h = Math.round(size * 1.08);
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 24 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Left half of the prism body — indigo */}
      <polygon points="12,1 1,25 12,25" fill="#6366f1" />
      {/* Right half of the prism body — violet */}
      <polygon points="12,1 12,25 23,25" fill="#8b5cf6" />
      {/* Upper highlight facet — adds a 3-D top face */}
      <polygon points="12,1 20,13 4,13" fill="rgba(255,255,255,0.18)" />
      {/* Subtle base line */}
      <line x1="1" y1="25" x2="23" y2="25" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" />
      {/* Center refraction seam */}
      <line x1="12" y1="1" x2="12" y2="25" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
    </svg>
  );
}
