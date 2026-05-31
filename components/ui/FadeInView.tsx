"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";

type Direction = "left" | "right" | "up";

const OFFSET: Record<Direction, { x: number; y: number }> = {
  left: { x: -32, y: 0 },
  right: { x: 32, y: 0 },
  up: { x: 0, y: 24 },
};

interface FadeInViewProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  className?: string;
}

export function FadeInView({
  children,
  direction = "up",
  delay = 0,
  className,
}: FadeInViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const offset = OFFSET[direction];

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: offset.x, y: offset.y }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : { opacity: 0, x: offset.x, y: offset.y }
      }
      transition={{ duration: 0.5, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
