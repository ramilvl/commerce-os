"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import { useAnalyticsOverview } from "@/features/analytics/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { KpiCard } from "@/components/shared/kpi-card";
import { ChartCardSkeleton, KpiGridSkeleton } from "@/components/shared/skeletons";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueAreaChart } from "@/components/shared/charts/revenue-area-chart";
import { ComparisonBarChart } from "@/components/shared/charts/comparison-bar-chart";
import { DualLineChart } from "@/components/shared/charts/dual-line-chart";
import { FunnelChart } from "@/components/shared/charts/funnel-chart";

export default function AnalyticsPage() {
  const [range, setRange] = useState("30");
  const { data, isLoading, isError, refetch } = useAnalyticsOverview(Number(range));

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Deep insights into revenue, sales performance, and customer behavior."
        actions={
          <>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="h-9 w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Report export started")}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
          </>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading || !data ? (
        <div className="space-y-6">
          <KpiGridSkeleton />
          <ChartCardSkeleton />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Revenue" value={formatCurrency(data.kpis.revenue)} delta={data.kpis.revenueDelta} accent="accent" />
            <KpiCard label="Orders" value={formatNumber(data.kpis.orders)} delta={data.kpis.ordersDelta} accent="success" />
            <KpiCard label="Average order value" value={formatCurrency(data.kpis.aov)} delta={data.kpis.aovDelta} />
            <KpiCard label="Conversion rate" value={formatPercent(data.kpis.conversionRate)} delta={data.kpis.conversionDelta} accent="warning" />
          </div>

          <Tabs defaultValue="revenue">
            <TabsList>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="conversion">Conversion</TabsTrigger>
              <TabsTrigger value="growth">Customer growth</TabsTrigger>
              <TabsTrigger value="geo">Geography</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue over time</CardTitle>
                  <p className="text-xs text-muted-foreground">Daily revenue for the selected period</p>
                </CardHeader>
                <CardContent>
                  <RevenueAreaChart data={data.revenueSeries} height={340} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sales">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ComparisonBarChart data={data.categoryPerformance} xKey="name" yKey="revenue" horizontal height={320} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Top products by revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ComparisonBarChart
                      data={data.topProducts.map((p) => ({ title: p.title, revenue: p.revenue }))}
                      xKey="title"
                      yKey="revenue"
                      horizontal
                      height={320}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="conversion">
              <Card>
                <CardHeader>
                  <CardTitle>Conversion funnel</CardTitle>
                  <p className="text-xs text-muted-foreground">From site visit to completed purchase</p>
                </CardHeader>
                <CardContent>
                  <FunnelChart data={data.funnel} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="growth">
              <Card>
                <CardHeader>
                  <CardTitle>Customer growth</CardTitle>
                  <p className="text-xs text-muted-foreground">Total vs. returning customers, last 12 months</p>
                </CardHeader>
                <CardContent>
                  <DualLineChart
                    data={data.customerGrowth}
                    xKey="month"
                    lines={[
                      { key: "customers", label: "Total customers", color: "hsl(var(--accent))" },
                      { key: "returning", label: "Returning customers", color: "hsl(var(--success))" },
                    ]}
                    height={340}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="geo">
              <Card>
                <CardHeader>
                  <CardTitle>Sales by country</CardTitle>
                </CardHeader>
                <CardContent>
                  <ComparisonBarChart data={data.geoSales} xKey="country" yKey="revenue" horizontal height={Math.max(280, data.geoSales.length * 34)} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}
