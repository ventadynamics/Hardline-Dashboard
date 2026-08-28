import Link from "next/link";
import { catalogService } from "@/services";
import { EmptyState } from "@/components/ui/states";
import { SeamShareBar } from "@/components/ui/bars";
import { cn } from "@/lib/cn";
import { factionTextHi, factionVar } from "@/lib/factions";
import { orderByLight } from "@/lib/light";
import { durationShort, relTime } from "@/lib/format";
import type { MatchSummary } from "@/types";

/**
 * The workhorse match row: 48px, full-row link, the seam at 2px scale
 * inside every score cell (Light Law ordering). A 3px leading rail
 * carries the viewer's result when a perspective is set. Rows can be
 * grouped by day with mono dividers.
 */

const dayFmt = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });

export async function MatchList({
  matches,
  showPerspective = false,
  groupByDay = false,
  emptyTitle = "Матчей пока нет",
  emptyHint,
  emptyAction,
}: {
  matches: MatchSummary[];
  showPerspective?: boolean;
  groupByDay?: boolean;
  emptyTitle?: string;
  emptyHint?: string;
  emptyAction?: { href: string; label: string };
}) {
  if (matches.length === 0) {
    return <EmptyState title={emptyTitle} hint={emptyHint} action={emptyAction} />;
  }
  const [factions, maps, modes] = await Promise.all([
    catalogService.factions(),
    catalogService.maps(),
    catalogService.modes(),
  ]);
  const faction = (id: string) => factions.find((f) => f.id === id)!;
  const map = (id: string) => maps.find((m) => m.id === id)!;
  const mode = (id: string) => modes.find((m) => m.id === id)!;

  const days = matches.map((m) => dayFmt.format(new Date(m.startedAt)));

  return (
    <ul>
      {matches.map((m, i) => {
        const [l, r] = orderByLight(
          { faction: faction(m.factionAId), score: m.scoreA, won: m.winner === "A" },
          { faction: faction(m.factionBId), score: m.scoreB, won: m.winner === "B" },
        );
        const day = days[i];
        const showDay = groupByDay && (i === 0 || days[i - 1] !== day);
        return (
          <li key={m.id}>
            {showDay ? (
              <p className={cn("tech-label border-b border-line2 px-4 py-2", i > 0 && "border-t")}>{day}</p>
            ) : null}
            <div
              className={cn(
                "relative grid h-auto grid-cols-[1fr_auto] items-center gap-x-4 px-4 py-[10px] transition-colors hover:bg-[color:var(--layer-2)] sm:h-[48px] sm:grid-cols-[minmax(120px,0.8fr)_minmax(220px,1.2fr)_64px_88px_auto] sm:py-0",
                !showDay && i > 0 && "border-t border-line",
              )}
            >
              {showPerspective && m.perspectiveResult ? (
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 left-0 w-[3px]",
                    m.perspectiveResult === "win" && "bg-[color:var(--police)]",
                    m.perspectiveResult === "loss" && "bg-[color:var(--hazard)]",
                    m.perspectiveResult === "draw" && "bg-[color:var(--line-2)]",
                  )}
                />
              ) : null}
              <Link
                href={`/matches/${m.id}`}
                className="row-link"
                aria-label={`Матч на карте ${map(m.mapId).name}, ${l.faction.name} против ${r.faction.name}, счёт ${l.score}:${r.score}`}
              />
              <div className="min-w-0">
                <p className="tele truncate text-[12px] font-bold text-ink" translate="no">
                  {map(m.mapId).name}
                  <span className="ml-2 font-normal normal-case tracking-normal text-faint">
                    {mode(m.modeId).name}
                  </span>
                </p>
              </div>
              {/* the seam at 2px scale */}
              <div className="tnum flex items-center gap-2.5 font-mono text-[12.5px] font-bold">
                <span className={cn("tele text-[10.5px]", factionTextHi[l.faction.colorToken])}>
                  {l.faction.code}
                </span>
                <span className={l.won ? "text-ink" : "text-dim"}>{l.score}</span>
                <SeamShareBar
                  a={l.score}
                  b={r.score}
                  aColor={factionVar[l.faction.colorToken]}
                  bColor={factionVar[r.faction.colorToken]}
                  height={4}
                  className="w-[64px] sm:w-[96px]"
                />
                <span className={r.won ? "text-ink" : "text-dim"}>{r.score}</span>
                <span className={cn("tele text-[10.5px]", factionTextHi[r.faction.colorToken])}>
                  {r.faction.code}
                </span>
              </div>
              <span className="tnum hidden font-mono text-[11.5px] text-dim sm:block">
                {durationShort(m.durationSec)}
              </span>
              <span className="tnum hidden font-mono text-[11px] text-faint sm:block">
                {relTime(m.startedAt)}
              </span>
              <div className="hidden justify-self-end sm:block">
                {showPerspective && m.perspectiveResult ? (
                  <span
                    className={cn(
                      "tele text-[10.5px] font-bold",
                      m.perspectiveResult === "win" && "text-ink",
                      m.perspectiveResult === "loss" && "text-[color:var(--hazard-hi)]",
                      m.perspectiveResult === "draw" && "text-dim",
                    )}
                    title={m.perspectiveResult === "win" ? "Победа" : m.perspectiveResult === "loss" ? "Поражение" : "Ничья"}
                  >
                    {m.perspectiveResult === "win" ? "П" : m.perspectiveResult === "loss" ? "ПР" : "Н"}
                  </span>
                ) : (
                  <span className="tech-label">
                    {m.winner === "draw" ? "ничья" : `${(m.winner === "A" ? faction(m.factionAId) : faction(m.factionBId)).code} победа`}
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
