"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orderColumns } from "@/features/orders/columns";
import { useOrders } from "@/features/orders/hooks";
import type { Order, OrderStatus } from "@/types/domain";

export default function OrdersPage() {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [channel, setChannel] = useState<Order["channel"] | "all">("all");
  const { data, isLoading, isError, refetch } = useOrders({ status, channel });

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Track fulfillment, payments, and shipments across every channel."
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
          columns={orderColumns}
          data={data ?? []}
          isLoading={isLoading}
          searchKey="number"
          searchPlaceholder="Search order number..."
          onRowClick={(row) => router.push(`/orders/${row.id}`)}
          enableRowSelection
          emptyIcon={ShoppingCart}
          emptyTitle="No orders found"
          emptyDescription="Orders will appear here as customers check out."
          pageSize={12}
          toolbar={
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={(v) => setStatus(v as OrderStatus | "all")}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={channel} onValueChange={(v) => setChannel(v as Order["channel"] | "all")}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Channel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All channels</SelectItem>
                  <SelectItem value="online_store">Online store</SelectItem>
                  <SelectItem value="pos">Point of sale</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />
      )}
    </div>
  );
}
