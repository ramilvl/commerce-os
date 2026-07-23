"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addCustomerNote, type CustomerListParams, fetchCustomer, fetchCustomerOrders, fetchCustomers,
  updateCustomerStatus,
} from "./api";
import type { Customer } from "@/types/domain";

export const customerKeys = {
  all: ["customers"] as const,
  list: (params: CustomerListParams) => ["customers", "list", params] as const,
  detail: (id: string) => ["customers", "detail", id] as const,
  orders: (id: string) => ["customers", "orders", id] as const,
};

export function useCustomers(params: CustomerListParams = {}) {
  return useQuery({ queryKey: customerKeys.list(params), queryFn: () => fetchCustomers(params) });
}

export function useCustomer(id: string) {
  return useQuery({ queryKey: customerKeys.detail(id), queryFn: () => fetchCustomer(id), enabled: !!id });
}

export function useCustomerOrders(id: string) {
  return useQuery({ queryKey: customerKeys.orders(id), queryFn: () => fetchCustomerOrders(id), enabled: !!id });
}

export function useAddCustomerNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => addCustomerNote(id, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all });
      toast.success("Note added");
    },
    onError: () => toast.error("Failed to add note"),
  });
}

export function useUpdateCustomerStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: Customer["status"]) => updateCustomerStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all });
      toast.success("Customer status updated");
    },
    onError: () => toast.error("Failed to update status"),
  });
}
