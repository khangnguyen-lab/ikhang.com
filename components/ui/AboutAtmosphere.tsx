"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ACCENT_RGB } from "@/lib/theme";

interface AboutAtmosphereProps {
  scrollProgress: MotionValue<number>;
}

export function AboutAtmosphere({ scrollProgress }: AboutAtmosphereProps) {
  const arcOpacity = useTransform(scrollProgress, [0, 0.35, 0.75, 1], [0, 0.55, 0.45, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {[14, 38, 62, 86].map((top) => (
        <div
          key={top}
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-border/35 to-transparent"
          style={{ top: `${top}%` }}
        />
      ))}

      <motion.svg
        className="absolute -left-[10%] top-[8%] h-[85%] w-[120%]"
        viewBox="0 0 1200 400"
        fill="none"
        preserveAspectRatio="none"
        style={{ opacity: arcOpacity }}
      >
        <ellipse
          cx="600"
          cy="420"
          rx="580"
          ry="180"
          stroke={`rgba(${ACCENT_RGB}, 0.12)`}
          strokeWidth="1"
        />
        <ellipse
          cx="600"
          cy="420"
          rx="480"
          ry="130"
          stroke={`rgba(${ACCENT_RGB}, 0.08)`}
          strokeWidth="0.75"
        />
        <motion.path
          d="M 0 200 Q 300 80, 600 120 T 1200 200"
          stroke={`rgba(${ACCENT_RGB}, 0.15)`}
          strokeWidth="0.75"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, ease: "easeOut", delay: 0.3 }}
        />
      </motion.svg>
    </div>
  );
}
