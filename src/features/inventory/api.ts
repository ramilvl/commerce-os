import { delay } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { InventoryItem } from "@/types/domain";

export interface InventoryListParams {
  warehouseId?: string | "all";
  status?: InventoryItem["status"] | "all";
}

export async function fetchInventory(params: InventoryListParams = {}): Promise<InventoryItem[]> {
  await delay(450);
  let items = [...db.inventory];
  if (params.warehouseId && params.warehouseId !== "all") items = items.filter((i) => i.warehouseId === params.warehouseId);
  if (params.status && params.status !== "all") items = items.filter((i) => i.status === params.status);
  return items.sort((a, b) => a.available - b.available);
}

export async function fetchInventoryItem(id: string): Promise<InventoryItem> {
  await delay(300);
  const item = db.inventory.find((i) => i.id === id);
  if (!item) throw new Error("Inventory item not found");
  return item;
}

export async function adjustInventory(id: string, delta: number): Promise<InventoryItem> {
  await delay(400);
  const idx = db.inventory.findIndex((i) => i.id === id);
  if (idx === -1) throw new Error("Inventory item not found");
  const item = db.inventory[idx] as InventoryItem;
  item.onHand = Math.max(0, item.onHand + delta);
  item.available = Math.max(0, item.onHand - item.reserved);
  item.status = item.available === 0 ? "out_of_stock" : item.available < item.reorderPoint ? "low_stock" : "in_stock";
  return item;
}
