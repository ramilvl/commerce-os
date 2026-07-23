"use client";

import { useRouter } from "next/navigation";
import { Megaphone, Plus } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useCampaigns } from "@/features/marketing/hooks";
import { campaignColumns } from "@/features/marketing/columns";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ErrorState } from "@/components/shared/error-state";
import { KpiGridSkeleton } from "@/components/shared/skeletons";
import { KpiCard } from "@/components/shared/kpi-card";
import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  const router = useRouter();
  const { data, isLoading, isError, refetch } = useCampaigns();

  const totals = data?.reduce(
    (acc, c) => ({
      sent: acc.sent + c.sent,
      revenue: acc.revenue + c.revenue,
      converted: acc.converted + c.converted,
    }),
    { sent: 0, revenue: 0, converted: 0 }
  );

  return (
    <div>
      <PageHeader
        title="Marketing"
        description="Plan, launch, and measure campaigns across every channel."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast.info("Campaign builder", { description: "This would open the campaign creation flow." })}>
            <Plus className="h-3.5 w-3.5" /> New campaign
          </Button>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading || !totals ? (
        <div className="mb-6">
          <KpiGridSkeleton count={3} />
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <KpiCard label="Total sent" value={formatNumber(totals.sent)} accent="accent" />
          <KpiCard label="Conversions" value={formatNumber(totals.converted)} accent="success" />
          <KpiCard label="Attributed revenue" value={formatCurrency(totals.revenue)} accent="default" />
        </div>
      )}

      {!isError && (
        <DataTable
          columns={campaignColumns}
          data={data ?? []}
          isLoading={isLoading}
          searchKey="name"
          searchPlaceholder="Search campaigns..."
          onRowClick={(row) => router.push(`/marketing/${row.id}`)}
          emptyIcon={Megaphone}
          emptyTitle="No campaigns yet"
          emptyDescription="Launch your first campaign to start reaching customers."
        />
      )}
    </div>
  );
}
