"use client";

import { formatNumber, formatPercent } from "@/lib/utils";

interface FunnelChartProps {
  data: { stage: string; value: number }[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  const max = data[0]?.value ?? 1;
  return (
    <div className="flex flex-col gap-3">
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        const prevValue = i > 0 ? data[i - 1]?.value : undefined;
        const prevPct = i > 0 && prevValue ? (d.value / prevValue) * 100 : 100;
        return (
          <div key={d.stage}>
            <div className="mb-1 flex items-baseline justify-between">
              <span className="text-sm font-medium text-foreground">{d.stage}</span>
              <span className="font-mono text-sm tabular-fig text-muted-foreground">
                {formatNumber(d.value)}
                {i > 0 && <span className="ml-2 text-xs text-muted-foreground/70">{formatPercent(prevPct)} of prev.</span>}
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-accent transition-all duration-700 ease-out"
                style={{ width: `${Math.max(pct, 3)}%`, opacity: 1 - i * 0.12 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
