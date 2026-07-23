"use client";

import { use } from "react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { useCoupon, useToggleCouponStatus } from "@/features/coupons/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { CouponStatusBadge } from "@/components/shared/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function CouponDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: coupon, isLoading, isError, refetch } = useCoupon(id);
  const toggleStatus = useToggleCouponStatus();

  if (isError) {
    return (
      <div>
        <PageHeader title="Coupon" breadcrumbs={[{ label: "Coupons", href: "/coupons" }, { label: "Not found" }]} />
        <ErrorState title="Coupon not found" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !coupon) {
    return (
      <div>
        <PageHeader title="Loading coupon..." breadcrumbs={[{ label: "Coupons", href: "/coupons" }]} />
        <DetailPageSkeleton />
      </div>
    );
  }

  const usagePct = coupon.usageLimit ? (coupon.usageCount / coupon.usageLimit) * 100 : null;

  return (
    <div>
      <PageHeader
        title={coupon.code}
        breadcrumbs={[{ label: "Coupons", href: "/coupons" }, { label: coupon.code }]}
        actions={
          <>
            <CouponStatusBadge status={coupon.status} />
            <Button variant="outline" size="sm" onClick={() => toggleStatus.mutate(coupon.id)} disabled={toggleStatus.isPending}>
              {coupon.status === "active" ? "Disable" : "Activate"}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount type</span>
              <span className="capitalize font-medium">{coupon.type.replace("_", " ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Value</span>
              <span className="font-mono font-medium tabular-fig">
                {coupon.type === "percentage" ? `${coupon.value}%` : coupon.type === "fixed" ? formatCurrency(coupon.value) : "Free shipping"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Applies to</span>
              <span>{coupon.appliesTo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum spend</span>
              <span>{coupon.minimumSpend ? formatCurrency(coupon.minimumSpend) : "None"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Starts</span>
              <span>{formatDate(coupon.startsAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ends</span>
              <span>{coupon.endsAt ? formatDate(coupon.endsAt) : "No expiry"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="font-mono text-2xl font-semibold tabular-fig">{formatNumber(coupon.usageCount)}</p>
            <p className="text-xs text-muted-foreground">
              {coupon.usageLimit ? `of ${formatNumber(coupon.usageLimit)} redemptions used` : "Unlimited redemptions"}
            </p>
            {usagePct !== null && <Progress value={usagePct} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
