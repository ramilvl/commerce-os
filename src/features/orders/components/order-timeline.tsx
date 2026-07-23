import {
  CreditCard, MessageSquare, Package, RotateCcw, ShoppingBag, Truck, type LucideIcon,
} from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import type { OrderTimelineEvent } from "@/types/domain";

const TYPE_ICON: Record<OrderTimelineEvent["type"], LucideIcon> = {
  order: ShoppingBag,
  payment: CreditCard,
  shipment: Truck,
  note: MessageSquare,
  refund: RotateCcw,
  system: Package,
};

const TYPE_COLOR: Record<OrderTimelineEvent["type"], string> = {
  order: "bg-accent-subtle text-accent",
  payment: "bg-success-subtle text-success",
  shipment: "bg-info-subtle text-info",
  note: "bg-secondary text-secondary-foreground",
  refund: "bg-danger-subtle text-danger",
  system: "bg-muted text-muted-foreground",
};

export function OrderTimeline({ events }: { events: OrderTimelineEvent[] }) {
  const sorted = [...events].reverse();
  return (
    <ol className="relative space-y-5 before:absolute before:left-[15px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
      {sorted.map((event) => {
        const Icon = TYPE_ICON[event.type];
        return (
          <li key={event.id} className="relative flex gap-3 pl-0">
            <div className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", TYPE_COLOR[event.type])}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 pb-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <p className="text-sm font-medium">{event.label}</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(event.createdAt)}</p>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
              <p className="mt-0.5 text-xs text-muted-foreground/70">by {event.actor}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
