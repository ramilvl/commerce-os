"use client";

import Link from "next/link";
import { Warehouse as WarehouseIcon } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useWarehouses } from "@/features/warehouses/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function WarehousesPage() {
  const { data, isLoading, isError, refetch } = useWarehouses();

  return (
    <div>
      <PageHeader title="Warehouses" description="Monitor fulfillment centers and their capacity utilization." />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-44 w-full rounded-xl" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState icon={WarehouseIcon} title="No warehouses configured" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((wh) => (
            <Link key={wh.id} href={`/warehouses/${wh.id}`}>
              <Card className="h-full transition-shadow hover:shadow-panel">
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <div>
                    <CardTitle>{wh.name}</CardTitle>
                    <p className="mt-0.5 text-xs text-muted-foreground">{wh.code}</p>
                  </div>
                  <Badge variant={wh.status === "active" ? "success" : "outline"} className="capitalize">
                    {wh.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {wh.address.city}, {wh.address.state} · Managed by {wh.manager}
                  </p>
                  <div>
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>Capacity utilization</span>
                      <span className="font-mono tabular-fig">{wh.utilization}%</span>
                    </div>
                    <Progress value={wh.utilization} indicatorClassName={wh.utilization > 85 ? "bg-warning" : undefined} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-mono font-medium tabular-fig text-foreground">{formatNumber(wh.itemCount)}</span> items ·{" "}
                    {formatNumber(wh.capacity)} capacity
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
