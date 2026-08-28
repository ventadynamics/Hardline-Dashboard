import {
  MockCatalogRepository,
  MockClanRepository,
  MockLiveRepository,
  MockMatchRepository,
  MockOperationsRepository,
  MockPlayerRepository,
  MockSessionRepository,
  MockStatsRepository,
} from "./mock";
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

/**
 * The swap point. When the real API arrives, replace these constructors with
 * Api* implementations — nothing above this file changes.
 */

export const catalogRepository: CatalogRepository = new MockCatalogRepository();
export const playerRepository: PlayerRepository = new MockPlayerRepository();
export const clanRepository: ClanRepository = new MockClanRepository();
export const matchRepository: MatchRepository = new MockMatchRepository();
export const statsRepository: StatsRepository = new MockStatsRepository();
export const operationsRepository: OperationsRepository = new MockOperationsRepository();
export const sessionRepository: SessionRepository = new MockSessionRepository();
export const liveRepository: LiveRepository = new MockLiveRepository();
