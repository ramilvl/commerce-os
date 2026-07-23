"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Package, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/shared/error-state";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { productColumns } from "@/features/products/columns";
import { useBulkUpdateStatus, useDeleteProducts, useProducts } from "@/features/products/hooks";
import { CATEGORIES } from "@/lib/mock/generators";
import type { Product, ProductStatus } from "@/types/domain";

export default function ProductsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [selected, setSelected] = useState<Product[]>([]);

  const { data, isLoading, isError, refetch } = useProducts({ status, categoryId });
  const bulkUpdateStatus = useBulkUpdateStatus();
  const deleteProducts = useDeleteProducts();

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your catalog, pricing, variants, and inventory."
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info("CSV import", { description: "Upload a CSV to bulk-import products." })}>
              <Upload className="h-3.5 w-3.5" /> Import
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.success("Export started", { description: "Your CSV will download shortly." })}>
              <Download className="h-3.5 w-3.5" /> Export
            </Button>
            <Button size="sm" className="gap-1.5" onClick={() => router.push("/products/new")}>
              <Plus className="h-3.5 w-3.5" /> Add product
            </Button>
          </>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={productColumns}
          data={data ?? []}
          isLoading={isLoading}
          searchKey="title"
          searchPlaceholder="Search products..."
          onRowClick={(row) => router.push(`/products/${row.id}`)}
          enableRowSelection
          onSelectionChange={setSelected}
          emptyIcon={Package}
          emptyTitle="No products found"
          emptyDescription="Try a different filter, or add your first product to get started."
          toolbar={
            <div className="flex items-center gap-2">
              <Select value={status} onValueChange={(v) => setStatus(v as ProductStatus | "all")}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="h-8 w-40 text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selected.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs">
                      Bulk actions ({selected.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => bulkUpdateStatus.mutate({ ids: selected.map((p) => p.id), status: "active" })}>
                      Mark as active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulkUpdateStatus.mutate({ ids: selected.map((p) => p.id), status: "draft" })}>
                      Mark as draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => bulkUpdateStatus.mutate({ ids: selected.map((p) => p.id), status: "archived" })}>
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem destructive onClick={() => deleteProducts.mutate(selected.map((p) => p.id))}>
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          }
        />
      )}
    </div>
  );
}
