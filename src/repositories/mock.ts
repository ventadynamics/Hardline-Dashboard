import { getDataset } from "@/data/mock/dataset";
import type {
  CatalogRepository,
  ClanRepository,
  LiveRepository,
  MatchRepository,
  OperationsRepository,
  PlayerRepository,
  SessionRepository,
  StatsRepository,
} from "./interfaces";
import type {
  ClanLeaderboardEntry,
  LeaderboardEntry,
  Match,
  MatchQuery,
  MatchSummary,
  PlayerQuery,
} from "@/types";

/** Small artificial latency so async states are real, not theoretical. */
const delay = (ms = 90) => new Promise((r) => setTimeout(r, ms));

function toSummary(m: Match, viewpoint?: { playerId?: string; clanId?: string }): MatchSummary {
  let perspectiveResult: MatchSummary["perspectiveResult"];
  if (viewpoint) {
    const team = m.teams.find((t) =>
      viewpoint.playerId
        ? t.rows.some((r) => r.playerId === viewpoint.playerId)
        : t.clanId === viewpoint.clanId,
    );
    if (team) {
      perspectiveResult = m.winner === "draw" ? "draw" : m.winner === team.key ? "win" : "loss";
    }
  }
  return {
    id: m.id,
    mapId: m.mapId,
    modeId: m.modeId,
    startedAt: m.startedAt,
    durationSec: m.durationSec,
    factionAId: m.teams[0].factionId,
    factionBId: m.teams[1].factionId,
    scoreA: m.teams[0].score,
    scoreB: m.teams[1].score,
    winner: m.winner,
    perspectiveResult,
  };
}

export class MockCatalogRepository implements CatalogRepository {
  async factions() { await delay(40); return getDataset().factions; }
  async faction(id: string) { await delay(40); return getDataset().factions.find((f) => f.id === id) ?? null; }
  async modes() { await delay(40); return getDataset().modes; }
  async mode(id: string) { await delay(40); return getDataset().modes.find((m) => m.id === id) ?? null; }
  async maps() { await delay(60); return getDataset().maps; }
  async map(id: string) { await delay(60); return getDataset().maps.find((m) => m.id === id) ?? null; }
  async units() { await delay(60); return getDataset().units; }
  async unit(id: string) { await delay(60); return getDataset().units.find((u) => u.id === id) ?? null; }
}

export class MockPlayerRepository implements PlayerRepository {
  async leaderboard(query: PlayerQuery = {}): Promise<{ entries: LeaderboardEntry[]; total: number }> {
    await delay();
    const ds = getDataset();
    let list = ds.players.map((p) => {
      const s = ds.playerStats.get(p.id)!;
      return { player: p, stats: s };
    });
    if (query.search) {
      const q = query.search.trim().toLowerCase();
      list = list.filter((e) => e.player.username.toLowerCase().includes(q));
    }
    if (query.factionId) list = list.filter((e) => e.player.factionId === query.factionId);
    if (query.clanId) list = list.filter((e) => e.player.clanId === query.clanId);
    const sort = query.sort ?? "rating";
    list.sort((a, b) => {
      switch (sort) {
        case "winRate": return b.stats.winRate - a.stats.winRate;
        case "kd": return b.stats.kd - a.stats.kd;
        case "score": return b.stats.totalScore - a.stats.totalScore;
        case "matches": return b.stats.matches - a.stats.matches;
        default: return b.player.rating - a.player.rating;
      }
    });
    // rank is always the global rating rank, whatever the current sort
    const ratingRank = new Map(
      [...ds.players].sort((a, b) => b.rating - a.rating).map((p, i) => [p.id, i + 1]),
    );
    const total = list.length;
    const offset = query.offset ?? 0;
    const limit = query.limit ?? total;
    const entries = list.slice(offset, offset + limit).map((e) => ({
      rank: ratingRank.get(e.player.id)!,
      player: e.player,
      stats: e.stats,
      favoriteUnitId: e.stats.favoriteUnitId,
    }));
    return { entries, total };
  }

  async byId(id: string) {
    await delay();
    return getDataset().players.find((p) => p.id === id) ?? null;
  }

  async statsById(id: string) {
    await delay();
    return getDataset().playerStats.get(id) ?? null;
  }

  async matchesByPlayer(id: string, limit = 10) {
    await delay();
    return getDataset()
      .matches.filter((m) => m.teams.some((t) => t.rows.some((r) => r.playerId === id)))
      .slice(0, limit)
      .map((m) => toSummary(m, { playerId: id }));
  }
}

export class MockClanRepository implements ClanRepository {
  async leaderboard(): Promise<ClanLeaderboardEntry[]> {
    await delay();
    const ds = getDataset();
    return [...ds.clans]
      .sort((a, b) => b.clanMMR - a.clanMMR)
      .map((clan, i) => ({ rank: i + 1, clan, stats: ds.clanStats.get(clan.id)! }));
  }
  async byId(id: string) { await delay(); return getDataset().clans.find((c) => c.id === id) ?? null; }
  async statsById(id: string) { await delay(); return getDataset().clanStats.get(id) ?? null; }
  async members(id: string) {
    await delay();
    const ds = getDataset();
    const clan = ds.clans.find((c) => c.id === id);
    if (!clan) return [];
    return clan.memberIds
      .map((pid) => ds.players.find((p) => p.id === pid)!)
      .sort((a, b) => b.rating - a.rating);
  }
  async matchesByClan(id: string, limit = 8) {
    await delay();
    return getDataset()
      .matches.filter((m) => m.teams.some((t) => t.clanId === id))
      .slice(0, limit)
      .map((m) => toSummary(m, { clanId: id }));
  }
}

export class MockMatchRepository implements MatchRepository {
  async list(query: MatchQuery = {}) {
    await delay();
    const ds = getDataset();
    let list = ds.matches;
    if (query.mapId) list = list.filter((m) => m.mapId === query.mapId);
    if (query.modeId) list = list.filter((m) => m.modeId === query.modeId);
    if (query.factionId) list = list.filter((m) => m.teams.some((t) => t.factionId === query.factionId));
    if (query.playerId) list = list.filter((m) => m.teams.some((t) => t.rows.some((r) => r.playerId === query.playerId)));
    if (query.clanId) list = list.filter((m) => m.teams.some((t) => t.clanId === query.clanId));
    const total = list.length;
    const offset = query.offset ?? 0;
    const limit = query.limit ?? 25;
    return { matches: list.slice(offset, offset + limit).map((m) => toSummary(m)), total };
  }
  async byId(id: string) {
    await delay(120);
    return getDataset().matches.find((m) => m.id === id) ?? null;
  }
}

export class MockStatsRepository implements StatsRepository {
  async global() { await delay(); return getDataset().globalStats; }
  async maps() { await delay(); return getDataset().mapStats; }
  async map(mapId: string) { await delay(); return getDataset().mapStats.find((m) => m.mapId === mapId) ?? null; }
  async units() { await delay(); return getDataset().unitStats; }
  async unit(unitId: string) { await delay(); return getDataset().unitStats.find((u) => u.unitId === unitId) ?? null; }
}

export class MockOperationsRepository implements OperationsRepository {
  async currentForClan(clanId: string) {
    await delay();
    return getDataset().operations.get(clanId) ?? null;
  }
}

export class MockSessionRepository implements SessionRepository {
  async current() { await delay(30); return getDataset().session; }
}

export class MockLiveRepository implements LiveRepository {
  async snapshot() {
    const ds = getDataset();
    // slow, logical drift around the base values — not random noise every tick
    const t = Date.now() / 1000;
    const wave = (period: number, phase = 0) => Math.sin((t / period) * Math.PI * 2 + phase);
    return {
      playersOnline: Math.round(ds.liveBase.playersOnline + wave(540) * 80 + wave(97, 2) * 22),
      liveMatches: Math.round(ds.liveBase.liveMatches + wave(300, 1) * 9 + wave(61, 4) * 3),
      activeClans: Math.round(ds.liveBase.activeClans + wave(900, 3) * 6),
      matchesToday: Math.round(ds.liveBase.matchesToday + (t % 86400) * 0.052),
      capturedAt: new Date().toISOString(),
    };
  }
}
