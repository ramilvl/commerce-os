import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, PackageX } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { InventoryStatusBadge } from "@/components/shared/status-badges";
import type { InventoryItem } from "@/types/domain";

export function LowStockCard({ items }: { items: InventoryItem[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Inventory alerts</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">Items approaching or below reorder point</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/inventory">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {items.length === 0 ? (
          <div className="px-5 pb-5">
            <EmptyState icon={PackageX} title="No stock alerts" description="All tracked items are above their reorder point." />
          </div>
        ) : (
          <ul>
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 border-t border-border px-5 py-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={item.image} alt={item.productTitle} fill className="object-cover" sizes="36px" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.productTitle}</p>
                  <p className="text-xs text-muted-foreground">{item.warehouseName}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-medium tabular-fig">{item.available} left</p>
                  <InventoryStatusBadge status={item.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
