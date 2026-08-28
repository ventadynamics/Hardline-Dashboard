/**
 * Hardline domain model.
 *
 * These types describe what the future game API will return. The mock layer
 * implements them today; an ApiRepository must be able to implement them
 * tomorrow without UI changes. Entity names, colors and numbers are DATA,
 * never constants inside components.
 */

export type FactionSide = "law" | "crime" | "military";
export type FactionColorToken = "blue" | "red" | "olive";

export interface Faction {
  id: string;
  code: string;
  name: string;
  fullName: string;
  side: FactionSide;
  colorToken: FactionColorToken;
  description: string;
}

export interface GameMode {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface GameMap {
  id: string;
  code: string;
  name: string;
  setting: string;
  description: string;
  objectives: string[];
  /** replaceable art slot: /public/images/maps/<file> */
  image: string | null;
}

export type UnitRole =
  | "infantry"
  | "recon"
  | "support"
  | "vehicle"
  | "armor"
  | "air";

export interface UnitStatsBlock {
  health: number;
  armor: number;
  firepower: number;
  range: number;
  mobility: number;
}

export interface Unit {
  id: string;
  code: string;
  name: string;
  factionId: string;
  role: UnitRole;
  roleName: string;
  isVehicle: boolean;
  stats: UnitStatsBlock;
  description: string;
  /** replaceable art slot */
  image?: string | null;
}

export type Presence = "online" | "ingame" | "offline";

export interface Player {
  id: string;
  username: string;
  level: number;
  rankTitle: string;
  rating: number;
  factionId: string;
  clanId: string | null;
  presence: Presence;
  createdAt: string;
}

export interface PlayerAggregates {
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  kills: number;
  deaths: number;
  kd: number;
  assists: number;
  totalScore: number;
  avgScore: number;
  objectivesCaptured: number;
  favoriteUnitId: string;
  favoriteMapId: string;
  favoriteFactionId: string;
}

export interface RatingPoint {
  date: string;
  rating: number;
}

export interface SliceStat {
  /** faction / map / mode id depending on the slice */
  refId: string;
  matches: number;
  wins: number;
  winRate: number;
  avgScore: number;
}

export interface PlayerStats extends PlayerAggregates {
  playerId: string;
  ratingHistory: RatingPoint[];
  activity: { date: string; matches: number }[];
  byFaction: SliceStat[];
  byMap: SliceStat[];
  byMode: SliceStat[];
}

export interface Clan {
  id: string;
  tag: string;
  name: string;
  motto: string;
  factionLeanId: string | null;
  memberIds: string[];
  leaderId: string;
  clanMMR: number;
  createdAt: string;
}

export interface ClanStats {
  clanId: string;
  matches: number;
  wins: number;
  losses: number;
  winRate: number;
  activity7d: number;
  avgMemberRating: number;
}

export interface ScoreboardRow {
  playerId: string;
  clanId: string | null;
  factionId: string;
  score: number;
  kills: number;
  deaths: number;
  assists: number;
  objectiveScore: number;
  unitsLost: number;
}

export interface TeamRtsStats {
  unitsDeployed: number;
  unitsLost: number;
  vehiclesDeployed: number;
  vehiclesLost: number;
  objectivesCaptured: number;
  damageDealt: number;
  damageReceived: number;
  resourcesSpent: number;
  reinforcements: number;
}

export interface UnitUsage {
  unitId: string;
  deployed: number;
  lost: number;
  kills: number;
}

export interface MatchTeam {
  key: "A" | "B";
  factionId: string;
  clanId: string | null;
  score: number;
  rows: ScoreboardRow[];
  rts: TeamRtsStats;
  unitUsage: UnitUsage[];
}

export type MatchEventType =
  | "capture"
  | "hold"
  | "unit_destroyed"
  | "vehicle_destroyed"
  | "reinforcement"
  | "critical_loss";

export interface MatchEvent {
  atSec: number;
  type: MatchEventType;
  factionId: string;
  text: string;
}

export interface Match {
  id: string;
  mapId: string;
  modeId: string;
  startedAt: string;
  durationSec: number;
  teams: [MatchTeam, MatchTeam];
  winner: "A" | "B" | "draw";
  timeline: MatchEvent[];
}

export interface MatchSummary {
  id: string;
  mapId: string;
  modeId: string;
  startedAt: string;
  durationSec: number;
  factionAId: string;
  factionBId: string;
  scoreA: number;
  scoreB: number;
  winner: "A" | "B" | "draw";
  /** result from the viewpoint of the queried player/clan, when one was set */
  perspectiveResult?: "win" | "loss" | "draw";
}

export interface LeaderboardEntry {
  rank: number;
  player: Player;
  stats: PlayerAggregates;
  favoriteUnitId: string;
}

export interface ClanLeaderboardEntry {
  rank: number;
  clan: Clan;
  stats: ClanStats;
}

export interface OperationTask {
  id: string;
  code: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: string | null;
  status: "active" | "done";
}

export interface Operation {
  id: string;
  clanId: string;
  issuedAt: string;
  expiresAt: string;
  tasks: OperationTask[];
}

export interface MapStats {
  mapId: string;
  matches: number;
  avgDurationSec: number;
  avgPlayers: number;
  popularityShare: number;
  winRateBySide: { factionId: string; matches: number; winRate: number }[];
}

export interface UnitGlobalStats {
  unitId: string;
  deployed: number;
  lost: number;
  kills: number;
  effectiveness: number;
  avgSurvivalSec: number;
  popularityShare: number;
}

export interface GlobalStats {
  totalPlayers: number;
  totalClans: number;
  totalMatches: number;
  matchesToday: number;
  avgMatchDurationSec: number;
  mostPlayedMapId: string;
  mostPopularFactionId: string;
  mostUsedUnitId: string;
  factionWinRates: { factionId: string; matches: number; winRate: number }[];
  modeDistribution: { modeId: string; matches: number }[];
}

export interface LiveSnapshot {
  playersOnline: number;
  liveMatches: number;
  activeClans: number;
  matchesToday: number;
  capturedAt: string;
}

export interface NotificationItem {
  id: string;
  kind: "operation" | "match" | "clan" | "system";
  text: string;
  ago: string;
  unread: boolean;
}

export interface SessionUser {
  player: Player;
  clan: Clan | null;
  notifications: NotificationItem[];
}

/* ------------------------------------------------------------------ */
/* Query shapes                                                        */
/* ------------------------------------------------------------------ */

export interface PlayerQuery {
  search?: string;
  factionId?: string;
  clanId?: string;
  sort?: "rating" | "winRate" | "kd" | "score" | "matches";
  limit?: number;
  offset?: number;
}

export interface MatchQuery {
  mapId?: string;
  modeId?: string;
  factionId?: string;
  playerId?: string;
  clanId?: string;
  result?: "any";
  limit?: number;
  offset?: number;
}
