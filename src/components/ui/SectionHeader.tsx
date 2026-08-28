import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/**
 * Section header: a short tick of colored light, mono uppercase title,
 * meta hanging right on the same baseline. A hairline closes the row.
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
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="tele flex items-center gap-2.5 text-[13px] font-bold text-ink">
          <span
            aria-hidden
            className={cn(
              "h-[12px] w-[3px] rounded-sm",
              accent === "red" && "bg-red shadow-[0_0_8px_rgba(255,59,48,0.5)]",
              accent === "blue" && "bg-blue shadow-[0_0_8px_rgba(76,154,255,0.5)]",
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
