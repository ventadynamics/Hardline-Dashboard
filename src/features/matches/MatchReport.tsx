import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Reveal } from "@/components/ui/Reveal";
import { FactionTag } from "@/components/ui/badges";
import { MapThumb } from "@/components/ui/MapThumb";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SeamShareBar } from "@/components/ui/bars";
import { cn } from "@/lib/cn";
import { factionRail, factionText, factionTextHi, factionVar, fieldFor } from "@/lib/factions";
import { orderByLight } from "@/lib/light";
import { clock, dateTime, durationShort, num } from "@/lib/format";
import { catalogService, clanService, matchService, playerService } from "@/services";
import type { Faction, Match, MatchTeam, Unit } from "@/types";

type Side = { faction: Faction; team: MatchTeam; won: boolean };

/* butterfly row: bars extend from the center, deployed vs lost at 40% */
function ButterflyRow({
  label,
  l,
  r,
  lColor,
  rColor,
  max,
}: {
  label: string;
  l: number;
  r: number;
  lColor: string;
  rColor: string;
  max: number;
}) {
  return (
    <div className="grid grid-cols-[1fr_150px_1fr] items-center gap-3 py-[7px] sm:grid-cols-[1fr_180px_1fr]">
      <div className="flex items-center justify-end gap-3">
        <span className="tnum font-mono text-[12.5px] font-medium text-ink">{num(l)}</span>
        <div className="h-[14px] w-full max-w-[240px]">
          <div
            className="ml-auto h-full"
            style={{ width: `${(l / max) * 100}%`, background: lColor, opacity: l >= r ? 0.9 : 0.45 }}
          />
        </div>
      </div>
      <p className="tech-label text-center">{label}</p>
      <div className="flex items-center gap-3">
        <div className="h-[14px] w-full max-w-[240px]">
          <div
            className="h-full"
            style={{ width: `${(r / max) * 100}%`, background: rColor, opacity: r >= l ? 0.9 : 0.45 }}
          />
        </div>
        <span className="tnum font-mono text-[12.5px] font-medium text-ink">{num(r)}</span>
      </div>
    </div>
  );
}

async function TeamSheet({
  side,
  flank,
  clanName,
}: {
  side: Side;
  flank: "l" | "r";
  clanName: string | null;
}) {
  const { entries } = await playerService.leaderboard({ limit: 500 });
  const name = (id: string) => entries.find((e) => e.player.id === id)?.player.username ?? id;
  return (
    <div className={cn("plate", factionRail[side.faction.colorToken])}>
      <header
        className={cn(
          "flex items-center justify-between gap-3 border-b border-line2 px-4 py-2.5",
          fieldFor(side.faction.colorToken, flank),
        )}
      >
        <div className="flex items-center gap-3">
          <FactionTag faction={side.faction} full />
          {clanName ? (
            <Link
              href={`/clans/${side.team.clanId}`}
              className="font-mono text-[11.5px] text-faint transition-colors hover:text-ink"
            >
              {clanName}
            </Link>
          ) : (
            <span className="font-mono text-[11.5px] text-faint">сборная</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {side.won && <span className="tele text-[10.5px] font-bold text-ink">ПОБЕДИТЕЛЬ</span>}
          <span className="display tnum text-[22px] font-bold leading-none text-ink">{side.team.score}</span>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Оперативник</th>
              <th className="!text-right">Счёт</th>
              <th className="!text-right">Унич.</th>
              <th className="!text-right">Потер.</th>
              <th className="!text-right">Сод.</th>
              <th className="!text-right">Точки</th>
            </tr>
          </thead>
          <tbody>
            {side.team.rows.map((r) => (
              <tr key={r.playerId}>
                <td>
                  <Link
                    href={`/players/${r.playerId}`}
                    className="font-mono text-[12.5px] font-medium text-ink transition-colors hover:text-[color:var(--police-hi)]"
                    translate="no"
                  >
                    {name(r.playerId)}
                  </Link>
                </td>
                <td className="num !font-bold text-ink">{num(r.score)}</td>
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
  );
}

function UnitUsageTable({ side, units }: { side: Side; units: Unit[] }) {
  const unit = (id: string) => units.find((u) => u.id === id);
  return (
    <div className={cn("plate", factionRail[side.faction.colorToken])}>
      <header className="flex items-center justify-between border-b border-line2 px-4 py-2">
        <FactionTag faction={side.faction} />
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
          {side.team.unitUsage.map((u) => (
            <tr key={u.unitId}>
              <td>
                <Link href={`/units/${u.unitId}`} className="text-[12.5px] text-ink transition-colors hover:text-[color:var(--police-hi)]">
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
  const [factions, maps, modes, units, clans, { entries }] = await Promise.all([
    catalogService.factions(),
    catalogService.maps(),
    catalogService.modes(),
    catalogService.units(),
    clanService.leaderboard(),
    playerService.leaderboard({ limit: 500 }),
  ]);
  const [teamA, teamB] = match.teams;
  const map = maps.find((m) => m.id === match.mapId)!;
  const mode = modes.find((m) => m.id === match.modeId)!;
  const [l, r] = orderByLight<Side>(
    { faction: factions.find((f) => f.id === teamA.factionId)!, team: teamA, won: match.winner === "A" },
    { faction: factions.find((f) => f.id === teamB.factionId)!, team: teamB, won: match.winner === "B" },
  );
  const clanName = (id: string | null) => {
    const c = clans.find((x) => x.clan.id === id)?.clan;
    return c ? `[${c.tag}] ${c.name}` : null;
  };
  const lVar = factionVar[l.faction.colorToken];
  const rVar = factionVar[r.faction.colorToken];

  /* MVP: the highest score across both sheets — real data */
  const allRows = [...teamA.rows, ...teamB.rows];
  const mvp = allRows.reduce((a, b) => (b.score > a.score ? b : a), allRows[0]);
  const mvpName = entries.find((e) => e.player.id === mvp?.playerId)?.player.username ?? mvp?.playerId;
  const mvpFaction = teamA.rows.includes(mvp)
    ? factions.find((f) => f.id === teamA.factionId)!
    : factions.find((f) => f.id === teamB.factionId)!;

  const rts: { label: string; l: number; r: number }[] = [
    { label: "Юниты введены", l: l.team.rts.unitsDeployed, r: r.team.rts.unitsDeployed },
    { label: "Юниты потеряны", l: l.team.rts.unitsLost, r: r.team.rts.unitsLost },
    { label: "Техника введена", l: l.team.rts.vehiclesDeployed, r: r.team.rts.vehiclesDeployed },
    { label: "Техника потеряна", l: l.team.rts.vehiclesLost, r: r.team.rts.vehiclesLost },
    { label: "Точки захвачены", l: l.team.rts.objectivesCaptured, r: r.team.rts.objectivesCaptured },
    { label: "Урон нанесён", l: l.team.rts.damageDealt, r: r.team.rts.damageDealt },
    { label: "Ресурсы потрачены", l: l.team.rts.resourcesSpent, r: r.team.rts.resourcesSpent },
    { label: "Подкрепления", l: l.team.rts.reinforcements, r: r.team.rts.reinforcements },
  ];

  return (
    <div className="pb-4">
      {/* final scorebug masthead */}
      <section aria-label="Итог матча" className="relative overflow-hidden border-b border-line2">
        <p
          aria-hidden
          className="display pointer-events-none absolute left-1/2 top-6 -translate-x-1/2 text-[120px] font-black text-ink opacity-[0.05]"
        >
          HARDLINE
        </p>
        <div className="relative grid min-h-[280px] grid-cols-1 lg:min-h-[360px] lg:grid-cols-[1fr_200px_1fr]">
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 w-full lg:w-1/2",
              fieldFor(l.faction.colorToken, "l"),
              !l.won && "opacity-40",
            )}
            aria-hidden
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block",
              fieldFor(r.faction.colorToken, "r"),
              !r.won && "opacity-40",
            )}
            aria-hidden
          />

          <div className="relative flex flex-col justify-center gap-2 px-6 py-8 sm:px-10 lg:items-end lg:text-right">
            {l.won ? (
              <p className="tele plate w-fit rounded-sm px-2.5 py-1 text-[10.5px] font-bold text-ink">
                ПОБЕДА · {l.faction.name}
              </p>
            ) : null}
            <p className={cn("display text-[20px] font-bold sm:text-[24px]", factionText[l.faction.colorToken])}>
              {l.faction.name}
            </p>
            <p className={cn("display tnum text-[clamp(72px,9vw,132px)] font-black leading-[0.85]", l.won ? "text-ink" : "text-dim")}>
              {l.team.score}
            </p>
          </div>

          <div className="seam-v relative hidden lg:block">
            <div className="absolute left-1/2 top-1/2 z-10 w-[168px] -translate-x-1/2 -translate-y-1/2">
              <div className="bezel">
                <div className="bezel-core p-2">
                  <Link href={`/maps/${map.id}`} className="group block">
                    <MapThumb map={map} className="h-[84px] w-full opacity-90 transition-opacity group-hover:opacity-100" />
                  </Link>
                  <p className="tele mt-2 text-center text-[11px] font-bold text-ink" translate="no">
                    {map.code}
                  </p>
                  <p className="tech-label mt-1 text-center">{mode.name}</p>
                  <p className="tnum mt-2 border-t border-line pt-2 text-center font-mono text-[10.5px] text-dim">
                    {durationShort(match.durationSec)}
                    <br />
                    {dateTime(match.startedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex flex-col justify-center gap-2 border-t border-line px-6 py-8 sm:px-10 lg:border-t-0">
            {r.won ? (
              <p className="tele plate w-fit rounded-sm px-2.5 py-1 text-[10.5px] font-bold text-ink">
                ПОБЕДА · {r.faction.name}
              </p>
            ) : null}
            <p className={cn("display text-[20px] font-bold sm:text-[24px]", factionText[r.faction.colorToken])}>
              {r.faction.name}
            </p>
            <p className={cn("display tnum text-[clamp(72px,9vw,132px)] font-black leading-[0.85]", r.won ? "text-ink" : "text-dim")}>
              {r.team.score}
            </p>
            {match.winner === "draw" ? <p className="tele text-[11px] font-bold text-dim">НИЧЬЯ</p> : null}
            <p className="tele mt-2 text-[10.5px] text-faint lg:hidden" translate="no">
              {map.code} · {mode.name} · {dateTime(match.startedAt)}
            </p>
          </div>
        </div>
        <SeamShareBar a={l.team.score} b={r.team.score} aColor={lVar} bColor={rVar} />
      </section>

      <div className="mx-auto mt-12 max-w-[1400px] space-y-12 px-4 sm:px-6">
        {/* MVP lower-third */}
        {mvp ? (
          <Reveal><section aria-label="Лучший игрок матча" className="plate shine rail-amber relative">
            <Link
              href={`/players/${mvp.playerId}`}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 transition-colors hover:bg-[color:var(--layer-2)]"
            >
              <span className="tele text-[11px] font-bold text-[color:var(--amber)]">MVP</span>
              <span className="flex items-center gap-3">
                <Avatar seed={mvp.playerId} label={mvpName} tone={mvpFaction.colorToken} size={28} />
                <span className="font-mono text-[13px] font-bold text-ink" translate="no">
                  {mvpName}
                </span>
                <span className={cn("tele text-[10px] font-bold", factionTextHi[mvpFaction.colorToken])}>
                  {mvpFaction.code}
                </span>
              </span>
              <span className="tnum ml-auto flex gap-6 font-mono text-[12px] text-dim">
                <span>
                  счёт <span className="font-bold text-ink">{num(mvp.score)}</span>
                </span>
                <span>
                  унич. <span className="font-bold text-ink">{mvp.kills}</span>
                </span>
                <span>
                  точки <span className="font-bold text-ink">{num(mvp.objectiveScore)}</span>
                </span>
              </span>
            </Link>
          </section></Reveal>
        ) : null}

        {/* team sheets */}
        <Reveal><section aria-label="Составы и счёт">
          <SectionHeader title="Составы" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <TeamSheet side={l} flank="l" clanName={clanName(l.team.clanId)} />
            <TeamSheet side={r} flank="r" clanName={clanName(r.team.clanId)} />
          </div>
        </section></Reveal>

        {/* RTS butterfly */}
        <Reveal><section aria-label="Потери и развёртывание">
          <SectionHeader title="Потери и развёртывание" accent="red" />
          <div className="plate stagger px-4 py-4">
            <div className="mb-2 grid grid-cols-[1fr_150px_1fr] gap-3 sm:grid-cols-[1fr_180px_1fr]">
              <p className={cn("tele text-right text-[11px] font-bold", factionTextHi[l.faction.colorToken])}>
                {l.faction.code}
              </p>
              <span />
              <p className={cn("tele text-[11px] font-bold", factionTextHi[r.faction.colorToken])}>
                {r.faction.code}
              </p>
            </div>
            {rts.map((row) => (
              <ButterflyRow
                key={row.label}
                label={row.label}
                l={row.l}
                r={row.r}
                lColor={lVar}
                rColor={rVar}
                max={Math.max(row.l, row.r, 1)}
              />
            ))}
          </div>
        </section></Reveal>

        {/* unit usage */}
        <Reveal><section aria-label="Юниты сторон">
          <SectionHeader title="Юниты сторон" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <UnitUsageTable side={l} units={units} />
            <UnitUsageTable side={r} units={units} />
          </div>
        </section></Reveal>

        {/* objective log */}
        <Reveal><section aria-label="Хроника матча">
          <SectionHeader title="Хроника" accent="blue" />
          <div className="plate">
            <ol className="stagger">
              {match.timeline.map((e, i) => {
                const f = factions.find((x) => x.id === e.factionId)!;
                return (
                  <li
                    key={i}
                    className={cn("flex items-center gap-3.5 px-4 py-[8px]", i > 0 && "border-t border-line")}
                  >
                    <span className="tnum w-[46px] shrink-0 font-mono text-[12px] text-faint">{clock(e.atSec)}</span>
                    <span
                      aria-hidden
                      className="h-[10px] w-[3px] shrink-0 -skew-x-[12deg]"
                      style={{ background: factionVar[f.colorToken] }}
                    />
                    <span className="text-[13px] text-ink">{e.text}</span>
                    <span className={cn("tele ml-auto hidden text-[10px] font-bold sm:inline", factionTextHi[f.colorToken])}>
                      {f.code}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </section></Reveal>
      </div>
    </div>
  );
}
