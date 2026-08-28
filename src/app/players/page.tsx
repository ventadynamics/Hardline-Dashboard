import type { Metadata } from "next";
import { FilterBar } from "@/components/ui/FilterBar";
import { PageTitle } from "@/components/ui/PageTitle";
import { Panel } from "@/components/ui/Panel";
import { PlayerTable } from "@/features/players/PlayerTable";
import { catalogService, playerService } from "@/services";
import { num } from "@/lib/format";
import type { PlayerQuery } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Игроки",
};

export default async function PlayersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; faction?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const factions = await catalogService.factions();
  const query: PlayerQuery = {
    search: sp.q,
    factionId: sp.faction || undefined,
    sort: (sp.sort as PlayerQuery["sort"]) || "rating",
  };
  const { entries, total } = await playerService.leaderboard(query);

  return (
    <div className="mx-auto max-w-[1360px] space-y-6 px-4 py-8 sm:px-6">
      <PageTitle
        title="ИГРОКИ"
        description="Общий реестр бойцов Hardline: рейтинг, результативность и предпочтения. Профиль каждого игрока открывается по клику."
        meta={<span className="font-mono text-[11.5px] text-faint">{num(total)} в списке</span>}
      />
      <FilterBar
        fields={[
          { type: "search", name: "q", label: "Поиск", placeholder: "Позывной игрока…" },
          {
            type: "select",
            name: "faction",
            label: "Фракция",
            options: [
              { value: "", label: "Все фракции" },
              ...factions.map((f) => ({ value: f.id, label: f.name })),
            ],
          },
          {
            type: "select",
            name: "sort",
            label: "Сортировка",
            options: [
              { value: "", label: "По рейтингу" },
              { value: "winRate", label: "По победам" },
              { value: "kd", label: "По K/D" },
              { value: "score", label: "По очкам" },
              { value: "matches", label: "По матчам" },
            ],
          },
        ]}
      />
      <Panel padded={false}>
        <PlayerTable entries={entries} variant="full" />
      </Panel>
    </div>
  );
}
