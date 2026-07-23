"use client";

import { Download, Plus, TrendingUp } from "lucide-react";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { useDashboardOverview } from "@/features/dashboard/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { ChartCardSkeleton, KpiGridSkeleton } from "@/components/shared/skeletons";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RevenueAreaChart } from "@/components/shared/charts/revenue-area-chart";
import { ComparisonBarChart } from "@/components/shared/charts/comparison-bar-chart";
import { RecentOrdersCard } from "@/features/dashboard/components/recent-orders-card";
import { LowStockCard } from "@/features/dashboard/components/low-stock-card";
import { AiInsightsCard } from "@/features/dashboard/components/ai-insights-card";
import { TopProductsCard, OrderStatusBreakdownCard } from "@/features/dashboard/components/side-widgets";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboardOverview();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A real-time overview of revenue, fulfillment, and growth across your store."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" /> Export report
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> New order
            </Button>
          </>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading || !data ? (
        <div className="space-y-6">
          <KpiGridSkeleton />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartCardSkeleton />
            </div>
            <ChartCardSkeleton height={220} />
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Revenue (30d)"
              value={formatCurrency(data.kpis.revenue)}
              delta={data.kpis.revenueDelta}
              deltaLabel="vs prior 30d"
              accent="accent"
              icon={TrendingUp}
            />
            <KpiCard
              label="Orders (30d)"
              value={formatNumber(data.kpis.orders)}
              delta={data.kpis.ordersDelta}
              deltaLabel="vs prior 30d"
              accent="success"
            />
            <KpiCard
              label="Average order value"
              value={formatCurrency(data.kpis.aov)}
              delta={data.kpis.aovDelta}
              deltaLabel="vs prior 30d"
              accent="default"
            />
            <KpiCard
              label="Conversion rate"
              value={formatPercent(data.kpis.conversionRate)}
              delta={data.kpis.conversionDelta}
              deltaLabel="vs prior 30d"
              accent="warning"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue trend</CardTitle>
                <p className="text-xs text-muted-foreground">Daily revenue over the last 30 days</p>
              </CardHeader>
              <CardContent>
                <RevenueAreaChart data={data.revenueSeries} />
              </CardContent>
            </Card>
            <OrderStatusBreakdownCard breakdown={data.orderStatusBreakdown} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <RecentOrdersCard orders={data.recentOrders} />
            <div className="space-y-6">
              <LowStockCard items={data.lowStock} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue by category</CardTitle>
                <p className="text-xs text-muted-foreground">Top performing categories this period</p>
              </CardHeader>
              <CardContent>
                <ComparisonBarChart data={data.categoryPerformance} xKey="name" yKey="revenue" horizontal height={260} />
              </CardContent>
            </Card>
            <TopProductsCard products={data.topProducts} />
          </div>

          <AiInsightsCard insights={data.insights} />
        </div>
      )}
    </div>
  );
}
