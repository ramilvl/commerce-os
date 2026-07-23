"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { CouponStatusBadge } from "@/components/shared/status-badges";
import type { Coupon } from "@/types/domain";

function describeValue(coupon: Coupon) {
  if (coupon.type === "percentage") return `${coupon.value}% off`;
  if (coupon.type === "fixed") return `${formatCurrency(coupon.value)} off`;
  return "Free shipping";
}

export const couponColumns: ColumnDef<Coupon, any>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => <span className="font-mono text-sm font-semibold tabular-fig">{row.original.code}</span>,
  },
  {
    id: "value",
    header: "Discount",
    accessorFn: (row) => describeValue(row),
    cell: ({ row }) => <span className="text-sm">{describeValue(row.original)}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <CouponStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "appliesTo",
    header: "Applies to",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.appliesTo}</span>,
  },
  {
    id: "usage",
    header: "Usage",
    accessorFn: (row) => row.usageCount,
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-fig">
        {formatNumber(row.original.usageCount)}
        {row.original.usageLimit ? ` / ${formatNumber(row.original.usageLimit)}` : ""}
      </span>
    ),
  },
  {
    accessorKey: "startsAt",
    header: "Starts",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.startsAt)}</span>,
  },
  {
    accessorKey: "endsAt",
    header: "Ends",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.endsAt ? formatDate(row.original.endsAt) : "No expiry"}</span>,
  },
];
