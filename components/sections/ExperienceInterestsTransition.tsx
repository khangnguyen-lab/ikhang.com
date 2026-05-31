"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { INTEREST_TILES } from "@/lib/interests";
import { ACCENT_RGB } from "@/lib/theme";

const ORBIT_LABELS = INTEREST_TILES.slice(0, 8).map((tile) => tile.title.toUpperCase());

const MOSAIC_SLOTS = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: ((i * 37) % 11) - 5,
  y: ((i * 53) % 9) - 4,
  rot: ((i * 29) % 24) - 12,
  w: 52 + (i % 4) * 18,
  h: 38 + (i % 3) * 14,
  delay: (i % 5) * 0.008,
}));

const WARM_RGB = "255, 110, 180";

function WarmChromaticBurst({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.025, 0.09], [0, 1, 0]);
  const scale = useTransform(progress, [0, 0.09], [0.55, 2.6]);
  const redX = useTransform(progress, [0, 0.06], [-22, 0]);
  const blueX = useTransform(progress, [0, 0.06], [22, 0]);
  const warmY = useTransform(progress, [0, 0.06], [10, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
      style={{ opacity }}
      aria-hidden
    >
      <motion.div
        className="absolute text-[17vw] font-bold uppercase tracking-[0.18em] text-red-500/35 mix-blend-screen"
        style={{ x: redX, scale }}
      >
        LIFE
      </motion.div>
      <motion.div
        className="absolute text-[17vw] font-bold uppercase tracking-[0.18em] text-accent/55 mix-blend-screen"
        style={{ scale }}
      >
        LIFE
      </motion.div>
      <motion.div
        className="absolute text-[17vw] font-bold uppercase tracking-[0.18em] mix-blend-screen"
        style={{ x: blueX, y: warmY, scale, color: `rgba(${WARM_RGB}, 0.35)` }}
      >
        LIFE
      </motion.div>
    </motion.div>
  );
}

function SpectrumScan({ progress }: { progress: MotionValue<number> }) {
  const top = useTransform(progress, [0, 0.11], ["-15%", "115%"]);
  const opacity = useTransform(progress, [0, 0.03, 0.08, 0.12], [0, 1, 0.85, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 z-[38] h-28"
      style={{ top, opacity }}
      aria-hidden
    >
      <div
        className="h-full w-full opacity-80"
        style={{
          background: `linear-gradient(90deg,
            transparent 0%,
            rgba(${ACCENT_RGB}, 0.5) 12%,
            rgba(${WARM_RGB}, 0.45) 28%,
            rgba(120, 220, 255, 0.4) 44%,
            rgba(${ACCENT_RGB}, 0.55) 58%,
            rgba(255, 200, 120, 0.35) 72%,
            rgba(${ACCENT_RGB}, 0.4) 86%,
            transparent 100%)`,
          boxShadow: `0 0 80px rgba(${ACCENT_RGB}, 0.35), 0 0 40px rgba(${WARM_RGB}, 0.25)`,
        }}
      />
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-primary/30" />
    </motion.div>
  );
}

function PulseRings({ progress }: { progress: MotionValue<number> }) {
  const containerOpacity = useTransform(progress, [0, 0.02, 0.16, 0.24], [0, 1, 1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      style={{ opacity: containerOpacity }}
      aria-hidden
    >
      {[0, 1, 2, 3].map((ring) => (
        <PulseRing key={ring} progress={progress} index={ring} />
      ))}
    </motion.div>
  );
}

function PulseRing({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const delay = index * 0.028;
  const scale = useTransform(progress, [0 + delay, 0.13 + delay], [0.15, 3.4]);
  const opacity = useTransform(progress, [0 + delay, 0.06 + delay, 0.14 + delay], [0, 0.65, 0]);
  const hue = index % 2 === 0 ? ACCENT_RGB : WARM_RGB;

  return (
    <motion.div
      className="absolute rounded-full border"
      style={{
        width: "26vmin",
        height: "26vmin",
        scale,
        opacity,
        borderColor: `rgba(${hue}, 0.45)`,
        boxShadow: `0 0 36px rgba(${hue}, 0.3)`,
      }}
    />
  );
}

function MosaicDetonation({ progress }: { progress: MotionValue<number> }) {
  const containerOpacity = useTransform(progress, [0.02, 0.1, 0.55, 0.68], [0, 1, 1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      style={{ opacity: containerOpacity }}
      aria-hidden
    >
      {MOSAIC_SLOTS.map((slot) => (
        <MosaicShard key={slot.id} progress={progress} slot={slot} />
      ))}
    </motion.div>
  );
}

function MosaicShard({
  progress,
  slot,
}: {
  progress: MotionValue<number>;
  slot: (typeof MOSAIC_SLOTS)[number];
}) {
  const start = 0.03 + slot.delay;
  const burst = useTransform(progress, [start, start + 0.14], [0, 1]);
  const x = useTransform(burst, [0, 1], [0, slot.x * 28]);
  const y = useTransform(burst, [0, 1], [0, slot.y * 32]);
  const rotate = useTransform(burst, [0, 1], [0, slot.rot]);
  const scale = useTransform(burst, [0, 0.35, 1], [0.2, 1.15, 0.85]);
  const opacity = useTransform(burst, [0, 0.2, 0.75, 1], [0, 0.95, 0.7, 0.35]);
  const tint = slot.id % 3 === 0 ? WARM_RGB : slot.id % 3 === 1 ? ACCENT_RGB : "180, 210, 255";

  return (
    <motion.div
      className="absolute rounded-sm border border-primary/20"
      style={{
        width: slot.w,
        height: slot.h,
        x,
        y,
        rotate,
        scale,
        opacity,
        background: `linear-gradient(135deg, rgba(${tint}, 0.22) 0%, rgba(2,2,4,0.85) 100%)`,
        boxShadow: `0 0 20px rgba(${tint}, 0.15)`,
      }}
    />
  );
}

function HeartbeatWave({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.04, 0.12, 0.42, 0.52], [0, 1, 1, 0]);
  const pathLength = useTransform(progress, [0.04, 0.2], [0, 1]);
  const glow = useTransform(progress, [0.14, 0.22, 0.3], [0, 1, 0.4]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-1/2 z-[25] -translate-y-1/2 px-8"
      style={{ opacity }}
      aria-hidden
    >
      <svg className="h-24 w-full sm:h-32" viewBox="0 0 400 80" preserveAspectRatio="none" fill="none">
        <motion.path
          d="M0 40 L40 40 L55 18 L70 62 L85 28 L100 52 L115 40 L400 40"
          stroke={`rgba(${WARM_RGB}, 0.25)`}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pathLength }}
        />
        <motion.path
          d="M0 40 L40 40 L55 18 L70 62 L85 28 L100 52 L115 40 L400 40"
          stroke={`rgba(${ACCENT_RGB}, 0.85)`}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            pathLength,
            filter: `drop-shadow(0 0 8px rgba(${ACCENT_RGB}, 0.9))`,
            opacity: glow,
          }}
        />
      </svg>
    </motion.div>
  );
}

function InterestOrbit({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.16, 0.24, 0.7, 0.84], [0, 1, 1, 0]);
  const rotate = useTransform(progress, [0.16, 0.85], [0, 42]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[22] flex items-center justify-center"
      style={{ opacity }}
      aria-hidden
    >
      <motion.div
        className="relative"
        style={{ rotate, width: "min(85vmin, 720px)", height: "min(85vmin, 720px)" }}
      >
        {ORBIT_LABELS.map((label, index) => (
          <OrbitLabel key={label} label={label} index={index} progress={progress} />
        ))}
      </motion.div>
    </motion.div>
  );
}

function OrbitLabel({
  label,
  index,
  progress,
}: {
  label: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const angle = (360 / ORBIT_LABELS.length) * index - 90;
  const rad = (angle * Math.PI) / 180;
  const radius = 42;
  const left = 50 + Math.cos(rad) * radius;
  const top = 50 + Math.sin(rad) * radius;
  const pop = useTransform(progress, [0.18 + index * 0.025, 0.26 + index * 0.025], [0, 1]);
  const labelOpacity = useTransform(pop, [0, 1], [0, 0.85]);
  const labelScale = useTransform(pop, [0, 1], [0.6, 1]);

  return (
    <motion.span
      className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] tracking-[0.2em] text-primary/70 sm:text-[10px]"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        opacity: labelOpacity,
        scale: labelScale,
      }}
    >
      {label}
    </motion.span>
  );
}

function InterestsTitle({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.12, 0.2, 0.74, 0.88], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.12, 0.22], [1.4, 1]);
  const blur = useTransform(progress, [0.12, 0.2], [16, 0]);
  const tracking = useTransform(progress, [0.12, 0.22], [0.32, 0.04]);
  const letterSpacing = useTransform(tracking, (v) => `${v}em`);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[28] flex items-center justify-center px-6"
      style={{ opacity }}
      aria-hidden
    >
      <motion.h2
        className="spacex-hero-title text-center text-[13vw] text-primary sm:text-[10vw] md:text-[8vw]"
        style={{ scale, letterSpacing, filter }}
      >
        Interests
      </motion.h2>
    </motion.div>
  );
}

function BentoGridGhost({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.32, 0.42, 0.78, 0.92], [0, 0.55, 0.45, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-8 bottom-[12vh] z-[18] grid grid-cols-3 gap-2 sm:inset-x-16 sm:gap-3"
      style={{ opacity }}
      aria-hidden
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <BentoGhostCell key={i} index={i} progress={progress} />
      ))}
    </motion.div>
  );
}

function BentoGhostCell({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const row = Math.floor(index / 3);
  const col = index % 3;
  const height = row === 1 && col === 1 ? "h-28" : row === 0 && col === 2 ? "h-20" : "h-16";
  const rise = useTransform(progress, [0.34 + index * 0.02, 0.48 + index * 0.02], [24, 0]);
  const cellOpacity = useTransform(progress, [0.34 + index * 0.02, 0.44 + index * 0.02], [0, 1]);

  return (
    <motion.div
      className={`rounded-sm border border-accent/15 bg-accent/5 ${height}`}
      style={{ y: rise, opacity: cellOpacity }}
    />
  );
}

function WarmFlash({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.08, 0.14, 0.22], [0, 0.5, 0]);
  const scale = useTransform(progress, [0.08, 0.22], [0.4, 2.8]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[35] flex items-center justify-center"
      style={{ opacity }}
      aria-hidden
    >
      <motion.div
        className="rounded-full"
        style={{
          scale,
          width: "45vmin",
          height: "45vmin",
          background: `radial-gradient(circle, rgba(${WARM_RGB}, 0.55) 0%, rgba(${ACCENT_RGB}, 0.35) 35%, transparent 68%)`,
          boxShadow: `0 0 100px rgba(${WARM_RGB}, 0.4), 0 0 160px rgba(${ACCENT_RGB}, 0.25)`,
        }}
      />
    </motion.div>
  );
}

function SparkRain({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.05, 0.35, 0.48], [0, 0.6, 0.4, 0]);

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" style={{ opacity }} aria-hidden>
      {Array.from({ length: 28 }).map((_, i) => (
        <Spark key={i} progress={progress} index={i} />
      ))}
    </motion.div>
  );
}

function Spark({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const left = (index * 3.7) % 100;
  const delay = (index % 6) * 0.01;
  const y = useTransform(progress, [0.02 + delay, 0.22 + delay], ["110%", "-20%"]);
  const sparkOpacity = useTransform(progress, [0.02 + delay, 0.1 + delay, 0.3, 0.45], [0, 0.9, 0.5, 0]);
  const warm = index % 2 === 0;

  return (
    <motion.div
      className="absolute top-0 h-8 w-px"
      style={{
        left: `${left}%`,
        y,
        opacity: sparkOpacity,
        background: warm
          ? `linear-gradient(to top, transparent, rgba(${WARM_RGB}, 0.8))`
          : `linear-gradient(to top, transparent, rgba(${ACCENT_RGB}, 0.75))`,
      }}
    />
  );
}

function ReducedMotionBridge() {
  return <div className="relative h-24" aria-hidden />;
}

export function ExperienceInterestsTransition() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.1, 0.62, 0.9], [0, 0.42, 0.38, 0]);
  const warmGlow = useTransform(scrollYProgress, [0.08, 0.22, 0.55, 0.75], [0, 0.35, 0.25, 0]);

  if (reduceMotion) {
    return <ReducedMotionBridge />;
  }

  return (
    <div ref={containerRef} className="relative -mt-[10vh] h-[260vh]" aria-hidden>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <SparkRain progress={scrollYProgress} />
        <MosaicDetonation progress={scrollYProgress} />
        <HeartbeatWave progress={scrollYProgress} />
        <InterestOrbit progress={scrollYProgress} />
        <BentoGridGhost progress={scrollYProgress} />

        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            opacity: warmGlow,
            background: `radial-gradient(circle at 50% 45%, rgba(${WARM_RGB}, 0.18) 0%, rgba(${ACCENT_RGB}, 0.08) 40%, transparent 68%)`,
          }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,2,4,0.52)_78%)]"
          style={{ opacity: vignetteOpacity }}
          aria-hidden
        />

        <WarmChromaticBurst progress={scrollYProgress} />
        <SpectrumScan progress={scrollYProgress} />
        <PulseRings progress={scrollYProgress} />
        <WarmFlash progress={scrollYProgress} />
        <InterestsTitle progress={scrollYProgress} />
      </div>
    </div>
  );
}
