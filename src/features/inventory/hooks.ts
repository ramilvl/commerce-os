"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adjustInventory, fetchInventory, fetchInventoryItem, type InventoryListParams } from "./api";

export const inventoryKeys = {
  all: ["inventory"] as const,
  list: (params: InventoryListParams) => ["inventory", "list", params] as const,
  detail: (id: string) => ["inventory", "detail", id] as const,
};

export function useInventory(params: InventoryListParams = {}) {
  return useQuery({ queryKey: inventoryKeys.list(params), queryFn: () => fetchInventory(params) });
}

export function useInventoryItem(id: string) {
  return useQuery({ queryKey: inventoryKeys.detail(id), queryFn: () => fetchInventoryItem(id), enabled: !!id });
}

export function useAdjustInventory(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (delta: number) => adjustInventory(id, delta),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all });
      toast.success("Inventory updated");
    },
    onError: () => toast.error("Failed to adjust inventory"),
  });
}
