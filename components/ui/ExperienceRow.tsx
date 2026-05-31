"use client";

import Image from "next/image";
import { useState } from "react";
import type { ExperienceRowItem } from "@/lib/experience";

function companyInitials(name: string) {
  return name
    .split(/\s+/)
    .filter((word) => word.length > 0 && word[0] !== "&")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function RowLogo({ company, logo }: { company: string; logo: string }) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <Image
        src={logo}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 object-contain grayscale opacity-60 transition-[filter,opacity] duration-[250ms] ease-out group-hover/row:grayscale-0 group-hover/row:opacity-100"
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center font-mono text-[10px] font-medium tracking-wide text-secondary/80"
      aria-hidden
    >
      {companyInitials(company)}
    </div>
  );
}

interface ExperienceRowProps {
  row: ExperienceRowItem;
}

export function ExperienceRow({ row }: ExperienceRowProps) {
  return (
    <div className="group/row border-b border-l-[3px] border-b-border border-l-transparent transition-[background-color,border-color] duration-[250ms] ease-out hover:border-l-accent hover:bg-black">
      <div className="grid grid-cols-[40px_1fr_auto] items-start gap-x-3 px-3 py-4 lg:px-4">
        <RowLogo company={row.company} logo={row.logo} />

        <div className="min-w-0">
          <p className="spacex-body truncate whitespace-nowrap text-[15px] font-bold leading-snug text-primary">
            {row.company}
          </p>
          <p className="mt-0.5 truncate whitespace-nowrap font-mono text-[13px] leading-snug text-accent">
            {row.role}
          </p>
        </div>

        <div className="shrink-0 pl-2 text-right">
          <p className="whitespace-nowrap font-mono text-[12px] leading-snug text-secondary">
            {row.duration}
          </p>
          {row.location ? (
            <p className="mt-0.5 whitespace-nowrap font-mono text-[12px] leading-snug text-primary/80">
              {row.location}
            </p>
          ) : null}
        </div>

        <div className="col-span-3 grid w-full grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-[250ms] ease-out group-hover/row:grid-rows-[1fr] group-hover/row:opacity-100">
          <div className="w-full overflow-hidden">
            <p className="spacex-body w-full whitespace-normal break-words pt-2 text-[13px] leading-[1.6] text-secondary">
              {row.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
