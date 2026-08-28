import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";
import { NumberRise } from "@/components/fx/NumberRise";
import { SignalAcquire } from "@/components/fx/SignalAcquire";
import { Countdown } from "@/components/live/Countdown";
import { MapThumb } from "@/components/ui/MapThumb";
import { ProgressBar, SeamShareBar } from "@/components/ui/bars";
import { Sparkline } from "@/components/ui/charts";
import { editionNumber } from "@/components/layout/SiteFooter";
import { factionRail, factionText, factionTextHi, factionVar, fieldFor } from "@/lib/factions";
import { orderByLight } from "@/lib/light";
import { cn } from "@/lib/cn";
import { durationShort, num, pct, relTime } from "@/lib/format";
import {
  catalogService,
  liveService,
  matchService,
  operationsService,
  playerService,
  sessionService,
  statsService,
} from "@/services";
import type { Faction, MatchSummary } from "@/types";

/**
 * «ЭФИР» — the broadcast desk. Zone order: ticker → hero scorebug →
 * mini-scorebug strip → feed+rail → podium → operational map band.
 * The seam appears at poster scale here and nowhere louder.
 */

async function factionIndex(): Promise<Map<string, Faction>> {
  const factions = await catalogService.factions();
  return new Map(factions.map((f) => [f.id, f]));
}

function sides(m: MatchSummary, fx: Map<string, Faction>) {
  const a = { faction: fx.get(m.factionAId)!, score: m.scoreA, won: m.winner === "A" };
  const b = { faction: fx.get(m.factionBId)!, score: m.scoreB, won: m.winner === "B" };
  return orderByLight(a, b);
}

/* ------------------------------------------------------------------ */
/* 6.1 Ticker                                                          */
/* ------------------------------------------------------------------ */

export async function Ticker() {
  const [snapshot, { matches }, fx, maps] = await Promise.all([
    liveService.snapshot(),
    matchService.list({ limit: 6 }),
    factionIndex(),
    catalogService.maps(),
  ]);
  const mapCode = (id: string) => maps.find((m) => m.id === id)?.code ?? "—";
  const lines = matches.map((m) => {
    const [l, r] = sides(m, fx);
    return `${mapCode(m.mapId)} · ${l.faction.code} ${l.score}:${r.score} ${r.faction.code}`;
  });
  lines.push(`${num(snapshot.matchesToday)} МАТЧЕЙ СЕГОДНЯ`, `${num(snapshot.activeClans)} АКТИВНЫХ КЛАНОВ`);
  const track = lines.join("   ///   ");
  return (
    <div className="relative z-[var(--z-ticker)] flex h-[28px] items-stretch overflow-hidden border-b border-line2 bg-carbon1">
      <p className="tele flex shrink-0 items-center border-r border-line2 bg-carbon0 px-3 text-[11.5px] font-medium text-ink">
        ЭФИР № {editionNumber()} · {num(snapshot.playersOnline)} В СЕТИ
      </p>
      <div className="ticker-viewport relative flex-1 overflow-hidden" aria-hidden>
        <div className="ticker-track tele items-center gap-0 py-[5px] text-[11.5px] text-dim">
          <span className="pr-12">{track}</span>
          <span className="pr-12">{track}</span>
        </div>
      </div>
      <p className="sr-only">{lines.slice(0, 3).join(". ")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6.2 Hero scorebug                                                   */
/* ------------------------------------------------------------------ */

export async function HeroScorebug() {
  const [{ matches }, fx, maps, modes] = await Promise.all([
    matchService.list({ limit: 1 }),
    factionIndex(),
    catalogService.maps(),
    catalogService.modes(),
  ]);
  const m = matches[0];
  if (!m) return null;
  const [l, r] = sides(m, fx);
  const map = maps.find((x) => x.id === m.mapId)!;
  const mode = modes.find((x) => x.id === m.modeId)!;

  return (
    <SignalAcquire>
      <section aria-label="Главный матч эфира">
        <Link
          href={`/matches/${m.id}`}
          className="group relative block overflow-hidden border-b border-line2"
        >
          <div className="relative grid min-h-[300px] grid-cols-1 lg:min-h-[420px] lg:grid-cols-[1fr_200px_1fr]">
            <div className="hero-scan" aria-hidden />
            {/* light fields: blue enters LEFT, red enters RIGHT */}
            <div className={cn("wipe-l pointer-events-none absolute inset-y-0 left-0 w-full lg:w-1/2", fieldFor(l.faction.colorToken, "l"))} aria-hidden />
            <div className={cn("wipe-r pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block", fieldFor(r.faction.colorToken, "r"))} aria-hidden />

            {/* left side */}
            <div className="relative flex flex-col justify-center gap-2 px-6 py-8 sm:px-10 lg:items-end lg:text-right">
              <p className={cn("display text-[22px] font-bold sm:text-[26px]", factionText[l.faction.colorToken])}>
                {l.faction.name}
              </p>
              <p
                data-text={l.score}
                className={cn(
                  "glitch-once display tnum text-[clamp(88px,11vw,168px)] font-black leading-[0.85]",
                  l.won ? "text-ink" : "text-dim",
                )}
              >
                {l.score}
              </p>
              {l.won ? <p className="tele text-[11px] font-bold text-ink">ПОБЕДА</p> : null}
            </div>

            {/* the seam and what rides it */}
            <div className="seam-v relative hidden lg:block">
              <div className="absolute left-1/2 top-1/2 z-10 w-[168px] -translate-x-1/2 -translate-y-1/2">
                <div className="bezel">
                  <div className="bezel-core p-2">
                    <MapThumb map={map} className="h-[84px] w-full" />
                    <p className="tele mt-2 text-center text-[11px] font-bold text-ink" translate="no">
                      {map.code}
                    </p>
                    <p className="tech-label mt-1 text-center">{mode.name}</p>
                    <p className="tnum mt-2 border-t border-line pt-2 text-center font-mono text-[11px] text-dim">
                      {durationShort(m.durationSec)} · {relTime(m.startedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* right side */}
            <div className="relative flex flex-col justify-center gap-2 border-t border-line px-6 py-8 sm:px-10 lg:border-t-0">
              <p className={cn("display text-[22px] font-bold sm:text-[26px]", factionText[r.faction.colorToken])}>
                {r.faction.name}
              </p>
              <p
                data-text={r.score}
                className={cn(
                  "glitch-once display tnum text-[clamp(88px,11vw,168px)] font-black leading-[0.85]",
                  r.won ? "text-ink" : "text-dim",
                )}
              >
                {r.score}
              </p>
              {r.won ? <p className="tele text-[11px] font-bold text-ink">ПОБЕДА</p> : null}
              <p className="tele mt-3 text-[10.5px] text-faint lg:hidden" translate="no">
                {map.code} · {mode.name} · {relTime(m.startedAt)}
              </p>
            </div>
          </div>

          {/* affordance plate + true-ratio share bar */}
          <div className="relative flex items-center justify-between border-t border-line bg-[rgba(5,7,11,0.5)] px-6 py-2.5 sm:px-10">
            <p className="tech-label">Матч-репорт · трансляция завершена</p>
            <p className="tele plate rounded-sm px-3 py-1.5 text-[10.5px] font-bold text-dim transition-colors group-hover:bg-[color:var(--layer-2)] group-hover:text-ink">
              СМОТРЕТЬ МАТЧ
            </p>
          </div>
          <SeamShareBar
            a={l.score}
            b={r.score}
            aColor={factionVar[l.faction.colorToken]}
            bColor={factionVar[r.faction.colorToken]}
          />
        </Link>
      </section>
    </SignalAcquire>
  );
}

/* ------------------------------------------------------------------ */
/* 6.3 Mini-scorebug strip                                             */
/* ------------------------------------------------------------------ */

export async function MiniScorebugs() {
  const [{ matches }, fx, maps] = await Promise.all([
    matchService.list({ limit: 4 }),
    factionIndex(),
    catalogService.maps(),
  ]);
  const strip = matches.slice(1, 4);
  if (strip.length === 0) return null;
  const mapCode = (id: string) => maps.find((m) => m.id === id)?.code ?? "—";
  return (
    <SignalAcquire>
      <section aria-label="Недавние матчи" className="stagger-acq grid grid-cols-1 gap-px border-y border-line bg-[color:var(--line-1)] sm:grid-cols-[1.2fr_1fr_1fr]">
      {strip.map((m) => {
        const [l, r] = sides(m, fx);
        return (
          <Link
            key={m.id}
            href={`/matches/${m.id}`}
            className="group flex h-[72px] flex-col justify-center gap-1.5 bg-carbon0 px-5 transition-colors hover:bg-[color:var(--layer-1)]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="tnum font-mono text-[13px] font-bold text-ink">
                <span className={factionTextHi[l.faction.colorToken]}>{l.faction.code}</span>
                <span className="mx-2">{l.score}:{r.score}</span>
                <span className={factionTextHi[r.faction.colorToken]}>{r.faction.code}</span>
              </p>
              <p className="tech-label" translate="no">
                {mapCode(m.mapId)}
              </p>
            </div>
            <SeamShareBar
              a={l.score}
              b={r.score}
              aColor={factionVar[l.faction.colorToken]}
              bColor={factionVar[r.faction.colorToken]}
              height={3}
            />
            <p className="tnum font-mono text-[10px] text-faint">{relTime(m.startedAt)}</p>
          </Link>
        );
      })}
      </section>
    </SignalAcquire>
  );
}

/* ------------------------------------------------------------------ */
/* 6.4 Operator rail: dossier + operations of the day                  */
/* ------------------------------------------------------------------ */

export async function OperatorRail() {
  const session = await sessionService.current();
  const [stats, { entries }, op] = await Promise.all([
    playerService.stats(session.player.id),
    playerService.leaderboard({ limit: 200 }),
    session.clan ? operationsService.currentForClan(session.clan.id) : Promise.resolve(null),
  ]);
  const rank = entries.find((e) => e.player.id === session.player.id)?.rank;
  const p = session.player;
  const done = op ? op.tasks.filter((t) => t.status === "done").length : 0;

  return (
    <div className="space-y-6">
      {/* dossier plate */}
      {stats ? (
        <div className="plate plate--cut rail-blue">
          <div className="flex items-center gap-3 border-b border-line px-5 py-3.5">
            <Avatar seed={p.id} label={p.username} tone="blue" size={40} />
            <div className="min-w-0">
              <p className="truncate font-mono text-[13px] font-bold text-ink" translate="no">
                {p.username}
                {session.clan ? <span className="ml-1.5 font-normal text-faint">[{session.clan.tag}]</span> : null}
              </p>
              <p className="tech-label mt-0.5">
                {p.rankTitle} · ур {p.level}
              </p>
            </div>
          </div>
          <div className="relative px-5 pb-3 pt-4">
            <div className="absolute inset-x-5 bottom-2 opacity-15">
              <Sparkline values={stats.ratingHistory.map((r) => r.rating)} tone="blue" width={240} height={56} className="w-full" />
            </div>
            <p className="tech-label">Рейтинг</p>
            <p className="display tnum relative mt-1 text-[44px] font-bold leading-none text-ink">
              <NumberRise value={p.rating} />
            </p>
            {rank ? <p className="tnum relative mt-1 font-mono text-[10.5px] text-faint">#{rank} в зачёте</p> : null}
          </div>
          <div className="tnum grid grid-cols-3 border-t border-line">
            <div className="border-r border-line px-5 py-3">
              <p className="tech-label">Победы</p>
              <p className="mt-1 font-mono text-[14px] font-bold text-ink">{pct(stats.winRate, 1)}</p>
            </div>
            <div className="border-r border-line px-5 py-3">
              <p className="tech-label">К-Д</p>
              <p className="mt-1 font-mono text-[14px] font-bold text-ink">{stats.kd.toFixed(2)}</p>
            </div>
            <div className="px-5 py-3">
              <p className="tech-label">Матчи</p>
              <p className="mt-1 font-mono text-[14px] font-bold text-ink">{num(stats.matches)}</p>
            </div>
          </div>
          <div className="border-t border-line p-3">
            <Link href="/profile" className="ctrl ctrl--primary pressable w-full justify-center">
              МОЁ ДОСЬЕ
            </Link>
          </div>
        </div>
      ) : null}

      {/* operations of the day */}
      <div className="plate">
        <div className="flex items-center justify-between gap-3 border-b border-line2 px-5 py-3">
          <h3 className="display text-[16px] font-bold text-ink">Операции дня</h3>
          {op ? (
            <span className="tnum font-mono text-[11px] text-faint">
              {done}/{op.tasks.length}
            </span>
          ) : null}
        </div>
        {!session.clan ? (
          <div className="px-5 py-6 text-center">
            <p className="tele text-[11.5px] font-bold text-dim">Вы не состоите в клане</p>
            <Link href="/clans" className="ctrl pressable mt-4">
              НАЙТИ КЛАН
            </Link>
          </div>
        ) : !op ? (
          <p className="px-5 py-6 text-center text-[12.5px] text-faint">Новая ротация в 00:00</p>
        ) : (
          <>
            <ol>
              {op.tasks.map((t, i) => {
                const isDone = t.status === "done";
                return (
                  <li key={t.id} className={cn("px-5 py-3", i > 0 && "border-t border-line")}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className={cn("font-mono text-[10.5px]", isDone ? "text-faint" : "text-dim")}>
                        {String(i + 1).padStart(2, "0")}
                      </p>
                      <p className={cn("tele flex-1 text-[11.5px] font-bold", isDone ? "text-dim line-through" : "text-ink")}>
                        {t.title}
                      </p>
                      <p className="tnum font-mono text-[11.5px]">
                        <span className={isDone ? "text-dim" : "text-ink"}>{t.progress}</span>
                        <span className="text-faint">/{t.total}</span>
                      </p>
                    </div>
                    <ProgressBar
                      value={t.progress}
                      total={t.total}
                      tone={isDone ? "success" : "red"}
                      className="mt-2"
                    />
                  </li>
                );
              })}
            </ol>
            <p className="tele border-t border-line px-5 py-2.5 text-[10.5px] text-dim">
              СБРОС ЧЕРЕЗ <Countdown until={op.expiresAt} />
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6.5 Podium strip                                                    */
/* ------------------------------------------------------------------ */

export async function PodiumStrip() {
  const [{ entries }, fx] = await Promise.all([
    playerService.leaderboard({ limit: 10 }),
    factionIndex(),
  ]);
  const [first, second, third, ...rest] = entries;
  if (!first) return null;

  const podium = (e: typeof first, rank: number, big: boolean) => {
    const f = fx.get(e.player.factionId)!;
    return (
      <Link
        key={e.player.id}
        href={`/players/${e.player.id}`}
        className={cn(
          "plate group relative flex min-h-[168px] flex-col justify-end overflow-hidden p-5 transition-colors hover:bg-[color:var(--layer-2)]",
          factionRail[f.colorToken],
          big && fieldFor(f.colorToken, "l"),
        )}
      >
        <p
          aria-hidden
          className={cn(
            "ghost-num display pointer-events-none absolute right-3 top-1 font-black text-ink",
            big ? "text-[104px] opacity-[0.12]" : "text-[56px] opacity-10",
          )}
        >
          {rank}
        </p>
        <p className="tech-label">#{rank} · {f.code}</p>
        <p className={cn("display mt-1 font-bold text-ink", big ? "text-[30px]" : "text-[19px]")} translate="no">
          {e.player.username}
        </p>
        <p className={cn("display tnum mt-2 font-bold", big ? "text-[32px] text-ink" : "text-[22px] text-dim")}>
          {num(e.player.rating)}
        </p>
        <p className="tnum mt-1 font-mono text-[10.5px] text-faint">
          {pct(e.stats.winRate, 1)} побед · {num(e.stats.matches)} матчей
        </p>
      </Link>
    );
  };

  return (
    <section aria-label="Лидеры недели">
      <div className="mb-4 flex items-baseline gap-4">
        <h2 className="display text-[24px] font-bold text-ink">
          <span className="glitch-title" data-text="Лидеры недели">Лидеры недели</span>
        </h2>
        <div className="min-w-6 flex-1 self-center border-t border-line2" aria-hidden />
        <Link href="/players" className="tele text-[10.5px] text-dim transition-colors hover:text-ink">
          ПОЛНЫЙ РЕЙТИНГ
        </Link>
      </div>
      <div className="stagger grid grid-cols-1 gap-3 sm:grid-cols-[2fr_1fr_1fr]">
        {podium(first, 1, true)}
        {second ? podium(second, 2, false) : null}
        {third ? podium(third, 3, false) : null}
      </div>
      {rest.length > 0 ? (
        <ol className="plate stagger mt-3">
          {rest.map((e, i) => {
            const f = fx.get(e.player.factionId)!;
            return (
              <li key={e.player.id} className={cn("relative", i > 0 && "border-t border-line")}>
                <Link
                  href={`/players/${e.player.id}`}
                  className="grid h-[36px] grid-cols-[44px_1fr_auto_auto] items-center gap-4 px-4 transition-colors hover:bg-[color:var(--layer-2)]"
                >
                  <span className="tnum font-mono text-[11.5px] text-faint">{e.rank}</span>
                  <span className="truncate font-mono text-[12.5px] font-medium text-ink" translate="no">
                    {e.player.username}
                  </span>
                  <span className={cn("tele hidden text-[10px] font-bold sm:inline", factionTextHi[f.colorToken])}>
                    {f.code}
                  </span>
                  <span className="tnum font-mono text-[12.5px] font-bold text-ink">{num(e.player.rating)}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      ) : null}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 6.6 Map of the week: the operational surface                        */
/* ------------------------------------------------------------------ */

function markerPos(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  h = Math.abs(h);
  return { x: 15 + (h % 71), y: 25 + (Math.floor(h / 97) % 51) };
}

export async function MapOfWeek() {
  const [global, mapStats, maps, fx] = await Promise.all([
    statsService.global(),
    statsService.maps(),
    catalogService.maps(),
    factionIndex(),
  ]);
  const topMap = maps.find((m) => m.id === global.mostPlayedMapId)!;
  const s = mapStats.find((m) => m.mapId === topMap.id)!;
  const { matches } = await matchService.list({ mapId: topMap.id, limit: 3 });

  const placed: { x: number; y: number }[] = [];
  const markers = matches.map((m) => {
    const pos = markerPos(m.id);
    while (placed.some((p) => Math.abs(p.x - pos.x) < 12 && Math.abs(p.y - pos.y) < 14)) pos.x = (pos.x + 14) % 86;
    placed.push(pos);
    const [l, r] = sides(m, fx);
    return { m, pos, l, r };
  });

  return (
    <section aria-label="Карта недели">
      <div className="mb-4 flex items-baseline gap-4">
        <h2 className="display text-[24px] font-bold text-ink">
          <span className="glitch-title" data-text="Карта недели">Карта недели</span>
        </h2>
        <div className="min-w-6 flex-1 self-center border-t border-line2" aria-hidden />
        <Link href="/maps" className="tele text-[10.5px] text-dim transition-colors hover:text-ink">
          ВСЕ КАРТЫ
        </Link>
      </div>
      <div className="relative min-h-[220px] overflow-hidden border-y border-line2">
        {/* enlarged linework under a duotone wash */}
        <div className="absolute inset-0 opacity-60" aria-hidden>
          <MapThumb map={topMap} className="h-full w-full scale-125 opacity-30" />
        </div>
        <div className="field-blue pointer-events-none absolute inset-y-0 left-0 w-1/2" aria-hidden />
        <div className="field-red pointer-events-none absolute inset-y-0 right-0 w-1/2" aria-hidden />

        <div className="relative flex min-h-[220px] flex-col justify-end p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="tech-label">{topMap.setting}</p>
              <Link
                href={`/maps/${topMap.id}`}
                className="display mt-1 inline-block text-[clamp(34px,4vw,56px)] font-bold text-ink transition-colors hover:text-[color:var(--police-hi)]"
                translate="no"
              >
                {topMap.name}
              </Link>
            </div>
            <p className="tnum text-right font-mono text-[11.5px] leading-relaxed text-dim">
              {num(s.matches)} матчей · ~{durationShort(s.avgDurationSec)}
              <br />в среднем {num(s.avgPlayers)} бойцов
            </p>
          </div>
        </div>

        {/* live match markers (≥1024px) */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          {markers.map(({ m, pos, l, r }) => (
            <Link
              key={m.id}
              href={`/matches/${m.id}`}
              className="group pointer-events-auto absolute flex min-h-[44px] min-w-[44px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              aria-label={`Матч ${l.score}:${r.score}, смотреть репорт`}
            >
              <span className="flex gap-[2px]" aria-hidden>
                <span
                  className="size-[4px] transition-shadow group-hover:shadow-[0_0_8px_var(--police)]"
                  style={{ background: factionVar[l.faction.colorToken] }}
                />
                <span
                  className="size-[4px] transition-shadow group-hover:shadow-[0_0_8px_var(--hazard)]"
                  style={{ background: factionVar[r.faction.colorToken] }}
                />
              </span>
              <span className="tele text-[10px] font-medium text-dim transition-colors group-hover:text-ink">
                {l.score}:{r.score}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
