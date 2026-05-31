"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { InterestTile } from "@/components/ui/InterestTile";
import {
  MOOD_BOARD_HEIGHT,
  MOOD_BOARD_TILES,
  MOOD_BOARD_WIDTH,
} from "@/lib/interests-mood-board";

interface InterestMoodBoardProps {
  inView: boolean;
}

/** Shrink collage vs full fit-to-width (0.72 ≈ 72% of previous size) */
const MOOD_BOARD_SIZE_FACTOR = 0.72;

function fitScale(containerWidth: number) {
  if (containerWidth <= 0) return 0.3;
  return Math.min(1, (containerWidth / MOOD_BOARD_WIDTH) * MOOD_BOARD_SIZE_FACTOR);
}

export function InterestMoodBoard({ inView }: InterestMoodBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => setScale(fitScale(el.clientWidth));

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const displayWidth = Math.round(MOOD_BOARD_WIDTH * scale);
  const displayHeight = Math.round(MOOD_BOARD_HEIGHT * scale);

  return (
    <div ref={containerRef} className="w-full">
      <motion.div
        className="relative mx-auto"
        style={{
          width: displayWidth,
          height: displayHeight,
        }}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
          },
        }}
      >
        {MOOD_BOARD_TILES.map((tile, index) => (
          <InterestTile
            key={tile.id}
            tile={tile}
            scale={scale}
            animateIn={inView}
            staggerIndex={index}
          />
        ))}
      </motion.div>
    </div>
  );
}
