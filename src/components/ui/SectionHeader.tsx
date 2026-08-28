import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Operational unit header, stamp variant: a double typographic rule, then an
 * inverted print stamp carrying the title, meta hanging right.
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
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
        <h2 className={cn("stamp text-[11px]", accent === "red" && "stamp--red")}>{title}</h2>
        {meta ? <div className="tele flex items-center gap-3 text-[10px] text-dim">{meta}</div> : null}
      </div>
    </div>
  );
}
