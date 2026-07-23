"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatCurrency, formatDate, formatNumber, formatPercent } from "@/lib/utils";
import { CampaignStatusBadge } from "@/components/shared/status-badges";
import { Badge } from "@/components/ui/badge";
import type { Campaign } from "@/types/domain";

const CHANNEL_LABEL: Record<Campaign["channel"], string> = {
  email: "Email", sms: "SMS", social: "Social", search: "Search",
};

export const campaignColumns: ColumnDef<Campaign, any>[] = [
  {
    accessorKey: "name",
    header: "Campaign",
    cell: ({ row }) => (
      <div>
        <p className="text-sm font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground">{row.original.audience}</p>
      </div>
    ),
  },
  {
    id: "channel",
    header: "Channel",
    accessorFn: (row) => CHANNEL_LABEL[row.channel],
    cell: ({ row }) => <Badge variant="outline">{CHANNEL_LABEL[row.original.channel]}</Badge>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <CampaignStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "sent",
    header: "Sent",
    cell: ({ row }) => <span className="font-mono text-sm tabular-fig">{formatNumber(row.original.sent)}</span>,
  },
  {
    id: "openRate",
    header: "Open rate",
    accessorFn: (row) => (row.sent ? (row.opened / row.sent) * 100 : 0),
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-fig">{formatPercent(row.original.sent ? (row.original.opened / row.original.sent) * 100 : 0)}</span>
    ),
  },
  {
    id: "conversionRate",
    header: "Conv. rate",
    accessorFn: (row) => (row.sent ? (row.converted / row.sent) * 100 : 0),
    cell: ({ row }) => (
      <span className="font-mono text-sm tabular-fig">{formatPercent(row.original.sent ? (row.original.converted / row.original.sent) * 100 : 0)}</span>
    ),
  },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ row }) => <span className="font-mono text-sm font-medium tabular-fig">{formatCurrency(row.original.revenue)}</span>,
  },
  {
    accessorKey: "startDate",
    header: "Started",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.startDate)}</span>,
  },
];
