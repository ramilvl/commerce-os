"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCampaign, fetchCampaigns } from "./api";

export function useCampaigns() {
  return useQuery({ queryKey: ["campaigns"], queryFn: fetchCampaigns });
}

export function useCampaign(id: string) {
  return useQuery({ queryKey: ["campaigns", id], queryFn: () => fetchCampaign(id), enabled: !!id });
}
