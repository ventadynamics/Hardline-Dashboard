import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { IntroFx } from "@/components/fx/IntroFx";
import { LiveTicker } from "@/components/live/LiveTicker";
import { MapThumb } from "@/components/ui/MapThumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Sparkline } from "@/components/ui/charts";
import { HBar } from "@/components/ui/bars";
import { Btn } from "@/components/ui/Btn";
import { factionText } from "@/lib/factions";
import { durationShort, num, pct } from "@/lib/format";
import {
  catalogService,
  liveService,
  playerService,
  sessionService,
  statsService,
} from "@/services";

/**
 * Split-console home. The left command column holds identity, the operator
 * card and live telemetry; the right side is the data stream.
 */

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  weekday: "long",
});

export async function LeftConsole() {
  const [session, snapshot] = await Promise.all([sessionService.current(), liveService.snapshot()]);
  const [stats, { entries }] = await Promise.all([
    playerService.stats(session.player.id),
    playerService.leaderboard({ limit: 200 }),
  ]);
  const rank = entries.find((e) => e.player.id === session.player.id)?.rank;
  const p = session.player;
  const today = dateFmt.format(new Date());

  return (
    <IntroFx>
      <div className="space-y-6 lg:sticky lg:top-[78px]">
        {/* console head */}
        <div data-fx>
          <div className="rule-red" aria-hidden />
          <h1 className="display mt-3 text-[30px] font-black leading-[0.95] text-ink">
            ОПЕРАТИВНАЯ
            <br />
            СВОДКА
          </h1>
          <p className="tech-label mt-2.5">{today} / mock-data</p>
        </div>

        {/* operator card */}
        {stats ? (
          <div data-fx className="frame">
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Avatar seed={p.id} tone="blue" size={40} />
              <div className="min-w-0">
                <p className="truncate font-mono text-[13.5px] font-bold text-ink">
                  {p.username}
                  {session.clan ? (
                    <Link
                      href={`/clans/${session.clan.id}`}
                      className="ml-2 font-normal text-faint transition-colors hover:text-bluebright"
                    >
                      [{session.clan.tag}]
                    </Link>
                  ) : null}
                </p>
                <p className="tech-label mt-0.5">
                  {p.rankTitle} / ур {p.level}
                </p>
              </div>
            </div>
            <div className="flex items-end justify-between gap-3 px-4 pb-1 pt-3">
              <div>
                <p className="tech-label">Рейтинг</p>
                <p className="display tnum mt-1 text-[38px] font-black leading-none text-ink">
                  {num(p.rating)}
                </p>
              </div>
              {rank ? <p className="tnum pb-1 font-mono text-[10.5px] text-faint">#{rank} в зачёте</p> : null}
            </div>
            <div className="px-4 pb-3">
              <Sparkline values={stats.ratingHistory.map((r) => r.rating)} tone="blue" width={280} height={34} className="w-full" />
            </div>
            <div className="tnum grid grid-cols-3 border-t border-line">
              <div className="border-r border-line px-4 py-2.5">
                <p className="tech-label">Победы</p>
                <p className="mt-1 font-mono text-[14px] font-bold text-ink">{pct(stats.winRate)}</p>
              </div>
              <div className="border-r border-line px-4 py-2.5">
                <p className="tech-label">K/D</p>
                <p className="mt-1 font-mono text-[14px] font-bold text-ink">{stats.kd.toFixed(2)}</p>
              </div>
              <div className="px-4 py-2.5">
                <p className="tech-label">Матчи</p>
                <p className="mt-1 font-mono text-[14px] font-bold text-ink">{num(stats.matches)}</p>
              </div>
            </div>
            <div className="border-t border-line p-3">
              <Btn href="/profile" variant="primary" className="w-full justify-center">
                МОЙ ПРОФИЛЬ
              </Btn>
            </div>
          </div>
        ) : null}

        {/* live telemetry stack */}
        <div data-fx className="frame">
          <header className="flex items-center justify-between border-b border-line2 bg-raised px-4 py-2">
            <h2 className="tele text-[11px] font-bold text-ink">Телеметрия</h2>
            <Link href="/matches" className="tele text-[9.5px] text-faint transition-colors hover:text-ink">
              матчи
            </Link>
          </header>
          <LiveTicker initial={snapshot} layout="stack" />
        </div>

        {/* community */}
        <div data-fx>
          <a
            href="#"
            className="ctrl pressable flex items-center justify-between px-4 py-[10px] text-[11px] font-medium"
          >
            Discord сообщества
            <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </IntroFx>
  );
}

/** Faction win rates + core game numbers. */
export async function GameSummaryBlock() {
  const [global, factions, units] = await Promise.all([
    statsService.global(),
    catalogService.factions(),
    catalogService.units(),
  ]);
  const topUnit = units.find((u) => u.id === global.mostUsedUnitId)!;
  const popFaction = factions.find((f) => f.id === global.mostPopularFactionId)!;
  const maxWr = Math.max(...global.factionWinRates.map((f) => f.winRate));
  return (
    <section aria-label="Сводка по игре">
      <SectionHeader
        title="Сводка по игре"
        meta={
          <Link href="/statistics" className="transition-colors hover:text-ink">
            вся статистика
          </Link>
        }
      />
      <div className="frame p-4">
        <p className="tech-label mb-1">Победы фракций</p>
        {global.factionWinRates.map((f) => {
          const fac = factions.find((x) => x.id === f.factionId)!;
          return (
            <HBar
              key={f.factionId}
              label={fac.name}
              value={f.winRate}
              max={maxWr}
              display={pct(f.winRate)}
              tone={fac.colorToken === "blue" ? "blue" : fac.colorToken === "red" ? "red" : "olive"}
            />
          );
        })}
        <div className="tnum grid-seam mt-4 grid-cols-2">
          <div className="px-3 py-2.5">
            <p className="tech-label">Средний матч</p>
            <p className="mt-1 font-mono text-[14px] font-bold text-ink">
              {durationShort(global.avgMatchDurationSec)}
            </p>
          </div>
          <div className="px-3 py-2.5">
            <p className="tech-label">Матчей сегодня</p>
            <p className="mt-1 font-mono text-[14px] font-bold text-ink">{num(global.matchesToday)}</p>
          </div>
          <div className="px-3 py-2.5">
            <p className="tech-label">Популярная фракция</p>
            <p className={`tele mt-1 text-[11.5px] font-bold ${factionText[popFaction.colorToken]}`}>
              {popFaction.name}
            </p>
          </div>
          <div className="px-3 py-2.5">
            <p className="tech-label">Топ-юнит</p>
            <Link
              href={`/units/${topUnit.id}`}
              className="tele mt-1 inline-block text-[11.5px] font-bold text-ink transition-colors hover:text-bluebright"
            >
              {topUnit.name}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Most played map of the period. */
export async function MapOfPeriodBlock() {
  const [global, mapStats, maps] = await Promise.all([
    statsService.global(),
    statsService.maps(),
    catalogService.maps(),
  ]);
  const topMap = maps.find((m) => m.id === global.mostPlayedMapId)!;
  const s = mapStats.find((m) => m.mapId === topMap.id)!;
  return (
    <section aria-label="Карта недели">
      <SectionHeader
        title="Карта недели"
        meta={
          <Link href="/maps" className="transition-colors hover:text-ink">
            все карты
          </Link>
        }
      />
      <Link href={`/maps/${topMap.id}`} className="frame group block">
        <MapThumb map={topMap} className="h-[168px] w-full opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="flex items-end justify-between gap-3 border-t border-line2 px-3.5 py-3">
          <div>
            <p className="display text-[16px] font-bold leading-none text-ink transition-colors group-hover:text-bluebright">
              {topMap.name}
            </p>
            <p className="tech-label mt-1.5">{topMap.setting}</p>
          </div>
          <p className="tnum text-right font-mono text-[10px] leading-relaxed text-dim">
            {num(s.matches)} матчей
            <br />~{durationShort(s.avgDurationSec)}
          </p>
        </div>
      </Link>
    </section>
  );
}
