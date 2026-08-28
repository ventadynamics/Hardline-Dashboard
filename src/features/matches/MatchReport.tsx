import Link from "next/link";
import { notFound } from "next/navigation";
import { FactionTag } from "@/components/ui/badges";
import { MapThumb } from "@/components/ui/MapThumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/cn";
import { factionBg, factionText } from "@/lib/factions";
import { clock, dateTime, durationShort, num } from "@/lib/format";
import { catalogService, clanService, matchService, playerService } from "@/services";
import type { Faction, Match, MatchTeam, Unit } from "@/types";

/* mirrored A-vs-B comparison bar */
function CompareRow({
  label,
  a,
  b,
  fa,
  fb,
  format = num,
}: {
  label: string;
  a: number;
  b: number;
  fa: Faction;
  fb: Faction;
  format?: (n: number) => string;
}) {
  const max = Math.max(a, b, 1);
  return (
    <div className="grid grid-cols-[1fr_150px_1fr] items-center gap-3 py-[7px] sm:grid-cols-[1fr_180px_1fr]">
      <div className="flex items-center justify-end gap-3">
        <span className="tnum font-mono text-[12.5px] text-ink">{format(a)}</span>
        <div className="h-[4px] w-full max-w-[220px]">
          <div className={cn("ml-auto h-full", factionBg[fa.colorToken])} style={{ width: `${(a / max) * 100}%`, opacity: a >= b ? 0.95 : 0.45 }} />
        </div>
      </div>
      <p className="tech-label text-center">{label}</p>
      <div className="flex items-center gap-3">
        <div className="h-[4px] w-full max-w-[220px]">
          <div className={cn("h-full", factionBg[fb.colorToken])} style={{ width: `${(b / max) * 100}%`, opacity: b >= a ? 0.95 : 0.45 }} />
        </div>
        <span className="tnum font-mono text-[12.5px] text-ink">{format(b)}</span>
      </div>
    </div>
  );
}

async function TeamScoreboard({
  team,
  faction,
  won,
  clanName,
}: {
  team: MatchTeam;
  faction: Faction;
  won: boolean;
  clanName: string | null;
}) {
  const { entries } = await playerService.leaderboard({ limit: 500 });
  const name = (id: string) => entries.find((e) => e.player.id === id)?.player.username ?? id;
  return (
    <div className="frame">
      <div>
        <header className="flex items-center justify-between gap-3 border-b border-line2 bg-raised px-3.5 py-2.5">
          <div className="flex items-center gap-3">
            <FactionTag faction={faction} full />
            {clanName ? (
              <Link
                href={`/clans/${team.clanId}`}
                className="font-mono text-[11.5px] text-faint transition-colors hover:text-bluebright"
              >
                {clanName}
              </Link>
            ) : (
              <span className="font-mono text-[11.5px] text-faint">сборная</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {won && (
              <span className="tele rounded-sm border border-[rgba(232,238,247,0.35)] bg-[rgba(232,238,247,0.07)] px-1.5 py-[2px] text-[10px] font-bold text-success">
                ПОБЕДИТЕЛЬ
              </span>
            )}
            <span className="tnum font-mono text-[18px] font-bold leading-none text-ink">{team.score}</span>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Игрок</th>
                <th className="!text-right">Счёт</th>
                <th className="!text-right">Унич.</th>
                <th className="!text-right">Потер.</th>
                <th className="!text-right">Сод.</th>
                <th className="!text-right">Точки</th>
              </tr>
            </thead>
            <tbody>
              {team.rows.map((r) => (
                <tr key={r.playerId}>
                  <td>
                    <Link href={`/players/${r.playerId}`} className="font-medium text-ink transition-colors hover:text-bluebright">
                      {name(r.playerId)}
                    </Link>
                  </td>
                  <td className="num font-semibold text-ink">{num(r.score)}</td>
                  <td className="num text-dim">{r.kills}</td>
                  <td className="num text-dim">{r.deaths}</td>
                  <td className="num text-dim">{r.assists}</td>
                  <td className="num text-dim">{num(r.objectiveScore)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function UnitUsageTable({ team, units, faction }: { team: MatchTeam; units: Unit[]; faction: Faction }) {
  const unit = (id: string) => units.find((u) => u.id === id);
  return (
    <div className="frame">
      <header className="flex items-center justify-between border-b border-line2 bg-[color:var(--layer-1)] px-3.5 py-2">
        <FactionTag faction={faction} />
        <span className="tech-label">состав и потери</span>
      </header>
      <table className="data-table">
        <thead>
          <tr>
            <th>Юнит</th>
            <th className="!text-right">Введено</th>
            <th className="!text-right">Потеряно</th>
            <th className="!text-right">Уничтожил</th>
          </tr>
        </thead>
        <tbody>
          {team.unitUsage.map((u) => (
            <tr key={u.unitId}>
              <td>
                <Link href={`/units/${u.unitId}`} className="text-[12.5px] text-ink transition-colors hover:text-bluebright">
                  {unit(u.unitId)?.name ?? u.unitId}
                </Link>
              </td>
              <td className="num text-dim">{u.deployed}</td>
              <td className="num text-dim">{u.lost}</td>
              <td className="num text-dim">{u.kills}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function MatchReport({ matchId }: { matchId: string }) {
  const match: Match | null = await matchService.byId(matchId);
  if (!match) notFound();
  const [factions, maps, modes, units, clans] = await Promise.all([
    catalogService.factions(),
    catalogService.maps(),
    catalogService.modes(),
    catalogService.units(),
    clanService.leaderboard(),
  ]);
  const [teamA, teamB] = match.teams;
  const fa = factions.find((f) => f.id === teamA.factionId)!;
  const fb = factions.find((f) => f.id === teamB.factionId)!;
  const map = maps.find((m) => m.id === match.mapId)!;
  const mode = modes.find((m) => m.id === match.modeId)!;
  const clanName = (id: string | null) => {
    const c = clans.find((x) => x.clan.id === id)?.clan;
    return c ? `[${c.tag}] ${c.name}` : null;
  };
  const aWon = match.winner === "A";
  const bWon = match.winner === "B";

  return (
    <div className="mx-auto max-w-[1400px] space-y-10 px-4 py-8 sm:px-6">
      {/* report head */}
      <section className="frame">
        <div className="relative">
          <div className="hero-light" aria-hidden />
          <div className="relative grid grid-cols-1 items-center gap-6 p-5 lg:grid-cols-[1.1fr_auto_1fr] lg:gap-10">
            <div>
              <p className="tech-label">Матч-репорт · {dateTime(match.startedAt)}</p>
              <h1 className="display mt-1.5 text-[30px] font-semibold leading-none text-ink">
                {map.name}
              </h1>
              <p className="mt-2 text-[13px] text-dim">
                {mode.name} · {durationShort(match.durationSec)} · {map.setting}
              </p>
            </div>
            <div className="justify-self-start lg:justify-self-center">
              <div className="flex items-center gap-5">
                <div className="text-right">
                  <p className={cn("display text-[15px] font-semibold", factionText[fa.colorToken])}>
                    {fa.name}
                  </p>
                  {aWon && <p className="tech-label !text-success">победа</p>}
                </div>
                <p className="tnum font-mono text-[40px] font-bold leading-none text-ink">
                  {teamA.score}
                  <span className="mx-2 text-[26px] text-faint">:</span>
                  {teamB.score}
                </p>
                <div>
                  <p className={cn("display text-[15px] font-semibold", factionText[fb.colorToken])}>
                    {fb.name}
                  </p>
                  {bWon && <p className="tech-label !text-success">победа</p>}
                </div>
              </div>
              {match.winner === "draw" && <p className="tech-label mt-1 text-center">ничья</p>}
            </div>
            <Link href={`/maps/${map.id}`} className="group hidden justify-self-end lg:block">
              <MapThumb map={map} className="h-[110px] w-[196px] opacity-85 transition-opacity group-hover:opacity-100" />
            </Link>
          </div>
        </div>
      </section>

      {/* scoreboards */}
      <section aria-label="Составы и счёт">
        <SectionHeader title="Составы" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <TeamScoreboard team={teamA} faction={fa} won={aWon} clanName={clanName(teamA.clanId)} />
          <TeamScoreboard team={teamB} faction={fb} won={bWon} clanName={clanName(teamB.clanId)} />
        </div>
      </section>

      {/* RTS comparison */}
      <section aria-label="Показатели сторон">
        <SectionHeader title="Показатели сторон" accent="red" />
        <div className="frame">
          <div className="px-4 py-3">
            <div className="mb-1 grid grid-cols-[1fr_150px_1fr] gap-3 sm:grid-cols-[1fr_180px_1fr]">
              <p className={cn("display text-right text-[12.5px] font-semibold", factionText[fa.colorToken])}>
                {fa.code}
              </p>
              <span />
              <p className={cn("display text-[12.5px] font-semibold", factionText[fb.colorToken])}>
                {fb.code}
              </p>
            </div>
            <CompareRow label="Юниты введены" a={teamA.rts.unitsDeployed} b={teamB.rts.unitsDeployed} fa={fa} fb={fb} />
            <CompareRow label="Юниты потеряны" a={teamA.rts.unitsLost} b={teamB.rts.unitsLost} fa={fa} fb={fb} />
            <CompareRow label="Техника введена" a={teamA.rts.vehiclesDeployed} b={teamB.rts.vehiclesDeployed} fa={fa} fb={fb} />
            <CompareRow label="Техника потеряна" a={teamA.rts.vehiclesLost} b={teamB.rts.vehiclesLost} fa={fa} fb={fb} />
            <CompareRow label="Точки захвачены" a={teamA.rts.objectivesCaptured} b={teamB.rts.objectivesCaptured} fa={fa} fb={fb} />
            <CompareRow label="Урон нанесён" a={teamA.rts.damageDealt} b={teamB.rts.damageDealt} fa={fa} fb={fb} />
            <CompareRow label="Ресурсы потрачены" a={teamA.rts.resourcesSpent} b={teamB.rts.resourcesSpent} fa={fa} fb={fb} />
            <CompareRow label="Подкрепления" a={teamA.rts.reinforcements} b={teamB.rts.reinforcements} fa={fa} fb={fb} />
          </div>
        </div>
      </section>

      {/* unit usage */}
      <section aria-label="Юниты сторон">
        <SectionHeader title="Юниты сторон" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UnitUsageTable team={teamA} units={units} faction={fa} />
          <UnitUsageTable team={teamB} units={units} faction={fb} />
        </div>
      </section>

      {/* timeline */}
      <section aria-label="Хроника матча">
        <SectionHeader title="Хроника матча" accent="red" />
        <div className="frame">
          <div>
            <ol>
              {match.timeline.map((e, i) => {
                const f = factions.find((x) => x.id === e.factionId)!;
                return (
                  <li
                    key={i}
                    className={cn(
                      "flex items-center gap-3.5 px-4 py-[8px]",
                      i > 0 && "border-t border-line",
                    )}
                  >
                    <span className="tnum w-[46px] shrink-0 font-mono text-[12px] text-faint">{clock(e.atSec)}</span>
                    <span aria-hidden className={cn("h-[10px] w-[3px] shrink-0", factionBg[f.colorToken])} />
                    <span className="text-[13px] text-ink">{e.text}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
    </div>
  );
}
