import { Suspense } from "react";
import {
  HeroScorebug,
  MapOfWeek,
  MiniScorebugs,
  OperatorRail,
  PodiumStrip,
  Ticker,
} from "@/features/home/dispatch";
import { MatchFeed } from "@/features/home/sections";
import { Reveal } from "@/components/ui/Reveal";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { Skeleton } from "@/components/ui/states";

export const dynamic = "force-dynamic";

/**
 * «ЭФИР» — the broadcast desk. Ticker, poster scorebug, mini-scorebug
 * strip, then the dispatch feed with the operator rail, the podium and
 * the operational map. Five layout families, none repeats.
 */
export default function HomePage() {
  return (
    <div className="pb-4">
      <Suspense fallback={<div className="h-[28px] border-b border-line2 bg-carbon1" aria-hidden />}>
        <Ticker />
      </Suspense>

      <h1 className="sr-only">HARDLINE — оперативная сводка</h1>

      <Suspense fallback={<Skeleton className="h-[420px] w-full" />}>
        <HeroScorebug />
      </Suspense>

      <Suspense fallback={null}>
        <MiniScorebugs />
      </Suspense>

      <div className="mx-auto mt-16 max-w-[1400px] space-y-16 px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-x-8 gap-y-12 lg:grid-cols-[2fr_1fr]">
          <Suspense fallback={<SectionSkeleton rows={8} />}>
            <Reveal>
              <MatchFeed />
            </Reveal>
          </Suspense>
          <Suspense fallback={<SectionSkeleton rows={6} />}>
            <Reveal delay={80}>
              <OperatorRail />
            </Reveal>
          </Suspense>
        </div>

        <Suspense fallback={<SectionSkeleton rows={5} />}>
          <Reveal>
            <PodiumStrip />
          </Reveal>
        </Suspense>

        <Suspense fallback={<SectionSkeleton rows={3} />}>
          <Reveal>
            <MapOfWeek />
          </Reveal>
        </Suspense>
      </div>
    </div>
  );
}
