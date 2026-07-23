"use client";

import { use } from "react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { useCampaign } from "@/features/marketing/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { CampaignStatusBadge } from "@/components/shared/status-badges";
import { FunnelChart } from "@/components/shared/charts/funnel-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: campaign, isLoading, isError, refetch } = useCampaign(id);

  if (isError) {
    return (
      <div>
        <PageHeader title="Campaign" breadcrumbs={[{ label: "Marketing", href: "/marketing" }, { label: "Not found" }]} />
        <ErrorState title="Campaign not found" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !campaign) {
    return (
      <div>
        <PageHeader title="Loading campaign..." breadcrumbs={[{ label: "Marketing", href: "/marketing" }]} />
        <DetailPageSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={campaign.name}
        description={`${campaign.audience} · Started ${formatDate(campaign.startDate)}`}
        breadcrumbs={[{ label: "Marketing", href: "/marketing" }, { label: campaign.name }]}
        actions={
          <>
            <Badge variant="outline" className="capitalize">{campaign.channel}</Badge>
            <CampaignStatusBadge status={campaign.status} />
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Sent</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{formatNumber(campaign.sent)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Opened</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{formatNumber(campaign.opened)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Converted</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{formatNumber(campaign.converted)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig text-accent">{formatCurrency(campaign.revenue)}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <FunnelChart
            data={[
              { stage: "Sent", value: campaign.sent },
              { stage: "Opened", value: campaign.opened },
              { stage: "Clicked", value: campaign.clicked },
              { stage: "Converted", value: campaign.converted },
            ]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
