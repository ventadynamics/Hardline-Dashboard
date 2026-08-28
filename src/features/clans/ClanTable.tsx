import Link from "next/link";
import { EmptyState } from "@/components/ui/states";
import { num, pct } from "@/lib/format";
import type { ClanLeaderboardEntry } from "@/types";

/** Clan ladder. Clan MMR arrives from the backend — never computed in UI. */
export function ClanTable({
  entries,
  variant = "full",
}: {
  entries: ClanLeaderboardEntry[];
  variant?: "full" | "compact";
}) {
  if (entries.length === 0) {
    return <EmptyState title="Кланы не найдены" />;
  }
  const full = variant === "full";
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-[44px] !text-right">#</th>
            <th>Клан</th>
            <th className="!text-right">MMR</th>
            {full && <th className="!text-right">Состав</th>}
            <th className="!text-right">Победы</th>
            {full && <th className="!text-right">В / П</th>}
            {full && <th className="!text-right hidden sm:table-cell">Актив 7д</th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.clan.id}>
              <td className="num font-mono text-[12px] text-faint">{e.rank}</td>
              <td>
                <Link
                  href={`/clans/${e.clan.id}`}
                  className="group flex items-baseline gap-2"
                >
                  <span className="font-mono text-[12px] text-faint">[{e.clan.tag}]</span>
                  <span className="tele text-[12.5px] font-bold text-ink transition-colors group-hover:text-bluebright">
                    {e.clan.name}
                  </span>
                </Link>
              </td>
              <td className="num font-semibold text-ink">{num(e.clan.clanMMR)}</td>
              {full && <td className="num text-dim">{e.clan.memberIds.length}</td>}
              <td className="num text-dim">{pct(e.stats.winRate)}</td>
              {full && (
                <td className="num text-dim">
                  {num(e.stats.wins)} / {num(e.stats.losses)}
                </td>
              )}
              {full && (
                <td className="num hidden text-dim sm:table-cell">{e.stats.activity7d}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
