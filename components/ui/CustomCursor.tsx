"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { ACCENT_RGB } from "@/lib/theme";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, summary, label[for], [data-cursor="pointer"]';

export function CustomCursor() {
  const reduceMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [onPage, setOnPage] = useState(true);

  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 320, damping: 26, mass: 0.35 });
  const ringY = useSpring(dotY, { stiffness: 320, damping: 26, mass: 0.35 });

  useEffect(() => {
    if (reduceMotion !== false) return;

    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (!finePointer) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (event: MouseEvent) => {
      dotX.set(event.clientX);
      dotY.set(event.clientY);
    };

    const onOver = (event: MouseEvent) => {
      const target = (event.target as Element | null)?.closest(INTERACTIVE_SELECTOR);
      setHovering(Boolean(target));
    };

    const onDown = () => setPressing(true);
    const onUp = () => setPressing(false);
    const onLeave = () => setOnPage(false);
    const onEnter = () => setOnPage(true);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [dotX, dotY, reduceMotion]);

  if (!enabled) return null;

  const ringSize = hovering ? 40 : 28;
  const dotSize = hovering ? 4 : 5;
  const ringScale = pressing ? 0.88 : 1;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-screen"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: onPage ? 1 : 0,
        }}
        animate={{
          width: ringSize,
          height: ringSize,
          scale: ringScale,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 28, mass: 0.4 }}
        aria-hidden
      >
        <div
          className="h-full w-full rounded-full border border-accent/50"
          style={{
            boxShadow: `0 0 14px rgba(${ACCENT_RGB}, 0.25), inset 0 0 8px rgba(${ACCENT_RGB}, 0.08)`,
          }}
        />
        {hovering ? (
          <div
            className="absolute left-1/2 top-1/2 h-px w-2 -translate-x-1/2 -translate-y-1/2 bg-accent/70"
            aria-hidden
          />
        ) : null}
        {hovering ? (
          <div
            className="absolute left-1/2 top-1/2 h-2 w-px -translate-x-1/2 -translate-y-1/2 bg-accent/70"
            aria-hidden
          />
        ) : null}
      </motion.div>

      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-accent"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          width: dotSize,
          height: dotSize,
          opacity: onPage ? 1 : 0,
          boxShadow: `0 0 10px rgba(${ACCENT_RGB}, 0.85), 0 0 20px rgba(${ACCENT_RGB}, 0.35)`,
        }}
        animate={{ scale: pressing ? 0.75 : hovering ? 0.85 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        aria-hidden
      />
    </>
  );
}
