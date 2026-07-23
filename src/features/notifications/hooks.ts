"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from "./api";

export const notificationsKeys = {
  all: ["notifications"] as const,
};

export function useNotifications() {
  return useQuery({
    queryKey: notificationsKeys.all,
    queryFn: fetchNotifications,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: notificationsKeys.all });
      const previous = qc.getQueryData(notificationsKeys.all);
      qc.setQueryData<Awaited<ReturnType<typeof fetchNotifications>>>(notificationsKeys.all, (old) =>
        old?.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) qc.setQueryData(notificationsKeys.all, context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: notificationsKeys.all }),
  });
}

export function useMarkAllNotificationsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: notificationsKeys.all });
      const previous = qc.getQueryData(notificationsKeys.all);
      qc.setQueryData<Awaited<ReturnType<typeof fetchNotifications>>>(notificationsKeys.all, (old) =>
        old?.map((n) => ({ ...n, read: true }))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) qc.setQueryData(notificationsKeys.all, context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: notificationsKeys.all }),
  });
}
