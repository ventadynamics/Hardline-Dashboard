import {
  catalogRepository,
  clanRepository,
  liveRepository,
  matchRepository,
  operationsRepository,
  playerRepository,
  sessionRepository,
  statsRepository,
} from "@/repositories";
import type { MatchQuery, PlayerQuery } from "@/types";

/**
 * Service layer — the API pages talk to. Thin today; business rules that do
 * not belong in components (joins, derived values) land here as they appear.
 */

export const catalogService = {
  factions: () => catalogRepository.factions(),
  faction: (id: string) => catalogRepository.faction(id),
  modes: () => catalogRepository.modes(),
  mode: (id: string) => catalogRepository.mode(id),
  maps: () => catalogRepository.maps(),
  map: (id: string) => catalogRepository.map(id),
  units: () => catalogRepository.units(),
  unit: (id: string) => catalogRepository.unit(id),
};

export const playerService = {
  leaderboard: (query?: PlayerQuery) => playerRepository.leaderboard(query),
  byId: (id: string) => playerRepository.byId(id),
  stats: (id: string) => playerRepository.statsById(id),
  recentMatches: (id: string, limit?: number) => playerRepository.matchesByPlayer(id, limit),
};

export const clanService = {
  leaderboard: () => clanRepository.leaderboard(),
  byId: (id: string) => clanRepository.byId(id),
  stats: (id: string) => clanRepository.statsById(id),
  members: (id: string) => clanRepository.members(id),
  recentMatches: (id: string, limit?: number) => clanRepository.matchesByClan(id, limit),
};

export const matchService = {
  list: (query?: MatchQuery) => matchRepository.list(query),
  byId: (id: string) => matchRepository.byId(id),
};

export const statsService = {
  global: () => statsRepository.global(),
  maps: () => statsRepository.maps(),
  map: (id: string) => statsRepository.map(id),
  units: () => statsRepository.units(),
  unit: (id: string) => statsRepository.unit(id),
};

export const operationsService = {
  currentForClan: (clanId: string) => operationsRepository.currentForClan(clanId),
};

export const sessionService = {
  current: () => sessionRepository.current(),
};

export const liveService = {
  snapshot: () => liveRepository.snapshot(),
};
