"use client";

import { useEffect, useState } from "react";
import { ACCENT_RGB } from "@/lib/theme";

function formatLosAngelesTime() {
  return new Date().toLocaleTimeString("en-US", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

const clockStyle = {
  color: `rgb(${ACCENT_RGB})`,
  textShadow: `0 0 24px rgba(${ACCENT_RGB}, 0.45)`,
} as const;

export function LiveClock() {
  const [time, setTime] = useState(formatLosAngelesTime);

  useEffect(() => {
    const interval = setInterval(() => setTime(formatLosAngelesTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <p
      className="font-mono text-sm tracking-[0.1em] md:text-base"
      style={clockStyle}
    >
      <span>{time}</span>
      <span className="animate-blink-separator mx-2">·</span>
      <span>Los Angeles, CA</span>
    </p>
  );
}
