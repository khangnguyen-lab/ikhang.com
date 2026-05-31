"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { ContactChannel } from "@/components/ui/ContactChannel";
import { ContactShimeji } from "@/components/ui/ContactShimeji";
import { CONTACT_CHANNELS } from "@/lib/contact";
import { SITE } from "@/lib/constants";
import { ACCENT_RGB } from "@/lib/theme";

function ContactTelemetryRail({
  progress,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const fill = useTransform(progress, [0.5, 0.95], ["0%", "100%"]);

  return (
    <div className="relative mt-16 overflow-hidden" aria-hidden>
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-secondary/40">
        <span>end of transmission</span>
        <span>signal sent</span>
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

function CornerBrackets({ active, pulse }: { active: boolean; pulse?: boolean }) {
  const corners = [
    "left-0 top-0 border-l border-t",
    "right-0 top-0 border-r border-t",
    "bottom-0 left-0 border-b border-l",
    "bottom-0 right-0 border-b border-r",
  ];

  return (
    <>
      {corners.map((position, i) => (
        <motion.span
          key={position}
          className={`pointer-events-none absolute h-5 w-5 border-accent/50 ${position}`}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={
            active
              ? pulse
                ? { opacity: [0.35, 0.65, 0.35], scale: 1 }
                : { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.6 }
          }
          transition={
            pulse
              ? {
                  opacity: {
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.4,
                  },
                  scale: { duration: 0.4, delay: i * 0.06, ease: "easeOut" },
                }
              : { duration: 0.4, delay: i * 0.06, ease: "easeOut" }
          }
          aria-hidden
        />
      ))}
    </>
  );
}

function CommsPanel({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={panelRef}
      className="relative overflow-visible border border-border/40 bg-surface/10"
      initial={{ opacity: 0, y: 20 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
    >
      {!reduceMotion ? <ContactShimeji panelRef={panelRef} active={active} /> : null}

      {!reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          animate={{ opacity: [0.03, 0.07, 0.03] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
          style={{
            background: `radial-gradient(ellipse 90% 55% at 50% 0%, rgba(${ACCENT_RGB}, 0.14), transparent 72%)`,
          }}
        />
      ) : null}

      {active && !reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-10 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent"
          initial={{ top: 0, opacity: 0.5 }}
          animate={{ top: "100%", opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeInOut", delay: 0.35 }}
          aria-hidden
        />
      ) : null}

      <CornerBrackets active={active} pulse={!reduceMotion} />

      <motion.div
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent sm:inset-x-6"
        initial={{ scaleX: 0 }}
        animate={active ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        aria-hidden
      />

      {!reduceMotion ? (
        <motion.div
          className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent sm:inset-x-6"
          animate={{ opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          aria-hidden
        />
      ) : null}

      <div className="relative border-b border-border/40 px-4 py-3 sm:px-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-secondary/45">
          find me here
          {!reduceMotion ? (
            <motion.span
              className="ml-1 inline-block text-accent/50"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            >
              _
            </motion.span>
          ) : null}
        </p>
      </div>

      <div className="relative z-10">
        {CONTACT_CHANNELS.map((channel, index) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, x: 10 }}
            animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
            transition={{
              duration: 0.4,
              delay: 0.18 + index * 0.07,
              ease: "easeOut",
            }}
          >
            <ContactChannel channel={channel} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInView = useInView(contentRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.92", "start 0.58"],
  });

  const sectionY = useTransform(scrollYProgress, [0, 1], [64, 0]);
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
      id="contact"
      className="relative z-10 pb-section pt-8"
      style={{ y, opacity }}
    >
      <div className="w-full px-20 subpixel-antialiased">
        <motion.div
          className="mb-10 h-px origin-right bg-gradient-to-l from-accent via-accent/40 to-transparent"
          style={{ scaleX: lineScaleX }}
          aria-hidden
        />

        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <motion.p
            className="spacex-body text-[13px] font-bold uppercase tracking-[0.2em] text-accent"
            style={{ opacity: labelOpacity, y: labelY }}
          >
            Contact
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
              OPEN CHANNEL &bull; SAY HI &bull; WORST CASE I REPLY
            </span>
          </motion.div>
        </div>

        <div
          ref={contentRef}
          className="grid w-full grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20"
        >
          <motion.div
            initial="hidden"
            animate={contentInView ? "visible" : "hidden"}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
            }}
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
              }}
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent/70"
            >
              &gt; incoming transmission
            </motion.p>
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
              }}
              className="spacex-hero-title mt-4 text-[2.5rem] text-primary sm:text-5xl md:text-6xl"
            >
              Let&apos;s make something happen.
            </motion.h2>
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
              }}
              className="mt-6 max-w-md font-body text-[15px] leading-[1.7] text-primary/75 md:text-base"
            >
              Always happy to talk about startups, space, interesting ideas, or whatever
              you&apos;re obsessed with right now.
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
              className="mt-8 font-mono text-[10px] tracking-[0.2em] text-secondary/40"
              aria-hidden
            >
              <span>&rarr; probably checking my inbox right now</span>
            </motion.div>
          </motion.div>

          <CommsPanel active={contentInView} />
        </div>

        <ContactTelemetryRail progress={scrollYProgress} />

        <motion.p
          className="mt-10 text-center font-mono text-[10px] tracking-[0.22em] text-secondary/35"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          &copy; {new Date().getFullYear()} {SITE.name.toUpperCase()}
        </motion.p>
      </div>
    </motion.section>
  );
}
