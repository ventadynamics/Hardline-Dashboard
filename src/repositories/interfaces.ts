import type {
  Clan,
  ClanLeaderboardEntry,
  ClanStats,
  Faction,
  GameMap,
  GameMode,
  GlobalStats,
  LeaderboardEntry,
  LiveSnapshot,
  MapStats,
  Match,
  MatchQuery,
  MatchSummary,
  Operation,
  Player,
  PlayerQuery,
  PlayerStats,
  SessionUser,
  Unit,
  UnitGlobalStats,
} from "@/types";

/**
 * Repository contracts — the seam where the mock layer will be replaced by a
 * real API client. UI and services depend only on these interfaces.
 */

export interface CatalogRepository {
  factions(): Promise<Faction[]>;
  faction(id: string): Promise<Faction | null>;
  modes(): Promise<GameMode[]>;
  mode(id: string): Promise<GameMode | null>;
  maps(): Promise<GameMap[]>;
  map(id: string): Promise<GameMap | null>;
  units(): Promise<Unit[]>;
  unit(id: string): Promise<Unit | null>;
}

export interface PlayerRepository {
  leaderboard(query?: PlayerQuery): Promise<{ entries: LeaderboardEntry[]; total: number }>;
  byId(id: string): Promise<Player | null>;
  statsById(id: string): Promise<PlayerStats | null>;
  matchesByPlayer(id: string, limit?: number): Promise<MatchSummary[]>;
}

export interface ClanRepository {
  leaderboard(): Promise<ClanLeaderboardEntry[]>;
  byId(id: string): Promise<Clan | null>;
  statsById(id: string): Promise<ClanStats | null>;
  members(id: string): Promise<Player[]>;
  matchesByClan(id: string, limit?: number): Promise<MatchSummary[]>;
}

export interface MatchRepository {
  list(query?: MatchQuery): Promise<{ matches: MatchSummary[]; total: number }>;
  byId(id: string): Promise<Match | null>;
}

export interface StatsRepository {
  global(): Promise<GlobalStats>;
  maps(): Promise<MapStats[]>;
  map(mapId: string): Promise<MapStats | null>;
  units(): Promise<UnitGlobalStats[]>;
  unit(unitId: string): Promise<UnitGlobalStats | null>;
}

export interface OperationsRepository {
  currentForClan(clanId: string): Promise<Operation | null>;
}

export interface SessionRepository {
  current(): Promise<SessionUser>;
}

export interface LiveRepository {
  snapshot(): Promise<LiveSnapshot>;
}
