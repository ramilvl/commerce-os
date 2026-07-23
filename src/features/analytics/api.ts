import { delay } from "@/lib/utils";
import {
  getCategoryPerformance, getConversionFunnel, getCustomerGrowth, getGeoSales,
  getKpiSummary, getRevenueSeries, getTopProducts,
} from "@/lib/mock/db";

export async function fetchAnalyticsOverview(rangeDays: number) {
  await delay(500);
  return {
    kpis: getKpiSummary(),
    revenueSeries: getRevenueSeries(rangeDays),
    categoryPerformance: getCategoryPerformance(),
    topProducts: getTopProducts(8),
    geoSales: getGeoSales(),
    customerGrowth: getCustomerGrowth(12),
    funnel: getConversionFunnel(),
  };
}
