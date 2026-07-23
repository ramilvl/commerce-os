"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Users } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { customerColumns } from "@/features/customers/columns";
import { useCustomers } from "@/features/customers/hooks";
import type { Customer } from "@/types/domain";

export default function CustomersPage() {
  const router = useRouter();
  const [status, setStatus] = useState<Customer["status"] | "all">("all");
  const { data, isLoading, isError, refetch } = useCustomers({ status });

  return (
    <div>
      <PageHeader
        title="Customers"
        description="Understand purchase behavior, lifetime value, and engagement."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Export started")}>
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={customerColumns}
          data={data ?? []}
          isLoading={isLoading}
          searchKey="name"
          searchPlaceholder="Search customers..."
          onRowClick={(row) => router.push(`/customers/${row.id}`)}
          enableRowSelection
          emptyIcon={Users}
          emptyTitle="No customers found"
          pageSize={12}
          toolbar={
            <Select value={status} onValueChange={(v) => setStatus(v as Customer["status"] | "all")}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All customers</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="at_risk">At risk</SelectItem>
                <SelectItem value="churned">Churned</SelectItem>
              </SelectContent>
            </Select>
          }
        />
      )}
    </div>
  );
}
