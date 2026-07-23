import { delay } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { Order, OrderStatus } from "@/types/domain";

export interface OrderListParams {
  status?: OrderStatus | "all";
  channel?: Order["channel"] | "all";
}

export async function fetchOrders(params: OrderListParams = {}): Promise<Order[]> {
  await delay(450);
  let items = [...db.orders];
  if (params.status && params.status !== "all") items = items.filter((o) => o.status === params.status);
  if (params.channel && params.channel !== "all") items = items.filter((o) => o.channel === params.channel);
  return items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function fetchOrder(id: string): Promise<Order> {
  await delay(350);
  const order = db.orders.find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  return order;
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  await delay(450);
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Order not found");
  const order = db.orders[idx] as Order;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  order.timeline = [
    ...order.timeline,
    {
      id: `tl_${Math.random().toString(36).slice(2, 8)}`,
      label: `Status changed to ${status}`,
      description: "Updated manually from the order detail page",
      createdAt: new Date().toISOString(),
      actor: "You",
      type: "system",
    },
  ];
  return order;
}

export async function issueRefund(id: string, amount: number, reason: string): Promise<Order> {
  await delay(700);
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Order not found");
  const order = db.orders[idx] as Order;
  order.paymentStatus = amount >= order.total ? "refunded" : "partially_refunded";
  order.status = amount >= order.total ? "refunded" : order.status;
  order.timeline = [
    ...order.timeline,
    {
      id: `tl_${Math.random().toString(36).slice(2, 8)}`,
      label: `Refund issued — $${amount.toFixed(2)}`,
      description: reason || "Refund processed to original payment method",
      createdAt: new Date().toISOString(),
      actor: "You",
      type: "refund",
    },
  ];
  return order;
}

export async function addOrderNote(id: string, note: string): Promise<Order> {
  await delay(300);
  const idx = db.orders.findIndex((o) => o.id === id);
  if (idx === -1) throw new Error("Order not found");
  const order = db.orders[idx] as Order;
  order.timeline = [
    ...order.timeline,
    {
      id: `tl_${Math.random().toString(36).slice(2, 8)}`,
      label: "Internal note added",
      description: note,
      createdAt: new Date().toISOString(),
      actor: "You",
      type: "note",
    },
  ];
  return order;
}
