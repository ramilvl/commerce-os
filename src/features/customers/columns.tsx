"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate, formatNumber, initials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomerStatusBadge } from "@/components/shared/status-badges";
import { selectionColumn } from "@/components/shared/data-table-selection-column";
import type { Customer } from "@/types/domain";

export const customerColumns: ColumnDef<Customer, any>[] = [
  selectionColumn<Customer>(),
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.original.avatar} alt={row.original.name} />
          <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <CustomerStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.location}</span>,
  },
  {
    accessorKey: "ordersCount",
    header: "Orders",
    cell: ({ row }) => <span className="font-mono text-sm tabular-fig">{formatNumber(row.original.ordersCount)}</span>,
  },
  {
    accessorKey: "averageOrderValue",
    header: "AOV",
    cell: ({ row }) => <span className="font-mono text-sm tabular-fig">{formatCurrency(row.original.averageOrderValue)}</span>,
  },
  {
    accessorKey: "lifetimeValue",
    header: "Lifetime value",
    cell: ({ row }) => <span className="font-mono text-sm font-medium tabular-fig">{formatCurrency(row.original.lifetimeValue)}</span>,
  },
  {
    accessorKey: "createdAt",
    header: "Customer since",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.createdAt)}</span>,
  },
];
