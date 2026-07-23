"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  bulkUpdateStatus, createProduct, deleteProducts, fetchProduct, fetchProducts,
  type ProductListParams, updateProduct,
} from "./api";
import type { ProductFormValues } from "./schema";
import type { ProductStatus } from "@/types/domain";

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductListParams) => ["products", "list", params] as const,
  detail: (id: string) => ["products", "detail", id] as const,
};

export function useProducts(params: ProductListParams = {}) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => fetchProducts(params),
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: ProductFormValues) => createProduct(values),
    onSuccess: (product) => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product created", { description: `${product.title} was added to your catalog.` });
    },
    onError: () => toast.error("Failed to create product"),
  });
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: Partial<ProductFormValues>) => updateProduct(id, values),
    onSuccess: (product) => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product updated", { description: `${product.title} was saved.` });
    },
    onError: () => toast.error("Failed to update product"),
  });
}

export function useDeleteProducts() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => deleteProducts(ids),
    onSuccess: (_data, ids) => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success(`${ids.length} product${ids.length > 1 ? "s" : ""} deleted`);
    },
    onError: () => toast.error("Failed to delete products"),
  });
}

export function useBulkUpdateStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ids, status }: { ids: string[]; status: ProductStatus }) => bulkUpdateStatus(ids, status),
    onSuccess: (_data, { ids, status }) => {
      qc.invalidateQueries({ queryKey: productKeys.all });
      toast.success(`${ids.length} product${ids.length > 1 ? "s" : ""} marked as ${status}`);
    },
    onError: () => toast.error("Bulk update failed"),
  });
}
