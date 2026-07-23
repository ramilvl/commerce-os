"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboardOverview } from "./api";

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: fetchDashboardOverview,
  });
}
