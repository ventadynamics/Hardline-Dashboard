import type { Metadata } from "next";
import { PlayerProfile } from "@/features/players/PlayerProfile";
import { sessionService } from "@/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Мой профиль",
};

export default async function MyProfilePage() {
  const session = await sessionService.current();
  return <PlayerProfile playerId={session.player.id} isSelf />;
}
