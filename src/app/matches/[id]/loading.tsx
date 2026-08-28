import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { Skeleton } from "@/components/ui/states";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-10 px-4 py-8 sm:px-6">
      <Skeleton className="h-[132px] w-full" />
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionSkeleton rows={5} title={false} />
        <SectionSkeleton rows={5} title={false} />
      </div>
      <SectionSkeleton rows={8} />
    </div>
  );
}
