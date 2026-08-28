import { cn } from "@/lib/cn";

/**
 * Step-line telemetry grammar: every line is a right-angle step-after
 * polyline — bezier smoothing is banned. Authored SVG, explicit sizes,
 * mono axis text, one real annotation per chart.
 */

const strokeTone = {
  blue: "var(--police)",
  red: "var(--hazard)",
  olive: "var(--faction-olive)",
} as const;

type Tone = keyof typeof strokeTone;

function stepPoints(values: number[], x: (i: number) => number, y: (v: number) => number): string {
  const pts: string[] = [];
  values.forEach((v, i) => {
    pts.push(`${x(i)},${y(v)}`);
    if (i < values.length - 1) pts.push(`${x(i + 1)},${y(v)}`);
  });
  return pts.join(" ");
}

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
  const x = (i: number) => (i / (values.length - 1)) * (width - 4);
  const y = (v: number) => height - 3 - ((v - min) / span) * (height - 6);
  const lastX = x(values.length - 1);
  const lastY = y(values[values.length - 1]);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <polyline
        points={stepPoints(values, x, y)}
        fill="none"
        stroke={strokeTone[tone]}
        strokeWidth="1.25"
      />
      <rect x={lastX - 1} y={lastY - 1} width="2" height="2" fill={strokeTone[tone]} />
    </svg>
  );
}

/** Step-after line chart with rating-band hairlines and an end-value chip. */
export function StepChart({
  points,
  tone = "blue",
  height = 200,
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
  const padR = 56;
  const padB = 22;
  const padT = 10;
  if (points.length < 2) return null;
  const vals = points.map((p) => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const x = (i: number) => padL + (i / (points.length - 1)) * (W - padL - padR);
  const y = (v: number) => padT + (1 - (v - min) / span) * (H - padT - padB);
  const last = vals[vals.length - 1];
  const bands = [min, min + span / 2, max];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("w-full", className)}
      preserveAspectRatio="none"
    >
      {bands.map((v, i) => (
        <g key={i}>
          <line x1={padL} y1={y(v)} x2={W - padR + 40} y2={y(v)} stroke="var(--line-1)" strokeWidth="1" />
          <text
            x={padL - 6}
            y={y(v) + 3}
            textAnchor="end"
            fontSize="9.5"
            fill="var(--faint)"
            fontFamily="var(--font-mono-face), monospace"
          >
            {Math.round(v)}
          </text>
        </g>
      ))}
      <polyline
        points={stepPoints(vals, x, y)}
        fill="none"
        stroke={strokeTone[tone]}
        strokeWidth="1.5"
      />
      {/* current-value chip riding the line end */}
      <g>
        <rect
          x={x(points.length - 1) + 4}
          y={y(last) - 9}
          width={padR - 12}
          height={18}
          fill="var(--carbon-2)"
          stroke="var(--line-2)"
        />
        <text
          x={x(points.length - 1) + 4 + (padR - 12) / 2}
          y={y(last) + 3.5}
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="500"
          fill="var(--ink)"
          fontFamily="var(--font-mono-face), monospace"
        >
          {Math.round(last)}
        </text>
      </g>
      <text
        x={padL}
        y={H - 6}
        fontSize="9.5"
        fill="var(--faint)"
        fontFamily="var(--font-mono-face), monospace"
      >
        {points[0].label}
      </text>
      <text
        x={W - padR + 40}
        y={H - 6}
        textAnchor="end"
        fontSize="9.5"
        fill="var(--faint)"
        fontFamily="var(--font-mono-face), monospace"
      >
        {points[points.length - 1].label}
      </text>
    </svg>
  );
}

/** Per-day activity bars: 6px columns, 3px gaps, mono axis. */
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
  const H = 96;
  const padB = 16;
  const max = Math.max(1, ...data.map((d) => d.value));
  const bw = (W - 8) / data.length;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={cn("w-full", className)} aria-hidden preserveAspectRatio="none">
      <line x1="0" y1={H - padB} x2={W} y2={H - padB} stroke="var(--line-2)" strokeWidth="1" />
      {data.map((d, i) => {
        const h = (d.value / max) * (H - padB - 10);
        return (
          <g key={i}>
            <rect
              x={i * bw + bw * 0.3}
              y={H - padB - h}
              width={bw * 0.4}
              height={Math.max(1, h)}
              fill={strokeTone[tone]}
              opacity={d.value === 0 ? 0.15 : 0.8}
            />
            {i % 2 === 0 ? (
              <text
                x={i * bw + bw * 0.5}
                y={H - 4}
                textAnchor="middle"
                fontSize="8.5"
                fill="var(--faint)"
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
