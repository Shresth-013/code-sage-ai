// frontend/src/components/Logo.jsx
// Signature mark: a monoline ">_" terminal-prompt glyph — reads as a
// dev tool at a glance, holds up at 24px in a browser tab as well as
// it does at 40px in the sidebar. Flat, single-color, no gradient.
export default function Logo({ size = 36, rounded = 10 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Code Sage AI"
    >
      <rect width="36" height="36" rx={rounded} fill="var(--accent)" />
      <path
        d="M11.5 12.5L17.5 18L11.5 23.5"
        stroke="white"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="20.5" y="21.7" width="8" height="2.6" rx="1.3" fill="white" />
    </svg>
  );
}
