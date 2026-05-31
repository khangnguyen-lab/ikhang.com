"use client";

import { motion } from "framer-motion";
import { ACCENT_RGB } from "@/lib/theme";

/** Stylized satellite — placeholder until a Spline scene URL is added */
export function RocketScene() {
  return (
    <div
      className="relative flex h-[min(440px,52vh)] w-full items-center justify-center"
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-full opacity-40 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 45%, rgba(${ACCENT_RGB}, 0.2) 0%, transparent 65%)`,
        }}
      />

      {/* Ambient particles */}
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary/30"
          style={{
            width: 1 + (i % 3),
            height: 1 + (i % 3),
            left: `${8 + ((i * 17) % 84)}%`,
            top: `${6 + ((i * 23) % 88)}%`,
            opacity: 0.15 + (i % 5) * 0.08,
          }}
        />
      ))}

      <motion.div
        className="relative z-10"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={{ rotateY: [0, 360] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d", perspective: 800 }}
        >
          <svg
            viewBox="0 0 200 120"
            className="h-auto w-[min(320px,85%)] drop-shadow-[0_0_40px_rgba(99,91,255,0.25)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6b7280" />
                <stop offset="50%" stopColor="#d1d5db" />
                <stop offset="100%" stopColor="#9ca3af" />
              </linearGradient>
              <linearGradient id="panelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={`rgba(${ACCENT_RGB}, 0.5)`} />
                <stop offset="100%" stopColor={`rgba(${ACCENT_RGB}, 0.1)`} />
              </linearGradient>
            </defs>
            {/* Solar panels */}
            <rect x="8" y="52" width="44" height="16" rx="1" fill="url(#panelGrad)" stroke="#8892A4" strokeWidth="0.75" />
            <rect x="148" y="52" width="44" height="16" rx="1" fill="url(#panelGrad)" stroke="#8892A4" strokeWidth="0.75" />
            <line x1="52" y1="60" x2="68" y2="60" stroke="#8892A4" strokeWidth="0.75" />
            <line x1="132" y1="60" x2="148" y2="60" stroke="#8892A4" strokeWidth="0.75" />
            {/* Main body */}
            <ellipse cx="100" cy="60" rx="28" ry="18" fill="url(#bodyGrad)" stroke="#F0F2F7" strokeWidth="0.75" opacity="0.9" />
            <ellipse cx="100" cy="60" rx="14" ry="9" fill={`rgba(${ACCENT_RGB}, 0.25)`} stroke={`rgba(${ACCENT_RGB}, 0.6)`} strokeWidth="0.5" />
            {/* Antenna */}
            <line x1="100" y1="42" x2="100" y2="22" stroke="#F0F2F7" strokeWidth="0.75" opacity="0.7" />
            <circle cx="100" cy="20" r="2" fill={`rgba(${ACCENT_RGB}, 0.8)`} />
            {/* Thruster glow */}
            <ellipse cx="100" cy="82" rx="6" ry="3" fill={`rgba(${ACCENT_RGB}, 0.35)`} />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
