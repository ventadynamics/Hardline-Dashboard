import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyState } from "@/components/ui/states";
import { catalogService, clanService } from "@/services";
import { cn } from "@/lib/cn";
import { factionTextHi } from "@/lib/factions";
import { kd, num, pct } from "@/lib/format";
import type { Faction, LeaderboardEntry } from "@/types";

/**
 * The ladder, Battlelog-tight: 40px rows, mono numerals, the rating as
 * the loudest cell, win % riding its own 2px bar, full-row links.
 */
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
    return (
      <EmptyState
        title="Нет данных за период"
        hint="Попробуйте изменить фильтры или запрос."
        action={{ href: "/players", label: "СБРОСИТЬ ФИЛЬТРЫ" }}
      />
    );
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
  const maxWr = Math.max(...entries.map((e) => e.stats.winRate), 0.0001);

  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-[48px] !text-right">Ранг</th>
            <th>Оперативник</th>
            <th>Фракция</th>
            <th className="!text-right">Рейтинг</th>
            <th className="w-[120px] !text-right">Победы</th>
            {full && <th className="!text-right">К-Д</th>}
            {full && <th className="!text-right">Матчи</th>}
            {full && <th className="hidden xl:table-cell">Юнит</th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const f = factionOf(e.player.factionId);
            const tag = clanTag(e.player.clanId);
            const isMe = e.player.id === highlightPlayerId;
            return (
              <tr key={e.player.id} className={cn("relative h-[40px]", isMe && "bg-[rgba(47,123,255,0.07)]")}>
                <td className="num !text-[11.5px] text-faint">{e.rank}</td>
                <td>
                  <div className="flex items-center gap-2.5">
                    <Avatar seed={e.player.id} label={e.player.username} tone={f.colorToken} size={24} />
                    <div className="min-w-0 leading-tight">
                      <Link
                        href={`/players/${e.player.id}`}
                        className="font-mono text-[12.5px] font-bold text-ink transition-colors hover:text-[color:var(--police-hi)]"
                        translate="no"
                      >
                        {e.player.username}
                        {tag ? <span className="ml-1.5 font-normal text-faint">[{tag}]</span> : null}
                      </Link>
                      <p className="tech-label !text-[9.5px]">
                        {e.player.rankTitle} · ур {e.player.level}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={cn("tele text-[10.5px] font-bold", factionTextHi[f.colorToken])}>
                    {f.code}
                  </span>
                </td>
                <td className="num !text-[15px] !font-bold text-ink">{num(e.player.rating)}</td>
                <td className="num text-dim">
                  <span className="tnum">{pct(e.stats.winRate, 1)}</span>
                  <span className="mt-1 block h-[2px] w-full bg-[color:var(--line-1)]" aria-hidden>
                    <span
                      className="block h-full bg-[color:var(--dim)]"
                      style={{ width: `${(e.stats.winRate / maxWr) * 100}%` }}
                    />
                  </span>
                </td>
                {full && <td className="num text-dim">{kd(e.stats.kd)}</td>}
                {full && <td className="num text-dim">{num(e.stats.matches)}</td>}
                {full && (
                  <td className="hidden xl:table-cell">
                    <Link
                      href={`/units/${e.favoriteUnitId}`}
                      className="text-[12px] text-dim transition-colors hover:text-[color:var(--police-hi)]"
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
