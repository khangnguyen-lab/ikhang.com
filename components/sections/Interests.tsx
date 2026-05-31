"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { InterestMoodBoard } from "@/components/ui/InterestMoodBoard";

export function Interests() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-60px" });

  return (
    <section id="interests" className="relative py-section">
      <div className="mx-auto w-full px-4 md:px-8 lg:px-12">
        <div ref={sectionRef}>
          <InterestMoodBoard inView={inView} />
        </div>
      </div>
    </section>
  );
}
