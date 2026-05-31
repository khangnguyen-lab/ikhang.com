"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AboutAtmosphere } from "@/components/ui/AboutAtmosphere";
import { AboutVisual } from "@/components/ui/AboutVisual";
import { HudCorner } from "@/components/ui/HudCorner";
import { ACCENT_RGB } from "@/lib/theme";

const RECENT_ITEMS = [
  <>
    Will be interning at <strong>Stripe</strong> in the Bay this summer on their
    Finance &amp; Strategy team
  </>,
  <>
    Did research and met some cool people through <strong>NASA&apos;s L&apos;SPACE</strong>{" "}
    program
  </>,
  <>
    Started the <strong>Irvine Consulting Group</strong> during my freshman year of
    college and am now scaling it to infinity and beyond with past clients such as{" "}
    <strong>BeReal</strong>, <strong>SanDisk</strong>,{" "}
    <strong>Aura Intelligence by Bain &amp; Company</strong>, <strong>Del Taco</strong>
    , and <strong>Kura Sushi</strong>
  </>,
] as const;

const textReveal = {
  hidden: { opacity: 0, x: -28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const listReveal = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const FOUNDERS_QUOTES = [
  {
    quote:
      "About half of what separates the successful entrepreneurs from the non-successful ones is pure perseverance.",
    author: "Steve Jobs",
  },
  {
    quote: "Take a simple idea and take it seriously.",
    author: "Charlie Munger",
  },
  {
    quote: "The cowards never started and the weak died along the way.",
    author: "Phil Knight",
  },
  {
    quote:
      "Don't undertake a project unless it is manifestly important and nearly impossible.",
    author: "Edwin Land",
  },
  {
    quote:
      "The difference between successful people and really successful people is that really successful people say no to almost everything.",
    author: "Warren Buffett",
  },
  {
    quote: "We are stubborn on vision. We are flexible on details.",
    author: "Jeff Bezos",
  },
  {
    quote: "When you don't know what you're doing, do it fast.",
    author: "Sam Zell",
  },
  {
    quote:
      "When something is important enough, you do it even if the odds are not in your favor.",
    author: "Elon Musk",
  },
  {
    quote: "Spend each day trying to be a little wiser than you were when you woke up.",
    author: "Charlie Munger",
  },
  {
    quote: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller",
  },
  {
    quote:
      "I've failed over and over and over again in my life. And that is why I succeed.",
    author: "Michael Jordan",
  },
  {
    quote:
      "Everything negative — pressure, challenges — is all an opportunity for me to rise.",
    author: "Kobe Bryant",
  },
] as const;

type FounderQuote = (typeof FOUNDERS_QUOTES)[number];

const QUOTE_DISPLAY_MS = 5500;
const QUOTE_GAP_MS = 2800;
const QUOTE_FADE_MS = 450;

function shuffleQuotes<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function DataTicker() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.55 });
  const prevInView = useRef(false);
  const [activeQuote, setActiveQuote] = useState<FounderQuote | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const entered = isInView && !prevInView.current;
    const left = !isInView && prevInView.current;
    prevInView.current = isInView;

    if (left) {
      setVisible(false);
      setActiveQuote(null);
      return;
    }

    if (!entered) return;

    const shuffled = shuffleQuotes(FOUNDERS_QUOTES);
    let index = 0;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, ms: number) => {
      timers.push(setTimeout(fn, ms));
    };

    const showNext = () => {
      if (cancelled) return;

      setActiveQuote(shuffled[index]);
      setVisible(true);

      schedule(() => {
        if (cancelled) return;
        setVisible(false);

        schedule(() => {
          if (cancelled) return;
          index = (index + 1) % shuffled.length;
          showNext();
        }, QUOTE_GAP_MS);
      }, QUOTE_DISPLAY_MS);
    };

    showNext();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [isInView]);

  return (
    <div
      ref={ref}
      className="relative mb-8 overflow-hidden py-4"
      aria-label="Quotes from entrepreneurs featured on Founders Podcast"
      aria-live="polite"
    >
      <div className="relative flex min-h-[2.75rem] items-center justify-center px-20 sm:min-h-[3rem]">
        <AnimatePresence mode="wait">
          {visible && activeQuote ? (
            <motion.p
              key={`${activeQuote.author}-${activeQuote.quote.slice(0, 24)}`}
              className="max-w-4xl text-center font-body text-[10px] leading-relaxed tracking-[0.06em] sm:text-[11px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: QUOTE_FADE_MS / 1000, ease: "easeOut" }}
            >
              <span className="text-secondary/40">&ldquo;{activeQuote.quote}&rdquo;</span>{" "}
              <span className="text-accent/40">&mdash; {activeQuote.author}</span>
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}

function TelemetryRail({ progress }: { progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const fill = useTransform(progress, [0.2, 0.85], ["0%", "100%"]);

  return (
    <div className="relative mt-10 overflow-hidden" aria-hidden>
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.28em] text-secondary/40">
        <span>signal integrity</span>
        <span>module sync</span>
      </div>
      <div className="relative mt-2 h-px w-full bg-border/50">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent via-accent/60 to-accent/20"
          style={{ width: fill }}
        />
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-border/60"
            style={{ left: `${(i / 23) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInView = useInView(contentRef, { once: true, margin: "-80px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "start 0.62"],
  });

  const sectionY = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const sectionScale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const lineScaleX = useTransform(scrollYProgress, [0.05, 0.45], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.08, 0.35], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.08, 0.35], [16, 0]);
  const coordOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 0.7]);

  const y = useSpring(sectionY, { stiffness: 140, damping: 20, mass: 0.55 });
  const scale = useSpring(sectionScale, { stiffness: 140, damping: 20, mass: 0.55 });

  return (
    <motion.section
      ref={sectionRef}
      id="about"
      className="relative z-10 overflow-hidden py-section"
      style={{ y, scale, transformOrigin: "center top" }}
    >
      <AboutAtmosphere scrollProgress={scrollYProgress} />

      <div className="relative w-full px-20 subpixel-antialiased">
        <motion.div
          className="mb-10 h-px origin-left bg-gradient-to-r from-accent via-accent/40 to-transparent"
          style={{ scaleX: lineScaleX }}
          aria-hidden
        />

        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <motion.p
            className="spacex-body text-[13px] font-bold uppercase tracking-[0.2em] text-accent"
            style={{ opacity: labelOpacity, y: labelY }}
          >
            About
          </motion.p>

          <motion.div
            className="hidden items-center gap-4 font-mono text-[10px] tracking-[0.22em] text-secondary/45 sm:flex"
            style={{ opacity: coordOpacity }}
            aria-hidden
          >
            <span className="flex items-center gap-2">
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-green"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              LIVE
            </span>
            <span>33.6846° N · 117.8265° W</span>
          </motion.div>
        </div>

        <DataTicker />

        <div
          ref={contentRef}
          className="relative grid w-full grid-cols-1 lg:grid-cols-2 lg:min-h-[560px]"
        >
          <div className="relative border border-border/40 bg-surface/10 p-8 lg:border-r-0 lg:p-10 xl:p-12">
            <HudCorner className="left-3 top-3" />
            <HudCorner className="right-3 top-3 rotate-90" />
            <HudCorner className="bottom-3 left-3 -rotate-90" />
            <HudCorner className="bottom-3 right-3 rotate-180" />

            <motion.div
              className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent lg:inset-x-10 xl:inset-x-12"
              initial={{ scaleX: 0 }}
              animate={contentInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              aria-hidden
            />

            {contentInView ? (
              <motion.div
                className="pointer-events-none absolute inset-x-6 top-0 h-16 overflow-hidden lg:inset-x-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.35, 0] }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                aria-hidden
              >
                <motion.div
                  className="h-full w-full bg-gradient-to-b from-accent/25 via-accent/5 to-transparent"
                  initial={{ y: "-100%" }}
                  animate={{ y: "400%" }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                />
              </motion.div>
            ) : null}

            <div
              className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-accent/25 to-transparent"
              aria-hidden
            />

            <motion.div
              className="spacex-body w-full space-y-5 text-sm leading-[1.65] text-primary/90 md:text-[15px]"
              initial="hidden"
              animate={contentInView ? "visible" : "hidden"}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.09, delayChildren: 0.12 } },
              }}
            >
              <motion.p variants={textReveal}>
                My name is Khang like Kangaroo. I&apos;m working on becoming a better
                version of myself at UC Irvine.
              </motion.p>

              <motion.p variants={textReveal}>
                Right now, I&apos;m exploring finance, strategy, technology, and
                entrepreneurship through internships, consulting, and building projects
                with people smarter than me. I love the late nights.
              </motion.p>

              <motion.div variants={textReveal}>
                <p className="mb-4">Most recently:</p>
                <motion.ul
                  className="space-y-4"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.07 } },
                  }}
                >
                  {RECENT_ITEMS.map((item, index) => (
                    <motion.li key={index} className="flex gap-3" variants={listReveal}>
                      <motion.span
                        className="mt-0.5 shrink-0 text-accent"
                        animate={{ x: [0, 4, 0] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          delay: index * 0.25,
                          ease: "easeInOut",
                        }}
                        aria-hidden
                      >
                        →
                      </motion.span>
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>

              <motion.div className="space-y-2 pt-2" variants={textReveal}>
                <p>I want to build my own company.</p>
                <p>I&apos;m also deeply fascinated by space.</p>
                <p>Maybe one day I&apos;ll get to do both!</p>
              </motion.div>
            </motion.div>
          </div>

          <AboutVisual />
        </div>

        <TelemetryRail progress={scrollYProgress} />

        <motion.div
          className="pointer-events-none absolute -right-4 top-1/2 hidden h-48 w-px lg:block"
          style={{
            background: `linear-gradient(to bottom, transparent, rgba(${ACCENT_RGB}, 0.35), transparent)`,
          }}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      </div>
    </motion.section>
  );
}
