"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { MoodBoardTile } from "@/lib/interests-mood-board";

interface InterestTileProps {
  tile: MoodBoardTile;
  scale: number;
  animateIn?: boolean;
  staggerIndex?: number;
}

export function InterestTile({
  tile,
  scale,
  animateIn = true,
  staggerIndex = 0,
}: InterestTileProps) {
  const [imgError, setImgError] = useState(false);

  const layout = useMemo(() => {
    const w = Math.round(tile.width * scale);
    const h = Math.round(tile.height * scale);
    return {
      left: Math.round(tile.x * scale),
      top: Math.round(tile.y * scale),
      width: w,
      height: h,
    };
  }, [scale, tile.height, tile.width, tile.x, tile.y]);

  return (
    <motion.article
      className="group/tile absolute transition-[z-index] duration-300 group-hover/tile:z-50"
      style={{
        left: layout.left,
        top: layout.top,
        width: layout.width,
        height: layout.height,
        zIndex: tile.zIndex,
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={animateIn ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{
        delay: 0.04 * staggerIndex,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        className="relative overflow-hidden rounded-sm shadow-[0_8px_32px_rgba(0,0,0,0.45)] ring-1 ring-white/10 transition-shadow duration-300 group-hover/tile:shadow-[0_12px_40px_rgba(99,91,255,0.35)]"
        style={{
          width: layout.width,
          height: layout.height,
          transform: `rotate(${tile.rotate}deg)`,
        }}
      >
        {!imgError ? (
          <Image
            src={tile.image}
            alt={tile.title}
            width={tile.width}
            height={tile.height}
            unoptimized
            draggable={false}
            className="block max-w-none transition-[filter] duration-300 group-hover/tile:brightness-[0.55]"
            style={{
              width: layout.width,
              height: layout.height,
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="flex items-center justify-center bg-surface font-mono text-xs text-secondary"
            style={{ width: layout.width, height: layout.height }}
          >
            {tile.title}
          </div>
        )}

        <div
          className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/tile:bg-black/35"
          aria-hidden
        />

        <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-3 text-center font-body text-sm font-medium leading-snug text-primary opacity-0 transition-opacity duration-300 group-hover/tile:opacity-100 sm:text-base">
          {tile.hoverLine}
        </p>
      </div>
    </motion.article>
  );
}
