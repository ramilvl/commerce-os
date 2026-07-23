"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCategory, fetchCategories, fetchCategory } from "./api";

export const categoryKeys = {
  all: ["categories"] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

export function useCategories() {
  return useQuery({ queryKey: categoryKeys.all, queryFn: fetchCategories });
}

export function useCategory(id: string) {
  return useQuery({ queryKey: categoryKeys.detail(id), queryFn: () => fetchCategory(id), enabled: !!id });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all });
      toast.success("Category created");
    },
    onError: () => toast.error("Failed to create category"),
  });
}
