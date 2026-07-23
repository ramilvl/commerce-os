import { Badge, type BadgeProps } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Variant = NonNullable<BadgeProps["variant"]>;

function makeStatusBadge<T extends string>(map: Record<T, { label: string; variant: Variant }>) {
  return function StatusBadgeComponent({ status, className }: { status: T; className?: string }) {
    const cfg = map[status];
    return (
      <Badge variant={cfg.variant} className={cn("capitalize", className)}>
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        {cfg.label}
      </Badge>
    );
  };
}

export const OrderStatusBadge = makeStatusBadge({
  pending: { label: "Pending", variant: "warning" },
  processing: { label: "Processing", variant: "info" },
  fulfilled: { label: "Fulfilled", variant: "info" },
  shipped: { label: "Shipped", variant: "accent" },
  delivered: { label: "Delivered", variant: "success" },
  cancelled: { label: "Cancelled", variant: "outline" },
  refunded: { label: "Refunded", variant: "danger" },
});

export const PaymentStatusBadge = makeStatusBadge({
  paid: { label: "Paid", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
  refunded: { label: "Refunded", variant: "outline" },
  partially_refunded: { label: "Partial refund", variant: "outline" },
});

export const FulfillmentStatusBadge = makeStatusBadge({
  unfulfilled: { label: "Unfulfilled", variant: "outline" },
  partial: { label: "Partial", variant: "warning" },
  fulfilled: { label: "Fulfilled", variant: "success" },
});

export const ProductStatusBadge = makeStatusBadge({
  active: { label: "Active", variant: "success" },
  draft: { label: "Draft", variant: "outline" },
  archived: { label: "Archived", variant: "default" },
});

export const InventoryStatusBadge = makeStatusBadge({
  in_stock: { label: "In stock", variant: "success" },
  low_stock: { label: "Low stock", variant: "warning" },
  out_of_stock: { label: "Out of stock", variant: "danger" },
  overstock: { label: "Overstock", variant: "info" },
});

export const CustomerStatusBadge = makeStatusBadge({
  active: { label: "Active", variant: "success" },
  vip: { label: "VIP", variant: "accent" },
  at_risk: { label: "At risk", variant: "warning" },
  churned: { label: "Churned", variant: "outline" },
});

export const CouponStatusBadge = makeStatusBadge({
  active: { label: "Active", variant: "success" },
  scheduled: { label: "Scheduled", variant: "info" },
  expired: { label: "Expired", variant: "outline" },
  disabled: { label: "Disabled", variant: "default" },
});

export const CampaignStatusBadge = makeStatusBadge({
  active: { label: "Active", variant: "success" },
  scheduled: { label: "Scheduled", variant: "info" },
  draft: { label: "Draft", variant: "outline" },
  completed: { label: "Completed", variant: "default" },
});

export const EmployeeStatusBadge = makeStatusBadge({
  active: { label: "Active", variant: "success" },
  invited: { label: "Invited", variant: "info" },
  suspended: { label: "Suspended", variant: "danger" },
});

export const RiskBadge = makeStatusBadge({
  low: { label: "Low risk", variant: "success" },
  medium: { label: "Medium risk", variant: "warning" },
  high: { label: "High risk", variant: "danger" },
});
