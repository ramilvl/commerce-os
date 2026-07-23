import { delay } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { Coupon } from "@/types/domain";

export async function fetchCoupons(): Promise<Coupon[]> {
  await delay(400);
  return [...db.coupons].sort((a, b) => b.usageCount - a.usageCount);
}

export async function fetchCoupon(id: string): Promise<Coupon> {
  await delay(300);
  const coupon = db.coupons.find((c) => c.id === id);
  if (!coupon) throw new Error("Coupon not found");
  return coupon;
}

export interface CouponFormInput {
  code: string;
  type: Coupon["type"];
  value: number;
  usageLimit: number | null;
  minimumSpend: number | null;
  appliesTo: string;
}

export async function createCoupon(values: CouponFormInput): Promise<Coupon> {
  await delay(500);
  const coupon: Coupon = {
    id: `coup_${Math.random().toString(36).slice(2, 8)}`,
    code: values.code.toUpperCase(),
    type: values.type,
    value: values.value,
    status: "active",
    usageCount: 0,
    usageLimit: values.usageLimit,
    startsAt: new Date().toISOString(),
    endsAt: null,
    minimumSpend: values.minimumSpend,
    appliesTo: values.appliesTo,
  };
  db.coupons.unshift(coupon);
  return coupon;
}

export async function toggleCouponStatus(id: string): Promise<Coupon> {
  await delay(350);
  const idx = db.coupons.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Coupon not found");
  const coupon = db.coupons[idx] as Coupon;
  coupon.status = coupon.status === "active" ? "disabled" : "active";
  return coupon;
}
