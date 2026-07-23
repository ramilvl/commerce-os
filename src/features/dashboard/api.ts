import { delay } from "@/lib/utils";
import {
  getCategoryPerformance, getKpiSummary, getLowStockItems, getOrderStatusBreakdown,
  getRecentOrders, getRevenueSeries, getTopProducts,
} from "@/lib/mock/db";
import { db } from "@/lib/mock/db";

export async function fetchDashboardOverview() {
  await delay(500);
  return {
    kpis: getKpiSummary(),
    revenueSeries: getRevenueSeries(30),
    recentOrders: getRecentOrders(6),
    lowStock: getLowStockItems(5),
    topProducts: getTopProducts(5),
    categoryPerformance: getCategoryPerformance().slice(0, 6),
    orderStatusBreakdown: getOrderStatusBreakdown(),
    insights: db.insights.slice(0, 3),
  };
}
