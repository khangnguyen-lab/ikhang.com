"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { ACCENT_RGB } from "@/lib/theme";

const TERMINAL_LINES = [
  "> VELOCITY THRESHOLD EXCEEDED",
  "> INITIATING DOCKING SEQUENCE",
  "> OPENING ABOUT MODULE",
] as const;

const STREAK_LAYOUT = [
  { top: 8, width: 120 },
  { top: 18, width: 200 },
  { top: 28, width: 160 },
  { top: 42, width: 240 },
  { top: 55, width: 140 },
  { top: 68, width: 180 },
  { top: 78, width: 220 },
  { top: 88, width: 100 },
] as const;

function WarpTunnel({ progress }: { progress: MotionValue<number> }) {
  const scale = useTransform(progress, [0.04, 0.28], [0.55, 10]);
  const rotate = useTransform(progress, [0, 0.85], [0, 38]);
  const opacity = useTransform(progress, [0, 0.06, 0.68, 0.82], [0.12, 0.35, 1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center will-change-transform"
      style={{ opacity }}
      aria-hidden
    >
      <motion.div
        className="relative"
        style={{ scale, rotate, width: "120vmax", height: "120vmax" }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 h-[55vmax] w-px origin-bottom"
            style={{
              transform: `rotate(${(360 / 24) * i}deg) translateY(-50%)`,
              background: `linear-gradient(to top, rgba(${ACCENT_RGB}, 0.85) 0%, rgba(${ACCENT_RGB}, 0.15) 45%, transparent 100%)`,
            }}
          />
        ))}
        {Array.from({ length: 4 }).map((_, ring) => (
          <div
            key={`ring-${ring}`}
            className="absolute left-1/2 top-1/2 rounded-full border border-accent/20"
            style={{
              width: `${(ring + 1) * 18}%`,
              height: `${(ring + 1) * 18}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function VelocityStreaks({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.06, 0.14, 0.42, 0.52], [0, 1, 1, 0]);
  const scaleX = useTransform(progress, [0.08, 0.3], [0, 1.6]);

  return (
    <motion.div className="pointer-events-none absolute inset-0" style={{ opacity }} aria-hidden>
      {STREAK_LAYOUT.map((streak, i) => (
        <motion.div
          key={streak.top}
          className="absolute left-1/2 h-px origin-center -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/70 to-transparent"
          style={{
            top: `${streak.top}%`,
            width: streak.width,
            scaleX,
            opacity: 0.35 + (i % 3) * 0.2,
          }}
        />
      ))}
    </motion.div>
  );
}

function TerminalHandoff({ progress }: { progress: MotionValue<number> }) {
  const containerOpacity = useTransform(progress, [0.18, 0.28, 0.72, 0.82], [0, 1, 1, 0]);
  const driftY = useTransform(progress, [0.28, 0.72], [12, -8]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-[14vh] z-20 flex flex-col items-center px-6 sm:top-[16vh]"
      style={{ opacity: containerOpacity, y: driftY }}
    >
      <div className="w-full max-w-xl space-y-3 font-mono text-xs tracking-[0.14em] sm:text-sm md:text-base">
        {TERMINAL_LINES.map((line, index) => (
          <TerminalLine key={line} line={line} progress={progress} index={index} />
        ))}
      </div>
      <TerminalTagline progress={progress} />
    </motion.div>
  );
}

function TerminalTagline({ progress }: { progress: MotionValue<number> }) {
  const dockOpacity = useTransform(progress, [0.48, 0.56, 0.68, 0.78], [0, 1, 1, 0]);

  return (
    <motion.p
      className="mt-6 font-mono text-[10px] uppercase tracking-[0.28em] text-accent/80 sm:mt-8 sm:text-xs"
      style={{ opacity: dockOpacity }}
    >
      docking in progress
    </motion.p>
  );
}

function TerminalLine({
  line,
  progress,
  index,
}: {
  line: string;
  progress: MotionValue<number>;
  index: number;
}) {
  const start = 0.2 + index * 0.06;
  const opacity = useTransform(progress, [start, start + 0.05], [0, 1]);
  const y = useTransform(progress, [start, start + 0.05], [10, 0]);

  return (
    <motion.p className="text-primary" style={{ opacity, y }}>
      {line}
    </motion.p>
  );
}

function ReentryFlash({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.52, 0.58, 0.66], [0, 0.55, 0]);
  const scale = useTransform(progress, [0.52, 0.66], [0.6, 2.2]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      style={{ opacity }}
      aria-hidden
    >
      <motion.div
        className="rounded-full"
        style={{
          scale,
          width: "40vmin",
          height: "40vmin",
          background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.95) 0%, rgba(${ACCENT_RGB}, 0.35) 35%, transparent 70%)`,
          boxShadow: `0 0 120px rgba(${ACCENT_RGB}, 0.8), 0 0 240px rgba(${ACCENT_RGB}, 0.4)`,
        }}
      />
    </motion.div>
  );
}

function EntryBridge({ progress }: { progress: MotionValue<number> }) {
  const topFadeOpacity = useTransform(progress, [0, 0.1, 0.22], [1, 0.75, 0]);
  const glowOpacity = useTransform(progress, [0, 0.08, 0.2, 0.32], [0.75, 0.9, 0.45, 0]);

  return (
    <>
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-[4] h-[55vh]"
        style={{
          opacity: topFadeOpacity,
          background:
            "linear-gradient(to bottom, #020204 0%, rgba(2,2,4,0.92) 18%, rgba(2,2,4,0.55) 45%, transparent 100%)",
        }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[42%] z-[3] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: glowOpacity }}
        aria-hidden
      >
        <div
          className="rounded-full"
          style={{
            width: "min(75vmin, 620px)",
            height: "min(75vmin, 620px)",
            background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.16) 0%, rgba(${ACCENT_RGB}, 0.05) 42%, transparent 68%)`,
          }}
        />
      </motion.div>
    </>
  );
}

function AboutTitle({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.58, 0.68, 0.88, 0.96], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.58, 0.68], [1.35, 1]);
  const blur = useTransform(progress, [0.58, 0.68], [14, 0]);
  const tracking = useTransform(progress, [0.58, 0.68], [0.28, 0.06]);
  const letterSpacing = useTransform(tracking, (v) => `${v}em`);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[32] flex items-center justify-center px-6"
      style={{ opacity }}
      aria-hidden
    >
      <motion.h2
        className="spacex-hero-title text-center text-[14vw] text-primary sm:text-[11vw] md:text-[9vw]"
        style={{ scale, letterSpacing, filter }}
      >
        About
      </motion.h2>
    </motion.div>
  );
}

function ReducedMotionBridge() {
  return <div className="relative h-24" aria-hidden />;
}

export function HeroAboutTransition() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.08, 0.15, 0.65, 0.9], [0.35, 0.5, 0.55, 0.55, 0]);

  if (reduceMotion) {
    return <ReducedMotionBridge />;
  }

  return (
    <div ref={containerRef} className="relative z-[12] -mt-[30vh] h-[300vh]" aria-hidden>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <EntryBridge progress={scrollYProgress} />
        <WarpTunnel progress={scrollYProgress} />
        <VelocityStreaks progress={scrollYProgress} />

        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,2,4,0.55)_80%)]"
          style={{ opacity: vignetteOpacity }}
          aria-hidden
        />

        <TerminalHandoff progress={scrollYProgress} />
        <ReentryFlash progress={scrollYProgress} />
        <AboutTitle progress={scrollYProgress} />
      </div>
    </div>
  );
}
