import { Bell, Boxes, Megaphone, ShieldAlert, ShoppingCart, Users, type LucideIcon } from "lucide-react";
import type { Notification } from "@/types/domain";

export const NOTIFICATION_META: Record<Notification["type"], { icon: LucideIcon; className: string }> = {
  order: { icon: ShoppingCart, className: "bg-info-subtle text-info" },
  inventory: { icon: Boxes, className: "bg-warning-subtle text-warning" },
  customer: { icon: Users, className: "bg-accent-subtle text-accent" },
  system: { icon: Bell, className: "bg-secondary text-secondary-foreground" },
  marketing: { icon: Megaphone, className: "bg-success-subtle text-success" },
  security: { icon: ShieldAlert, className: "bg-danger-subtle text-danger" },
};
