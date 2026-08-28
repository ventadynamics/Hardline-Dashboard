import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { NumberRise } from "@/components/fx/NumberRise";
import { Reveal } from "@/components/ui/Reveal";
import { FactionTag } from "@/components/ui/badges";
import { ActivityBars, StepChart } from "@/components/ui/charts";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedLinks } from "@/components/ui/Segmented";
import { EmptyState } from "@/components/ui/states";
import { MatchList } from "@/features/matches/MatchList";
import { cn } from "@/lib/cn";
import { factionRail, fieldFor } from "@/lib/factions";
import { kd as fmtKd, num, pct, shortDate } from "@/lib/format";
import { catalogService, clanService, playerService } from "@/services";
import type { SliceStat } from "@/types";

type BreakdownKind = "faction" | "map" | "mode";

async function SliceTable({ slices, kind }: { slices: SliceStat[]; kind: BreakdownKind }) {
  const [factions, maps, modes] = await Promise.all([
    catalogService.factions(),
    catalogService.maps(),
    catalogService.modes(),
  ]);
  const name = (id: string) =>
    kind === "faction"
      ? factions.find((f) => f.id === id)?.name ?? id
      : kind === "map"
        ? maps.find((m) => m.id === id)?.name ?? id
        : modes.find((m) => m.id === id)?.name ?? id;
  if (slices.length === 0) {
    return <p className="px-4 py-5 text-[12.5px] text-faint">Нет матчей за период.</p>;
  }
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>—</th>
          <th className="!text-right">Матчи</th>
          <th className="!text-right">Победы</th>
          <th className="!text-right">Ср. очки</th>
        </tr>
      </thead>
      <tbody>
        {slices.slice(0, 5).map((s) => (
          <tr key={s.refId}>
            <td className="text-[12.5px] text-ink">{name(s.refId)}</td>
            <td className="num text-dim">{s.matches}</td>
            <td className="num text-dim">{pct(s.winRate)}</td>
            <td className="num text-dim">{num(s.avgScore)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export async function PlayerProfile({
  playerId,
  isSelf = false,
  breakdown = "faction",
  basePath,
}: {
  playerId: string;
  isSelf?: boolean;
  breakdown?: string;
  basePath: string;
}) {
  const [player, stats] = await Promise.all([
    playerService.byId(playerId),
    playerService.stats(playerId),
  ]);
  if (!player || !stats) notFound();
  const [factions, units, maps, clans, recent, { entries }] = await Promise.all([
    catalogService.factions(),
    catalogService.units(),
    catalogService.maps(),
    clanService.leaderboard(),
    playerService.recentMatches(playerId, 8),
    playerService.leaderboard({ limit: 500 }),
  ]);
  const faction = factions.find((f) => f.id === player.factionId)!;
  const clanEntry = clans.find((c) => c.clan.id === player.clanId);
  const favUnit = units.find((u) => u.id === stats.favoriteUnitId);
  const favMap = maps.find((m) => m.id === stats.favoriteMapId);
  const rank = entries.find((e) => e.player.id === playerId)?.rank;
  const hist = stats.ratingHistory;
  const delta = hist.length > 1 ? hist[hist.length - 1].rating - hist[0].rating : 0;
  const presence =
    player.presence === "online" ? "В СЕТИ" : player.presence === "ingame" ? "В МАТЧЕ" : "НЕ В СЕТИ";
  const kind: BreakdownKind = breakdown === "map" ? "map" : breakdown === "mode" ? "mode" : "faction";
  const slices = kind === "map" ? stats.byMap : kind === "mode" ? stats.byMode : stats.byFaction;

  return (
    <div className="pb-4">
      {/* dossier masthead: the faction's light enters from the leading edge */}
      <section className="relative overflow-hidden border-b border-line2">
        <div
          className={cn(
            "pointer-events-none absolute inset-y-0 w-full sm:w-2/3",
            faction.colorToken === "red" ? "right-0" : "left-0",
            fieldFor(faction.colorToken, faction.colorToken === "red" ? "r" : "l"),
          )}
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[auto_1fr_auto]">
          <div className="bezel w-fit">
            <div className={cn("bezel-core", factionRail[faction.colorToken])}>
              <Avatar seed={player.id} label={player.username} tone={faction.colorToken} size={96} />
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-3">
              <h1 className="display text-[clamp(40px,5vw,72px)] font-bold text-ink" translate="no">
                {player.username}
              </h1>
              {clanEntry ? (
                <Link
                  href={`/clans/${clanEntry.clan.id}`}
                  className="font-mono text-[14px] text-faint transition-colors hover:text-[color:var(--police-hi)]"
                >
                  [{clanEntry.clan.tag}]
                </Link>
              ) : null}
              {isSelf ? (
                <span className="tele rounded-sm border border-[rgba(47,123,255,0.45)] px-2 py-[3px] text-[10px] font-bold text-[color:var(--police-hi)]">
                  ЭТО ВЫ
                </span>
              ) : null}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="tech-label">
                {player.rankTitle} · уровень {player.level}
              </span>
              <FactionTag faction={faction} full />
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "live-dot !size-[5px]",
                    player.presence === "offline" && "!animate-none !bg-[color:var(--line-2)]",
                    player.presence === "ingame" && "live-dot--red",
                  )}
                  aria-hidden
                />
                <span className="tech-label">{presence}</span>
              </span>
              <span className="font-mono text-[11px] text-faint">в игре с {shortDate(player.createdAt)}</span>
            </div>
          </div>
          <div className="text-left lg:text-right">
            <p className="tech-label">Рейтинг</p>
            <p className="display tnum text-[72px] font-black leading-none text-ink">
              <NumberRise value={player.rating} />
            </p>
            <p className="tnum mt-2 font-mono text-[11.5px] text-dim">
              {rank ? `#${rank} в зачёте` : "вне зачёта"}
              <span className={cn("ml-3", delta >= 0 ? "text-[color:var(--police-hi)]" : "text-[color:var(--hazard-hi)]")}>
                {delta >= 0 ? "▲" : "▼"} {num(Math.abs(delta))} за 30 дней
              </span>
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-10 grid max-w-[1400px] grid-cols-1 items-start gap-x-8 gap-y-10 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        {/* left: service record */}
        <div className="space-y-10">
          <Reveal delay={0}><section aria-label="Послужной список">
            <SectionHeader title="Послужной список" accent="blue" />
            <div className="plate grid grid-cols-3">
              <div className="border-r border-line px-5 py-4">
                <p className="tech-label">Победы</p>
                <p className="display tnum mt-1.5 text-[32px] font-bold text-ink">{pct(stats.winRate, 1)}</p>
                <p className="tnum mt-1 font-mono text-[10.5px] text-faint">
                  {num(stats.wins)} - {num(stats.losses)}
                </p>
              </div>
              <div className="border-r border-line px-5 py-4">
                <p className="tech-label">К-Д</p>
                <p className="display tnum mt-1.5 text-[32px] font-bold text-ink">{fmtKd(stats.kd)}</p>
                <p className="tnum mt-1 font-mono text-[10.5px] text-faint">
                  {num(stats.kills)} / {num(stats.deaths)}
                </p>
              </div>
              <div className="px-5 py-4">
                <p className="tech-label">Матчи</p>
                <p className="display tnum mt-1.5 text-[32px] font-bold text-ink">{num(stats.matches)}</p>
                <p className="tnum mt-1 font-mono text-[10.5px] text-faint">ср. очки {num(stats.avgScore)}</p>
              </div>
            </div>
            <details className="plate group mt-3">
              <summary className="tele cursor-pointer list-none px-5 py-3 text-[11px] font-bold text-dim transition-colors hover:text-ink">
                ПОЛНАЯ СТАТИСТИКА
                <span className="ml-2 inline-block transition-transform group-open:rotate-90" aria-hidden>›</span>
              </summary>
              <dl className="tnum grid grid-cols-1 gap-x-8 border-t border-line px-5 py-4 font-mono text-[12px] sm:grid-cols-2">
                {(
                  [
                    ["Всего очков", num(stats.totalScore)],
                    ["Содействий", num(stats.assists)],
                    ["Точек захвачено", num(stats.objectivesCaptured)],
                    ["Любимый юнит", favUnit?.name ?? "—"],
                    ["Любимая карта", favMap?.name ?? "—"],
                    ["Основная фракция", factions.find((f) => f.id === stats.favoriteFactionId)?.name ?? faction.name],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line py-2 last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0">
                    <dt className="tech-label">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </details>
          </section></Reveal>

          <Reveal delay={0}><section aria-label="История матчей">
            <SectionHeader
              title="История матчей"
              meta={
                <Link href="/matches" className="transition-colors hover:text-ink">
                  все матчи
                </Link>
              }
            />
            <Panel padded={false}>
              <MatchList
                matches={recent}
                showPerspective
                groupByDay
                emptyTitle="Недавних матчей нет"
                emptyHint="За последние 30 дней игрок не выходил в бой."
              />
            </Panel>
          </section></Reveal>
        </div>

        {/* right rail: telemetry */}
        <div className="space-y-10">
          <Reveal delay={0}><section aria-label="Динамика рейтинга">
            <SectionHeader title="Динамика" meta={<span>30 дней</span>} />
            <Panel>
              <StepChart
                ariaLabel={`Рейтинг игрока ${player.username} за 30 дней`}
                points={hist.map((p) => ({ label: shortDate(p.date), value: p.rating }))}
                tone="blue"
                height={200}
              />
            </Panel>
          </section></Reveal>

          <Reveal delay={80}><section aria-label="Активность">
            <SectionHeader title="Активность" meta={<span>14 дней</span>} />
            <Panel>
              <ActivityBars
                data={stats.activity.map((a) => ({ label: shortDate(a.date), value: a.matches }))}
                tone="red"
              />
              <p className="tnum mt-2 font-mono text-[11px] text-faint">
                матчей за период: {stats.activity.reduce((s, a) => s + a.matches, 0)}
              </p>
            </Panel>
          </section></Reveal>

          <Reveal delay={120}><section aria-label="Разбор за 30 дней">
            <SectionHeader title="Разбор" meta={<span>30 дней</span>} />
            {stats.byFaction.length === 0 && stats.byMap.length === 0 ? (
              <EmptyState
                title="Нет данных за период"
                hint="Разбор появится после ближайших боёв."
                action={{ href: "/matches", label: "К МАТЧАМ" }}
              />
            ) : (
              <div className="plate">
                <div className="border-b border-line2 p-2">
                  <SegmentedLinks
                    ariaLabel="Срез разбора"
                    className="border-0"
                    items={[
                      { href: `${basePath}?breakdown=faction`, label: "ФРАКЦИИ", active: kind === "faction" },
                      { href: `${basePath}?breakdown=map`, label: "КАРТЫ", active: kind === "map" },
                      { href: `${basePath}?breakdown=mode`, label: "РЕЖИМЫ", active: kind === "mode" },
                    ]}
                  />
                </div>
                <SliceTable slices={slices} kind={kind} />
              </div>
            )}
          </section></Reveal>
        </div>
      </div>
    </div>
  );
}
