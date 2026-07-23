"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/lib/utils";
import { useWarehouse } from "@/features/warehouses/hooks";
import { useInventory } from "@/features/inventory/hooks";
import { inventoryColumns } from "@/features/inventory/columns";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ErrorState } from "@/components/shared/error-state";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function WarehouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: warehouse, isLoading, isError, refetch } = useWarehouse(id);
  const { data: inventory, isLoading: inventoryLoading } = useInventory({ warehouseId: id });

  if (isError) {
    return (
      <div>
        <PageHeader title="Warehouse" breadcrumbs={[{ label: "Warehouses", href: "/warehouses" }, { label: "Not found" }]} />
        <ErrorState title="Warehouse not found" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !warehouse) {
    return (
      <div>
        <PageHeader title="Loading warehouse..." breadcrumbs={[{ label: "Warehouses", href: "/warehouses" }]} />
        <DetailPageSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={warehouse.name}
        description={`${warehouse.address.line1}, ${warehouse.address.city}, ${warehouse.address.state} · Managed by ${warehouse.manager}`}
        breadcrumbs={[{ label: "Warehouses", href: "/warehouses" }, { label: warehouse.name }]}
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Items stored</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{formatNumber(warehouse.itemCount)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Capacity</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{formatNumber(warehouse.capacity)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Utilization</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{warehouse.utilization}%</p>
          <Progress value={warehouse.utilization} className="mt-2" />
        </Card>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-foreground">Inventory at this location</h2>
      <DataTable
        columns={inventoryColumns}
        data={inventory ?? []}
        isLoading={inventoryLoading}
        searchKey="productTitle"
        searchPlaceholder="Search inventory..."
        onRowClick={(row) => router.push(`/inventory/${row.id}`)}
        emptyTitle="No inventory at this warehouse"
      />
    </div>
  );
}
