import { Skeleton, TableSkeleton } from "./states";

/** Fallback for async home/page sections while their data loads. */
export function SectionSkeleton({ rows = 5, title = true }: { rows?: number; title?: boolean }) {
  return (
    <div role="status" aria-label="Загрузка раздела">
      {title && (
        <div className="mb-4 border-b border-line pb-2">
          <Skeleton className="h-[17px] w-[180px]" />
        </div>
      )}
      <div className="frame p-3">
        <TableSkeleton rows={rows} />
      </div>
    </div>
  );
}
