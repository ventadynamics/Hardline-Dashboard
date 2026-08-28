import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { Skeleton } from "@/components/ui/states";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1360px] space-y-10 px-4 py-8 sm:px-6">
      <Skeleton className="h-[124px] w-full" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
        <SectionSkeleton rows={5} />
        <SectionSkeleton rows={5} />
      </div>
      <SectionSkeleton rows={4} />
    </div>
  );
}
