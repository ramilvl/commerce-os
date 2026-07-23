import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AiInsight } from "@/types/domain";

const IMPACT_STYLES: Record<AiInsight["impact"], string> = {
  high: "text-danger bg-danger-subtle",
  medium: "text-warning bg-warning-subtle",
  low: "text-muted-foreground bg-muted",
};

export function AiInsightsCard({ insights }: { insights: AiInsight[] }) {
  return (
    <Card className="border-accent/20 bg-gradient-to-br from-accent-subtle/40 to-transparent">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <CardTitle>AI recommendations</CardTitle>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/ai-assistant">
            Open assistant <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-lg border border-border bg-surface p-3.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium leading-snug">{insight.title}</p>
              <Badge className={cn("shrink-0 capitalize", IMPACT_STYLES[insight.impact])}>{insight.impact} impact</Badge>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{insight.description}</p>
            <p className="mt-2 text-[11px] font-medium text-accent">{insight.confidence}% confidence</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
