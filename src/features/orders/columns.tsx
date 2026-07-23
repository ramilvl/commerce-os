"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrderStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badges";
import { selectionColumn } from "@/components/shared/data-table-selection-column";
import type { Order } from "@/types/domain";

const CHANNEL_LABELS: Record<Order["channel"], string> = {
  online_store: "Online store",
  pos: "Point of sale",
  marketplace: "Marketplace",
  api: "API",
};

export const orderColumns: ColumnDef<Order, any>[] = [
  selectionColumn<Order>(),
  {
    accessorKey: "number",
    header: "Order",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-sm">{row.original.number}</p>
        <p className="text-xs text-muted-foreground">{formatDate(row.original.createdAt)}</p>
      </div>
    ),
  },
  {
    id: "customer",
    header: "Customer",
    accessorFn: (row) => row.customer.name,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-7 w-7">
          <AvatarImage src={row.original.customer.avatar} alt={row.original.customer.name} />
          <AvatarFallback>{row.original.customer.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <span className="truncate text-sm">{row.original.customer.name}</span>
      </div>
    ),
  },
  {
    id: "channel",
    header: "Channel",
    accessorFn: (row) => CHANNEL_LABELS[row.channel],
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{CHANNEL_LABELS[row.original.channel]}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <OrderStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
  },
  {
    id: "items",
    header: "Items",
    accessorFn: (row) => row.items.reduce((s, i) => s + i.quantity, 0),
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-fig text-muted-foreground">
        {row.original.items.reduce((s, i) => s + i.quantity, 0)}
      </span>
    ),
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => <span className="font-mono text-sm font-medium tabular-fig">{formatCurrency(row.original.total)}</span>,
  },
];
