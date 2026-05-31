"use client";

import { ExternalLink, FileText, Linkedin, Mail } from "lucide-react";
import { SITE, SOCIAL_ITEMS } from "@/lib/constants";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path d="M4 4l16 16M20 4L4 20" strokeLinecap="round" />
    </svg>
  );
}

const ICON_MAP = {
  mail: Mail,
  linkedin: Linkedin,
  twitter: XIcon,
  file: FileText,
} as const;

function SpotifyWidget() {
  return (
    <a
      href={SITE.spotify}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-row-reverse items-center gap-0 text-primary/85 outline-none drop-shadow-[0_0_8px_rgba(0,0,0,0.95)] hover:text-primary"
      aria-label="Spotify profile"
    >
      <span className="flex h-10 w-12 shrink-0 items-center justify-center">
        <span className="relative flex h-6 w-6 items-center justify-center">
          <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden>
            <circle
              cx="12"
              cy="12"
              r="10"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 15c3-1 5-1 8 0M7 12c4-1.5 7-1.5 10 0M6.5 9c5-2 8-2 11 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-xs tracking-[0.08em] text-secondary opacity-0 transition-all duration-200 ease-out group-hover:max-w-[120px] group-hover:opacity-100 group-hover:text-gold group-focus-visible:max-w-[120px] group-focus-visible:opacity-100">
        <span className="pl-2 pr-1">Spotify</span>
      </span>
    </a>
  );
}

export function RightSidebar() {
  return (
    <aside
      className="fixed right-0 top-1/2 z-[150] isolate flex -translate-y-1/2 translate-z-0 flex-col items-end gap-4 pr-4 md:pr-6"
      aria-label="Social links"
    >
      {SOCIAL_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const external = item.id !== "email";

        return (
          <a
            key={item.id}
            href={item.href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="group flex flex-row-reverse items-center gap-0 text-primary/85 outline-none drop-shadow-[0_0_8px_rgba(0,0,0,0.95)] hover:text-primary"
            aria-label={item.label}
          >
            <span className="flex h-10 w-12 shrink-0 items-center justify-center">
              <Icon className="h-[18px] w-[18px] stroke-[1.5]" />
              {external && item.id === "resume" && (
                <ExternalLink className="sr-only" />
              )}
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap font-mono text-xs tracking-[0.08em] text-secondary opacity-0 transition-all duration-200 ease-out group-hover:max-w-[120px] group-hover:opacity-100 group-hover:text-gold group-focus-visible:max-w-[120px] group-focus-visible:opacity-100">
              <span className="pl-2 pr-1">{item.label}</span>
            </span>
          </a>
        );
      })}
      <SpotifyWidget />
    </aside>
  );
}
