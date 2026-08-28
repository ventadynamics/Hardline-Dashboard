import { cn } from "@/lib/cn";

const tones = {
  blue: "bg-[color:var(--faction-blue)]",
  red: "bg-[color:var(--faction-red)]",
  olive: "bg-[color:var(--faction-olive)]",
  neutral: "bg-[color:var(--dim)]",
  success: "bg-ink",
} as const;

export type BarTone = keyof typeof tones;

/**
 * Progress per the seam grammar: a 2px hairline track, a light fill with
 * a skewed leading edge, mono value always adjacent (callers render it).
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
      className={cn("relative h-[2px] w-full bg-[color:var(--line-1)]", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={value}
    >
      <div className={cn("h-full", tones[tone])} style={{ width: `${share * 100}%` }} />
      {share > 0.02 && share < 0.99 ? (
        <span
          aria-hidden
          className={cn("absolute top-[-2px] h-[6px] w-[2px] -skew-x-[12deg]", tones[tone])}
          style={{ left: `calc(${share * 100}% - 1px)` }}
        />
      ) : null}
    </div>
  );
}

/** Labeled characteristic gauge (unit stats). */
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
      <div className="h-[2px] flex-1 bg-[color:var(--line-1)]">
        <div
          className={cn("h-full", tones[tone])}
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
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[13px] text-ink">
          {label}
          {sub ? <span className="ml-2 font-mono text-[10.5px] text-faint">{sub}</span> : null}
        </span>
        <span className="tnum font-mono text-[12px] text-dim">{display}</span>
      </div>
      <div className="h-[2px] w-full bg-[color:var(--line-1)]">
        <div
          className={cn("h-full", tones[tone])}
          style={{ width: `${max === 0 ? 0 : (value / max) * 100}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Score-share bar: blue fills from the LEFT, red from the RIGHT, meeting
 * at a 2px skewed ink junction at the true score ratio (Light Law).
 */
export function SeamShareBar({
  a,
  b,
  aColor = "var(--police)",
  bColor = "var(--hazard)",
  height = 6,
  className,
}: {
  a: number;
  b: number;
  /** CSS color for the left/right fills (faction vars; Light Law ordering is the caller's job) */
  aColor?: string;
  bColor?: string;
  height?: number;
  className?: string;
}) {
  const share = a + b === 0 ? 0.5 : a / (a + b);
  return (
    <div className={cn("relative w-full overflow-hidden", className)} style={{ height }} aria-hidden>
      <div
        className="absolute inset-y-0 left-0 opacity-80"
        style={{ width: `calc(${share * 100}% - 1px)`, background: aColor }}
      />
      <div
        className="absolute inset-y-0 right-0 opacity-80"
        style={{ width: `calc(${(1 - share) * 100}% - 1px)`, background: bColor }}
      />
      <div
        className="seam-junction absolute inset-y-[-2px] w-[2px] -skew-x-[12deg] bg-ink"
        style={{ left: `calc(${share * 100}% - 1px)` }}
      />
    </div>
  );
}
