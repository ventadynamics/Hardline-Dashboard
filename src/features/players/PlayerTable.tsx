import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/states";
import { catalogService, clanService } from "@/services";
import { cn } from "@/lib/cn";
import { kd, num, pct } from "@/lib/format";
import type { Faction, LeaderboardEntry } from "@/types";

/** Player ranking table — the game's ladder, not an admin grid. */
export async function PlayerTable({
  entries,
  variant = "full",
  highlightPlayerId,
}: {
  entries: LeaderboardEntry[];
  variant?: "full" | "compact";
  highlightPlayerId?: string;
}) {
  if (entries.length === 0) {
    return <EmptyState title="Игроки не найдены" hint="Попробуйте изменить фильтры или запрос." />;
  }
  const [units, clans, factions] = await Promise.all([
    catalogService.units(),
    clanService.leaderboard(),
    catalogService.factions(),
  ]);
  const clanTag = (id: string | null) => clans.find((c) => c.clan.id === id)?.clan.tag;
  const unitName = (id: string) => units.find((u) => u.id === id)?.name ?? "—";
  const factionOf = (id: string): Faction => factions.find((f) => f.id === id)!;
  const full = variant === "full";

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-[44px] !text-right">#</th>
            <th>Игрок</th>
            <th className="!text-right">Рейтинг</th>
            <th className="!text-right">Победы</th>
            {full && <th className="!text-right">Матчи</th>}
            {full && <th className="!text-right">K/D</th>}
            {full && <th className="!text-right">Очки</th>}
            {full && <th className="hidden lg:table-cell">Любимый юнит</th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const f = factionOf(e.player.factionId);
            const tag = clanTag(e.player.clanId);
            const isMe = e.player.id === highlightPlayerId;
            return (
              <tr key={e.player.id} className={cn("relative", isMe && "bg-[rgba(76,154,255,0.07)]")}>
                <td className="num font-mono text-[12px] text-faint">{e.rank}</td>
                <td>
                  <div className="flex items-center gap-2.5">
                    <Avatar seed={e.player.id} tone={f.colorToken} size={26} />
                    <div className="min-w-0 leading-tight">
                      <Link
                        href={`/players/${e.player.id}`}
                        className="font-semibold text-ink transition-colors hover:text-bluebright"
                      >
                        {e.player.username}
                        {tag ? <span className="ml-1.5 font-mono text-[11px] font-normal text-faint">[{tag}]</span> : null}
                      </Link>
                      <p className="tech-label !text-[10px]">
                        {e.player.rankTitle} · ур {e.player.level}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="num font-semibold text-ink">{num(e.player.rating)}</td>
                <td className="num text-dim">{pct(e.stats.winRate)}</td>
                {full && <td className="num text-dim">{num(e.stats.matches)}</td>}
                {full && <td className="num text-dim">{kd(e.stats.kd)}</td>}
                {full && <td className="num text-dim">{num(e.stats.totalScore)}</td>}
                {full && (
                  <td className="hidden lg:table-cell">
                    <Link
                      href={`/units/${e.favoriteUnitId}`}
                      className="text-[12.5px] text-dim transition-colors hover:text-bluebright"
                    >
                      {unitName(e.favoriteUnitId)}
                    </Link>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
