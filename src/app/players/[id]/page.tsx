import type { Metadata } from "next";
import { PlayerProfile } from "@/features/players/PlayerProfile";
import { playerService, sessionService } from "@/services";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const player = await playerService.byId(id);
  return { title: player ? `${player.username} — профиль` : "Игрок не найден" };
}

export default async function PlayerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await sessionService.current();
  return <PlayerProfile playerId={id} isSelf={session.player.id === id} />;
}
