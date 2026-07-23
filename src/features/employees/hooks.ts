"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchEmployee, fetchEmployees, inviteEmployee, type InviteEmployeeInput } from "./api";

export const employeeKeys = {
  all: ["employees"] as const,
  detail: (id: string) => ["employees", "detail", id] as const,
};

export function useEmployees() {
  return useQuery({ queryKey: employeeKeys.all, queryFn: fetchEmployees });
}

export function useEmployee(id: string) {
  return useQuery({ queryKey: employeeKeys.detail(id), queryFn: () => fetchEmployee(id), enabled: !!id });
}

export function useInviteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (values: InviteEmployeeInput) => inviteEmployee(values),
    onSuccess: (employee) => {
      qc.invalidateQueries({ queryKey: employeeKeys.all });
      toast.success("Invitation sent", { description: `${employee.email} has been invited.` });
    },
    onError: () => toast.error("Failed to send invitation"),
  });
}
