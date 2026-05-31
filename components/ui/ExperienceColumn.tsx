"use client";

import type { ExperienceColumnData } from "@/lib/experience";
import { ExperienceRow } from "@/components/ui/ExperienceRow";

interface ExperienceColumnProps {
  column: ExperienceColumnData;
}

export function ExperienceColumn({ column }: ExperienceColumnProps) {
  return (
    <div className="min-w-0 w-full">
      <h3 className="spacex-body mb-4 border-b border-border pb-3 text-[13px] font-bold uppercase tracking-[0.12em] text-primary">
        {column.label}
      </h3>
      <div>
        {column.rows.map((row) => (
          <ExperienceRow key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}
