import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Section identity is the headline itself: D3 display title left-aligned,
 * a 1px rule running from its right edge to the column edge, meta riding
 * the rule. Accent = faction light on the leading tick.
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
    <div className={cn("mb-4 flex items-baseline gap-4", className)}>
      <h2 className="display flex shrink-0 items-center gap-2.5 text-[24px] font-bold text-ink">
        {accent !== "none" ? (
          <span
            aria-hidden
            className={cn(
              "h-[16px] w-[5px] -skew-x-[12deg]",
              accent === "red" && "bg-[color:var(--hazard)] shadow-[0_0_10px_rgba(255,59,59,0.5)]",
              accent === "blue" && "bg-[color:var(--police)] shadow-[0_0_10px_rgba(47,123,255,0.5)]",
              accent === "ink" && "bg-ink",
            )}
          />
        ) : null}
        {title}
      </h2>
      <div className="min-w-6 flex-1 self-center border-t border-line2" aria-hidden />
      {meta ? <div className="tele flex shrink-0 items-center gap-3 text-[10.5px] text-dim">{meta}</div> : null}
    </div>
  );
}
