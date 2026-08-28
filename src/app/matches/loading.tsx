import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { Skeleton } from "@/components/ui/states";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1400px] space-y-5 px-4 py-8 sm:px-6">
      <div className="border-b border-line pb-5">
        <Skeleton className="h-[30px] w-[200px]" />
      </div>
      <Skeleton className="h-[64px] w-full" />
      <SectionSkeleton rows={14} title={false} />
    </div>
  );
}
