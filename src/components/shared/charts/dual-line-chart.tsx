"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatNumber } from "@/lib/utils";

interface DualLineChartProps {
  data: Record<string, any>[];
  xKey: string;
  lines: { key: string; label: string; color: string }[];
  height?: number;
}

function LineTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs shadow-panel">
      <p className="mb-1 font-medium text-muted-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} className="flex items-center gap-1.5 font-mono tabular-fig text-foreground">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
          {p.name}: {formatNumber(p.value)}
        </p>
      ))}
    </div>
  );
}

export function DualLineChart({ data, xKey, lines, height = 280 }: DualLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
        <YAxis tickFormatter={(v) => formatNumber(v)} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} width={44} />
        <Tooltip content={<LineTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
        />
        {lines.map((l) => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={l.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
