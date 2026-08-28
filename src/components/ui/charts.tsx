import { cn } from "@/lib/cn";

/**
 * Hand-drawn SVG charts in the portal's own grammar: thin strokes, faint
 * fills, mono axis labels. No chart library, no SaaS palette.
 */

const strokeTone = {
  blue: "var(--blue)",
  red: "var(--red)",
  olive: "var(--olive)",
} as const;

type Tone = keyof typeof strokeTone;

export function Sparkline({
  values,
  tone = "blue",
  width = 120,
  height = 28,
  className,
}: {
  values: number[];
  tone?: Tone;
  width?: number;
  height?: number;
  className?: string;
}) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * width},${height - 3 - ((v - min) / span) * (height - 6)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <polyline points={pts} fill="none" stroke={strokeTone[tone]} strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  );
}

export function AreaChart({
  points,
  tone = "blue",
  height = 160,
  ariaLabel,
  className,
}: {
  points: { label: string; value: number }[];
  tone?: Tone;
  height?: number;
  ariaLabel: string;
  className?: string;
}) {
  const W = 640;
  const H = height;
  const padL = 44;
  const padB = 22;
  const padT = 10;
  if (points.length < 2) return null;
  const vals = points.map((p) => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const x = (i: number) => padL + (i / (points.length - 1)) * (W - padL - 8);
  const y = (v: number) => padT + (1 - (v - min) / span) * (H - padT - padB);
  const line = points.map((p, i) => `${x(i)},${y(p.value)}`).join(" ");
  const area = `${padL},${H - padB} ${line} ${x(points.length - 1)},${H - padB}`;
  const gid = `ac-${tone}`;
  const gridYs = [min, min + span / 2, max];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("w-full", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeTone[tone]} stopOpacity="0.22" />
          <stop offset="100%" stopColor={strokeTone[tone]} stopOpacity="0" />
        </linearGradient>
      </defs>
      {gridYs.map((v, i) => (
        <g key={i}>
          <line x1={padL} y1={y(v)} x2={W - 8} y2={y(v)} stroke="var(--line-1)" strokeWidth="1" />
          <text
            x={padL - 6}
            y={y(v) + 3}
            textAnchor="end"
            fontSize="9"
            fill="var(--text-3)"
            fontFamily="var(--font-mono-face), monospace"
          >
            {Math.round(v)}
          </text>
        </g>
      ))}
      <polygon points={area} fill={`url(#${gid})`} />
      <polyline points={line} fill="none" stroke={strokeTone[tone]} strokeWidth="1.5" strokeLinejoin="round" />
      <text
        x={padL}
        y={H - 6}
        fontSize="9"
        fill="var(--text-3)"
        fontFamily="var(--font-mono-face), monospace"
      >
        {points[0].label}
      </text>
      <text
        x={W - 8}
        y={H - 6}
        textAnchor="end"
        fontSize="9"
        fill="var(--text-3)"
        fontFamily="var(--font-mono-face), monospace"
      >
        {points[points.length - 1].label}
      </text>
    </svg>
  );
}

export function ActivityBars({
  data,
  tone = "blue",
  className,
}: {
  data: { label: string; value: number }[];
  tone?: Tone;
  className?: string;
}) {
  const W = 640;
  const H = 84;
  const padB = 16;
  const max = Math.max(1, ...data.map((d) => d.value));
  const bw = (W - 8) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} aria-hidden preserveAspectRatio="none">
      <line x1="0" y1={H - padB} x2={W} y2={H - padB} stroke="var(--line-2)" strokeWidth="1" />
      {data.map((d, i) => {
        const h = (d.value / max) * (H - padB - 8);
        return (
          <g key={i}>
            <rect
              x={i * bw + bw * 0.22}
              y={H - padB - h}
              width={bw * 0.56}
              height={Math.max(1, h)}
              fill={strokeTone[tone]}
              opacity={d.value === 0 ? 0.14 : 0.75}
            />
            {i % 2 === 0 ? (
              <text
                x={i * bw + bw * 0.5}
                y={H - 4}
                textAnchor="middle"
                fontSize="8.5"
                fill="var(--text-3)"
                fontFamily="var(--font-mono-face), monospace"
              >
                {d.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
