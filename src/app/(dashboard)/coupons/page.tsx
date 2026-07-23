"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Plus, TicketPercent } from "lucide-react";
import { useCoupons, useCreateCoupon } from "@/features/coupons/hooks";
import { couponColumns } from "@/features/coupons/columns";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").max(20),
  type: z.enum(["percentage", "fixed", "free_shipping"]),
  value: z.coerce.number().min(0),
  minimumSpend: z.coerce.number().optional(),
  appliesTo: z.string().min(1),
});

type CouponFormValues = z.infer<typeof couponSchema>;

export default function CouponsPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useCoupons();
  const createCoupon = useCreateCoupon();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: { code: "", type: "percentage", value: 10, appliesTo: "All products" },
  });

  const type = watch("type");

  const onSubmit = async (values: CouponFormValues) => {
    await createCoupon.mutateAsync({
      code: values.code,
      type: values.type,
      value: values.type === "free_shipping" ? 0 : values.value,
      usageLimit: null,
      minimumSpend: values.minimumSpend ?? null,
      appliesTo: values.appliesTo,
    });
    setOpen(false);
    reset();
  };

  return (
    <div>
      <PageHeader
        title="Coupons"
        description="Create and manage discount codes for your storefront."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Create coupon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create coupon</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="code">Code</Label>
                  <Input id="code" placeholder="e.g. SAVE20" className="uppercase" {...register("code")} />
                  {errors.code && <p className="text-xs text-danger">{errors.code.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Discount type</Label>
                    <Select value={type} onValueChange={(v) => setValue("type", v as CouponFormValues["type"])}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed amount</SelectItem>
                        <SelectItem value="free_shipping">Free shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {type !== "free_shipping" && (
                    <div className="space-y-1.5">
                      <Label htmlFor="value">{type === "percentage" ? "Percent off" : "Amount off"}</Label>
                      <Input id="value" type="number" step="0.01" {...register("value")} />
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="minimumSpend">Minimum spend (optional)</Label>
                  <Input id="minimumSpend" type="number" step="0.01" {...register("minimumSpend")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="appliesTo">Applies to</Label>
                  <Input id="appliesTo" placeholder="e.g. All products" {...register("appliesTo")} />
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createCoupon.isPending} className="gap-1.5">
                    {createCoupon.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Create coupon
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={couponColumns}
          data={data ?? []}
          isLoading={isLoading}
          searchKey="code"
          searchPlaceholder="Search coupon codes..."
          onRowClick={(row) => router.push(`/coupons/${row.id}`)}
          emptyIcon={TicketPercent}
          emptyTitle="No coupons yet"
          emptyDescription="Create your first discount code to boost conversion."
        />
      )}
    </div>
  );
}
