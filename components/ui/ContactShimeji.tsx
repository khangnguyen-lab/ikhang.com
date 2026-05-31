"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { ACCENT_RGB } from "@/lib/theme";

type Edge = "bottom" | "right" | "top" | "left";
type Pose = "walk" | "idle";

type Figure = {
  id: number;
  t: number;
  dir: 1 | -1;
  speed: number;
  pose: Pose;
  idleTimer: number;
  frame: 0 | 1;
  frameTimer: number;
  renderX: number;
  renderY: number;
  edge: Edge;
};

const FIGURE_W = 22;
const FIGURE_H = 28;

function perimeter(w: number, h: number) {
  return 2 * (w + h);
}

function initFigures(w: number, h: number): Figure[] {
  const startA = positionAlongPerimeter(w * 0.32, w, h);
  const startB = positionAlongPerimeter(w * 0.68, w, h);

  return [
    {
      id: 0,
      t: w * 0.32,
      dir: 1,
      speed: 0.32,
      pose: "walk",
      idleTimer: 0,
      frame: 0,
      frameTimer: 0,
      renderX: startA.x,
      renderY: startA.y,
      edge: startA.edge,
    },
    {
      id: 1,
      t: w * 0.68,
      dir: -1,
      speed: 0.26,
      pose: "walk",
      idleTimer: 60,
      frame: 1,
      frameTimer: 0,
      renderX: startB.x,
      renderY: startB.y,
      edge: startB.edge,
    },
  ];
}

function positionAlongPerimeter(t: number, w: number, h: number) {
  const p = perimeter(w, h);
  let d = ((t % p) + p) % p;

  if (d <= w) {
    return { x: d, y: h, edge: "bottom" as Edge };
  }
  d -= w;

  if (d <= h) {
    return { x: w, y: h - d, edge: "right" as Edge };
  }
  d -= h;

  if (d <= w) {
    return { x: w - d, y: 0, edge: "top" as Edge };
  }
  d -= w;

  return { x: 0, y: d, edge: "left" as Edge };
}

function rotationForEdge(edge: Edge, dir: 1 | -1) {
  switch (edge) {
    case "bottom":
      return dir === 1 ? 0 : 180;
    case "right":
      return dir === 1 ? -90 : 90;
    case "top":
      return dir === 1 ? 180 : 0;
    case "left":
      return dir === 1 ? 90 : -90;
  }
}

function stepFigure(fig: Figure, w: number, h: number): Figure {
  const next = { ...fig };
  const p = perimeter(w, h);

  if (next.idleTimer > 0) {
    next.idleTimer -= 1;
    if (next.idleTimer === 0) next.pose = "walk";
  } else if (next.pose === "idle") {
    next.pose = "walk";
  }

  if (next.pose === "walk") {
    next.t += next.dir * next.speed;
    if (next.t < 0) next.t += p;
    if (next.t >= p) next.t -= p;

    next.frameTimer += 1;
    if (next.frameTimer >= 9) {
      next.frame = next.frame === 0 ? 1 : 0;
      next.frameTimer = 0;
    }

    if (Math.random() < 0.0012) {
      next.pose = "idle";
      next.idleTimer = 70 + Math.floor(Math.random() * 60);
    }
  }

  const target = positionAlongPerimeter(next.t, w, h);
  const lerp = next.pose === "walk" ? 0.28 : 0.14;
  next.renderX += (target.x - next.renderX) * lerp;
  next.renderY += (target.y - next.renderY) * lerp;
  next.edge = target.edge;

  return next;
}

function MiniAstronautSvg({
  frame,
  pose,
}: {
  frame: 0 | 1;
  pose: Pose;
}) {
  const stroke = `rgba(${ACCENT_RGB}, 0.9)`;
  const fill = `rgba(${ACCENT_RGB}, 0.18)`;
  const visor = `rgba(${ACCENT_RGB}, 0.45)`;
  const legL = frame === 0 ? "M9 22 L7 27" : "M9 22 L11 27";
  const legR = frame === 0 ? "M13 22 L15 27" : "M13 22 L11 27";
  const armL = pose === "idle" ? "M7 14 L5 17" : frame === 0 ? "M7 14 L4 16" : "M7 14 L5 18";
  const armR = pose === "idle" ? "M15 14 L17 17" : frame === 0 ? "M15 14 L18 16" : "M15 14 L17 18";

  return (
    <svg width={FIGURE_W} height={FIGURE_H} viewBox="0 0 22 28" className="overflow-visible" aria-hidden>
      <rect
        x="14.5"
        y="12"
        width="3.5"
        height="7"
        rx="1"
        fill={fill}
        stroke={stroke}
        strokeWidth="0.9"
      />
      <rect x="6" y="12" width="10" height="11" rx="2.2" fill={fill} stroke={stroke} strokeWidth="1" />
      <circle cx="11" cy="7.5" r="5.2" fill={fill} stroke={stroke} strokeWidth="1" />
      <path
        d="M8 7.5 Q11 9.8 14 7.5"
        fill={visor}
        stroke={stroke}
        strokeWidth="0.7"
      />
      <path d={armL} stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
      <path d={armR} stroke={stroke} strokeWidth="1.1" strokeLinecap="round" />
      <path d={legL} stroke={stroke} strokeWidth="1.15" strokeLinecap="round" />
      <path d={legR} stroke={stroke} strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}

interface ContactShimejiProps {
  panelRef: RefObject<HTMLElement | null>;
  active: boolean;
}

export function ContactShimeji({ panelRef, active }: ContactShimejiProps) {
  const figuresRef = useRef<Figure[]>([]);
  const boundsRef = useRef({ w: 0, h: 0 });
  const [figures, setFigures] = useState<Figure[]>([]);

  useEffect(() => {
    if (!active || !panelRef.current) return;

    const panel = panelRef.current;

    const measure = () => {
      const rect = panel.getBoundingClientRect();
      const prev = boundsRef.current;
      const w = rect.width;
      const h = rect.height;

      if (figuresRef.current.length === 0) {
        figuresRef.current = initFigures(w, h);
      } else if (prev.w > 0 && prev.h > 0 && (prev.w !== w || prev.h !== h)) {
        const oldP = perimeter(prev.w, prev.h);
        const newP = perimeter(w, h);
        figuresRef.current = figuresRef.current.map((fig) => {
          const ratio = fig.t / oldP;
          const nt = ratio * newP;
          const pos = positionAlongPerimeter(nt, w, h);
          return { ...fig, t: nt, renderX: pos.x, renderY: pos.y, edge: pos.edge };
        });
      }

      boundsRef.current = { w, h };
      setFigures([...figuresRef.current]);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);

    let raf = 0;
    const loop = () => {
      const { w, h } = boundsRef.current;
      if (w > 0 && h > 0 && figuresRef.current.length > 0) {
        figuresRef.current = figuresRef.current.map((fig) => stepFigure(fig, w, h));
        setFigures([...figuresRef.current]);
      }
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      figuresRef.current = [];
      setFigures([]);
    };
  }, [active, panelRef]);

  if (!active || figures.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden>
      {figures.map((fig) => {
        const rotate = rotationForEdge(fig.edge, fig.dir);

        return (
          <div
            key={fig.id}
            className="absolute will-change-transform"
            style={{
              left: fig.renderX,
              top: fig.renderY,
              width: FIGURE_W,
              height: FIGURE_H,
              transform: `translate(-50%, -100%) rotate(${rotate}deg)`,
              transformOrigin: "50% 100%",
              filter: `drop-shadow(0 0 5px rgba(${ACCENT_RGB}, 0.35))`,
            }}
          >
            <MiniAstronautSvg frame={fig.frame} pose={fig.pose} />
          </div>
        );
      })}
    </div>
  );
}
