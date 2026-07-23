"use client";

import { use, useState } from "react";
import Link from "next/link";
import { Activity, Mail, MapPin, Phone, StickyNote } from "lucide-react";
import { formatCurrency, formatDate, formatRelativeTime, initials } from "@/lib/utils";
import { useAddCustomerNote, useCustomer, useCustomerOrders } from "@/features/customers/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import { CustomerStatusBadge, OrderStatusBadge } from "@/components/shared/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag } from "lucide-react";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: customer, isLoading, isError, refetch } = useCustomer(id);
  const { data: orders, isLoading: ordersLoading } = useCustomerOrders(id);
  const addNote = useAddCustomerNote(id);
  const [noteText, setNoteText] = useState("");

  if (isError) {
    return (
      <div>
        <PageHeader title="Customer" breadcrumbs={[{ label: "Customers", href: "/customers" }, { label: "Not found" }]} />
        <ErrorState title="Customer not found" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !customer) {
    return (
      <div>
        <PageHeader title="Loading customer..." breadcrumbs={[{ label: "Customers", href: "/customers" }]} />
        <DetailPageSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={customer.name}
        breadcrumbs={[{ label: "Customers", href: "/customers" }, { label: customer.name }]}
        actions={<CustomerStatusBadge status={customer.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center pt-6 text-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="text-lg">{initials(customer.name)}</AvatarFallback>
              </Avatar>
              <p className="mt-3 text-base font-semibold">{customer.name}</p>
              <p className="text-xs text-muted-foreground">Customer since {formatDate(customer.createdAt)}</p>
              <div className="mt-4 w-full space-y-2 text-left text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5 shrink-0" />
                  <span>{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{customer.location}</span>
                </div>
              </div>
              {customer.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {customer.tags.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Lifetime value</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total spent</span>
                <span className="font-mono font-medium tabular-fig">{formatCurrency(customer.totalSpent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Lifetime value</span>
                <span className="font-mono font-semibold tabular-fig text-accent">{formatCurrency(customer.lifetimeValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg. order value</span>
                <span className="font-mono font-medium tabular-fig">{formatCurrency(customer.averageOrderValue)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total orders</span>
                <span className="font-mono font-medium tabular-fig">{customer.ordersCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Marketing</span>
                <span>{customer.marketingOptIn ? "Subscribed" : "Not subscribed"}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Purchase history</TabsTrigger>
              <TabsTrigger value="activity">Activity log</TabsTrigger>
              <TabsTrigger value="notes">Notes ({customer.notes.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card>
                <CardContent className="p-0">
                  {ordersLoading ? (
                    <div className="p-5 text-sm text-muted-foreground">Loading orders...</div>
                  ) : orders && orders.length > 0 ? (
                    <ul>
                      {orders.map((order) => (
                        <li key={order.id}>
                          <Link href={`/orders/${order.id}`} className="flex items-center gap-3 border-t border-border px-5 py-3.5 first:border-t-0 transition-colors hover:bg-muted/50">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium">{order.number}</p>
                              <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)} · {order.items.reduce((s, i) => s + i.quantity, 0)} items</p>
                            </div>
                            <OrderStatusBadge status={order.status} />
                            <span className="w-20 shrink-0 text-right font-mono text-sm font-medium tabular-fig">{formatCurrency(order.total)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState icon={ShoppingBag} title="No orders yet" description="This customer hasn't placed any orders." className="border-0" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="p-0">
                  {customer.activity.length > 0 ? (
                    <ul>
                      {customer.activity.map((event) => (
                        <li key={event.id} className="flex items-start gap-3 border-t border-border px-5 py-3.5 first:border-t-0">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm">{event.description}</p>
                            <p className="text-xs text-muted-foreground">{formatRelativeTime(event.createdAt)}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState icon={Activity} title="No activity recorded" className="border-0" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Leave an internal note about this customer..."
                      rows={3}
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                    />
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={!noteText.trim() || addNote.isPending}
                      onClick={async () => {
                        await addNote.mutateAsync(noteText);
                        setNoteText("");
                      }}
                    >
                      <StickyNote className="h-3.5 w-3.5" /> Add note
                    </Button>
                  </div>
                  {customer.notes.length > 0 ? (
                    <ul className="space-y-3 border-t border-border pt-4">
                      {customer.notes.map((note) => (
                        <li key={note.id} className="rounded-lg border border-border bg-muted/30 p-3">
                          <p className="text-sm">{note.content}</p>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {note.author} · {formatRelativeTime(note.createdAt)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <EmptyState icon={StickyNote} title="No notes yet" description="Notes you add will be visible to your whole team." className="border-0" />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
