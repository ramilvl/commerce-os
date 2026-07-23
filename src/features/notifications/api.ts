import { delay } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { Notification } from "@/types/domain";

let notifications = [...db.notifications];

export async function fetchNotifications(): Promise<Notification[]> {
  await delay(300);
  return [...notifications].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function markNotificationRead(id: string): Promise<Notification> {
  await delay(150);
  notifications = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  const found = notifications.find((n) => n.id === id);
  if (!found) throw new Error("Notification not found");
  return found;
}

export async function markAllNotificationsRead(): Promise<void> {
  await delay(200);
  notifications = notifications.map((n) => ({ ...n, read: true }));
}
