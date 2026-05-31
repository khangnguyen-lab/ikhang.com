"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { HudCorner } from "@/components/ui/HudCorner";

const AboutSpaceScene = dynamic(
  () => import("@/components/ui/AboutSpaceScene").then((m) => m.AboutSpaceScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-accent"
          animate={{ opacity: [1, 0.25, 1], scale: [1, 0.85, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      </div>
    ),
  },
);

export function AboutVisual() {
  return (
    <div
      className="relative flex min-h-[min(480px,55vh)] w-full items-stretch lg:min-h-[560px]"
      aria-label="Interactive 3D space scene"
    >
      <div className="relative flex w-full flex-col overflow-hidden border border-border/40 bg-surface/20 lg:border-l-0">
        <HudCorner className="left-3 top-3" />
        <HudCorner className="right-3 top-3 rotate-90" />
        <HudCorner className="bottom-3 left-3 -rotate-90" />
        <HudCorner className="bottom-3 right-3 rotate-180" />

        <div className="relative min-h-[min(480px,55vh)] flex-1 lg:min-h-[560px]">
          <AboutSpaceScene />
        </div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />
      </div>
    </div>
  );
}
