import { Suspense } from "react";
import { GameSummaryBlock, HeroConsole, MapOfPeriodBlock } from "@/features/home/dispatch";
import { RecentMatchesBlock, TopClansBlock, TopPlayersBlock } from "@/features/home/sections";
import { OperationBlock } from "@/features/operations/OperationBlock";
import { Reveal } from "@/components/ui/Reveal";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { Skeleton } from "@/components/ui/states";

export const dynamic = "force-dynamic";

/**
 * Cinematic dispatch home: poster hero with the operator card and live
 * telemetry, then one dense data stream.
 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-12 px-4 py-8 sm:px-6">
      <Suspense fallback={<Skeleton className="h-[420px] w-full" />}>
        <HeroConsole />
      </Suspense>

      <Suspense fallback={<SectionSkeleton rows={4} />}>
        <Reveal>
          <OperationBlock />
        </Reveal>
      </Suspense>

      <Suspense fallback={<SectionSkeleton rows={6} />}>
        <Reveal>
          <RecentMatchesBlock />
        </Reveal>
      </Suspense>

      <div className="grid grid-cols-1 items-start gap-x-8 gap-y-12 xl:grid-cols-2">
        <Suspense fallback={<SectionSkeleton rows={5} />}>
          <Reveal>
            <TopPlayersBlock />
          </Reveal>
        </Suspense>
        <Suspense fallback={<SectionSkeleton rows={5} />}>
          <Reveal delay={80}>
            <TopClansBlock />
          </Reveal>
        </Suspense>
      </div>

      <div className="grid grid-cols-1 items-start gap-x-8 gap-y-12 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Suspense fallback={<SectionSkeleton rows={5} />}>
          <Reveal>
            <GameSummaryBlock />
          </Reveal>
        </Suspense>
        <Suspense fallback={<SectionSkeleton rows={5} />}>
          <Reveal delay={80}>
            <MapOfPeriodBlock />
          </Reveal>
        </Suspense>
      </div>
    </div>
  );
}
