import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Callout header: the title projects a survey line ending in a terminator
 * square; meta rides past the line. No box, no rule stack.
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
    <div className={cn("callout mb-3.5", className)}>
      <h2 className="tele shrink-0 text-[13px] font-bold text-ink">
        {accent === "red" ? <span aria-hidden className="mr-2.5 inline-block h-[9px] w-[9px] bg-red align-baseline" /> : null}
        {title}
      </h2>
      <span className={cn("callout-line", accent === "red" && "callout-line--red")} aria-hidden />
      {meta ? <div className="tele flex shrink-0 items-center gap-3 text-[10px] text-dim">{meta}</div> : null}
    </div>
  );
}
