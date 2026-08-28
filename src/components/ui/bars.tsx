import { cn } from "@/lib/cn";

const tones = {
  blue: "bg-blue",
  red: "bg-red",
  olive: "bg-olive",
  neutral: "bg-line3",
  success: "bg-ink",
} as const;

export type BarTone = keyof typeof tones;

/**
 * Segmented mechanical progress: discrete blocks, no continuous fills.
 * Red while running, phosphor white when the objective is complete.
 */
export function ProgressBar({
  value,
  total,
  tone = "red",
  segments = 14,
  className,
}: {
  value: number;
  total: number;
  tone?: BarTone;
  segments?: number;
  className?: string;
}) {
  const share = Math.max(0, Math.min(1, total === 0 ? 0 : value / total));
  const filled = Math.round(share * segments);
  return (
    <div
      className={cn("flex h-[8px] gap-[2px]", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={value}
    >
      {Array.from({ length: segments }).map((_, i) => (
        <span
          key={i}
          className={cn("flex-1", i < filled ? tones[tone] : "bg-[color:var(--line-1)]")}
        />
      ))}
    </div>
  );
}

/** Labeled characteristic bar (unit stats): thin blueprint gauge. */
export function StatBar({
  label,
  value,
  max = 100,
  tone = "blue",
}: {
  label: string;
  value: number;
  max?: number;
  tone?: BarTone;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="tech-label w-[104px] shrink-0">{label}</span>
      <div className="flex h-[6px] flex-1 gap-[2px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className={cn("flex-1", i < Math.round((value / max) * 10) ? tones[tone] : "bg-[color:var(--line-1)]")}
          />
        ))}
      </div>
      <span className="tnum w-8 text-right font-mono text-[11.5px] text-dim">{value}</span>
    </div>
  );
}

/** Horizontal comparison bar with mono value on the right. */
export function HBar({
  label,
  sub,
  value,
  max,
  display,
  tone = "blue",
}: {
  label: string;
  sub?: string;
  value: number;
  max: number;
  display: string;
  tone?: BarTone;
}) {
  return (
    <div className="py-1.5">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <span className="text-[12.5px] text-ink">
          {label}
          {sub ? <span className="ml-2 font-mono text-[10.5px] text-faint">{sub}</span> : null}
        </span>
        <span className="tnum font-mono text-[11.5px] text-dim">{display}</span>
      </div>
      <div className="h-[4px] w-full bg-[color:var(--line-1)]">
        <div className={cn("h-full", tones[tone])} style={{ width: `${max === 0 ? 0 : (value / max) * 100}%` }} />
      </div>
    </div>
  );
}
