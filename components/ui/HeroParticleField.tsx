"use client";

import { useEffect, useRef } from "react";
import { ACCENT_RGB } from "@/lib/theme";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
};

interface HeroParticleFieldProps {
  active?: boolean;
}

export function HeroParticleField({ active = true }: HeroParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const burstRef = useRef(1);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frameId = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const count = Math.min(140, Math.floor((width * height) / 12000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.45 + 0.15,
      }));
    };

    const onMove = (e: PointerEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const onLeave = () => {
      mouseRef.current.active = false;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (burstRef.current > 0) {
        burstRef.current -= 0.012;
      }

      const cx = width / 2;
      const cy = height / 2;
      const burst = burstRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const mouseOn = mouseRef.current.active;

      for (const p of particles) {
        if (burst > 0) {
          const dx = p.x - cx;
          const dy = p.y - cy;
          const dist = Math.hypot(dx, dy) || 1;
          p.vx += (dx / dist) * burst * 0.35;
          p.vy += (dy / dist) * burst * 0.35;
        }

        if (mouseOn) {
          const dx = mx - p.x;
          const dy = my - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 160) {
            const force = (160 - dist) / 160;
            p.vx += (dx / (dist || 1)) * force * 0.08;
            p.vy += (dy / (dist || 1)) * force * 0.08;
          }
        }

        p.vx *= 0.98;
        p.vy *= 0.98;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 242, 247, ${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = dx * dx + dy * dy;
          if (dist < 10000) {
            const opacity = (1 - dist / 10000) * 0.12;
            ctx.strokeStyle = `rgba(${ACCENT_RGB}, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (mouseOn) {
        const grad = ctx.createRadialGradient(mx, my, 0, mx, my, 120);
        grad.addColorStop(0, `rgba(${ACCENT_RGB}, 0.14)`);
        grad.addColorStop(1, "transparent");
        ctx.fillStyle = grad;
        ctx.fillRect(mx - 120, my - 120, 240, 240);
      }

      frameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      aria-hidden
    />
  );
}
