"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";
import { ACCENT_RGB } from "@/lib/theme";

const TRAJECTORY_NODES = [
  { label: "AURA", progress: 0.14 },
  { label: "ICG", progress: 0.22 },
  { label: "NASA", progress: 0.3 },
  { label: "BEREAL", progress: 0.38 },
  { label: "STRIPE", progress: 0.46 },
  { label: "DRF", progress: 0.54 },
] as const;

const TRAJECTORY_PATH =
  "M 4 88 C 22 92, 34 52, 52 48 S 78 22, 96 10";

const COLUMN_LABELS = ["Work", "Leadership", "Projects"] as const;

function ScrollCounter({ value, pad = 3 }: { value: MotionValue<number>; pad?: number }) {
  const [display, setDisplay] = useState(0);

  useMotionValueEvent(value, "change", (v) => {
    setDisplay(Math.floor(v));
  });

  return <span>{String(display).padStart(pad, "0")}</span>;
}

function ChromaticBurst({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.03, 0.1], [0, 1, 0]);
  const scale = useTransform(progress, [0, 0.1], [0.6, 2.4]);
  const redX = useTransform(progress, [0, 0.06], [-18, 0]);
  const blueX = useTransform(progress, [0, 0.06], [18, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center"
      style={{ opacity }}
      aria-hidden
    >
      <motion.div
        className="absolute text-[18vw] font-bold uppercase tracking-[0.2em] text-red-500/40 mix-blend-screen"
        style={{ x: redX, scale }}
      >
        EXP
      </motion.div>
      <motion.div
        className="absolute text-[18vw] font-bold uppercase tracking-[0.2em] text-accent/50 mix-blend-screen"
        style={{ scale }}
      >
        EXP
      </motion.div>
      <motion.div
        className="absolute text-[18vw] font-bold uppercase tracking-[0.2em] text-cyan-400/35 mix-blend-screen"
        style={{ x: blueX, scale }}
      >
        EXP
      </motion.div>
    </motion.div>
  );
}

function ShockwaveRings({ progress }: { progress: MotionValue<number> }) {
  const containerOpacity = useTransform(progress, [0, 0.02, 0.18, 0.28], [0, 1, 1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
      style={{ opacity: containerOpacity }}
      aria-hidden
    >
      {[0, 1, 2].map((ring) => (
        <ShockwaveRing key={ring} progress={progress} index={ring} />
      ))}
    </motion.div>
  );
}

function ShockwaveRing({
  progress,
  index,
}: {
  progress: MotionValue<number>;
  index: number;
}) {
  const delay = index * 0.035;
  const scale = useTransform(progress, [0 + delay, 0.14 + delay], [0.2, 3.2]);
  const opacity = useTransform(progress, [0 + delay, 0.08 + delay, 0.16 + delay], [0, 0.7, 0]);

  return (
    <motion.div
      className="absolute rounded-full border border-accent/40"
      style={{
        width: "28vmin",
        height: "28vmin",
        scale,
        opacity,
        boxShadow: `0 0 40px rgba(${ACCENT_RGB}, 0.25)`,
      }}
    />
  );
}

function ScanSweep({ progress }: { progress: MotionValue<number> }) {
  const top = useTransform(progress, [0.02, 0.14], ["-8%", "108%"]);
  const opacity = useTransform(progress, [0.02, 0.06, 0.14, 0.18], [0, 1, 1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 z-[35] h-24"
      style={{ top, opacity }}
      aria-hidden
    >
      <div
        className="h-full w-full"
        style={{
          background: `linear-gradient(to bottom, transparent, rgba(${ACCENT_RGB}, 0.35), rgba(240,242,247,0.12), transparent)`,
          boxShadow: `0 0 60px rgba(${ACCENT_RGB}, 0.5), 0 0 120px rgba(${ACCENT_RGB}, 0.2)`,
        }}
      />
    </motion.div>
  );
}

function OrbitalDisc({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.04, 0.12, 0.72, 0.88], [0, 1, 1, 0]);
  const rotate = useTransform(progress, [0, 1], [0, 48]);
  const tilt = useTransform(progress, [0.04, 0.2], [8, 22]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      style={{ opacity, perspective: 900 }}
      aria-hidden
    >
      <motion.div style={{ rotateX: tilt, rotateZ: rotate }}>
        {[1, 2, 3].map((ring) => (
          <div
            key={ring}
            className="absolute left-1/2 top-1/2 rounded-[50%] border border-accent/15"
            style={{
              width: `${28 + ring * 18}vmin`,
              height: `${6 + ring * 1.5}vmin`,
              transform: "translate(-50%, -50%)",
              boxShadow: `inset 0 0 30px rgba(${ACCENT_RGB}, 0.08)`,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

function TrajectoryArc({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.06, 0.14, 0.78, 0.92], [0, 1, 1, 0]);
  const pathLength = useTransform(progress, [0.08, 0.32], [0, 1]);
  const glowOpacity = useTransform(progress, [0.28, 0.36, 0.42], [0, 0.8, 0.3]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-20"
      style={{ opacity }}
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d={TRAJECTORY_PATH}
          stroke={`rgba(${ACCENT_RGB}, 0.15)`}
          strokeWidth="0.6"
          strokeLinecap="round"
          style={{ pathLength }}
        />
        <motion.path
          d={TRAJECTORY_PATH}
          stroke={`rgba(${ACCENT_RGB}, 0.85)`}
          strokeWidth="0.35"
          strokeLinecap="round"
          style={{
            pathLength,
            filter: `drop-shadow(0 0 6px rgba(${ACCENT_RGB}, 0.9))`,
          }}
        />
        <motion.path
          d={TRAJECTORY_PATH}
          stroke="rgba(240,242,247,0.5)"
          strokeWidth="0.12"
          strokeLinecap="round"
          style={{ pathLength, opacity: glowOpacity }}
        />
      </svg>
    </motion.div>
  );
}

function TrajectoryNodes({ progress }: { progress: MotionValue<number> }) {
  const containerOpacity = useTransform(progress, [0.1, 0.18, 0.78, 0.92], [0, 1, 1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-[25]"
      style={{ opacity: containerOpacity }}
      aria-hidden
    >
      {TRAJECTORY_NODES.map((node, index) => (
        <TrajectoryNode key={node.label} progress={progress} node={node} index={index} />
      ))}
    </motion.div>
  );
}

function TrajectoryNode({
  progress,
  node,
  index,
}: {
  progress: MotionValue<number>;
  node: (typeof TRAJECTORY_NODES)[number];
  index: number;
}) {
  const left = 8 + index * 14 + (index % 2) * 3;
  const top = 78 - index * 11 + (index % 3) * 4;
  const pop = useTransform(progress, [node.progress, node.progress + 0.06], [0, 1]);
  const scale = useTransform(pop, [0, 1], [0.3, 1]);
  const nodeOpacity = useTransform(pop, [0, 0.4, 1], [0, 1, 1]);
  const ringScale = useTransform(pop, [0, 1], [2, 1]);
  const ringOpacity = useTransform(pop, [0, 1], [0, 0.6]);

  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${left}%`, top: `${top}%`, scale, opacity: nodeOpacity }}
    >
      <motion.div
        className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/30"
        style={{ scale: ringScale, opacity: ringOpacity }}
      />
      <div
        className="relative flex h-3 w-3 items-center justify-center rounded-full bg-accent"
        style={{ boxShadow: `0 0 16px rgba(${ACCENT_RGB}, 0.9)` }}
      />
      <p className="absolute left-1/2 top-4 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] tracking-[0.22em] text-primary/80 sm:text-[10px]">
        {node.label}
      </p>
    </motion.div>
  );
}

function DataRain({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.03, 0.1, 0.45, 0.55], [0, 0.35, 0.35, 0]);

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden" style={{ opacity }} aria-hidden>
      {Array.from({ length: 24 }).map((_, i) => {
        const left = (i * 4.3) % 100;
        const delay = (i % 5) * 0.012;
        return <DataStream key={i} progress={progress} left={left} delay={delay} index={i} />;
      })}
    </motion.div>
  );
}

function DataStream({
  progress,
  left,
  delay,
  index,
}: {
  progress: MotionValue<number>;
  left: number;
  delay: number;
  index: number;
}) {
  const y = useTransform(progress, [0.04 + delay, 0.28 + delay], ["-20%", "120%"]);
  const streamOpacity = useTransform(progress, [0.04 + delay, 0.12 + delay, 0.35, 0.5], [0, 0.7, 0.5, 0]);
  const chars = "01ARCΔ∑EXP";

  return (
    <motion.div
      className="absolute top-0 font-mono text-[10px] leading-[1.1] tracking-widest text-accent/25"
      style={{ left: `${left}%`, y, opacity: streamOpacity }}
    >
      {Array.from({ length: 8 }).map((_, row) => (
        <div key={row}>{chars[(index + row) % chars.length]}</div>
      ))}
    </motion.div>
  );
}

function MissionHUD({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.04, 0.12, 0.72, 0.88], [0, 1, 1, 0]);
  const recordCount = useTransform(progress, [0.06, 0.2], [0, 47]);
  const lockOpacity = useTransform(progress, [0.34, 0.4, 0.72, 0.86], [0, 1, 1, 0]);
  const lockScale = useTransform(progress, [0.34, 0.42], [0.85, 1]);

  return (
    <motion.div
      className="pointer-events-none absolute left-6 top-8 z-20 font-mono text-[10px] tracking-[0.18em] sm:left-12 sm:top-12 sm:text-xs"
      style={{ opacity }}
    >
      <p className="text-accent/90">ARCHIVE QUERY</p>
      <p className="mt-2 text-primary/70">
        RECORDS: <span className="text-primary"><ScrollCounter value={recordCount} /></span>
      </p>
      <motion.p
        className="mt-4 text-[11px] font-medium uppercase tracking-[0.28em] text-accent sm:text-xs"
        style={{ opacity: lockOpacity, scale: lockScale }}
      >
        ▸ trajectory locked
      </motion.p>
    </motion.div>
  );
}

function ExperienceTitle({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.14, 0.22, 0.74, 0.88], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0.14, 0.24], [1.35, 1]);
  const blur = useTransform(progress, [0.14, 0.22], [14, 0]);
  const tracking = useTransform(progress, [0.14, 0.24], [0.28, 0.06]);
  const letterSpacing = useTransform(tracking, (v) => `${v}em`);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6"
      style={{ opacity }}
      aria-hidden
    >
      <motion.h2
        className="spacex-hero-title text-center text-[14vw] text-primary sm:text-[11vw] md:text-[9vw]"
        style={{
          scale,
          letterSpacing,
          filter,
        }}
      >
        Experience
      </motion.h2>
    </motion.div>
  );
}

function ColumnBeams({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.24, 0.32, 0.76, 0.9], [0, 1, 1, 0]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex h-[55vh] items-end justify-center gap-4 px-8 sm:gap-8 md:gap-12 lg:gap-16"
      style={{ opacity }}
      aria-hidden
    >
      {COLUMN_LABELS.map((label, index) => (
        <ColumnBeam key={label} progress={progress} label={label} index={index} />
      ))}
    </motion.div>
  );
}

function ColumnBeam({
  progress,
  label,
  index,
}: {
  progress: MotionValue<number>;
  label: string;
  index: number;
}) {
  const start = 0.26 + index * 0.04;
  const height = useTransform(progress, [start, start + 0.14], ["0%", "100%"]);
  const labelOpacity = useTransform(progress, [start + 0.08, start + 0.16], [0, 1]);
  const labelY = useTransform(progress, [start + 0.08, start + 0.16], [12, 0]);

  return (
    <div className="relative flex h-full flex-1 max-w-[200px] flex-col items-center justify-end">
      <motion.div
        className="w-px origin-bottom bg-gradient-to-t from-accent via-accent/50 to-transparent"
        style={{
          height,
          boxShadow: `0 0 24px rgba(${ACCENT_RGB}, 0.45)`,
        }}
      />
      <motion.p
        className="spacex-body mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-primary/60 sm:text-[11px]"
        style={{ opacity: labelOpacity, y: labelY }}
      >
        {label}
      </motion.p>
    </div>
  );
}

function LockFlash({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.32, 0.38, 0.46], [0, 0.45, 0]);
  const scale = useTransform(progress, [0.32, 0.46], [0.5, 2.5]);

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
          width: "50vmin",
          height: "50vmin",
          background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.5) 0%, transparent 65%)`,
        }}
      />
    </motion.div>
  );
}

function ReducedMotionBridge() {
  return <div className="relative h-24" aria-hidden />;
}

export function AboutExperienceTransition() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.12, 0.65, 0.9], [0, 0.5, 0.45, 0]);

  if (reduceMotion) {
    return <ReducedMotionBridge />;
  }

  return (
    <div ref={containerRef} className="relative -mt-[8vh] h-[240vh]" aria-hidden>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <DataRain progress={scrollYProgress} />
        <OrbitalDisc progress={scrollYProgress} />
        <TrajectoryArc progress={scrollYProgress} />
        <TrajectoryNodes progress={scrollYProgress} />
        <ColumnBeams progress={scrollYProgress} />

        <motion.div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(2,2,4,0.5)_78%)]"
          style={{ opacity: vignetteOpacity }}
          aria-hidden
        />

        <ChromaticBurst progress={scrollYProgress} />
        <ShockwaveRings progress={scrollYProgress} />
        <ScanSweep progress={scrollYProgress} />
        <MissionHUD progress={scrollYProgress} />
        <ExperienceTitle progress={scrollYProgress} />
        <LockFlash progress={scrollYProgress} />
      </div>
    </div>
  );
}
