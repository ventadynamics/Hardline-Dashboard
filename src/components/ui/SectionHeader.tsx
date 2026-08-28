import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Section header: a slanted tick of colored light, condensed display
 * title, meta hanging right. A hairline closes the row.
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
    <div className={cn("mb-3.5", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="display flex items-center gap-2.5 text-[17px] font-semibold text-ink">
          <span
            aria-hidden
            className={cn(
              "h-[14px] w-[5px] -skew-x-[18deg]",
              accent === "red" && "bg-red shadow-[0_0_10px_rgba(255,47,54,0.55)]",
              accent === "blue" && "bg-blue shadow-[0_0_10px_rgba(63,141,255,0.55)]",
              (accent === "ink" || accent === "none") && "bg-inkline",
            )}
          />
          {title}
        </h2>
        {meta ? <div className="tele flex items-center gap-3 text-[10.5px] text-dim">{meta}</div> : null}
      </div>
      <div className="mt-2 border-t border-line" aria-hidden />
    </div>
  );
}
