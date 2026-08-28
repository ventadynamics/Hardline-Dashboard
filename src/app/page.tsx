import { Suspense } from "react";
import { GameSummaryBlock, LeftConsole, MapOfPeriodBlock } from "@/features/home/dispatch";
import { RecentMatchesBlock, TopClansBlock, TopPlayersBlock } from "@/features/home/sections";
import { OperationBlock } from "@/features/operations/OperationBlock";
import { Reveal } from "@/components/ui/Reveal";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { Skeleton } from "@/components/ui/states";

export const dynamic = "force-dynamic";

/**
 * Split-console home: persistent command column left, data stream right.
 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-7 sm:px-6">
      <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-[330px_minmax(0,1fr)]">
        <aside aria-label="Командная колонна">
          <Suspense fallback={<Skeleton className="h-[520px] w-full" />}>
            <LeftConsole />
          </Suspense>
        </aside>

        <div className="space-y-10 lg:border-l lg:border-line2 lg:pl-10">
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

          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-10 xl:grid-cols-2">
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

          <div className="grid grid-cols-1 items-start gap-x-8 gap-y-10 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
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
      </div>
    </div>
  );
}
