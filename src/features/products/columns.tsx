"use client";

import Image from "next/image";
import type { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ProductStatusBadge } from "@/components/shared/status-badges";
import { selectionColumn } from "@/components/shared/data-table-selection-column";
import { CATEGORIES } from "@/lib/mock/generators";
import type { Product } from "@/types/domain";

const categoryName = (id: string) => CATEGORIES.find((c) => c.id === id)?.name ?? "Uncategorized";

export const productColumns: ColumnDef<Product, any>[] = [
  selectionColumn<Product>(),
  {
    accessorKey: "title",
    header: "Product",
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
          {row.original.images[0] && (
            <Image src={row.original.images[0].url} alt={row.original.title} fill className="object-cover" sizes="40px" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.original.title}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.sku}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ProductStatusBadge status={row.original.status} />,
  },
  {
    id: "category",
    header: "Category",
    accessorFn: (row) => categoryName(row.categoryId),
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{categoryName(row.original.categoryId)}</span>,
  },
  {
    accessorKey: "inventory",
    header: "Inventory",
    cell: ({ row }) => (
      <span className={`font-mono text-sm tabular-fig ${row.original.inventory === 0 ? "text-danger" : row.original.inventory < 30 ? "text-warning" : ""}`}>
        {formatNumber(row.original.inventory)}
      </span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <span className="font-mono text-sm tabular-fig">{formatCurrency(row.original.price)}</span>,
  },
  {
    accessorKey: "unitsSold",
    header: "Sold",
    cell: ({ row }) => <span className="font-mono text-sm tabular-fig text-muted-foreground">{formatNumber(row.original.unitsSold)}</span>,
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => <span className="font-mono text-sm font-medium tabular-fig">{formatCurrency(row.original.revenue)}</span>,
  },
];
