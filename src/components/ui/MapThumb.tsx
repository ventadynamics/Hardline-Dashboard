import { hashCode, int, mulberry32 } from "@/lib/rng";
import type { GameMap } from "@/types";

/**
 * Authored tactical-scheme thumbnail: a deterministic district plan with
 * objective markers, drawn in the portal's grammar. Stands in the map art
 * slot until real level art replaces it (map.image).
 */
export function MapThumb({
  map,
  className,
  interactive = false,
}: {
  map: GameMap;
  className?: string;
  interactive?: boolean;
}) {
  const rng = mulberry32(hashCode(map.id));
  const W = 320;
  const H = 180;

  /* city blocks */
  const blocks: { x: number; y: number; w: number; h: number; o: number }[] = [];
  for (let i = 0; i < 26; i++) {
    blocks.push({
      x: int(rng, 0, W - 40),
      y: int(rng, 0, H - 26),
      w: int(rng, 14, 46),
      h: int(rng, 8, 26),
      o: 0.04 + rng() * 0.08,
    });
  }
  /* main roads */
  const roadY = int(rng, 50, H - 50);
  const roadX = int(rng, 80, W - 80);
  /* objectives spread along the road axes */
  const objs = map.objectives.map((code, i) => ({
    code,
    x: 34 + ((W - 68) / Math.max(1, map.objectives.length - 1)) * i + int(rng, -14, 14),
    y: roadY + int(rng, -34, 34),
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      role="img"
      aria-label={`Схема карты ${map.name}`}
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width={W} height={H} fill="var(--surface-2)" />
      {blocks.map((b, i) => (
        <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill="#9eb2d0" opacity={b.o} />
      ))}
      <line x1="0" y1={roadY} x2={W} y2={roadY} stroke="var(--line-3)" strokeWidth="3" opacity="0.5" />
      <line x1={roadX} y1="0" x2={roadX} y2={H} stroke="var(--line-3)" strokeWidth="2" opacity="0.4" />
      <line x1="0" y1={roadY} x2={W} y2={roadY} stroke="var(--blue)" strokeWidth="0.75" opacity="0.35" />
      {/* grid */}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`v${i}`} x1={(i + 1) * (W / 8)} y1="0" x2={(i + 1) * (W / 8)} y2={H} stroke="var(--line-1)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 3 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={(i + 1) * (H / 4)} x2={W} y2={(i + 1) * (H / 4)} stroke="var(--line-1)" strokeWidth="0.5" />
      ))}
      {/* objectives */}
      {objs.map((o, i) => {
        const tone = i % 2 === 0 ? "var(--blue)" : "var(--red)";
        return (
          <g key={o.code} className={interactive ? "transition-opacity" : undefined}>
            <rect x={o.x - 7} y={o.y - 7} width={14} height={14} fill="none" stroke={tone} strokeWidth="1" opacity="0.9" />
            <rect x={o.x - 2.5} y={o.y - 2.5} width={5} height={5} fill={tone} opacity="0.85" />
            <text
              x={o.x}
              y={o.y - 11}
              textAnchor="middle"
              fontSize="8"
              fill="var(--text-2)"
              fontFamily="var(--font-mono-face), monospace"
            >
              {o.code}
            </text>
          </g>
        );
      })}
      {/* frame + code */}
      <rect x="0.5" y="0.5" width={W - 1} height={H - 1} fill="none" stroke="var(--line-2)" />
      <text
        x={W - 8}
        y={H - 8}
        textAnchor="end"
        fontSize="9"
        fill="var(--text-3)"
        fontFamily="var(--font-mono-face), monospace"
      >
        {map.code}
      </text>
    </svg>
  );
}
