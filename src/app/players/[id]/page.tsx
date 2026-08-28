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
  return { title: player ? `${player.username} — досье` : "Игрок не найден" };
}

export default async function PlayerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ breakdown?: string }>;
}) {
  const [{ id }, sp, session] = await Promise.all([params, searchParams, sessionService.current()]);
  return (
    <PlayerProfile
      playerId={id}
      isSelf={session.player.id === id}
      breakdown={sp.breakdown}
      basePath={`/players/${id}`}
    />
  );
}
