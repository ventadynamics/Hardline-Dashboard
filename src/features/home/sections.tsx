import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MatchList } from "@/features/matches/MatchList";
import { PlayerTable } from "@/features/players/PlayerTable";
import { ClanTable } from "@/features/clans/ClanTable";
import { clanService, playerService, sessionService } from "@/services";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------ */
/* Framed compartment with a mono header row                            */
/* ------------------------------------------------------------------ */

export function RailModule({
  title,
  meta,
  children,
  flush = false,
}: {
  title: string;
  meta?: ReactNode;
  children: ReactNode;
  flush?: boolean;
}) {
  return (
    <section className="frame" aria-label={title}>
      <header className="flex items-center justify-between gap-3 border-b border-line2 bg-raised px-4 py-2.5">
        <h2 className="display text-[15px] font-semibold text-ink">{title}</h2>
        {meta}
      </header>
      <div className={flush ? "" : "px-3.5 py-3"}>{children}</div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tops                                                                 */
/* ------------------------------------------------------------------ */

export async function TopPlayersBlock() {
  const { entries } = await playerService.leaderboard({ limit: 5 });
  return (
    <RailModule
      title="Топ игроков"
      flush
      meta={
        <Link href="/leaderboards/players" className="tele text-[10px] text-faint transition-colors hover:text-ink">
          весь рейтинг
        </Link>
      }
    >
      <PlayerTable entries={entries} variant="compact" />
    </RailModule>
  );
}

export async function TopClansBlock() {
  const entries = (await clanService.leaderboard()).slice(0, 5);
  return (
    <RailModule
      title="Топ кланов"
      flush
      meta={
        <Link href="/leaderboards/clans" className="tele text-[10px] text-faint transition-colors hover:text-ink">
          все кланы
        </Link>
      }
    >
      <ClanTable entries={entries} variant="compact" />
    </RailModule>
  );
}

/* ------------------------------------------------------------------ */
/* Recent matches — full-width ledger                                   */
/* ------------------------------------------------------------------ */

export async function RecentMatchesBlock() {
  const session = await sessionService.current();
  const matches = await playerService.recentMatches(session.player.id, 6);
  return (
    <section aria-label="Последние матчи">
      <SectionHeader
        title="Мои последние матчи"
        meta={
          <Link href="/matches" className="group inline-flex items-center gap-1 transition-colors hover:text-ink">
            все матчи
            <ArrowRight size={11} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        }
      />
      <div className="frame">
        <MatchList
          matches={matches}
          showPerspective
          emptyTitle="Вы ещё не сыграли ни одного матча"
          emptyHint="История появится после первого выхода в бой."
        />
      </div>
    </section>
  );
}
