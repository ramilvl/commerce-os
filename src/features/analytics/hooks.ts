"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchAnalyticsOverview } from "./api";

export function useAnalyticsOverview(rangeDays: number) {
  return useQuery({
    queryKey: ["analytics", "overview", rangeDays],
    queryFn: () => fetchAnalyticsOverview(rangeDays),
  });
}
