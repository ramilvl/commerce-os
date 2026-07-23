"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactNumber, formatCurrency, formatDate } from "@/lib/utils";

interface RevenueAreaChartProps {
  data: { date: string; revenue: number; orders: number }[];
  height?: number;
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs shadow-panel">
      <p className="mb-1 font-medium text-muted-foreground">{formatDate(label, { month: "short", day: "numeric" })}</p>
      <p className="font-mono font-semibold tabular-fig text-foreground">{formatCurrency(payload[0].value)}</p>
      <p className="text-muted-foreground">{payload[0].payload.orders} orders</p>
    </div>
  );
}

export function RevenueAreaChart({ data, height = 300 }: RevenueAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.28} />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatDate(v, { month: "short", day: "numeric" })}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          minTickGap={32}
        />
        <YAxis
          tickFormatter={(v) => `$${formatCompactNumber(v)}`}
          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
          tickLine={false}
          axisLine={false}
          width={56}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "hsl(var(--accent))", strokeWidth: 1, strokeDasharray: "4 4" }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--accent))"
          strokeWidth={2}
          fill="url(#revenueFill)"
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
