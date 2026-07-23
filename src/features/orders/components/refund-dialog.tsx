"use client";

import { useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useIssueRefund } from "@/features/orders/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import type { Order } from "@/types/domain";

export function RefundDialog({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(order.total.toString());
  const [reason, setReason] = useState("");
  const issueRefund = useIssueRefund(order.id);

  const handleSubmit = async () => {
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;
    await issueRefund.mutateAsync({ amount: value, reason });
    setOpen(false);
    setReason("");
  };

  const disabled = order.paymentStatus === "refunded";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5" disabled={disabled}>
          <RotateCcw className="h-3.5 w-3.5" /> Issue refund
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue a refund</DialogTitle>
          <DialogDescription>
            Refund order {order.number} for {order.customer.name}. This will be credited to the original payment method.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="refund-amount">Refund amount</Label>
            <Input
              id="refund-amount"
              type="number"
              step="0.01"
              max={order.total}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Maximum refundable: {formatCurrency(order.total)}</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="refund-reason">Reason (internal)</Label>
            <Textarea id="refund-reason" rows={3} placeholder="e.g. Customer requested a return — item arrived damaged." value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={issueRefund.isPending} className="gap-1.5">
            {issueRefund.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Confirm refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
