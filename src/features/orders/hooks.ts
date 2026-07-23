"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addOrderNote, fetchOrder, fetchOrders, issueRefund, type OrderListParams, updateOrderStatus } from "./api";
import type { OrderStatus } from "@/types/domain";

export const orderKeys = {
  all: ["orders"] as const,
  list: (params: OrderListParams) => ["orders", "list", params] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};

export function useOrders(params: OrderListParams = {}) {
  return useQuery({ queryKey: orderKeys.list(params), queryFn: () => fetchOrders(params) });
}

export function useOrder(id: string) {
  return useQuery({ queryKey: orderKeys.detail(id), queryFn: () => fetchOrder(id), enabled: !!id });
}

export function useUpdateOrderStatus(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Order status updated");
    },
    onError: () => toast.error("Failed to update order status"),
  });
}

export function useIssueRefund(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ amount, reason }: { amount: number; reason: string }) => issueRefund(id, amount, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Refund issued");
    },
    onError: () => toast.error("Failed to issue refund"),
  });
}

export function useAddOrderNote(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (note: string) => addOrderNote(id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Note added");
    },
    onError: () => toast.error("Failed to add note"),
  });
}
