import { delay } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { Campaign } from "@/types/domain";

export async function fetchCampaigns(): Promise<Campaign[]> {
  await delay(400);
  return [...db.campaigns].sort((a, b) => b.revenue - a.revenue);
}

export async function fetchCampaign(id: string): Promise<Campaign> {
  await delay(300);
  const campaign = db.campaigns.find((c) => c.id === id);
  if (!campaign) throw new Error("Campaign not found");
  return campaign;
}
