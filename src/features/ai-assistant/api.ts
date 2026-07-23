import { delay } from "@/lib/utils";
import { db, getKpiSummary, getLowStockItems, getTopProducts } from "@/lib/mock/db";
import type { ChatMessage } from "@/types/domain";

const RESPONSES: { match: RegExp; reply: () => string }[] = [
  {
    match: /forecast|inventory|stock/i,
    reply: () => {
      const low = getLowStockItems(3);
      return `Based on current sell-through velocity, ${low.length} SKUs are projected to stock out within 14 days: ${low
        .map((i) => `${i.productTitle} (${i.available} units left at ${i.warehouseName})`)
        .join(
          ", "
        )}. I'd recommend placing reorders this week — lead times for your top vendors average 10–12 days.`;
    },
  },
  {
    match: /sales|revenue|performance/i,
    reply: () => {
      const kpi = getKpiSummary();
      const top = getTopProducts(3);
      return `Revenue is at $${kpi.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} over the last 30 days (${kpi.revenueDelta >= 0 ? "+" : ""}${kpi.revenueDelta.toFixed(1)}% vs. prior period). Your top performers are ${top
        .map((p) => p.title)
        .join(", ")}. Conversion rate is holding steady at ${kpi.conversionRate.toFixed(1)}%.`;
    },
  },
  {
    match: /marketing|campaign|promo/i,
    reply: () =>
      `For your next campaign, I'd suggest targeting the "Outdoor & Travel" category — it's converting 3.1x the store average this month. A 15% win-back offer to your 18 lapsed VIP customers could recover an estimated $3,100 in revenue. Want me to draft the campaign brief?`,
  },
  {
    match: /description|copy|write/i,
    reply: () =>
      `Happy to help write product copy — head to any product's edit page and use the "Generate with AI" button next to the description field, or tell me the product name and key features here and I'll draft it for you.`,
  },
  {
    match: /customer|churn|retention/i,
    reply: () =>
      `You have 12 previously active customers who've gone quiet for 45+ days, representing roughly $9,800 in historical spend. A targeted win-back email with a modest incentive typically recovers 18–24% of this segment within 30 days.`,
  },
];

const DEFAULT_REPLIES = [
  "I can help with sales insights, inventory forecasting, marketing suggestions, and product copywriting. What would you like to dig into?",
  "Could you tell me a bit more about what you're trying to accomplish? I can pull live numbers from your store to help.",
];

export async function sendChatMessage(history: ChatMessage[], content: string): Promise<ChatMessage> {
  await delay(900 + Math.random() * 600);
  const matched = RESPONSES.find((r) => r.match.test(content));
  const replyText = matched ? matched.reply() : DEFAULT_REPLIES[Math.floor(Math.random() * DEFAULT_REPLIES.length)];
  return {
    id: `msg_${Math.random().toString(36).slice(2, 9)}`,
    role: "assistant",
    content: replyText ?? DEFAULT_REPLIES[0]!,
    createdAt: new Date().toISOString(),
  };
}

export async function fetchInsights() {
  await delay(300);
  return db.insights;
}
