import type { Metadata } from "next";
import { FilterBar } from "@/components/ui/FilterBar";
import { PageTitle } from "@/components/ui/PageTitle";
import { Panel } from "@/components/ui/Panel";
import { SegmentedLinks } from "@/components/ui/Segmented";
import { PlayerTable } from "@/features/players/PlayerTable";
import { catalogService, playerService, sessionService } from "@/services";
import { num } from "@/lib/format";
import type { PlayerQuery } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Личный состав",
};

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; faction?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const [factions, session] = await Promise.all([
    catalogService.factions(),
    sessionService.current(),
  ]);
  const query: PlayerQuery = {
    search: sp.q,
    factionId: sp.faction || undefined,
    sort: (sp.sort as PlayerQuery["sort"]) || "rating",
  };
  const { entries, total } = await playerService.leaderboard(query);

  const factionHref = (id: string) => {
    const next = new URLSearchParams();
    if (sp.q) next.set("q", sp.q);
    if (sp.sort) next.set("sort", sp.sort);
    if (id) next.set("faction", id);
    const qs = next.toString();
    return qs ? `/players?${qs}` : "/players";
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-6 px-4 py-8 sm:px-6">
      <PageTitle
        title="Личный состав"
        description="Реестр бойцов Hardline - рейтинг, результативность и предпочтения. Досье каждого оперативника открывается по клику."
        meta={<span className="tnum font-mono text-[11.5px] text-faint">{num(total)} оперативников · сезон 3</span>}
      />

      {/* filter rail */}
      <div className="sticky top-[60px] z-[var(--z-ticker)] -mx-4 border-b border-line2 bg-[rgba(5,7,11,0.85)] px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <div className="flex flex-col gap-1">
            <span className="tech-label">Фракция</span>
            <SegmentedLinks
              ariaLabel="Фильтр по фракции"
              items={[
                { href: factionHref(""), label: "ВСЕ", active: !sp.faction },
                ...factions.map((f) => ({
                  href: factionHref(f.id),
                  label: f.code,
                  active: sp.faction === f.id,
                })),
              ]}
            />
          </div>
          <FilterBar
            fields={[
              { type: "search", name: "q", label: "Поиск", placeholder: "Позывной…" },
              {
                type: "select",
                name: "sort",
                label: "Сортировка",
                options: [
                  { value: "", label: "По рейтингу" },
                  { value: "winRate", label: "По победам" },
                  { value: "kd", label: "По К-Д" },
                  { value: "score", label: "По очкам" },
                  { value: "matches", label: "По матчам" },
                ],
              },
            ]}
          />
        </div>
      </div>

      <Panel padded={false}>
        <PlayerTable entries={entries} variant="full" highlightPlayerId={session.player.id} />
      </Panel>
    </div>
  );
}
