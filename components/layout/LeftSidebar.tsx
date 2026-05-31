"use client";

import Image from "next/image";
import {
  Briefcase,
  Mail,
  Star,
  User,
} from "lucide-react";
import { NAV_ITEMS, SITE } from "@/lib/constants";
import { useActiveSection, type SectionId } from "@/hooks/useActiveSection";

const ICON_MAP = {
  logo: null,
  user: User,
  briefcase: Briefcase,
  star: Star,
  mail: Mail,
} as const;

function scrollToSection(id: SectionId) {
  const el = document.getElementById(id);
  if (!el) return;

  if (id === "experience") {
    const grid = el.querySelector("[data-experience-grid]");
    (grid ?? el).scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  el.scrollIntoView({
    behavior: "smooth",
    block: id === "hero" ? "start" : "center",
  });
}

export function LeftSidebar() {
  const active = useActiveSection();

  return (
    <nav
      className="fixed left-0 top-1/2 z-[150] isolate flex -translate-y-1/2 translate-z-0 flex-col gap-4 pl-4 md:pl-6"
      aria-label="Primary navigation"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        const Icon = item.icon === "logo" ? null : ICON_MAP[item.icon];

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => scrollToSection(item.id)}
            className="group flex items-center gap-0 outline-none"
            aria-current={isActive ? "true" : undefined}
            aria-label={item.icon === "logo" ? "Scroll to top" : item.label}
          >
            <span
              className={`flex h-10 w-12 shrink-0 items-center justify-center drop-shadow-[0_0_8px_rgba(0,0,0,0.95)] transition-all duration-200 ${
                isActive
                  ? "text-accent drop-shadow-[0_0_12px_rgba(99,91,255,0.65)]"
                  : "text-primary/85 group-hover:text-primary"
              }`}
            >
              {item.icon === "logo" ? (
                <span
                  className={`relative h-7 w-7 shrink-0 overflow-hidden rounded-full transition-all duration-200 ${
                    isActive
                      ? "drop-shadow-[0_0_12px_rgba(99,91,255,0.65)]"
                      : "drop-shadow-[0_0_6px_rgba(0,0,0,0.9)] group-hover:drop-shadow-[0_0_10px_rgba(99,91,255,0.35)]"
                  }`}
                >
                  <Image
                    src={SITE.logo}
                    alt=""
                    width={32}
                    height={32}
                    className="h-full w-full object-cover object-center"
                  />
                </span>
              ) : Icon ? (
                <Icon className="h-[18px] w-[18px] stroke-[1.5]" />
              ) : null}
            </span>
            <span
              className={`max-w-0 overflow-hidden whitespace-nowrap font-mono text-xs tracking-[0.08em] opacity-0 transition-all duration-200 ease-out group-hover:max-w-[120px] group-hover:opacity-100 group-focus-visible:max-w-[120px] group-focus-visible:opacity-100 ${
                isActive ? "text-accent" : "text-secondary group-hover:text-gold"
              }`}
            >
              <span className="pl-1 pr-2">{item.label}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
