import Link from "next/link";
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
 * Cinematic dispatch hero: poster-scale headline under the red/blue city
 * light, the operator card on the right flank, live telemetry running
 * along the base. Sections stream below in one column.
 */

const dateFmt = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  weekday: "long",
});

export async function HeroConsole() {
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
      <section className="frame cut relative" aria-label="Оперативная сводка">
        <div className="hero-light" aria-hidden />
        <div className="relative grid grid-cols-1 gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-14">
          {/* headline */}
          <div data-fx className="flex flex-col justify-center">
            <p className="kicker">{today} / mock-data</p>
            <h1 className="display mt-3 text-[clamp(52px,7vw,96px)] font-semibold text-ink">
              Оперативная
              <br />
              сводка
            </h1>
            <p className="mt-5 max-w-[52ch] text-pretty text-[14px] leading-relaxed text-dim">
              Живая телеметрия Hardline: рейтинги и кланы, операции дня и полные
              матч-репорты войны за город — в одном оперативном узле.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn href="/profile" variant="primary">
                МОЙ ПРОФИЛЬ
              </Btn>
              <Btn href="/matches" variant="ghost">
                СМОТРЕТЬ МАТЧИ
              </Btn>
            </div>
          </div>

          {/* operator card */}
          {stats ? (
            <div data-fx className="frame edge-blue self-center bg-[rgba(6,8,12,0.55)]">
              <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
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
              <div className="flex items-end justify-between gap-3 px-5 pb-1 pt-4">
                <div>
                  <p className="tech-label">Рейтинг</p>
                  <p className="display tnum mt-1 text-[44px] font-semibold leading-none text-ink">
                    {num(p.rating)}
                  </p>
                </div>
                {rank ? (
                  <p className="tnum pb-1 font-mono text-[10.5px] text-faint">#{rank} в зачёте</p>
                ) : null}
              </div>
              <div className="px-5 pb-4">
                <Sparkline
                  values={stats.ratingHistory.map((r) => r.rating)}
                  tone="blue"
                  width={280}
                  height={36}
                  className="w-full"
                />
              </div>
              <div className="tnum grid grid-cols-3 border-t border-line">
                <div className="border-r border-line px-5 py-3">
                  <p className="tech-label">Победы</p>
                  <p className="mt-1 font-mono text-[14px] font-bold text-ink">{pct(stats.winRate)}</p>
                </div>
                <div className="border-r border-line px-5 py-3">
                  <p className="tech-label">K/D</p>
                  <p className="mt-1 font-mono text-[14px] font-bold text-ink">{stats.kd.toFixed(2)}</p>
                </div>
                <div className="px-5 py-3">
                  <p className="tech-label">Матчи</p>
                  <p className="mt-1 font-mono text-[14px] font-bold text-ink">{num(stats.matches)}</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* live telemetry along the base */}
        <div data-fx className="relative border-t border-line2 bg-[rgba(6,8,12,0.45)] px-5">
          <LiveTicker initial={snapshot} layout="row" />
        </div>
      </section>
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
        accent="blue"
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
        <MapThumb
          map={topMap}
          className="h-[168px] w-full opacity-90 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="flex items-end justify-between gap-3 border-t border-line2 px-4 py-3">
          <div>
            <p className="display text-[19px] font-semibold leading-none text-ink transition-colors group-hover:text-bluebright">
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
