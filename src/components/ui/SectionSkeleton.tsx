import { Skeleton, TableSkeleton } from "./states";

/** Fallback for async sections: plate-shaped blocks, no spinners. */
export function SectionSkeleton({ rows = 5, title = true }: { rows?: number; title?: boolean }) {
  return (
    <div role="status" aria-label="Загрузка раздела">
      {title && (
        <div className="mb-4 border-b border-line pb-2">
          <Skeleton className="h-[20px] w-[200px]" />
        </div>
      )}
      <div className="plate p-3">
        <TableSkeleton rows={rows} />
      </div>
    </div>
  );
}
