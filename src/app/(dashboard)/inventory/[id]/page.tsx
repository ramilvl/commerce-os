"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { useAdjustInventory, useInventoryItem } from "@/features/inventory/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { InventoryStatusBadge } from "@/components/shared/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: item, isLoading, isError, refetch } = useInventoryItem(id);
  const adjust = useAdjustInventory(id);

  if (isError) {
    return (
      <div>
        <PageHeader title="Inventory" breadcrumbs={[{ label: "Inventory", href: "/inventory" }, { label: "Not found" }]} />
        <ErrorState title="Inventory record not found" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !item) {
    return (
      <div>
        <PageHeader title="Loading..." breadcrumbs={[{ label: "Inventory", href: "/inventory" }]} />
        <DetailPageSkeleton />
      </div>
    );
  }

  const utilization = item.onHand === 0 ? 0 : Math.min(100, (item.available / (item.reorderPoint * 4)) * 100);

  return (
    <div>
      <PageHeader
        title={item.productTitle}
        description={`${item.warehouseName} · SKU ${item.sku}`}
        breadcrumbs={[{ label: "Inventory", href: "/inventory" }, { label: item.productTitle }]}
        actions={<InventoryStatusBadge status={item.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Stock levels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-mono text-2xl font-semibold tabular-fig">{formatNumber(item.onHand)}</p>
                  <p className="text-xs text-muted-foreground">On hand</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-semibold tabular-fig text-warning">{formatNumber(item.reserved)}</p>
                  <p className="text-xs text-muted-foreground">Reserved</p>
                </div>
                <div>
                  <p className="font-mono text-2xl font-semibold tabular-fig text-accent">{formatNumber(item.available)}</p>
                  <p className="text-xs text-muted-foreground">Available</p>
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
                  <span>Stock coverage</span>
                  <span>Reorder point: {item.reorderPoint}</span>
                </div>
                <Progress value={utilization} />
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-border p-3">
                <p className="flex-1 text-sm text-muted-foreground">Adjust on-hand quantity</p>
                <Button variant="outline" size="icon-sm" onClick={() => adjust.mutate(-10)} aria-label="Decrease stock">
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="icon-sm" onClick={() => adjust.mutate(10)} aria-label="Increase stock">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product</span>
                <Link href={`/products/${item.productId}`} className="font-medium text-accent hover:underline">
                  View product
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Warehouse</span>
                <span className="font-medium">{item.warehouseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Incoming</span>
                <span className="font-mono tabular-fig">{item.incoming > 0 ? `+${item.incoming}` : "None scheduled"}</span>
              </div>
            </CardContent>
          </Card>
          <div className="relative h-40 w-full overflow-hidden rounded-xl bg-muted">
            <Image src={item.image} alt={item.productTitle} fill className="object-cover" sizes="400px" />
          </div>
        </div>
      </div>
    </div>
  );
}
