import type { Metadata } from "next";
import { FilterBar } from "@/components/ui/FilterBar";
import { PageTitle } from "@/components/ui/PageTitle";
import { Pagination } from "@/components/ui/Pagination";
import { MatchList } from "@/features/matches/MatchList";
import { catalogService, matchService } from "@/services";
import { num } from "@/lib/format";

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
    <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-8 sm:px-6">
      <PageTitle
        title="Матчи"
        kicker="HARDLINE / АРХИВ БОЁВ"
        description="История боёв за последние 30 дней. Каждый матч открывается как полный тактический репорт."
        meta={<span className="tnum font-mono text-[11.5px] text-faint">{num(total)} матчей</span>}
      />
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
      <div className="frame">
        <MatchList
          matches={matches}
          emptyTitle="Матчей по таким фильтрам нет"
          emptyHint="Сбросьте фильтры или загляните позже."
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
