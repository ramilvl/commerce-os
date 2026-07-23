import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrderStatusBadge } from "@/components/shared/status-badges";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/domain";

export function RecentOrdersCard({ orders }: { orders: Order[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent orders</CardTitle>
          <p className="mt-0.5 text-xs text-muted-foreground">Latest activity across all sales channels</p>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs">
          <Link href="/orders">
            View all <ArrowUpRight className="h-3 w-3" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center gap-3 border-t border-border px-5 py-3 transition-colors hover:bg-muted/50"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                  <AvatarFallback>{order.customer.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{order.customer.name}</p>
                    <span className="text-xs text-muted-foreground">{order.number}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatRelativeTime(order.createdAt)}</p>
                </div>
                <OrderStatusBadge status={order.status} className="hidden sm:inline-flex" />
                <span className="w-20 shrink-0 text-right font-mono text-sm font-medium tabular-fig">
                  {formatCurrency(order.total)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
