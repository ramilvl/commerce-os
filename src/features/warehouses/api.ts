import { delay } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { Warehouse } from "@/types/domain";

export async function fetchWarehouses(): Promise<Warehouse[]> {
  await delay(400);
  return [...db.warehouses];
}

export async function fetchWarehouse(id: string): Promise<Warehouse> {
  await delay(300);
  const warehouse = db.warehouses.find((w) => w.id === id);
  if (!warehouse) throw new Error("Warehouse not found");
  return warehouse;
}
