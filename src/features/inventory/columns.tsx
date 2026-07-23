"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { formatNumber } from "@/lib/utils";
import { InventoryStatusBadge } from "@/components/shared/status-badges";
import type { InventoryItem } from "@/types/domain";

export const inventoryColumns: ColumnDef<InventoryItem, any>[] = [
  {
    accessorKey: "productTitle",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-muted">
          <Image src={row.original.image} alt={row.original.productTitle} fill className="object-cover" sizes="36px" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.original.productTitle}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.sku}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "warehouseName",
    header: "Warehouse",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.warehouseName}</span>,
  },
  {
    accessorKey: "onHand",
    header: "On hand",
    cell: ({ row }) => <span className="font-mono text-sm tabular-fig">{formatNumber(row.original.onHand)}</span>,
  },
  {
    accessorKey: "reserved",
    header: "Reserved",
    cell: ({ row }) => <span className="font-mono text-sm tabular-fig text-muted-foreground">{formatNumber(row.original.reserved)}</span>,
  },
  {
    accessorKey: "available",
    header: "Available",
    cell: ({ row }) => <span className="font-mono text-sm font-medium tabular-fig">{formatNumber(row.original.available)}</span>,
  },
  {
    accessorKey: "incoming",
    header: "Incoming",
    cell: ({ row }) =>
      row.original.incoming > 0 ? (
        <span className="font-mono text-sm tabular-fig text-info">+{formatNumber(row.original.incoming)}</span>
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <InventoryStatusBadge status={row.original.status} />,
  },
];
