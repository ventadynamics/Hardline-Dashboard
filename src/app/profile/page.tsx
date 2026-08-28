import type { Metadata } from "next";
import { PlayerProfile } from "@/features/players/PlayerProfile";
import { sessionService } from "@/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Моё досье",
};

export default async function MyProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ breakdown?: string }>;
}) {
  const [sp, session] = await Promise.all([searchParams, sessionService.current()]);
  return (
    <PlayerProfile
      playerId={session.player.id}
      isSelf
      breakdown={sp.breakdown}
      basePath="/profile"
    />
  );
}
