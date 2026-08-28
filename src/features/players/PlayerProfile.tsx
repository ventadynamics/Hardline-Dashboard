import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { FactionTag } from "@/components/ui/badges";
import { AreaChart, ActivityBars } from "@/components/ui/charts";
import { Panel } from "@/components/ui/Panel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { EmptyState } from "@/components/ui/states";
import { MatchList } from "@/features/matches/MatchList";
import { cn } from "@/lib/cn";
import { kd as fmtKd, num, pct, shortDate } from "@/lib/format";
import { catalogService, clanService, playerService } from "@/services";
import type { SliceStat } from "@/types";

function StatCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-panel px-4 py-3.5">
      <p className="tech-label">{label}</p>
      <p className={cn("tnum display mt-1.5 text-[27px] font-semibold leading-none", accent ? "text-bluebright" : "text-ink")}>
        {value}
      </p>
    </div>
  );
}

async function SliceTable({ title, slices, kind }: { title: string; slices: SliceStat[]; kind: "faction" | "map" | "mode" }) {
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
  return (
    <div className="frame">
      <p className="tech-label border-b border-[rgba(0,0,0,0.45)] bg-raised px-3.5 py-2.5">{title}</p>
      {slices.length === 0 ? (
        <p className="px-3.5 py-4 text-[12.5px] text-faint">Нет матчей за период.</p>
      ) : (
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
      )}
    </div>
  );
}

export async function PlayerProfile({ playerId, isSelf = false }: { playerId: string; isSelf?: boolean }) {
  const [player, stats] = await Promise.all([
    playerService.byId(playerId),
    playerService.stats(playerId),
  ]);
  if (!player || !stats) notFound();
  const [factions, units, maps, clans, recent] = await Promise.all([
    catalogService.factions(),
    catalogService.units(),
    catalogService.maps(),
    clanService.leaderboard(),
    playerService.recentMatches(playerId, 8),
  ]);
  const faction = factions.find((f) => f.id === player.factionId)!;
  const clanEntry = clans.find((c) => c.clan.id === player.clanId);
  const favUnit = units.find((u) => u.id === stats.favoriteUnitId);
  const favMap = maps.find((m) => m.id === stats.favoriteMapId);
  const presence =
    player.presence === "online" ? "В СЕТИ" : player.presence === "ingame" ? "В МАТЧЕ" : "НЕ В СЕТИ";

  return (
    <div className="mx-auto max-w-[1360px] space-y-10 px-4 py-8 sm:px-6">
      {/* identity strip */}
      <section className="frame relative overflow-hidden">
        <div className="scanlines pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <Avatar seed={player.id} tone={faction.colorToken} size={72} />
            <div>
              <div className="flex flex-wrap items-baseline gap-2.5">
                <h1 className="display text-[30px] font-semibold leading-none tracking-[0.06em] text-ink">
                  {player.username}
                </h1>
                {clanEntry ? (
                  <Link href={`/clans/${clanEntry.clan.id}`} className="font-mono text-[13px] text-faint transition-colors hover:text-bluebright">
                    [{clanEntry.clan.tag}]
                  </Link>
                ) : null}
                {isSelf ? (
                  <span className="display border border-[rgba(67,144,255,0.4)] px-1.5 py-[3px] text-[10.5px] font-semibold tracking-wider text-bluebright">
                    ЭТО ВЫ
                  </span>
                ) : null}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                <span className="tech-label">
                  {player.rankTitle} · уровень {player.level}
                </span>
                <FactionTag faction={faction} full />
                <span className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "live-dot !h-[5px] !w-[5px]",
                      player.presence === "offline" && "!animate-none !bg-line3 !shadow-none",
                      player.presence === "ingame" && "live-dot--red",
                    )}
                    aria-hidden
                  />
                  <span className="tech-label">{presence}</span>
                </span>
                <span className="font-mono text-[11px] text-faint">в игре с {shortDate(player.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="tech-label">Рейтинг</p>
              <p className="tnum font-mono text-[32px] font-bold leading-none text-ink">{num(player.rating)}</p>
            </div>
            <div className="hidden h-[52px] w-px bg-line2 sm:block" aria-hidden />
            <div className="tnum grid grid-cols-3 gap-x-7 text-right">
              <div>
                <p className="tech-label">Победы</p>
                <p className="display mt-1 text-[19px] font-semibold leading-none text-ink">{pct(stats.winRate)}</p>
              </div>
              <div>
                <p className="tech-label">K/D</p>
                <p className="display mt-1 text-[19px] font-semibold leading-none text-ink">{fmtKd(stats.kd)}</p>
              </div>
              <div>
                <p className="tech-label">Матчи</p>
                <p className="display mt-1 text-[19px] font-semibold leading-none text-ink">{num(stats.matches)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* charts */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-10">
        <div>
          <SectionHeader title="Динамика рейтинга" meta={<span className="font-mono text-[11px] text-faint">30 дней</span>} />
          <Panel>
            <AreaChart
              ariaLabel={`Рейтинг игрока ${player.username} за 30 дней`}
              points={stats.ratingHistory.map((p) => ({ label: shortDate(p.date), value: p.rating }))}
              tone="blue"
              height={170}
            />
          </Panel>
        </div>
        <div>
          <SectionHeader title="Активность" meta={<span className="font-mono text-[11px] text-faint">14 дней</span>} />
          <Panel>
            <ActivityBars
              data={stats.activity.map((a) => ({ label: shortDate(a.date), value: a.matches }))}
              tone="red"
            />
            <p className="mt-2 text-[12px] text-faint">
              Матчей за период: {stats.activity.reduce((s, a) => s + a.matches, 0)}
            </p>
          </Panel>
        </div>
      </section>

      {/* career numbers */}
      <section>
        <SectionHeader title="Карьера" />
        <div className="grid-seam grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">
          <StatCell label="Всего очков" value={num(stats.totalScore)} accent />
          <StatCell label="Ср. очки за матч" value={num(stats.avgScore)} />
          <StatCell label="Побед" value={num(stats.wins)} />
          <StatCell label="Поражений" value={num(stats.losses)} />
          <StatCell label="Уничтожено" value={num(stats.kills)} />
          <StatCell label="Потеряно" value={num(stats.deaths)} />
          <StatCell label="Содействий" value={num(stats.assists)} />
          <StatCell label="Точек захвачено" value={num(stats.objectivesCaptured)} />
        </div>
        <div className="grid-seam mt-2 grid grid-cols-1 sm:grid-cols-3">
          <div className="bg-panel px-4 py-3.5">
            <p className="tech-label">Любимый юнит</p>
            {favUnit ? (
              <Link href={`/units/${favUnit.id}`} className="display mt-1.5 inline-block text-[15px] font-semibold tracking-wider text-ink transition-colors hover:text-bluebright">
                {favUnit.name}
              </Link>
            ) : (
              <p className="mt-1.5 text-dim">—</p>
            )}
          </div>
          <div className="bg-panel px-4 py-3.5">
            <p className="tech-label">Любимая карта</p>
            {favMap ? (
              <Link href={`/maps/${favMap.id}`} className="display mt-1.5 inline-block text-[15px] font-semibold tracking-wider text-ink transition-colors hover:text-bluebright">
                {favMap.name}
              </Link>
            ) : (
              <p className="mt-1.5 text-dim">—</p>
            )}
          </div>
          <div className="bg-panel px-4 py-3.5">
            <p className="tech-label">Основная фракция</p>
            <p className="mt-1.5">
              <FactionTag faction={factions.find((f) => f.id === stats.favoriteFactionId) ?? faction} full />
            </p>
          </div>
        </div>
      </section>

      {/* slices */}
      <section>
        <SectionHeader title="Разбор за 30 дней" meta={<span className="font-mono text-[11px] text-faint">по недавним матчам</span>} />
        {stats.byFaction.length === 0 && stats.byMap.length === 0 ? (
          <EmptyState title="За последние 30 дней матчей не было" hint="Разбор появится после ближайших боёв." />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <SliceTable title="По фракциям" slices={stats.byFaction} kind="faction" />
            <SliceTable title="По картам" slices={stats.byMap} kind="map" />
            <SliceTable title="По режимам" slices={stats.byMode} kind="mode" />
          </div>
        )}
      </section>

      {/* recent matches */}
      <section>
        <SectionHeader
          title="Последние матчи"
          meta={
            <Link href="/matches" className="tech-label transition-colors hover:!text-bluebright">
              все матчи
            </Link>
          }
        />
        <Panel padded={false}>
          <MatchList
            matches={recent}
            showPerspective
            emptyTitle="Недавних матчей нет"
            emptyHint="За последние 30 дней игрок не выходил в бой."
          />
        </Panel>
      </section>
    </div>
  );
}
