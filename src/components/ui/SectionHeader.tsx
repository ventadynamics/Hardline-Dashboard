import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Operational unit header: a full-width structural rule, then ASCII-framed
 * mono title with meta hanging right on the same line.
 */
export function SectionHeader({
  title,
  meta,
  accent = "ink",
  className,
}: {
  title: string;
  meta?: ReactNode;
  accent?: "ink" | "red" | "blue" | "none";
  className?: string;
}) {
  return (
    <div className={cn("mb-3", className)}>
      <div className={accent === "red" ? "rule-red" : "rule-ink"} aria-hidden />
      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="tele text-[13px] font-bold text-ink">
          <span aria-hidden className="text-faint">[ </span>
          {title}
          <span aria-hidden className="text-faint"> ]</span>
        </h2>
        {meta ? <div className="tele flex items-center gap-3 text-[10.5px] text-dim">{meta}</div> : null}
      </div>
    </div>
  );
}
