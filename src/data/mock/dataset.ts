import {
  CLAN_POOL,
  FACTIONS,
  MAPS,
  MODES,
  PLAYER_NAMES,
  TASK_TEMPLATES,
  UNITS,
  rankForLevel,
} from "./catalog";
import { hashCode, int, mulberry32, pick, pickWeighted, sample, shuffle, type Rng } from "@/lib/rng";
import type {
  Clan,
  ClanStats,
  Faction,
  GameMap,
  GameMode,
  GlobalStats,
  LiveSnapshot,
  Match,
  MatchEvent,
  MatchTeam,
  Operation,
  Player,
  PlayerStats,
  MapStats,
  RatingPoint,
  ScoreboardRow,
  SessionUser,
  SliceStat,
  Unit,
  UnitGlobalStats,
  UnitUsage,
} from "@/types";

/**
 * One deterministic, interconnected mock universe.
 *
 * The visible sample: every match in `matches` references real players, clans,
 * maps, modes and units; player/clan/map/unit aggregates are COMPUTED from
 * those matches plus a per-player career baseline, so win rates, K/D and
 * averages always reconcile. Universe-scale counters (players online, lifetime
 * matches) model the whole player base the sample is drawn from.
 */

const SEED = 0x48524c31;
const MATCH_COUNT = 190;
const DAYS = 30;
/** lifetime universe ≈ sample × scale — keeps absolute counts plausible */
const UNIVERSE_SCALE = 6400;

const DAY_MS = 86_400_000;

interface Tally {
  matches: number;
  wins: number;
  score: number;
}

export interface Dataset {
  factions: Faction[];
  modes: GameMode[];
  maps: GameMap[];
  units: Unit[];
  players: Player[];
  clans: Clan[];
  matches: Match[]; // sorted newest first
  playerStats: Map<string, PlayerStats>;
  clanStats: Map<string, ClanStats>;
  mapStats: MapStats[];
  unitStats: UnitGlobalStats[];
  globalStats: GlobalStats;
  operations: Map<string, Operation>;
  session: SessionUser;
  liveBase: LiveSnapshot;
  anchor: number;
}

function buildDataset(): Dataset {
  const rng = mulberry32(SEED);
  const anchor = Date.now();

  /* ---------------- players ---------------- */
  const players: Player[] = PLAYER_NAMES.slice(0, 84).map((name, i) => {
    const skill = 0.22 + rng() * 0.72;
    const factionId = pickWeighted(rng, FACTIONS, (f) =>
      f.id === "police" ? 4 : f.id === "syndicate" ? 3.8 : 2.2,
    ).id;
    const presenceRoll = rng();
    return {
      id: `p-${String(i + 1).padStart(2, "0")}`,
      username: name,
      level: 1,
      rankTitle: rankForLevel(1),
      rating: 0,
      factionId,
      clanId: null,
      presence: presenceRoll < 0.2 ? "online" : presenceRoll < 0.32 ? "ingame" : "offline",
      createdAt: new Date(anchor - int(rng, 40, 420) * DAY_MS).toISOString(),
    };
  });
  const skillOf = new Map<string, number>();
  players.forEach((p) => skillOf.set(p.id, 0.22 + mulberry32(hashCode(p.id))() * 0.72));
  // the session account should sit believably high, never fake-perfect #1
  const meEarly = players.find((p) => p.username === "VANTAGE")!;
  skillOf.set(meEarly.id, 0.61);

  /* ---------------- clans ---------------- */
  const shuffled = shuffle(rng, players);
  let cursor = 0;
  const clans: Clan[] = CLAN_POOL.map((c, i) => {
    const size = int(rng, 4, 9);
    const memberIds = shuffled.slice(cursor, cursor + size).map((p) => p.id);
    cursor += size;
    return {
      id: `c-${c.tag.toLowerCase()}`,
      tag: c.tag,
      name: c.name,
      motto: c.motto,
      factionLeanId: null,
      memberIds,
      leaderId: memberIds[0],
      clanMMR: 0,
      createdAt: new Date(anchor - int(rng, 60, 500) * DAY_MS).toISOString(),
    };
  });
  const byId = new Map(players.map((p) => [p.id, p]));
  // the mock session account: VANTAGE, member of NIGHTSHIFT
  const me = players.find((p) => p.username === "VANTAGE")!;
  const myClan = clans.find((c) => c.name === "NIGHTSHIFT")!;
  for (const c of clans) c.memberIds = c.memberIds.filter((id) => id !== me.id);
  if (!myClan.memberIds.includes(me.id)) myClan.memberIds.push(me.id);
  for (const clan of clans) {
    for (const id of clan.memberIds) byId.get(id)!.clanId = clan.id;
    const counts = new Map<string, number>();
    for (const id of clan.memberIds) {
      const f = byId.get(id)!.factionId;
      counts.set(f, (counts.get(f) ?? 0) + 1);
    }
    clan.factionLeanId = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    clan.leaderId = [...clan.memberIds].sort((a, b) => (skillOf.get(b) ?? 0) - (skillOf.get(a) ?? 0))[0];
  }
  me.presence = "online";

  /* ---------------- matches ---------------- */
  const unitsByFaction = new Map<string, Unit[]>(
    FACTIONS.map((f) => [f.id, UNITS.filter((u) => u.factionId === f.id)]),
  );

  const factionPairs: [string, string, number][] = [
    ["police", "syndicate", 0.55],
    ["police", "guard", 0.2],
    ["syndicate", "guard", 0.25],
  ];
  const mapWeight = new Map<string, number>([
    ["downtown", 1.6],
    ["harbor", 1.25],
    ["interstate", 1.2],
    ["civic", 1.05],
    ["railyard", 0.95],
    ["strip", 0.9],
    ["hillside", 0.85],
    ["refinery", 0.8],
  ]);
  const modeWeight = new Map<string, number>([
    ["conquest", 3.8],
    ["assault", 2.6],
    ["blockade", 2.0],
    ["convoy", 1.6],
  ]);
  const modeDuration: Record<string, [number, number]> = {
    conquest: [22, 38],
    assault: [18, 30],
    blockade: [25, 42],
    convoy: [14, 24],
  };

  function buildTeamPlayers(
    factionId: string,
    n: number,
    used: Set<string>,
    forceInclude?: Player,
  ): { members: Player[]; clanId: string | null } {
    // 55% of sides are clan stacks
    if (!forceInclude && rng() < 0.55) {
      const candidates = clans.filter(
        (c) => c.memberIds.filter((id) => !used.has(id)).length >= n,
      );
      if (candidates.length) {
        const clan = pickWeighted(rng, candidates, (c) => (c.factionLeanId === factionId ? 3 : 1));
        const members = sample(
          rng,
          clan.memberIds.filter((id) => !used.has(id)),
          n,
        ).map((id) => byId.get(id)!);
        members.forEach((m) => used.add(m.id));
        return { members, clanId: clan.id };
      }
    }
    const pool = players.filter((p) => !used.has(p.id) && p.id !== forceInclude?.id);
    const members = sample(
      rng,
      pool.filter((p) => p.factionId === factionId).length >= n
        ? pool.filter((p) => p.factionId === factionId)
        : pool,
      forceInclude ? n - 1 : n,
    );
    if (forceInclude) members.unshift(forceInclude);
    members.forEach((m) => used.add(m.id));
    return { members, clanId: null };
  }

  function buildUsage(factionId: string, teamSize: number, losing: boolean): UnitUsage[] {
    const pool = sample(rng, unitsByFaction.get(factionId)!, int(rng, 4, 6));
    return pool.map((u) => {
      const deployed = int(rng, 2, 5) * teamSize;
      const lossRate = losing ? 0.42 + rng() * 0.3 : 0.22 + rng() * 0.28;
      return { unitId: u.id, deployed, lost: Math.round(deployed * lossRate), kills: 0 };
    });
  }

  function distributeKills(usage: UnitUsage[], total: number) {
    const weights = usage.map((u) => u.deployed * (0.5 + rng()));
    const sum = weights.reduce((a, b) => a + b, 0);
    let left = total;
    usage.forEach((u, i) => {
      const v = i === usage.length - 1 ? left : Math.min(left, Math.round((weights[i] / sum) * total));
      u.kills = v;
      left -= v;
    });
  }

  const matches: Match[] = [];
  for (let i = 0; i < MATCH_COUNT; i++) {
    const id = `m-${String(i + 1).padStart(3, "0")}`;
    const dayOffset = Math.floor(DAYS * Math.pow(rng(), 1.5));
    const startedAt = anchor - dayOffset * DAY_MS - int(rng, 0, 20) * 3_600_000 - int(rng, 0, 59) * 60_000;
    const mode = pickWeighted(rng, MODES, (m) => modeWeight.get(m.id) ?? 1);
    const map = pickWeighted(rng, MAPS, (m) => mapWeight.get(m.id) ?? 1);
    const pair = pickWeighted(rng, factionPairs, (p) => p[2]);
    const flip = rng() < 0.5;
    const factionA = flip ? pair[1] : pair[0];
    const factionB = flip ? pair[0] : pair[1];
    const teamSize = int(rng, 3, 5);
    const [dMin, dMax] = modeDuration[mode.id];
    const durationSec = int(rng, dMin * 60, dMax * 60);

    const used = new Set<string>();
    const includeMe = rng() < 0.18;
    const sideA = buildTeamPlayers(factionA, teamSize, used, includeMe ? me : undefined);
    const sideB = buildTeamPlayers(factionB, teamSize, used);

    const power = (side: { members: Player[] }) =>
      side.members.reduce((s, m) => s + (skillOf.get(m.id) ?? 0.5), 0) + rng() * 1.1;
    const drawRoll = rng();
    const aWins = power(sideA) > power(sideB);
    const winner: Match["winner"] = drawRoll < 0.02 ? "draw" : aWins ? "A" : "B";

    const winScore = int(rng, 360, 460);
    const loseScore = int(rng, 150, winScore - 40);
    const scoreA = winner === "draw" ? winScore : winner === "A" ? winScore : loseScore;
    const scoreB = winner === "draw" ? winScore : winner === "B" ? winScore : loseScore;

    const usageA = buildUsage(factionA, teamSize, winner === "B");
    const usageB = buildUsage(factionB, teamSize, winner === "A");
    const lostA = usageA.reduce((s, u) => s + u.lost, 0);
    const lostB = usageB.reduce((s, u) => s + u.lost, 0);
    distributeKills(usageA, lostB);
    distributeKills(usageB, lostA);

    function buildTeam(
      key: "A" | "B",
      factionId: string,
      side: { members: Player[]; clanId: string | null },
      usage: UnitUsage[],
      score: number,
      enemyUsage: UnitUsage[],
    ): MatchTeam {
      const unitsDeployed = usage.reduce((s, u) => s + u.deployed, 0);
      const unitsLost = usage.reduce((s, u) => s + u.lost, 0);
      const kills = usage.reduce((s, u) => s + u.kills, 0);
      const isVeh = (uid: string) => UNITS.find((u) => u.id === uid)!.isVehicle;
      const vehiclesDeployed = usage.filter((u) => isVeh(u.unitId)).reduce((s, u) => s + u.deployed, 0);
      const vehiclesLost = usage.filter((u) => isVeh(u.unitId)).reduce((s, u) => s + u.lost, 0);
      const objectivesCaptured =
        mode.id === "convoy" ? int(rng, 0, 3) : int(rng, 2, map.objectives.length * 3);
      const damageDealt = kills * int(rng, 300, 420);
      const rts = {
        unitsDeployed,
        unitsLost,
        vehiclesDeployed,
        vehiclesLost,
        objectivesCaptured,
        damageDealt,
        damageReceived: enemyUsage.reduce((s, u) => s + u.kills, 0) * int(rng, 300, 420),
        resourcesSpent: unitsDeployed * int(rng, 110, 190),
        reinforcements: int(rng, 2, 6),
      };
      // split team totals across players by skill weight
      const weights = side.members.map((m) => (skillOf.get(m.id) ?? 0.5) + rng() * 0.4);
      const wSum = weights.reduce((a, b) => a + b, 0);
      let killsLeft = kills;
      let deathsLeft = unitsLost;
      let objLeft = objectivesCaptured;
      const rows: ScoreboardRow[] = side.members.map((m, idx) => {
        const last = idx === side.members.length - 1;
        const share = weights[idx] / wSum;
        const k = last ? killsLeft : Math.min(killsLeft, Math.round(kills * share));
        const d = last ? deathsLeft : Math.min(deathsLeft, Math.round(unitsLost * share));
        const o = last ? objLeft : Math.min(objLeft, Math.round(objectivesCaptured * share));
        killsLeft -= k;
        deathsLeft -= d;
        objLeft -= o;
        const assists = int(rng, 0, Math.max(2, Math.round(k * 0.8)));
        const objectiveScore = o * 150 + int(rng, 40, 160);
        return {
          playerId: m.id,
          clanId: m.clanId,
          factionId,
          score: k * 90 + assists * 40 + objectiveScore + int(rng, 60, 240),
          kills: k,
          deaths: d,
          assists,
          objectiveScore,
          unitsLost: d,
        };
      });
      rows.sort((a, b) => b.score - a.score);
      return { key, factionId, clanId: side.clanId, score, rows, rts, unitUsage: usage };
    }

    const teamA = buildTeam("A", factionA, sideA, usageA, scoreA, usageB);
    const teamB = buildTeam("B", factionB, sideB, usageB, scoreB, usageA);

    /* timeline */
    const timeline: MatchEvent[] = [];
    const evCount = int(rng, 6, 10);
    const fName = (fid: string) => FACTIONS.find((f) => f.id === fid)!.name;
    for (let e = 0; e < evCount; e++) {
      const atSec = int(rng, 60, durationSec - 60);
      const roll = rng();
      const fid = rng() < (winner === "A" ? 0.6 : 0.4) ? factionA : factionB;
      const enemy = fid === factionA ? factionB : factionA;
      if (roll < 0.4) {
        timeline.push({ atSec, type: "capture", factionId: fid, text: `${fName(fid)}: захвачена точка ${pick(rng, map.objectives)}` });
      } else if (roll < 0.6) {
        const u = pick(rng, unitsByFaction.get(enemy)!.filter((x) => x.isVehicle));
        timeline.push({ atSec, type: "vehicle_destroyed", factionId: fid, text: `Уничтожена техника: ${u.name} (${fName(enemy)})` });
      } else if (roll < 0.75) {
        const u = pick(rng, unitsByFaction.get(enemy)!);
        timeline.push({ atSec, type: "unit_destroyed", factionId: fid, text: `Потерян юнит: ${u.name} (${fName(enemy)})` });
      } else if (roll < 0.88) {
        timeline.push({ atSec, type: "reinforcement", factionId: fid, text: `${fName(fid)}: прибыло подкрепление` });
      } else {
        timeline.push({ atSec, type: "hold", factionId: fid, text: `${fName(fid)}: удержана точка ${pick(rng, map.objectives)}` });
      }
    }
    timeline.sort((a, b) => a.atSec - b.atSec);

    matches.push({
      id,
      mapId: map.id,
      modeId: mode.id,
      startedAt: new Date(startedAt).toISOString(),
      durationSec,
      teams: [teamA, teamB],
      winner,
      timeline,
    });
  }
  matches.sort((a, b) => +new Date(b.startedAt) - +new Date(a.startedAt));

  /* ---------------- player aggregates ---------------- */
  const playerStats = new Map<string, PlayerStats>();
  interface Acc {
    matches: number; wins: number; kills: number; deaths: number; assists: number;
    score: number; obj: number;
    byFaction: Map<string, Tally>; byMap: Map<string, Tally>; byMode: Map<string, Tally>;
    unitTally: Map<string, number>;
    activity: Map<string, number>;
    results: { date: number; win: boolean }[];
  }
  const accs = new Map<string, Acc>();
  const acc = (id: string): Acc => {
    let a = accs.get(id);
    if (!a) {
      a = { matches: 0, wins: 0, kills: 0, deaths: 0, assists: 0, score: 0, obj: 0,
        byFaction: new Map(), byMap: new Map(), byMode: new Map(), unitTally: new Map(),
        activity: new Map(), results: [] };
      accs.set(id, a);
    }
    return a;
  };
  const bump = (m: Map<string, Tally>, key: string, win: boolean, score: number) => {
    const t = m.get(key) ?? { matches: 0, wins: 0, score: 0 };
    t.matches++; if (win) t.wins++; t.score += score;
    m.set(key, t);
  };
  for (const match of matches) {
    for (const team of match.teams) {
      const win = match.winner === team.key;
      for (const row of team.rows) {
        const a = acc(row.playerId);
        a.matches++; if (win) a.wins++;
        a.kills += row.kills; a.deaths += row.deaths; a.assists += row.assists;
        a.score += row.score; a.obj += Math.round(row.objectiveScore / 150);
        bump(a.byFaction, team.factionId, win, row.score);
        bump(a.byMap, match.mapId, win, row.score);
        bump(a.byMode, match.modeId, win, row.score);
        for (const u of team.unitUsage) a.unitTally.set(u.unitId, (a.unitTally.get(u.unitId) ?? 0) + u.deployed);
        const day = new Date(match.startedAt).toISOString().slice(0, 10);
        a.activity.set(day, (a.activity.get(day) ?? 0) + 1);
        a.results.push({ date: +new Date(match.startedAt), win });
      }
    }
  }

  for (const p of players) {
    const prng = mulberry32(hashCode(p.id) ^ SEED);
    const skill = skillOf.get(p.id)!;
    const a = accs.get(p.id);
    const ageDays = (anchor - +new Date(p.createdAt)) / DAY_MS;
    const careerMatches = Math.round(30 + (ageDays / 420) * 480 * (0.5 + prng() * 0.8));
    const careerWinRate = Math.min(0.68, Math.max(0.34, 0.36 + skill * 0.3 + (prng() - 0.5) * 0.06));
    const careerWins = Math.round(careerMatches * careerWinRate);
    const avgKills = 5 + skill * 9;
    const careerKills = Math.round(careerMatches * avgKills * (0.9 + prng() * 0.2));
    const careerDeaths = Math.round(careerKills / (0.75 + skill * 0.9));
    const careerAssists = Math.round(careerKills * (0.35 + prng() * 0.2));
    const careerScore = Math.round(careerMatches * (750 + skill * 700));
    const careerObj = Math.round(careerMatches * (2 + skill * 4));

    const matchesTotal = careerMatches + (a?.matches ?? 0);
    const winsTotal = careerWins + (a?.wins ?? 0);
    const killsTotal = careerKills + (a?.kills ?? 0);
    const deathsTotal = careerDeaths + (a?.deaths ?? 0);
    const assistsTotal = careerAssists + (a?.assists ?? 0);
    const scoreTotal = careerScore + (a?.score ?? 0);
    const objTotal = careerObj + (a?.obj ?? 0);

    p.level = Math.max(1, Math.min(50, 1 + Math.floor(scoreTotal / 11000)));
    p.rankTitle = rankForLevel(p.level);

    /* rating: 30-day walk ending at the leaderboard value */
    const base = Math.round(1050 + skill * 900 + (prng() - 0.5) * 120);
    const history: RatingPoint[] = [];
    let r = base;
    const resultsByDay = new Map<string, { win: boolean }[]>();
    a?.results.forEach((res) => {
      const d = new Date(res.date).toISOString().slice(0, 10);
      const list = resultsByDay.get(d) ?? [];
      list.push({ win: res.win });
      resultsByDay.set(d, list);
    });
    for (let d = DAYS; d >= 0; d--) {
      const date = new Date(anchor - d * DAY_MS).toISOString().slice(0, 10);
      const games = resultsByDay.get(date) ?? [];
      for (const g of games) r += g.win ? int(prng, 8, 22) : -int(prng, 6, 20);
      if (games.length === 0 && prng() < 0.3) r += int(prng, -6, 6);
      history.push({ date, rating: r });
    }
    p.rating = r;

    const slices = (m?: Map<string, Tally>): SliceStat[] =>
      [...(m ?? new Map<string, Tally>()).entries()]
        .map(([refId, t]) => ({
          refId,
          matches: t.matches,
          wins: t.wins,
          winRate: t.wins / t.matches,
          avgScore: Math.round(t.score / t.matches),
        }))
        .sort((x, y) => y.matches - x.matches);

    const favUnit =
      [...(a?.unitTally ?? new Map<string, number>()).entries()].sort((x, y) => y[1] - x[1])[0]?.[0] ??
      pick(prng, unitsByFaction.get(p.factionId)!).id;
    const byMap = slices(a?.byMap);
    const byFaction = slices(a?.byFaction);

    const activity: { date: string; matches: number }[] = [];
    for (let d = 13; d >= 0; d--) {
      const date = new Date(anchor - d * DAY_MS).toISOString().slice(0, 10);
      activity.push({ date, matches: a?.activity.get(date) ?? 0 });
    }

    playerStats.set(p.id, {
      playerId: p.id,
      matches: matchesTotal,
      wins: winsTotal,
      losses: matchesTotal - winsTotal,
      winRate: winsTotal / matchesTotal,
      kills: killsTotal,
      deaths: deathsTotal,
      kd: killsTotal / Math.max(1, deathsTotal),
      assists: assistsTotal,
      totalScore: scoreTotal,
      avgScore: Math.round(scoreTotal / matchesTotal),
      objectivesCaptured: objTotal,
      favoriteUnitId: favUnit,
      favoriteMapId: byMap[0]?.refId ?? pick(prng, MAPS).id,
      favoriteFactionId: byFaction[0]?.refId ?? p.factionId,
      ratingHistory: history,
      activity,
      byFaction,
      byMap,
      byMode: slices(a?.byMode),
    });
  }

  /* ---------------- clan aggregates ---------------- */
  const clanStats = new Map<string, ClanStats>();
  for (const clan of clans) {
    const crng = mulberry32(hashCode(clan.id) ^ SEED);
    let m = 0, w = 0, recent = 0;
    for (const match of matches) {
      for (const team of match.teams) {
        if (team.clanId === clan.id) {
          m++;
          if (match.winner === team.key) w++;
          if (anchor - +new Date(match.startedAt) < 7 * DAY_MS) recent++;
        }
      }
    }
    const baseMatches = int(crng, 120, 860);
    const baseWinRate = 0.4 + crng() * 0.22;
    const matchesTotal = baseMatches + m;
    const winsTotal = Math.round(baseMatches * baseWinRate) + w;
    const ratings = clan.memberIds.map((id) => byId.get(id)!.rating);
    const avgMemberRating = Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length);
    const winRate = winsTotal / matchesTotal;
    clan.clanMMR = Math.round(700 + avgMemberRating * 0.45 + winRate * 900 + recent * 12);
    clanStats.set(clan.id, {
      clanId: clan.id,
      matches: matchesTotal,
      wins: winsTotal,
      losses: matchesTotal - winsTotal,
      winRate,
      activity7d: recent,
      avgMemberRating,
    });
  }

  /* ---------------- map stats ---------------- */
  const mapStats: MapStats[] = MAPS.map((map) => {
    const played = matches.filter((m) => m.mapId === map.id);
    const sideAgg = new Map<string, { m: number; w: number }>();
    let dur = 0, playersSum = 0;
    for (const m of played) {
      dur += m.durationSec;
      playersSum += m.teams[0].rows.length + m.teams[1].rows.length;
      for (const t of m.teams) {
        const s = sideAgg.get(t.factionId) ?? { m: 0, w: 0 };
        s.m++;
        if (m.winner === t.key) s.w++;
        sideAgg.set(t.factionId, s);
      }
    }
    return {
      mapId: map.id,
      matches: played.length * UNIVERSE_SCALE,
      avgDurationSec: played.length ? Math.round(dur / played.length) : 0,
      avgPlayers: played.length ? Math.round((playersSum / played.length) * 10) / 10 : 0,
      popularityShare: played.length / matches.length,
      winRateBySide: [...sideAgg.entries()].map(([factionId, s]) => ({
        factionId,
        matches: s.m * UNIVERSE_SCALE,
        winRate: s.w / Math.max(1, s.m),
      })),
    };
  }).sort((a, b) => b.matches - a.matches);

  /* ---------------- unit stats ---------------- */
  const unitAgg = new Map<string, { dep: number; lost: number; kills: number; life: number; lifeN: number }>();
  for (const m of matches) {
    for (const t of m.teams) {
      for (const u of t.unitUsage) {
        const s = unitAgg.get(u.unitId) ?? { dep: 0, lost: 0, kills: 0, life: 0, lifeN: 0 };
        s.dep += u.deployed; s.lost += u.lost; s.kills += u.kills;
        s.life += m.durationSec * (1 - u.lost / Math.max(1, u.deployed)) * 0.8;
        s.lifeN++;
        unitAgg.set(u.unitId, s);
      }
    }
  }
  const totalDeployed = [...unitAgg.values()].reduce((s, u) => s + u.dep, 0);
  const unitStats: UnitGlobalStats[] = UNITS.map((u) => {
    const s = unitAgg.get(u.id) ?? { dep: 0, lost: 0, kills: 0, life: 0, lifeN: 0 };
    return {
      unitId: u.id,
      deployed: s.dep * UNIVERSE_SCALE,
      lost: s.lost * UNIVERSE_SCALE,
      kills: s.kills * UNIVERSE_SCALE,
      effectiveness: s.kills / Math.max(1, s.dep),
      avgSurvivalSec: s.lifeN ? Math.round(s.life / s.lifeN) : 0,
      popularityShare: s.dep / Math.max(1, totalDeployed),
    };
  }).sort((a, b) => b.deployed - a.deployed);

  /* ---------------- global stats ---------------- */
  const today = matches.filter((m) => anchor - +new Date(m.startedAt) < DAY_MS).length;
  const factionAgg = new Map<string, { m: number; w: number }>();
  const modeAgg = new Map<string, number>();
  for (const m of matches) {
    modeAgg.set(m.modeId, (modeAgg.get(m.modeId) ?? 0) + 1);
    for (const t of m.teams) {
      const s = factionAgg.get(t.factionId) ?? { m: 0, w: 0 };
      s.m++;
      if (m.winner === t.key) s.w++;
      factionAgg.set(t.factionId, s);
    }
  }
  const globalStats: GlobalStats = {
    totalPlayers: 48_213,
    totalClans: 2_140,
    totalMatches: matches.length * UNIVERSE_SCALE,
    // daily activity is a different scale than lifetime volume
    matchesToday: Math.max(1, today) * 260,
    avgMatchDurationSec: Math.round(matches.reduce((s, m) => s + m.durationSec, 0) / matches.length),
    mostPlayedMapId: mapStats[0].mapId,
    mostPopularFactionId: [...factionAgg.entries()].sort((a, b) => b[1].m - a[1].m)[0][0],
    mostUsedUnitId: unitStats[0].unitId,
    factionWinRates: [...factionAgg.entries()].map(([factionId, s]) => ({
      factionId,
      matches: s.m * UNIVERSE_SCALE,
      winRate: s.w / s.m,
    })),
    modeDistribution: [...modeAgg.entries()].map(([modeId, m]) => ({ modeId, matches: m * UNIVERSE_SCALE })),
  };

  /* ---------------- clan operations ---------------- */
  const endOfDay = new Date(anchor);
  endOfDay.setHours(23, 59, 59, 0);
  const startOfDay = new Date(anchor);
  startOfDay.setHours(0, 0, 0, 0);
  const operations = new Map<string, Operation>();
  for (const clan of clans) {
    const orng = mulberry32(hashCode(clan.id + "op") ^ SEED);
    const templates = sample(orng, TASK_TEMPLATES, 4);
    const activity = clanStats.get(clan.id)!.activity7d;
    operations.set(clan.id, {
      id: `op-${clan.tag.toLowerCase()}`,
      clanId: clan.id,
      issuedAt: startOfDay.toISOString(),
      expiresAt: endOfDay.toISOString(),
      tasks: templates.map((t, ti) => {
        const total = pick(orng, t.totals);
        const doneShare = Math.min(1, (0.15 + orng() * 0.75) * (0.5 + activity * 0.12));
        const progress = Math.min(total, Math.round(total * doneShare));
        return {
          id: `op-${clan.tag.toLowerCase()}-${ti}`,
          code: t.code,
          title: t.title,
          description: t.description,
          progress,
          total,
          reward: t.reward,
          status: progress >= total ? "done" : "active",
        };
      }),
    });
  }

  /* ---------------- session ---------------- */
  const myMatches = matches.filter((m) =>
    m.teams.some((t) => t.rows.some((r) => r.playerId === me.id)),
  );
  const myOp = operations.get(myClan.id)!;
  const nearestTask = myOp.tasks.find((t) => t.status === "active");
  const session: SessionUser = {
    player: me,
    clan: myClan,
    notifications: [
      nearestTask
        ? { id: "n1", kind: "operation", text: `Задача «${nearestTask.title}»: ${nearestTask.progress} из ${nearestTask.total}`, ago: "12 мин назад", unread: true }
        : { id: "n1", kind: "operation", text: "Все задачи операции выполнены", ago: "12 мин назад", unread: true },
      myMatches[0]
        ? { id: "n2", kind: "match", text: `Матч-репорт готов: ${MAPS.find((x) => x.id === myMatches[0].mapId)!.name}`, ago: "1 ч назад", unread: true }
        : { id: "n2", kind: "system", text: "Добро пожаловать в оперативный портал", ago: "1 ч назад", unread: true },
      { id: "n3", kind: "clan", text: `${myClan.name}: клан поднялся в рейтинге`, ago: "6 ч назад", unread: false },
      { id: "n4", kind: "system", text: "Ротация задач операции — сегодня в 00:00", ago: "вчера", unread: false },
    ],
  };

  const liveBase: LiveSnapshot = {
    playersOnline: 2_481,
    liveMatches: 124,
    activeClans: 183,
    matchesToday: globalStats.matchesToday,
    capturedAt: new Date(anchor).toISOString(),
  };

  return {
    factions: FACTIONS,
    modes: MODES,
    maps: MAPS,
    units: UNITS,
    players,
    clans,
    matches,
    playerStats,
    clanStats,
    mapStats,
    unitStats,
    globalStats,
    operations,
    session,
    liveBase,
    anchor,
  };
}

let cached: Dataset | null = null;

export function getDataset(): Dataset {
  if (!cached) cached = buildDataset();
  return cached;
}
