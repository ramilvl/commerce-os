"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatNumber } from "@/lib/utils";

interface DonutChartProps {
  data: { label: string; value: number }[];
  height?: number;
  colors?: string[];
  centerLabel?: string;
  centerValue?: string;
}

const DEFAULT_COLORS = [
  "hsl(var(--accent))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--info))",
  "hsl(var(--danger))",
  "hsl(var(--muted-foreground))",
];

function DonutTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-xs shadow-panel">
      <p className="font-medium text-foreground">{p.name}</p>
      <p className="font-mono tabular-fig text-muted-foreground">{formatNumber(p.value)}</p>
    </div>
  );
}

export function DonutChart({ data, height = 240, colors = DEFAULT_COLORS, centerLabel, centerValue }: DonutChartProps) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            innerRadius="62%"
            outerRadius="88%"
            paddingAngle={2}
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-xl font-semibold tabular-fig text-foreground">{centerValue}</span>
          <span className="text-xs text-muted-foreground">{centerLabel}</span>
        </div>
      )}
    </div>
  );
}
