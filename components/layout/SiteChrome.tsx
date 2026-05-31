"use client";

import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";

const EDGE_SCRIM =
  "pointer-events-none fixed inset-y-0 z-[140] w-14 md:w-[4.5rem]";

export function SiteChrome() {
  return (
    <>
      <div
        aria-hidden
        className={`${EDGE_SCRIM} left-0 bg-gradient-to-r from-bg via-bg/80 to-transparent`}
      />
      <div
        aria-hidden
        className={`${EDGE_SCRIM} right-0 bg-gradient-to-l from-bg via-bg/80 to-transparent`}
      />
      <LeftSidebar />
      <RightSidebar />
    </>
  );
}
