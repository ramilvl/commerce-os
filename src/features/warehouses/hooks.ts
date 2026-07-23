"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchWarehouse, fetchWarehouses } from "./api";

export function useWarehouses() {
  return useQuery({ queryKey: ["warehouses"], queryFn: fetchWarehouses });
}

export function useWarehouse(id: string) {
  return useQuery({ queryKey: ["warehouses", id], queryFn: () => fetchWarehouse(id), enabled: !!id });
}
