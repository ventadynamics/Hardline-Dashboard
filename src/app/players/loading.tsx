import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { Skeleton } from "@/components/ui/states";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1360px] space-y-6 px-4 py-8 sm:px-6">
      <div className="border-b border-line pb-5">
        <Skeleton className="h-[30px] w-[220px]" />
      </div>
      <Skeleton className="h-[64px] w-full" />
      <SectionSkeleton rows={12} title={false} />
    </div>
  );
}
