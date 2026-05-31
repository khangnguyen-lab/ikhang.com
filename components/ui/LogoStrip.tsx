"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import type { LogoItem } from "@/lib/experience";

type Direction = "left" | "right";

interface LogoStripProps {
  logos: LogoItem[];
  direction?: Direction;
}

const maskStyle = (src: string): CSSProperties => ({
  WebkitMaskImage: `url(${src})`,
  maskImage: `url(${src})`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
});

function LogoMark({ logo }: { logo: LogoItem }) {
  const [imgError, setImgError] = useState(false);
  const logoHeight = 48;
  const logoScale = logo.scale ?? 1;

  if (logo.src && !imgError) {
    return (
      <div className="inline-flex rounded-lg px-3 py-1.5 transition-all duration-[250ms] ease group-hover/item:scale-[1.08] group-hover/item:bg-white">
        <div
          className={`relative ${logoScale > 1 ? "overflow-visible" : "overflow-hidden"}`}
          style={{ height: logoHeight }}
        >
          {/* Sizes container to logo aspect ratio at standard height */}
          <Image
            src={logo.src}
            alt=""
            width={240}
            height={logoHeight}
            aria-hidden
            className="block w-auto opacity-0"
            style={{ height: logoHeight }}
          />
          <div className="absolute inset-0 flex items-center justify-center overflow-visible">
            <div
              className="relative shrink-0 transition-transform duration-[250ms] ease"
              style={{
                height: logoHeight,
                transform: `scale(${logoScale})`,
                transformOrigin: "center center",
              }}
            >
              {/* Pure #FFFFFF silhouette — uses PNG alpha, not color inversion */}
              <div
                aria-hidden
                className="absolute inset-0 bg-white transition-opacity duration-[250ms] ease group-hover/item:opacity-0"
                style={maskStyle(logo.src)}
              />
              <Image
                src={logo.src}
                alt={logo.name}
                width={240}
                height={logoHeight}
                className="relative block w-auto opacity-0 transition-opacity duration-[250ms] ease group-hover/item:opacity-100"
                style={{ height: logoHeight }}
                onError={() => setImgError(true)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <span className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-primary/45 transition-all duration-[250ms] ease group-hover/item:scale-[1.08] group-hover/item:text-primary/90">
      {logo.name}
    </span>
  );
}

export function LogoStrip({ logos, direction = "left" }: LogoStripProps) {
  const loop = [...logos, ...logos, ...logos];
  const animationClass =
    direction === "left" ? "animate-scroll-left" : "animate-scroll-right";

  return (
    <div className="relative overflow-hidden py-6">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent sm:w-24"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent sm:w-24"
        aria-hidden
      />

      <div
        className={`flex w-max flex-nowrap items-center overflow-hidden ${animationClass}`}
      >
        {loop.map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="group/item flex min-w-[160px] shrink-0 items-center justify-center px-8"
          >
            <LogoMark logo={logo} />
          </div>
        ))}
      </div>
    </div>
  );
}
