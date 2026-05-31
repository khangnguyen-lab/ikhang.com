"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef, type PointerEvent } from "react";
import { HeroFloatingPhoto } from "@/components/ui/HeroFloatingPhoto";
import { HeroParticleField } from "@/components/ui/HeroParticleField";
import { LiveClock } from "@/components/ui/LiveClock";
import { FLOATING_PHOTOS } from "@/lib/hero-photos";
import { ACCENT_RGB } from "@/lib/theme";

const TITLE_LINES = ["Hi,", "I'm Khang!"] as const;

function StaggerTitle({ reduceMotion }: { reduceMotion: boolean | null }) {
  if (reduceMotion) {
    return (
      <h1 className="spacex-hero-title max-w-3xl text-center text-[2.75rem] text-primary sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.25rem]">
        <span className="sr-only">Hi, I&apos;m Khang!</span>
        <span className="block" aria-hidden>Hi,</span>
        <span className="block" aria-hidden>I&apos;m Khang!</span>
      </h1>
    );
  }

  return (
    <h1 className="spacex-hero-title relative max-w-3xl text-center text-[2.75rem] text-primary sm:text-6xl md:text-7xl lg:text-[4.75rem] xl:text-[5.25rem]">
      <span className="sr-only">Hi, I&apos;m Khang!</span>
      {TITLE_LINES.map((line, lineIndex) => (
        <span key={line} className="block overflow-hidden py-1" aria-hidden>
          {line.split("").map((char, charIndex) => {
            const delay = 0.12 + lineIndex * 0.18 + charIndex * 0.028;
            return (
              <motion.span
                key={`${lineIndex}-${charIndex}`}
                className="inline-block"
                initial={{ y: "110%", opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  delay,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 18 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 18 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const titleOpacity = useTransform(scrollYProgress, [0, 0.15, 0.72, 0.9], [1, 1, 1, 0]);
  const titleScale = useTransform(scrollYProgress, [0.28, 0.78], [1, 0.88]);
  const clockOpacity = useTransform(scrollYProgress, [0, 0.12, 0.72, 0.9], [1, 1, 1, 0]);
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.5, 0.9], [0.55, 0.65, 0.85]);
  const particleOpacity = useTransform(scrollYProgress, [0.62, 0.88], [1, 0]);
  const bottomFadeOpacity = useTransform(scrollYProgress, [0.35, 0.68, 0.92], [0.45, 0.72, 1]);
  const stickyOpacity = useTransform(scrollYProgress, [0.88, 1], [1, 0]);
  const glowScrollOpacity = useTransform(scrollYProgress, [0.12, 0.38, 0.58], [1, 0.45, 0]);
  const glowScrollScale = useTransform(scrollYProgress, [0.2, 0.58], [1, 0.82]);

  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: (e.clientX - rect.left) / rect.width - 0.5,
      y: (e.clientY - rect.top) / rect.height - 0.5,
    };
    mouseX.set(pointerRef.current.x);
    mouseY.set(pointerRef.current.y);
  }

  function handlePointerLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[400vh] overflow-x-clip"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ opacity: stickyOpacity }}
      >
        <motion.div className="absolute inset-0" style={{ opacity: particleOpacity }}>
          <HeroParticleField active={!reduceMotion} />
        </motion.div>

        {!reduceMotion ? (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-1/2 z-[30] h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-accent to-transparent"
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            aria-hidden
          />
        ) : null}

        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          aria-hidden
        >
          <motion.div style={{ opacity: glowScrollOpacity, scale: glowScrollScale }}>
            <div
              className="rounded-full"
              style={{
                width: "min(70vmin, 560px)",
                height: "min(70vmin, 560px)",
                background: `radial-gradient(circle, rgba(${ACCENT_RGB}, 0.18) 0%, rgba(${ACCENT_RGB}, 0.06) 40%, transparent 68%)`,
              }}
            />
          </motion.div>
        </motion.div>

        {FLOATING_PHOTOS.map((photo) => (
          <HeroFloatingPhoto
            key={photo.id}
            photo={photo}
            progress={scrollYProgress}
            parallaxX={springX}
            parallaxY={springY}
          />
        ))}

        <motion.div
          className="pointer-events-none absolute inset-0 z-[20]"
          style={{
            opacity: vignetteOpacity,
            background:
              "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 35%, rgba(2,2,4,0.65) 100%)",
          }}
          aria-hidden
        />

        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[26] h-[50vh]"
          style={{
            opacity: bottomFadeOpacity,
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(2,2,4,0.25) 30%, rgba(2,2,4,0.75) 65%, #020204 100%)",
          }}
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[25] h-[18vh] bg-gradient-to-b from-transparent to-bg/80"
          aria-hidden
        />

        <div className="pointer-events-none absolute inset-0 z-[28] flex flex-col items-center justify-center px-6">
          <motion.div style={{ opacity: titleOpacity, scale: titleScale }}>
            <StaggerTitle reduceMotion={reduceMotion} />
          </motion.div>
          <motion.div
            style={{ opacity: clockOpacity }}
            className="hero-clock-enter mt-8"
            initial={reduceMotion ? undefined : { opacity: 0, y: 12 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5, ease: "easeOut" }}
          >
            <LiveClock />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
