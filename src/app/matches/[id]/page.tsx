import type { Metadata } from "next";
import { MatchReport } from "@/features/matches/MatchReport";
import { catalogService, matchService } from "@/services";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const match = await matchService.byId(id);
  if (!match) return { title: "Матч не найден" };
  const map = await catalogService.map(match.mapId);
  return { title: `Матч-репорт: ${map?.name ?? id}` };
}

export default async function MatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MatchReport matchId={id} />;
}
