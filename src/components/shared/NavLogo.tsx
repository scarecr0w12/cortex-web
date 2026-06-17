/**
 * CortexPrism full nav logo.
 * Recreates the brand image: a triangular crystal at centre with sinusoidal
 * wave-ribbons flowing left and right, overlaid with a triangulated mesh
 * network of fine lines and glowing node dots — all in the existing
 * indigo / violet palette.
 */
export function NavLogo({ className }: { className?: string }) {
  return (
    <svg
      width="160"
      height="36"
      viewBox="0 0 160 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CortexPrism"
    >
      <defs>
        {/* Crystal face gradients */}
        <linearGradient id="nl-left" x1="50" y1="4" x2="44" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="nl-right" x1="50" y1="4" x2="56" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        {/* Wave ribbon gradient — fades out at the edges */}
        <linearGradient id="nl-wave-l" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0" />
          <stop offset="60%"  stopColor="#8b5cf6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="nl-wave-r" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#8b5cf6" stopOpacity="0.28" />
          <stop offset="40%"  stopColor="#8b5cf6" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
        <clipPath id="nl-clip-l">
          <rect x="0" y="0" width="44" height="36" />
        </clipPath>
        <clipPath id="nl-clip-r">
          <rect x="56" y="0" width="44" height="36" />
        </clipPath>
      </defs>

      {/* ── LEFT WAVE RIBBON ── */}
      <g clipPath="url(#nl-clip-l)">
        {/* Upper wave ribbon */}
        <path
          d="M44,11 C36,8 28,5 20,9 C12,13 6,10 0,8"
          stroke="rgba(139,92,246,0.45)" strokeWidth="0.8" fill="none"
        />
        {/* Lower wave ribbon */}
        <path
          d="M44,25 C36,28 28,31 20,27 C12,23 6,26 0,28"
          stroke="rgba(99,102,241,0.45)" strokeWidth="0.8" fill="none"
        />
        {/* Mid-wave ribbon */}
        <path
          d="M44,18 C36,15 28,20 20,18 C12,16 6,18 0,18"
          stroke="rgba(167,139,250,0.25)" strokeWidth="0.5" fill="none"
        />
        {/* Mesh triangles over the left wave */}
        <line x1="44" y1="11" x2="32" y2="25" stroke="rgba(139,92,246,0.22)" strokeWidth="0.5" />
        <line x1="44" y1="25" x2="32" y2="11" stroke="rgba(99,102,241,0.22)"  strokeWidth="0.5" />
        <line x1="32" y1="11" x2="20" y2="25" stroke="rgba(139,92,246,0.2)"  strokeWidth="0.5" />
        <line x1="32" y1="25" x2="20" y2="11" stroke="rgba(99,102,241,0.2)"  strokeWidth="0.5" />
        <line x1="20" y1="11" x2="8"  y2="25" stroke="rgba(139,92,246,0.15)" strokeWidth="0.5" />
        <line x1="20" y1="25" x2="8"  y2="11" stroke="rgba(99,102,241,0.15)" strokeWidth="0.5" />
        <line x1="8"  y1="11" x2="0"  y2="18" stroke="rgba(139,92,246,0.1)"  strokeWidth="0.5" />
        <line x1="8"  y1="25" x2="0"  y2="18" stroke="rgba(99,102,241,0.1)"  strokeWidth="0.5" />
        {/* Horizontal connectors */}
        <line x1="0"  y1="8"  x2="44" y2="11" stroke="rgba(167,139,250,0.12)" strokeWidth="0.4" />
        <line x1="0"  y1="28" x2="44" y2="25" stroke="rgba(167,139,250,0.12)" strokeWidth="0.4" />
        {/* Node dots on wave */}
        <circle cx="44" cy="11" r="1.2" fill="#818cf8" fillOpacity="0.7" />
        <circle cx="44" cy="25" r="1.2" fill="#818cf8" fillOpacity="0.7" />
        <circle cx="32" cy="9"  r="0.8" fill="#a78bfa" fillOpacity="0.55" />
        <circle cx="32" cy="27" r="0.8" fill="#a78bfa" fillOpacity="0.55" />
        <circle cx="20" cy="9"  r="0.7" fill="#a78bfa" fillOpacity="0.45" />
        <circle cx="20" cy="27" r="0.7" fill="#a78bfa" fillOpacity="0.45" />
        <circle cx="8"  cy="10" r="0.6" fill="#818cf8" fillOpacity="0.3" />
        <circle cx="8"  cy="26" r="0.6" fill="#818cf8" fillOpacity="0.3" />
      </g>

      {/* ── RIGHT WAVE RIBBON ── */}
      <g clipPath="url(#nl-clip-r)">
        {/* Upper wave ribbon */}
        <path
          d="M56,11 C64,8 72,5 80,9 C88,13 94,10 100,8"
          stroke="rgba(139,92,246,0.45)" strokeWidth="0.8" fill="none"
        />
        {/* Lower wave ribbon */}
        <path
          d="M56,25 C64,28 72,31 80,27 C88,23 94,26 100,28"
          stroke="rgba(99,102,241,0.45)" strokeWidth="0.8" fill="none"
        />
        {/* Mid-wave ribbon */}
        <path
          d="M56,18 C64,15 72,20 80,18 C88,16 94,18 100,18"
          stroke="rgba(167,139,250,0.25)" strokeWidth="0.5" fill="none"
        />
        {/* Mesh triangles over the right wave */}
        <line x1="56" y1="11" x2="68" y2="25" stroke="rgba(139,92,246,0.22)" strokeWidth="0.5" />
        <line x1="56" y1="25" x2="68" y2="11" stroke="rgba(99,102,241,0.22)"  strokeWidth="0.5" />
        <line x1="68" y1="11" x2="80" y2="25" stroke="rgba(139,92,246,0.2)"  strokeWidth="0.5" />
        <line x1="68" y1="25" x2="80" y2="11" stroke="rgba(99,102,241,0.2)"  strokeWidth="0.5" />
        <line x1="80" y1="11" x2="92" y2="25" stroke="rgba(139,92,246,0.15)" strokeWidth="0.5" />
        <line x1="80" y1="25" x2="92" y2="11" stroke="rgba(99,102,241,0.15)" strokeWidth="0.5" />
        <line x1="92" y1="11" x2="100" y2="18" stroke="rgba(139,92,246,0.1)" strokeWidth="0.5" />
        <line x1="92" y1="25" x2="100" y2="18" stroke="rgba(99,102,241,0.1)" strokeWidth="0.5" />
        {/* Horizontal connectors */}
        <line x1="56" y1="11" x2="100" y2="8"  stroke="rgba(167,139,250,0.12)" strokeWidth="0.4" />
        <line x1="56" y1="25" x2="100" y2="28" stroke="rgba(167,139,250,0.12)" strokeWidth="0.4" />
        {/* Node dots on wave */}
        <circle cx="56" cy="11" r="1.2" fill="#a78bfa" fillOpacity="0.7" />
        <circle cx="56" cy="25" r="1.2" fill="#a78bfa" fillOpacity="0.7" />
        <circle cx="68" cy="9"  r="0.8" fill="#a78bfa" fillOpacity="0.55" />
        <circle cx="68" cy="27" r="0.8" fill="#a78bfa" fillOpacity="0.55" />
        <circle cx="80" cy="9"  r="0.7" fill="#818cf8" fillOpacity="0.45" />
        <circle cx="80" cy="27" r="0.7" fill="#818cf8" fillOpacity="0.45" />
        <circle cx="92" cy="10" r="0.6" fill="#818cf8" fillOpacity="0.3" />
        <circle cx="92" cy="26" r="0.6" fill="#818cf8" fillOpacity="0.3" />
      </g>

      {/* ── CENTRAL CRYSTAL PRISM ── */}
      {/* Left face — indigo */}
      <polygon points="50,2 40,34 50,34" fill="url(#nl-left)" />
      {/* Right face — violet */}
      <polygon points="50,2 50,34 60,34" fill="url(#nl-right)" />
      {/* Top highlight facet */}
      <polygon points="50,2 57,16 43,16" fill="rgba(255,255,255,0.18)" />
      {/* Face edges */}
      <line x1="40" y1="34" x2="60" y2="34" stroke="rgba(255,255,255,0.15)" strokeWidth="0.7" />
      <line x1="50" y1="2"  x2="50" y2="34" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
      {/* Apex glow dot */}
      <circle cx="50" cy="2" r="1.5" fill="#c4b5fd" />
      {/* Base corner dots */}
      <circle cx="40" cy="34" r="1.1" fill="#818cf8" fillOpacity="0.9" />
      <circle cx="60" cy="34" r="1.1" fill="#a78bfa" fillOpacity="0.9" />

      {/* ── WORDMARK ── */}
      <text
        x="108"
        y="23"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="15"
        fontWeight="800"
        fill="#e2e2ea"
        letterSpacing="0.3"
      >
        CortexPrism
      </text>
    </svg>
  );
}
