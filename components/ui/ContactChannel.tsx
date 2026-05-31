"use client";

import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import type { ContactChannel as ContactChannelData } from "@/lib/contact";

interface ContactChannelProps {
  channel: ContactChannelData;
}

export function ContactChannel({ channel }: ContactChannelProps) {
  return (
    <motion.a
      href={channel.href}
      target={channel.external ? "_blank" : undefined}
      rel={channel.external ? "noopener noreferrer" : undefined}
      className="group/channel relative flex items-center justify-between gap-4 overflow-hidden border-b border-border/50 border-l-[3px] border-l-transparent px-4 py-5 transition-[background-color,border-color] duration-[250ms] ease-out last:border-b-0 hover:border-l-accent hover:bg-black sm:px-5"
      whileHover={{ x: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    >
      <motion.span
        className="pointer-events-none absolute inset-y-0 left-0 w-0 bg-accent/5"
        initial={false}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        aria-hidden
      />
      <div className="relative min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-secondary/45 transition-colors duration-[250ms] group-hover/channel:text-secondary/65">
          {channel.label}
        </p>
        <p className="spacex-body mt-1 truncate text-[15px] text-primary transition-colors duration-[250ms] group-hover/channel:text-accent">
          {channel.value}
        </p>
      </div>
      <ArrowUpRight
        className="relative h-4 w-4 shrink-0 text-secondary/35 transition-all duration-[250ms] group-hover/channel:-translate-y-0.5 group-hover/channel:translate-x-0.5 group-hover/channel:text-accent"
        aria-hidden
      />
    </motion.a>
  );
}
