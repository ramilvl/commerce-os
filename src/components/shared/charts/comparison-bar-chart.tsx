"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";

interface ComparisonBarChartProps {
  data: Record<string, any>[];
  xKey: string;
  yKey: string;
  height?: number;
  horizontal?: boolean;
  colorVar?: string;
  currency?: boolean;
}

function BarTooltip({ active, payload, currency }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs shadow-panel">
      <p className="mb-1 font-medium text-muted-foreground">{p.payload.__label}</p>
      <p className="font-mono font-semibold tabular-fig text-foreground">
        {currency ? formatCurrency(p.value) : formatCompactNumber(p.value)}
      </p>
    </div>
  );
}

export function ComparisonBarChart({
  data, xKey, yKey, height = 280, horizontal = false, colorVar = "--accent", currency = true,
}: ComparisonBarChartProps) {
  const normalized = data.map((d) => ({ ...d, __label: d[xKey] }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={normalized}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 4, right: 8, left: horizontal ? 8 : 0, bottom: 0 }}
        barCategoryGap={horizontal ? 10 : 18}
      >
        <CartesianGrid horizontal={!horizontal} vertical={horizontal} stroke="hsl(var(--border))" />
        {horizontal ? (
          <>
            <XAxis
              type="number"
              tickFormatter={(v) => (currency ? `$${formatCompactNumber(v)}` : formatCompactNumber(v))}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }}
              tickLine={false}
              axisLine={false}
              width={110}
            />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(v) => (currency ? `$${formatCompactNumber(v)}` : formatCompactNumber(v))}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickLine={false}
              axisLine={false}
              width={52}
            />
          </>
        )}
        <Tooltip content={<BarTooltip currency={currency} />} cursor={{ fill: "hsl(var(--muted))" }} />
        <Bar dataKey={yKey} radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]} maxBarSize={horizontal ? 18 : 36}>
          {normalized.map((_, i) => (
            <Cell key={i} fill={`hsl(var(${colorVar}) / ${1 - i * 0.09 > 0.35 ? 1 - i * 0.09 : 0.35})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
