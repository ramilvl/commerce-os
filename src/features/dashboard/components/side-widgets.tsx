import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DonutChart } from "@/components/shared/charts/donut-chart";
import type { Product } from "@/types/domain";

export function TopProductsCard({ products }: { products: Product[] }) {
  const max = products[0]?.revenue ?? 1;
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Top products</CardTitle>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/products">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((p, i) => (
          <Link key={p.id} href={`/products/${p.id}`} className="flex items-center gap-3 group">
            <span className="w-4 shrink-0 font-mono text-xs text-muted-foreground">{i + 1}</span>
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md bg-muted">
              <Image src={p.images[0]?.url ?? ""} alt={p.title} fill className="object-cover" sizes="36px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium group-hover:text-accent transition-colors">{p.title}</p>
              <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-accent" style={{ width: `${(p.revenue / max) * 100}%` }} />
              </div>
            </div>
            <span className="shrink-0 font-mono text-sm font-medium tabular-fig">{formatCurrency(p.revenue)}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending", processing: "Processing", fulfilled: "Fulfilled",
  shipped: "Shipped", delivered: "Delivered", cancelled: "Cancelled", refunded: "Refunded",
};

export function OrderStatusBreakdownCard({ breakdown }: { breakdown: { status: string; count: number }[] }) {
  const total = breakdown.reduce((s, b) => s + b.count, 0);
  const data = breakdown.map((b) => ({ label: STATUS_LABELS[b.status] ?? b.status, value: b.count }));
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order status breakdown</CardTitle>
        <p className="text-xs text-muted-foreground">Last 180 days</p>
      </CardHeader>
      <CardContent>
        <DonutChart data={data} centerValue={formatNumber(total)} centerLabel="Total orders" height={200} />
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((d, i) => (
            <div key={d.label} className="flex items-center gap-1.5 text-xs">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  background: [
                    "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))",
                    "hsl(var(--info))", "hsl(var(--danger))", "hsl(var(--muted-foreground))",
                  ][i % 6],
                }}
              />
              <span className="text-muted-foreground">{d.label}</span>
              <span className="ml-auto font-mono font-medium tabular-fig">{d.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
