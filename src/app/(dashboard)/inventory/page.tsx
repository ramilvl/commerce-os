"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Boxes, Download } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { inventoryColumns } from "@/features/inventory/columns";
import { useInventory } from "@/features/inventory/hooks";
import { WAREHOUSES } from "@/lib/mock/generators";
import type { InventoryItem } from "@/types/domain";

export default function InventoryPage() {
  const router = useRouter();
  const [warehouseId, setWarehouseId] = useState("all");
  const [status, setStatus] = useState<InventoryItem["status"] | "all">("all");
  const { data, isLoading, isError, refetch } = useInventory({ warehouseId, status });

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Monitor stock levels, reservations, and incoming shipments across warehouses."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Export started")}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={inventoryColumns}
          data={data ?? []}
          isLoading={isLoading}
          searchKey="productTitle"
          searchPlaceholder="Search inventory..."
          onRowClick={(row) => router.push(`/inventory/${row.id}`)}
          emptyIcon={Boxes}
          emptyTitle="No inventory records found"
          pageSize={12}
          toolbar={
            <div className="flex items-center gap-2">
              <Select value={warehouseId} onValueChange={setWarehouseId}>
                <SelectTrigger className="h-8 w-44 text-xs">
                  <SelectValue placeholder="Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All warehouses</SelectItem>
                  {WAREHOUSES.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={(v) => setStatus(v as InventoryItem["status"] | "all")}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="in_stock">In stock</SelectItem>
                  <SelectItem value="low_stock">Low stock</SelectItem>
                  <SelectItem value="out_of_stock">Out of stock</SelectItem>
                  <SelectItem value="overstock">Overstock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />
      )}
    </div>
  );
}
