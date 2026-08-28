import type { Metadata } from "next";
import { FilterBar } from "@/components/ui/FilterBar";
import { PageTitle } from "@/components/ui/PageTitle";
import { Pagination } from "@/components/ui/Pagination";
import { NumberRise } from "@/components/fx/NumberRise";
import { MatchList } from "@/features/matches/MatchList";
import { catalogService, matchService } from "@/services";


export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Матчи" };

const PAGE_SIZE = 25;

export default async function MatchesPage({
  searchParams,
}: {
  searchParams: Promise<{ map?: string; mode?: string; faction?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const [maps, modes, factions] = await Promise.all([
    catalogService.maps(),
    catalogService.modes(),
    catalogService.factions(),
  ]);
  const { matches, total } = await matchService.list({
    mapId: sp.map || undefined,
    modeId: sp.mode || undefined,
    factionId: sp.faction || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  });

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6">
      <PageTitle
        title="Матчи"
        description="Архив боёв за последние 30 дней. Каждый матч открывается как полная трансляция - составы, потери, хроника."
        meta={<span className="tnum font-mono text-[11.5px] text-faint"><NumberRise value={total} duration={700} /> матчей</span>}
      />
      <div className="sticky top-[60px] z-[var(--z-ticker)] -mx-4 border-b border-line2 bg-[rgba(5,7,11,0.85)] px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <FilterBar
          fields={[
            {
              type: "select",
              name: "map",
              label: "Карта",
              options: [{ value: "", label: "Все карты" }, ...maps.map((m) => ({ value: m.id, label: m.name }))],
            },
            {
              type: "select",
              name: "mode",
              label: "Режим",
              options: [{ value: "", label: "Все режимы" }, ...modes.map((m) => ({ value: m.id, label: m.name }))],
            },
            {
              type: "select",
              name: "faction",
              label: "Фракция",
              options: [{ value: "", label: "Все фракции" }, ...factions.map((f) => ({ value: f.id, label: f.name }))],
            },
          ]}
        />
      </div>
      <div className="plate">
        <MatchList
          matches={matches}
          groupByDay
          emptyTitle="Матчей по таким фильтрам нет"
          emptyHint="Сбросьте фильтры или загляните позже."
          emptyAction={{ href: "/matches", label: "СБРОСИТЬ ФИЛЬТРЫ" }}
        />
      </div>
      <Pagination
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
        basePath="/matches"
        params={{ map: sp.map, mode: sp.mode, faction: sp.faction }}
      />
    </div>
  );
}
