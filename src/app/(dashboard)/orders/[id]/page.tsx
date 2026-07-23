"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, MessageSquarePlus, Truck } from "lucide-react";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import { useAddOrderNote, useOrder, useUpdateOrderStatus } from "@/features/orders/hooks";
import { OrderTimeline } from "@/features/orders/components/order-timeline";
import { RefundDialog } from "@/features/orders/components/refund-dialog";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { OrderStatusBadge, PaymentStatusBadge, FulfillmentStatusBadge, RiskBadge } from "@/components/shared/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { OrderStatus } from "@/types/domain";

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const updateStatus = useUpdateOrderStatus(id);
  const addNote = useAddOrderNote(id);
  const [note, setNote] = useState("");

  if (isError) {
    return (
      <div>
        <PageHeader title="Order" breadcrumbs={[{ label: "Orders", href: "/orders" }, { label: "Not found" }]} />
        <ErrorState title="Order not found" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !order) {
    return (
      <div>
        <PageHeader title="Loading order..." breadcrumbs={[{ label: "Orders", href: "/orders" }]} />
        <DetailPageSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={order.number}
        description={`Placed ${formatDate(order.createdAt, { month: "long", day: "numeric", year: "numeric" })}`}
        breadcrumbs={[{ label: "Orders", href: "/orders" }, { label: order.number }]}
        actions={
          <>
            <RiskBadge status={order.riskLevel} />
            <Select value={order.status} onValueChange={(v) => updateStatus.mutate(v as OrderStatus)}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="fulfilled">Fulfilled</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <RefundDialog order={order} />
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Items</CardTitle>
              <div className="flex gap-2">
                <OrderStatusBadge status={order.status} />
                <PaymentStatusBadge status={order.paymentStatus} />
                <FulfillmentStatusBadge status={order.fulfillmentStatus} />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ul>
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 border-t border-border px-5 py-3.5 first:border-t-0">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={item.image} alt={item.productTitle} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link href={`/products/${item.productId}`} className="truncate text-sm font-medium hover:text-accent">
                        {item.productTitle}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        {item.variant} · SKU {item.sku}
                      </p>
                    </div>
                    <span className="font-mono text-sm tabular-fig text-muted-foreground">×{item.quantity}</span>
                    <span className="w-20 shrink-0 text-right font-mono text-sm font-medium tabular-fig">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <Separator />
              <div className="space-y-1.5 px-5 py-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-fig">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="font-mono tabular-fig">{formatCurrency(order.shipping)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span className="font-mono tabular-fig">{formatCurrency(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span className="font-mono tabular-fig">-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <Separator className="my-2" />
                <div className="flex justify-between text-base font-semibold">
                  <span>Total</span>
                  <span className="font-mono tabular-fig">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.trackingNumber && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-accent" /> Shipment tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between rounded-lg">
                <div>
                  <p className="text-sm font-medium">{order.carrier}</p>
                  <p className="font-mono text-xs tabular-fig text-muted-foreground">{order.trackingNumber}</p>
                </div>
                <Button variant="outline" size="sm">
                  Track shipment
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline events={order.timeline} />
              <Separator className="my-4" />
              <div className="space-y-2">
                <Textarea
                  placeholder="Add an internal note about this order..."
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5"
                  disabled={!note.trim() || addNote.isPending}
                  onClick={async () => {
                    await addNote.mutateAsync(note);
                    setNote("");
                  }}
                >
                  <MessageSquarePlus className="h-3.5 w-3.5" /> Add note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={`/customers/${order.customer.id}`} className="flex items-center gap-3 group">
                <Avatar>
                  <AvatarImage src={order.customer.avatar} alt={order.customer.name} />
                  <AvatarFallback>{initials(order.customer.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium group-hover:text-accent transition-colors">{order.customer.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{order.customer.email}</p>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" /> Shipping address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0.5 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{order.customer.name}</p>
              <p>{order.shippingAddress.line1}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-mono text-xs tabular-fig">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Channel</span>
                <span className="capitalize">{order.channel.replace("_", " ")}</span>
              </div>
              {order.tags.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tags</span>
                  <span className="capitalize">{order.tags.join(", ")}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
