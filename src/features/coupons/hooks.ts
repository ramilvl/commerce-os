"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCoupon, type CouponFormInput, fetchCoupon, fetchCoupons, toggleCouponStatus } from "./api";

export const couponKeys = {
  all: ["coupons"] as const,
  detail: (id: string) => ["coupons", "detail", id] as const,
};

export function useCoupons() {
  return useQuery({ queryKey: couponKeys.all, queryFn: fetchCoupons });
}

export function useCoupon(id: string) {
  return useQuery({ queryKey: couponKeys.detail(id), queryFn: () => fetchCoupon(id), enabled: !!id });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: CouponFormInput) => createCoupon(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: couponKeys.all });
      toast.success("Coupon created");
    },
    onError: () => toast.error("Failed to create coupon"),
  });
}

export function useToggleCouponStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleCouponStatus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: couponKeys.all });
      toast.success("Coupon status updated");
    },
    onError: () => toast.error("Failed to update coupon"),
  });
}
