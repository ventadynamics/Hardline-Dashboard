import { cn } from "@/lib/cn";

const tones = {
  blue: "bg-blue",
  red: "bg-red",
  olive: "bg-olive",
  neutral: "bg-line3",
  success: "bg-ink",
} as const;

const glows = {
  blue: "shadow-[0_0_6px_rgba(76,154,255,0.45)]",
  red: "shadow-[0_0_6px_rgba(255,59,48,0.45)]",
  olive: "",
  neutral: "",
  success: "",
} as const;

export type BarTone = keyof typeof tones;

/**
 * Thin luminous progress: a line of light over a translucent track.
 * Red while the objective runs, phosphor white when it is complete.
 */
export function ProgressBar({
  value,
  total,
  tone = "red",
  className,
}: {
  value: number;
  total: number;
  tone?: BarTone;
  className?: string;
}) {
  const share = Math.max(0, Math.min(1, total === 0 ? 0 : value / total));
  return (
    <div
      className={cn("h-[4px] w-full rounded-sm bg-[color:var(--layer-2)]", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={value}
    >
      <div
        className={cn("h-full rounded-sm", tones[tone], glows[tone])}
        style={{ width: `${share * 100}%` }}
      />
    </div>
  );
}

/** Labeled characteristic bar (unit stats): thin gauge with mono value. */
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
      <div className="h-[4px] flex-1 rounded-sm bg-[color:var(--layer-2)]">
        <div
          className={cn("h-full rounded-sm", tones[tone])}
          style={{ width: `${max === 0 ? 0 : (value / max) * 100}%` }}
        />
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
      <div className="h-[4px] w-full rounded-sm bg-[color:var(--layer-2)]">
        <div
          className={cn("h-full rounded-sm", tones[tone])}
          style={{ width: `${max === 0 ? 0 : (value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}
