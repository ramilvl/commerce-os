import { delay } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { Role } from "@/types/domain";

export const ALL_PERMISSIONS = [
  "products.view", "products.edit", "orders.view", "orders.edit", "customers.view",
  "customers.edit", "inventory.view", "inventory.edit", "marketing.view", "marketing.edit",
  "analytics.view", "employees.manage", "roles.manage", "settings.manage", "billing.manage",
];

export async function fetchRoles(): Promise<Role[]> {
  await delay(400);
  return [...db.roles];
}

export async function fetchRole(id: string): Promise<Role> {
  await delay(300);
  const role = db.roles.find((r) => r.id === id);
  if (!role) throw new Error("Role not found");
  return role;
}

export async function updateRolePermissions(id: string, permissions: string[]): Promise<Role> {
  await delay(400);
  const idx = db.roles.findIndex((r) => r.id === id);
  if (idx === -1) throw new Error("Role not found");
  const role = db.roles[idx] as Role;
  role.permissions = permissions;
  return role;
}
