import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface KpiCardProps {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon?: LucideIcon;
  accent?: "default" | "success" | "warning" | "danger" | "accent";
  sparkline?: ReactNode;
}

const ACCENT_BAR: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  default: "bg-border-strong",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  accent: "bg-accent",
};

export function KpiCard({ label, value, delta, deltaLabel, icon: Icon, accent = "default", sparkline }: KpiCardProps) {
  const positive = (delta ?? 0) >= 0;

  return (
    <Card className="relative overflow-hidden p-5">
      <span className={cn("absolute inset-y-0 left-0 w-[3px]", ACCENT_BAR[accent])} aria-hidden />
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/60" aria-hidden />}
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-fig tracking-tight text-foreground">{value}</p>
      <div className="mt-2 flex items-center justify-between gap-2">
        {typeof delta === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              positive ? "text-success" : "text-danger"
            )}
          >
            {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta).toFixed(1)}%
            {deltaLabel && <span className="ml-1 font-normal text-muted-foreground">{deltaLabel}</span>}
          </span>
        ) : (
          <span />
        )}
        {sparkline}
      </div>
    </Card>
  );
}
