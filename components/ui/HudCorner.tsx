export function HudCorner({ className }: { className: string }) {
  return (
    <svg
      className={`pointer-events-none absolute z-10 h-8 w-8 text-accent/70 ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
    >
      <path d="M2 12V2H12" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}
