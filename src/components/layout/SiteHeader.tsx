import { sessionService } from "@/services";
import { HeaderNav, type HeaderUser } from "./HeaderNav";

export async function SiteHeader() {
  const session = await sessionService.current();
  const user: HeaderUser = {
    username: session.player.username,
    rankTitle: session.player.rankTitle,
    level: session.player.level,
    clanTag: session.clan?.tag ?? null,
    factionTone: "blue",
    playerId: session.player.id,
    notifications: session.notifications,
  };
  return <HeaderNav user={user} />;
}
