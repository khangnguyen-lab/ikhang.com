"use client";

import {
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import {
  BOTTOM_STRIP_LOGOS,
  EXPERIENCE_COLUMNS,
  TOP_STRIP_LOGOS,
} from "@/lib/experience";
import { ExperienceColumn } from "@/components/ui/ExperienceColumn";
import { LogoStrip } from "@/components/ui/LogoStrip";

const VERTICAL_COUNT = EXPERIENCE_COLUMNS.length;
const STORY_COUNT = EXPERIENCE_COLUMNS.reduce((total, column) => total + column.rows.length, 0);

function ExperienceTelemetryRail({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const fill = useTransform(progress, [0.45, 0.92], ["0%", "100%"]);

  return (
    <div className="relative mt-8 overflow-hidden" aria-hidden>
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-secondary/40">
        <span>trajectory logged</span>
        <span>crew archive</span>
      </div>
      <div className="relative mt-2 h-px w-full bg-border/50">
        <motion.div
          className="absolute inset-y-0 right-0 bg-gradient-to-l from-accent via-accent/60 to-accent/20"
          style={{ width: fill }}
        />
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-full h-2 w-px bg-border/60"
            style={{ left: `${(i / 23) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.92", "start 0.58"],
  });

  const sectionY = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.2, 1], [0, 0.7, 1]);
  const lineScaleX = useTransform(scrollYProgress, [0.05, 0.45], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.08, 0.35], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.08, 0.35], [16, 0]);
  const metaOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 0.7]);

  const y = useSpring(sectionY, { stiffness: 140, damping: 20, mass: 0.55 });
  const opacity = useSpring(sectionOpacity, { stiffness: 140, damping: 20, mass: 0.55 });

  return (
    <motion.section
      ref={sectionRef}
      id="experience"
      className="relative z-10 flex min-h-[100dvh] flex-col justify-center py-section"
      style={{ y, opacity }}
    >
      <div className="w-full px-20 subpixel-antialiased">
        <motion.div
          className="mb-10 h-px origin-left bg-gradient-to-r from-accent via-accent/40 to-transparent"
          style={{ scaleX: lineScaleX }}
          aria-hidden
        />

        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <motion.p
            className="spacex-body text-[13px] font-bold uppercase tracking-[0.2em] text-accent"
            style={{ opacity: labelOpacity, y: labelY }}
          >
            Experience
          </motion.p>

          <motion.div
            className="hidden items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-secondary/45 sm:flex"
            style={{ opacity: metaOpacity }}
            aria-hidden
          >
            <motion.span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-green"
              animate={{ opacity: [1, 0.35, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            <span>
              IN PROGRESS &bull; {VERTICAL_COUNT} VERTICALS &bull; {STORY_COUNT} STORIES
            </span>
          </motion.div>
        </div>
      </div>

      <LogoStrip logos={TOP_STRIP_LOGOS} direction="left" />

      <div className="w-full px-20 subpixel-antialiased">
        <motion.div
          ref={gridRef}
          data-experience-grid
          className="grid w-full grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-6"
          initial="hidden"
          animate={gridInView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.08 },
            },
          }}
        >
          {EXPERIENCE_COLUMNS.map((column) => (
            <motion.div
              key={column.id}
              className="min-w-0 w-full"
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: "easeOut" },
                },
              }}
            >
              <ExperienceColumn column={column} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <LogoStrip logos={BOTTOM_STRIP_LOGOS} direction="right" />

      <div className="w-full px-20 subpixel-antialiased">
        <ExperienceTelemetryRail progress={scrollYProgress} />
      </div>
    </motion.section>
  );
}
