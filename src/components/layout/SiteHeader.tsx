import { liveService, sessionService } from "@/services";
import { HeaderNav, type HeaderUser } from "./HeaderNav";

export async function SiteHeader() {
  const [session, snapshot] = await Promise.all([sessionService.current(), liveService.snapshot()]);
  const user: HeaderUser = {
    username: session.player.username,
    rankTitle: session.player.rankTitle,
    level: session.player.level,
    clanTag: session.clan?.tag ?? null,
    factionTone: "blue",
    playerId: session.player.id,
    notifications: session.notifications,
    liveMatches: snapshot.liveMatches,
  };
  return <HeaderNav user={user} />;
}
