import { seededRandom } from "@/lib/utils";
import {
  AI_INSIGHTS, CAMPAIGNS, CATEGORIES, COUPONS, CUSTOMERS, EMPLOYEES, INVENTORY,
  NOTIFICATIONS, ORDERS, PRODUCTS, ROLES, WAREHOUSES,
} from "./generators";

/**
 * In-memory data store standing in for Supabase during development / demo mode.
 * All reads/writes go through this module so the API surface (src/features/*\/api.ts)
 * can be swapped for real Supabase calls without touching UI code.
 */
export const db = {
  products: PRODUCTS,
  categories: CATEGORIES,
  customers: CUSTOMERS,
  orders: ORDERS,
  warehouses: WAREHOUSES,
  inventory: INVENTORY,
  coupons: COUPONS,
  campaigns: CAMPAIGNS,
  employees: EMPLOYEES,
  roles: ROLES,
  notifications: NOTIFICATIONS,
  insights: AI_INSIGHTS,
};

export interface RevenuePoint {
  date: string;
  revenue: number;
  orders: number;
}

export function getRevenueSeries(days: number): RevenuePoint[] {
  const points: RevenuePoint[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const r = seededRandom(i * 97 + days);
    const dt = new Date(Date.now() - i * 86_400_000);
    const weekday = dt.getDay();
    const weekendDip = weekday === 0 || weekday === 6 ? 0.75 : 1;
    const trend = 1 + (days - i) / (days * 6);
    const base = 3200 * weekendDip * trend;
    const revenue = Math.round(base + r() * 1800);
    points.push({
      date: dt.toISOString().slice(0, 10),
      revenue,
      orders: Math.round(revenue / (62 + r() * 20)),
    });
  }
  return points;
}

export interface KpiSummary {
  revenue: number;
  revenueDelta: number;
  orders: number;
  ordersDelta: number;
  aov: number;
  aovDelta: number;
  conversionRate: number;
  conversionDelta: number;
}

export function getKpiSummary(): KpiSummary {
  const series = getRevenueSeries(60);
  const last30 = series.slice(30);
  const prev30 = series.slice(0, 30);
  const sum = (arr: RevenuePoint[], key: keyof RevenuePoint) => arr.reduce((s, p) => s + (p[key] as number), 0);
  const revenue = sum(last30, "revenue");
  const prevRevenue = sum(prev30, "revenue");
  const orders = sum(last30, "orders");
  const prevOrders = sum(prev30, "orders");
  const aov = revenue / orders;
  const prevAov = prevRevenue / prevOrders;
  const pctDelta = (a: number, b: number) => (b === 0 ? 0 : ((a - b) / b) * 100);
  return {
    revenue,
    revenueDelta: pctDelta(revenue, prevRevenue),
    orders,
    ordersDelta: pctDelta(orders, prevOrders),
    aov,
    aovDelta: pctDelta(aov, prevAov),
    conversionRate: 3.42,
    conversionDelta: 0.31,
  };
}

export function getTopProducts(limit = 5) {
  return [...PRODUCTS].sort((a, b) => b.revenue - a.revenue).slice(0, limit);
}

export function getLowStockItems(limit = 6) {
  return [...INVENTORY]
    .filter((i) => i.status === "low_stock" || i.status === "out_of_stock")
    .sort((a, b) => a.available - b.available)
    .slice(0, limit);
}

export function getRecentOrders(limit = 8) {
  return [...ORDERS].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, limit);
}

export function getOrderStatusBreakdown() {
  const counts: Record<string, number> = {};
  ORDERS.forEach((o) => {
    counts[o.status] = (counts[o.status] ?? 0) + 1;
  });
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

export function getCategoryPerformance() {
  return CATEGORIES.map((c) => {
    const prods = PRODUCTS.filter((p) => p.categoryId === c.id);
    return {
      name: c.name,
      revenue: Math.round(prods.reduce((s, p) => s + p.revenue, 0)),
      units: prods.reduce((s, p) => s + p.unitsSold, 0),
    };
  }).sort((a, b) => b.revenue - a.revenue);
}

export function getGeoSales() {
  const byCountry = new Map<string, number>();
  ORDERS.forEach((o) => {
    const key = o.shippingAddress.country;
    byCountry.set(key, (byCountry.get(key) ?? 0) + o.total);
  });
  return Array.from(byCountry.entries())
    .map(([country, revenue]) => ({ country, revenue: Math.round(revenue) }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getCustomerGrowth(months = 12) {
  const points: { month: string; customers: number; returning: number }[] = [];
  let cumulative = 40;
  for (let i = months - 1; i >= 0; i--) {
    const r = seededRandom(i * 51 + 3);
    const dt = new Date();
    dt.setMonth(dt.getMonth() - i);
    cumulative += Math.round(8 + r() * 20);
    points.push({
      month: dt.toLocaleDateString("en-US", { month: "short" }),
      customers: cumulative,
      returning: Math.round(cumulative * (0.32 + r() * 0.12)),
    });
  }
  return points;
}

export function getConversionFunnel() {
  return [
    { stage: "Site visits", value: 128_400 },
    { stage: "Product views", value: 61_200 },
    { stage: "Added to cart", value: 18_900 },
    { stage: "Checkout started", value: 9_450 },
    { stage: "Purchased", value: 4_390 },
  ];
}
