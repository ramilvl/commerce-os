"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchRole, fetchRoles, updateRolePermissions } from "./api";

export const roleKeys = {
  all: ["roles"] as const,
  detail: (id: string) => ["roles", "detail", id] as const,
};

export function useRoles() {
  return useQuery({ queryKey: roleKeys.all, queryFn: fetchRoles });
}

export function useRole(id: string) {
  return useQuery({ queryKey: roleKeys.detail(id), queryFn: () => fetchRole(id), enabled: !!id });
}

export function useUpdateRolePermissions(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (permissions: string[]) => updateRolePermissions(id, permissions),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.all });
      toast.success("Permissions updated");
    },
    onError: () => toast.error("Failed to update permissions"),
  });
}
