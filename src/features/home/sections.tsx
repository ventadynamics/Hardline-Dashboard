import Link from "next/link";
import { MatchList } from "@/features/matches/MatchList";
import { matchService } from "@/services";

/** «СВОДКА МАТЧЕЙ»: the day-grouped dispatch feed on the home desk. */
export async function MatchFeed() {
  const { matches } = await matchService.list({ limit: 8 });
  return (
    <section aria-label="Сводка матчей">
      <div className="mb-4 flex items-baseline gap-4">
        <h2 className="display text-[24px] font-bold text-ink">
          <span className="glitch-title" data-text="Сводка матчей">Сводка матчей</span>
        </h2>
        <div className="min-w-6 flex-1 self-center border-t border-line2" aria-hidden />
        <Link href="/matches" className="tele text-[10.5px] text-dim transition-colors hover:text-ink">
          ВСЕ МАТЧИ
        </Link>
      </div>
      <div className="plate">
        <MatchList
          matches={matches}
          groupByDay
          emptyTitle="Эфир пуст"
          emptyHint="Матчи появятся после ближайших боёв."
          emptyAction={{ href: "/matches", label: "АРХИВ БОЁВ" }}
        />
      </div>
    </section>
  );
}
