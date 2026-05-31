"use client";

import Image from "next/image";
import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useState } from "react";
import {
  EXPLODE_BASE,
  type FloatingPhoto,
} from "@/lib/hero-photos";
import { ACCENT_RGB } from "@/lib/theme";

interface HeroFloatingPhotoProps {
  photo: FloatingPhoto;
  progress: MotionValue<number>;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
}

export function HeroFloatingPhoto({
  photo,
  progress,
  parallaxX,
  parallaxY,
}: HeroFloatingPhotoProps) {
  const [hovered, setHovered] = useState(false);
  const base = EXPLODE_BASE[photo.direction];

  const explodeX = useTransform(progress, [0.3, 0.82], [0, base.x * photo.speed]);
  const explodeY = useTransform(progress, [0.3, 0.82], [0, base.y * photo.speed]);
  const opacity = useTransform(progress, [0, 0.7, 0.92], [1, 1, 0]);
  const scrollScale = useTransform(progress, [0.25, 0.75], [1, 0.85]);

  const driftX = useTransform(parallaxX, (v) => v * photo.depth * 36);
  const driftY = useTransform(parallaxY, (v) => v * photo.depth * 28);

  const width = hovered ? photo.w * 1.55 : photo.w;
  const height = hovered ? photo.h * 1.55 : photo.h;

  return (
    <motion.div
      className="absolute z-[12]"
      style={{
        left: `${photo.x}%`,
        top: `${photo.y}%`,
        x: explodeX,
        y: explodeY,
        opacity,
        scale: scrollScale,
        rotate: photo.rotate,
        zIndex: hovered ? 50 : 12,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.2, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{
          delay: photo.enterDelay,
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
      <motion.div style={{ x: driftX, y: driftY }}>
        <motion.button
          type="button"
          className="group relative block cursor-pointer border-0 bg-transparent p-0 outline-none"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          aria-label={photo.alt}
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 3.5 + photo.depth * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: photo.enterDelay,
          }}
        >
          <motion.div
            className="relative overflow-hidden"
            animate={{ width, height }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            style={{
              boxShadow: hovered
                ? `0 0 40px rgba(${ACCENT_RGB}, 0.55), 0 24px 48px rgba(0,0,0,0.45)`
                : `0 0 20px rgba(${ACCENT_RGB}, 0.25), 0 12px 32px rgba(0,0,0,0.35)`,
            }}
          >
            <div
              className="absolute inset-0 rounded-[inherit] ring-1 ring-accent/40 transition-all duration-300 group-hover:ring-accent/80"
              style={{ borderRadius: hovered ? 12 : 10 }}
            />
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.w}
              height={photo.h}
              className="h-full w-full object-cover"
              style={{ borderRadius: hovered ? 12 : 10 }}
              sizes="(max-width: 768px) 120px, 180px"
              priority={photo.enterDelay < 0.65}
              draggable={false}
            />
            <motion.div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-accent/10"
              animate={{ opacity: hovered ? 0.15 : 0.35 }}
              style={{ borderRadius: hovered ? 12 : 10 }}
            />
          </motion.div>
        </motion.button>
      </motion.div>
      </motion.div>
    </motion.div>
  );
}
