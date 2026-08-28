import Link from "next/link";
import { catalogService } from "@/services";
import { ResultBadge } from "@/components/ui/badges";
import { EmptyState } from "@/components/ui/states";
import { cn } from "@/lib/cn";
import { factionText } from "@/lib/factions";
import { durationShort, relTime } from "@/lib/format";
import type { MatchSummary } from "@/types";

/**
 * Dense tactical match ledger — the shared read of a match everywhere:
 * map + mode, faction score line with the winner lit, duration, recency.
 * A 2px edge tick carries the viewer's result when a perspective is set.
 */
export async function MatchList({
  matches,
  showPerspective = false,
  emptyTitle = "Матчей пока нет",
  emptyHint,
}: {
  matches: MatchSummary[];
  showPerspective?: boolean;
  emptyTitle?: string;
  emptyHint?: string;
}) {
  if (matches.length === 0) return <EmptyState title={emptyTitle} hint={emptyHint} />;
  const [factions, maps, modes] = await Promise.all([
    catalogService.factions(),
    catalogService.maps(),
    catalogService.modes(),
  ]);
  const faction = (id: string) => factions.find((f) => f.id === id)!;
  const map = (id: string) => maps.find((m) => m.id === id)!;
  const mode = (id: string) => modes.find((m) => m.id === id)!;

  return (
    <ul>
      {matches.map((m, i) => {
        const fa = faction(m.factionAId);
        const fb = faction(m.factionBId);
        const aWon = m.winner === "A";
        const bWon = m.winner === "B";
        return (
          <li
            key={m.id}
            className={cn(
              "relative grid grid-cols-[1fr_auto] items-center gap-x-4 px-3.5 py-[9px] transition-colors hover:bg-[color:var(--layer-1)] sm:grid-cols-[minmax(140px,1.1fr)_minmax(210px,1.4fr)_64px_92px_auto]",
              i > 0 && "border-t border-line",
            )}
          >
            {showPerspective && m.perspectiveResult ? (
              <span
                aria-hidden
                className={cn(
                  "absolute inset-y-0 left-0 w-[2px]",
                  m.perspectiveResult === "win" && "bg-success",
                  m.perspectiveResult === "loss" && "bg-red",
                  m.perspectiveResult === "draw" && "bg-line3",
                )}
              />
            ) : null}
            <Link
              href={`/matches/${m.id}`}
              className="row-link"
              aria-label={`Матч на карте ${map(m.mapId).name}, ${fa.name} против ${fb.name}`}
            />
            <div className="min-w-0">
              <p className="tele truncate text-[12.5px] font-bold text-ink">
                {map(m.mapId).name}
                <span className="ml-2 font-mono text-[10px] font-normal tracking-normal text-faint">
                  {mode(m.modeId).name}
                </span>
              </p>
            </div>
            <div className="tnum flex items-center gap-2 font-mono text-[12.5px]">
              <span className={cn("tele text-[11px] font-bold", factionText[fa.colorToken])}>
                {fa.code}
              </span>
              <span className={aWon ? "font-semibold text-ink" : "text-dim"}>{m.scoreA}</span>
              <span className="text-faint">:</span>
              <span className={bWon ? "font-semibold text-ink" : "text-dim"}>{m.scoreB}</span>
              <span className={cn("tele text-[11px] font-bold", factionText[fb.colorToken])}>
                {fb.code}
              </span>
            </div>
            <span className="tnum hidden font-mono text-[11.5px] text-dim sm:block">
              {durationShort(m.durationSec)}
            </span>
            <span className="hidden font-mono text-[11px] text-faint sm:block">{relTime(m.startedAt)}</span>
            <div className="justify-self-end">
              {showPerspective && m.perspectiveResult ? (
                <ResultBadge result={m.perspectiveResult} />
              ) : (
                <span className="tech-label hidden sm:inline">
                  {m.winner === "draw" ? "ничья" : `${(m.winner === "A" ? fa : fb).code} победа`}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
