"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ACCENT_RGB } from "@/lib/theme";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  layer: 0 | 1 | 2;
  twinklePhase: number;
  twinkleSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
}

interface Trajectory {
  x: number;
  y: number;
  angle: number;
  speed: number;
  scale: number;
  opacity: number;
  type: "satellite" | "debris";
  trail: { x: number; y: number }[];
}

const LAYER_SPEED = [0.15, 0.35, 0.6] as const;
const LAYER_COUNTS = [140, 90, 45] as const;

function generateStars(width: number, height: number): Star[] {
  const stars: Star[] = [];
  LAYER_COUNTS.forEach((count, layer) => {
    for (let i = 0; i < count; i++) {
      const depth = layer as 0 | 1 | 2;
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: depth === 0 ? Math.random() * 0.55 + 0.2 : depth === 1 ? Math.random() * 0.9 + 0.35 : Math.random() * 1.2 + 0.5,
        opacity:
          depth === 0
            ? Math.random() * 0.25 + 0.08
            : depth === 1
              ? Math.random() * 0.45 + 0.12
              : Math.random() * 0.65 + 0.2,
        layer: depth,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.004 + 0.001,
      });
    }
  });
  return stars;
}

function spawnShootingStar(w: number, h: number): ShootingStar {
  const fromTop = Math.random() > 0.35;
  const x = fromTop ? Math.random() * w * 0.85 : w * (0.1 + Math.random() * 0.4);
  const y = fromTop ? Math.random() * h * 0.35 : Math.random() * h * 0.55;
  const angle = (Math.PI / 4) * (0.85 + Math.random() * 0.3);
  const speed = 10 + Math.random() * 6;
  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    length: 72 + Math.random() * 100,
    life: 0,
    maxLife: 38 + Math.random() * 28,
  };
}

function spawnTrajectory(w: number, h: number): Trajectory {
  const fromLeft = Math.random() > 0.5;
  return {
    x: fromLeft ? -40 : w + 40,
    y: h * (0.12 + Math.random() * 0.55),
    angle: fromLeft ? (-8 + Math.random() * 6) * (Math.PI / 180) : (172 + Math.random() * 6) * (Math.PI / 180),
    speed: 0.35 + Math.random() * 0.45,
    scale: 0.7 + Math.random() * 0.5,
    opacity: 0.12 + Math.random() * 0.14,
    type: Math.random() > 0.55 ? "satellite" : "debris",
    trail: [],
  };
}

function drawSatellite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number,
  opacity: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);
  ctx.strokeStyle = `rgba(240, 242, 247, ${opacity})`;
  ctx.fillStyle = `rgba(${ACCENT_RGB}, ${opacity * 0.35})`;
  ctx.lineWidth = 0.75;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Minimal ISS-style silhouette — editorial, not cartoon
  ctx.beginPath();
  ctx.moveTo(-18, 0);
  ctx.lineTo(14, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.ellipse(0, 0, 5, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.lineTo(-8, -9);
  ctx.moveTo(-8, 0);
  ctx.lineTo(-8, 9);
  ctx.moveTo(6, 0);
  ctx.lineTo(6, -7);
  ctx.moveTo(6, 0);
  ctx.lineTo(6, 7);
  ctx.stroke();

  ctx.restore();
}

function drawDebris(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number,
  opacity: number,
  t: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  const pulse = 0.85 + Math.sin(t * 0.02) * 0.15;
  const grad = ctx.createLinearGradient(-28, 0, 8, 0);
  grad.addColorStop(0, `rgba(${ACCENT_RGB}, 0)`);
  grad.addColorStop(0.4, `rgba(${ACCENT_RGB}, ${opacity * 0.5 * pulse})`);
  grad.addColorStop(1, `rgba(240, 242, 247, ${opacity * pulse})`);

  ctx.strokeStyle = `rgba(240, 242, 247, ${opacity * 0.9})`;
  ctx.fillStyle = grad;
  ctx.lineWidth = 0.6;

  ctx.beginPath();
  ctx.moveTo(-24, 1);
  ctx.lineTo(4, -1);
  ctx.lineTo(6, 0);
  ctx.lineTo(4, 1);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const trajectoriesRef = useRef<Trajectory[]>([]);
  const timeRef = useRef(0);
  const nextShootRef = useRef(90);
  const nextTrajRef = useRef(180);
  const rafRef = useRef(0);

  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 900], [0, 32]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      starsRef.current = generateStars(w, h);
      if (trajectoriesRef.current.length === 0) {
        trajectoriesRef.current = [spawnTrajectory(w, h), spawnTrajectory(w, h)];
      }
    };

    const drawBackground = () => {
      // Near-pure black with a faint cool void at center — no bright lift
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      const voidGlow = ctx.createRadialGradient(
        w * 0.48,
        h * 0.42,
        0,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.95
      );
      voidGlow.addColorStop(0, "rgba(4, 6, 12, 0.35)");
      voidGlow.addColorStop(0.35, "rgba(2, 3, 6, 0.15)");
      voidGlow.addColorStop(0.7, "rgba(0, 0, 0, 0)");
      voidGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = voidGlow;
      ctx.fillRect(0, 0, w, h);
    };

    const drawStars = (t: number) => {
      const driftX = Math.sin(t * 0.00008) * 4;
      const driftY = Math.cos(t * 0.00006) * 3;

      for (const star of starsRef.current) {
        const layerSpeed = LAYER_SPEED[star.layer];
        const twinkle =
          0.65 +
          0.35 * Math.sin(t * star.twinkleSpeed + star.twinklePhase);
        const sx =
          star.x + driftX * layerSpeed + Math.sin(t * 0.00004 + star.twinklePhase) * layerSpeed;
        const sy =
          star.y + driftY * layerSpeed + Math.cos(t * 0.00003 + star.twinklePhase) * layerSpeed;

        if (star.layer === 2 && star.radius > 1) {
          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.radius * 4);
          glow.addColorStop(0, `rgba(${ACCENT_RGB}, ${star.opacity * 0.12 * twinkle})`);
          glow.addColorStop(1, `rgba(${ACCENT_RGB}, 0)`);
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(sx, sy, star.radius * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 242, 247, ${star.opacity * twinkle})`;
        ctx.fill();
      }
    };

    const drawShootingStars = () => {
      shootingRef.current = shootingRef.current.filter((s) => {
        s.life += 1;
        s.x += s.vx;
        s.y += s.vy;
        if (s.life > s.maxLife) return false;

        const progress = s.life / s.maxLife;
        const fadeIn = Math.min(progress * 8, 1);
        const fadeOut = 1 - Math.max(0, (progress - 0.55) / 0.45);
        const alpha = fadeIn * fadeOut;

        const tailX = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.length;
        const tailY = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(240, 242, 247, 0)");
        grad.addColorStop(0.55, `rgba(200, 210, 230, ${alpha * 0.25})`);
        grad.addColorStop(0.85, `rgba(240, 242, 247, ${alpha * 0.7})`);
        grad.addColorStop(1, `rgba(${ACCENT_RGB}, ${alpha * 0.95})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
        headGlow.addColorStop(0, `rgba(240, 242, 247, ${alpha * 0.9})`);
        headGlow.addColorStop(0.5, `rgba(${ACCENT_RGB}, ${alpha * 0.35})`);
        headGlow.addColorStop(1, `rgba(${ACCENT_RGB}, 0)`);
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
        ctx.fill();

        return s.x < w + 120 && s.y < h + 120;
      });
    };

    const drawTrajectories = (t: number) => {
      trajectoriesRef.current.forEach((traj) => {
        traj.x += Math.cos(traj.angle) * traj.speed;
        traj.y += Math.sin(traj.angle) * traj.speed;

        traj.trail.push({ x: traj.x, y: traj.y });
        if (traj.trail.length > 24) traj.trail.shift();

        if (traj.trail.length > 2) {
          ctx.strokeStyle = `rgba(${ACCENT_RGB}, ${traj.opacity * 0.2})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(traj.trail[0].x, traj.trail[0].y);
          for (let i = 1; i < traj.trail.length; i++) {
            ctx.lineTo(traj.trail[i].x, traj.trail[i].y);
          }
          ctx.stroke();
        }

        if (traj.type === "satellite") {
          drawSatellite(ctx, traj.x, traj.y, traj.angle, traj.scale, traj.opacity);
        } else {
          drawDebris(ctx, traj.x, traj.y, traj.angle, traj.scale, traj.opacity, t);
        }

        const offScreen =
          (Math.cos(traj.angle) > 0 && traj.x > w + 60) ||
          (Math.cos(traj.angle) < 0 && traj.x < -60);
        if (offScreen) {
          Object.assign(traj, spawnTrajectory(w, h));
          traj.trail = [];
        }
      });
    };

    const drawVignette = () => {
      const v = ctx.createRadialGradient(
        w / 2,
        h / 2,
        h * 0.2,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.72
      );
      v.addColorStop(0, "rgba(0, 0, 0, 0)");
      v.addColorStop(0.65, "rgba(0, 0, 0, 0.35)");
      v.addColorStop(1, "rgba(0, 0, 0, 0.8)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);
    };

    const draw = (timestamp: number) => {
      timeRef.current = timestamp;
      drawBackground();
      drawStars(timestamp);
      drawShootingStars();
      drawTrajectories(timestamp);
      drawVignette();

      nextShootRef.current -= 1;
      if (nextShootRef.current <= 0) {
        const count = Math.random() > 0.7 ? 2 : 1;
        for (let i = 0; i < count; i++) {
          shootingRef.current.push(spawnShootingStar(w, h));
        }
        nextShootRef.current = 70 + Math.random() * 110;
      }

      nextTrajRef.current -= 1;
      if (nextTrajRef.current <= 0 && trajectoriesRef.current.length < 3) {
        trajectoriesRef.current.push(spawnTrajectory(w, h));
        nextTrajRef.current = 400 + Math.random() * 300;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    trajectoriesRef.current = [spawnTrajectory(w, h)];
    rafRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      style={{ y: parallaxY }}
      initial={false}
    >
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
    </motion.div>
  );
}
