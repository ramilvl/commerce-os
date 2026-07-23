import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function KpiGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-5">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-3 h-7 w-32" />
          <Skeleton className="mt-3 h-3 w-16" />
        </Card>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="flex items-center gap-4 border-b border-border bg-muted/40 px-4 py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 border-b border-border px-4 py-3.5 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={`h-3.5 flex-1 ${c === 0 ? "max-w-[160px]" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ChartCardSkeleton({ height = 300 }: { height?: number }) {
  return (
    <Card className="p-5">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-1 h-3 w-56" />
      <Skeleton className="mt-6 w-full" style={{ height }} />
    </Card>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        <Card className="p-5">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="mt-4 h-32 w-full" />
        </Card>
        <Card className="p-5">
          <Skeleton className="h-5 w-1/4" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="p-5">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-4 h-24 w-full" />
        </Card>
        <Card className="p-5">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="mt-4 h-24 w-full" />
        </Card>
      </div>
    </div>
  );
}

export function ListItemRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="h-9 w-9 rounded-md" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-3 w-16" />
    </div>
  );
}
