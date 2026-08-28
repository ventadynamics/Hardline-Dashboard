# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + React + TypeScript + Tailwind CSS — specified by the owner's master brief (§70). Allowed when needed: TanStack Query, a lightweight chart approach, Lucide icons. No heavy libraries without need. Deploy target: Vercel (assumed default, not explicitly confirmed).

## Users

Players of **Hardline** — a multiplayer tactical RTS set in a modern American urban environment (police, special units, army, criminal factions). They come to the portal to: view their account and profile, personal statistics, player and clan ratings, match history and match details, maps, units, aggregated game statistics, current clan operations (daily/rotating tasks), and live game data.

Secondary audiences the prototype must impress: potential players, artists, programmers, partners, potential publishers, community.

## Product Purpose

The official **companion portal** of the game — conceptually close to Battlelog (BF3/BF4 era). Not a promo landing, not a SaaS dashboard, not a demo. Success: a visitor feels "I opened the official Hardline companion service and I'm looking at data of a real multiplayer system", even on mock data.

## Positioning

A Battlelog-class companion for a modern-American tactical RTS: Battlefield Hardline atmosphere (urban police/crime, red-blue light) + Battlelog information density + modern web UI. Unlike a typical shooter companion, it must surface **RTS-specific statistics** (units deployed/lost, vehicles, objectives, resources, reinforcements).

## Operating Context

- The game is in development; no public backend or API exists yet.
- The portal runs entirely on an interconnected mock dataset that imitates the future API.
- Future API shape (architectural model, not a contract): REST resources for players, clans, leaderboards, matches, maps, units, statistics, operations (`GET /players/:id/stats` etc.); some live sections may later move to WebSocket/SSE.
- Account system exists in UX terms (header: avatar, username, rank, notifications, presence; routes `/profile`, `/settings`) while authentication itself stays mock.
- Community: Discord first (visual slot only); Telegram and others possible later.

## Capabilities and Constraints

- High-fidelity frontend prototype only: no real backend, auth, database, WebSocket, or admin panel at this stage.
- Strict TypeScript; typed domain models (Player, Clan, Match, GameMap, Unit, Faction, GameMode, LeaderboardEntry, Operation, OperationTask, *Stats).
- Data flows UI → Service/Repository → Mock API; components must not know the data origin. Replacing MockRepository with ApiRepository must not touch UI.
- **No game canon exists yet** (user-confirmed 2026-08-27): faction, map, unit, mode names are invented placeholders. All entity names/values must live in the data layer only, so a future API/DB delivers the real ones without UI rewrites. No hardcoded entity names or faction hex colors inside components.
- Clan MMR algorithm is undefined — treat `clanMMR` as a backend-provided value.
- Faction colors are provisional — centralized tokens, changeable in one place.
- Mock data must be large (≈50–100 players, 10–20 clans, several factions/maps/modes, dozens–hundreds of matches), interlinked and mathematically consistent (wins/matches ↔ win rate, clan members exist as players, etc.). Names must feel real (RAVEN, NIGHTSHIFT, Redline…), never Player1/Clan2, never real people.
- Async sections need loading / loaded / empty / error states, styled in-world (no browser-default alerts).
- **UI language: Russian** (user-confirmed 2026-08-27). Entity proper nouns (player names, clan tags, map codenames) may stay Latin. Code, identifiers, and comments stay English.
- Primary target: desktop (1920×1080, 1440×900, 2560×1440); mobile must be usable with simplified navigation and restructured tables, not a literal squeeze.
- Performance discipline: blur/filters/large images/animated gradients used sparingly; no thousands of decorative DOM nodes.

## Brand Commitments

- Name: **Hardline**. No logo or brand assets exist — text-based identity for now.
- The owner's master brief (2026-08-27, in chat) is **binding** on visual direction; headline formula: *Battlefield Hardline atmosphere + Battlelog functionality + modern tactical web UI*. Dark layered surfaces, red/blue as light (not button color), translucency as interface layers (not glassmorphism), rectangular 0–6px shape language, restrained cinematic effects, disciplined technical graphics.
- Binding bans (anti-AI-slop): SaaS/startup landing patterns, purple gradients, big rounded glass cards, identical card grids, giant CTA pills, cyberpunk/sci-fi neon, full military-stencil UI, random decorative technical text, glitch overuse. Full list in the brief; DESIGN.md operationalizes it.
- Do not copy Battlefield logos, assets, layouts, or proprietary graphics — references are direction only; Hardline has its own identity.
- Interface copy tone: short, confident, tactical uppercase labels («ИСТОРИЯ МАТЧЕЙ», «ОПЕРАЦИИ КЛАНА»); no marketing fluff.

## Evidence on Hand

- No real game art, screenshots, footage, or data exist yet. Decorative imagery (vehicle/weapon cutouts, textures) is temporary, sourced from the open web **without license clearance** by the owner's explicit instruction; the owner will replace it with real game art. Composition must survive asset replacement (`/public/images/**` slots). Do not treat this prototype's imagery as shippable.
- Decorative art ≠ gameplay truth: a vehicle on the hero does not imply that unit exists in the game.
- Nothing may fabricate real-world claims: no invented press quotes, real player endorsements, review scores, pricing, or release claims.

## Product Principles

1. **Companion, not landing** — every screen serves a player checking real data; density is welcome, decoration never competes with content.
2. **Part of the game** — the portal must feel like an extension of Hardline's world, not a website about it.
3. **Designed, not generated** — every element has a reason; the brief's anti-slop bans are hard constraints.
4. **API-ready by construction** — UI is blind to data origin; entity truth lives only in the data layer.
5. **Pages share one system but keep character** — cinematic Home, data-heavy leaderboards, tactical match reports; no uniform card grid everywhere.

## Accessibility & Inclusion

Readable contrast on dark surfaces; status never conveyed by color alone (faction colors always paired with text/tag); hover is never the only path to information; keyboard navigation works across nav, tables, and filters (brief §78).
