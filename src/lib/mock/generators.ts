import { pick, range, seededRandom, slugify } from "@/lib/utils";
import {
  CATEGORY_NAMES, CITIES, COMPANIES, DEPARTMENTS, FIRST_NAMES, IMG, JOB_TITLES,
  LAST_NAMES, PRODUCT_ADJECTIVES, PRODUCT_NOUNS, TAGS, VENDORS,
} from "./seed-values";
import type {
  ActivityEvent, AiInsight, Campaign, Category, Coupon, Customer, CustomerNote, Employee,
  Address, ID, InventoryItem, Notification, Order, OrderLineItem, OrderStatus, OrderTimelineEvent,
  Product, ProductImage, ProductStatus, ProductVariant, Role, Warehouse,
} from "@/types/domain";

const rnd = seededRandom(42);
const fullName = (r: () => number) => `${pick(FIRST_NAMES, r)} ${pick(LAST_NAMES, r)}`;
const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000).toISOString();
const uid = (prefix: string, n: number) => `${prefix}_${String(n).padStart(4, "0")}`;

function address(r: () => number): Address {
  const c = pick(CITIES, r);
  return {
    line1: `${100 + Math.floor(r() * 899)} ${pick(["Market", "Elm", "Harbor", "Founders", "Union", "Birch"], r)} St`,
    city: c.city,
    state: c.state,
    postalCode: String(10000 + Math.floor(r() * 89999)),
    country: c.country,
  };
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const CATEGORIES: Category[] = CATEGORY_NAMES.map((name, i) => ({
  id: uid("cat", i + 1),
  name,
  slug: slugify(name),
  description: `Curated ${name.toLowerCase()} collection spanning ${8 + i} active product lines.`,
  parentId: null,
  productCount: 0,
  image: IMG.product(i),
  createdAt: daysAgo(300 - i * 10),
}));

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
const PRODUCT_COUNT = 64;
const statuses: ProductStatus[] = ["active", "active", "active", "draft", "archived"];

export const PRODUCTS: Product[] = range(PRODUCT_COUNT).map((i) => {
  const r = seededRandom(1000 + i);
  const noun = pick(PRODUCT_NOUNS, r);
  const adj = pick(PRODUCT_ADJECTIVES, r);
  const title = `${adj} ${noun}`;
  const price = Math.round((18 + r() * 220) * 100) / 100;
  const hasCompare = r() > 0.6;
  const category = pick(CATEGORIES, r);
  const images: ProductImage[] = range(1 + Math.floor(r() * 3)).map((p) => ({
    id: uid(`img${i}`, p),
    url: IMG.product(i + p),
    alt: `${title} — view ${p + 1}`,
    position: p,
  }));
  const variantCount = r() > 0.55 ? 2 + Math.floor(r() * 3) : 1;
  const variants: ProductVariant[] = range(variantCount).map((v) => {
    const inv = Math.floor(r() * 240);
    return {
      id: uid(`var${i}`, v),
      productId: uid("prod", i + 1),
      name: variantCount > 1 ? `${pick(["Small", "Medium", "Large", "XL"], r)} / ${pick(["Black", "Stone", "Olive", "Navy"], r)}` : "Default",
      sku: `SKU-${1000 + i}${v}`,
      price: price + (v > 0 ? Math.round(r() * 10) : 0),
      compareAtPrice: hasCompare ? Math.round(price * 1.25 * 100) / 100 : undefined,
      inventory: inv,
      option1: variantCount > 1 ? pick(["Small", "Medium", "Large", "XL"], r) : undefined,
      option2: variantCount > 1 ? pick(["Black", "Stone", "Olive", "Navy"], r) : undefined,
      barcode: `0${Math.floor(100000000 + r() * 899999999)}`,
      weightGrams: Math.floor(80 + r() * 1800),
    };
  });
  const inventory = variants.reduce((sum, v) => sum + v.inventory, 0);
  const unitsSold = Math.floor(r() * 3200);
  return {
    id: uid("prod", i + 1),
    title,
    slug: slugify(`${title}-${i}`),
    description: `The ${title} is engineered for everyday reliability — built with premium materials, tested for durability, and designed to look as good on day 500 as day one. A ${category.name.toLowerCase()} staple trusted by thousands of customers.`,
    status: pick(statuses, r),
    categoryId: category.id,
    vendor: pick(VENDORS, r),
    price,
    compareAtPrice: hasCompare ? Math.round(price * 1.25 * 100) / 100 : undefined,
    costPerItem: Math.round(price * 0.42 * 100) / 100,
    sku: `SKU-${1000 + i}`,
    barcode: `0${Math.floor(100000000 + r() * 899999999)}`,
    inventory,
    trackInventory: true,
    tags: range(1 + Math.floor(r() * 3)).map(() => pick(TAGS, r)),
    images,
    variants,
    seoTitle: `${title} | Shop Premium ${category.name}`,
    seoDescription: `Buy the ${title} — free shipping on orders over $75, 30-day returns, and a 2-year warranty.`,
    createdAt: daysAgo(Math.floor(r() * 400) + 10),
    updatedAt: daysAgo(Math.floor(r() * 20)),
    rating: Math.round((3.4 + r() * 1.6) * 10) / 10,
    reviewCount: Math.floor(r() * 900),
    unitsSold,
    revenue: Math.round(unitsSold * price * 100) / 100,
  };
});

CATEGORIES.forEach((c) => {
  c.productCount = PRODUCTS.filter((p) => p.categoryId === c.id).length;
});

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------
const CUSTOMER_COUNT = 90;
const customerStatuses: Customer["status"][] = ["active", "active", "active", "vip", "at_risk", "churned"];

export const CUSTOMERS: Customer[] = range(CUSTOMER_COUNT).map((i) => {
  const r = seededRandom(2000 + i);
  const name = fullName(r);
  const email = `${name.toLowerCase().replace(/\s+/g, ".")}@${pick(["gmail.com", "outlook.com", "proton.me", "icloud.com"], r)}`;
  const ordersCount = Math.floor(r() * 24);
  const aov = Math.round((35 + r() * 180) * 100) / 100;
  const totalSpent = Math.round(ordersCount * aov * 100) / 100;
  const loc = pick(CITIES, r);
  const notes: CustomerNote[] = r() > 0.6 ? [{
    id: uid(`note${i}`, 0),
    author: pick(["Priya M.", "Jordan K.", "Sam T."], r),
    content: pick([
      "Prefers email over SMS for order updates.",
      "Requested gift wrap on last two orders — flag for holiday campaign.",
      "Had a shipping delay in March, issued goodwill credit.",
      "High-value repeat buyer — good candidate for early access program.",
    ], r),
    createdAt: daysAgo(Math.floor(r() * 90)),
  }] : [];
  const activity: ActivityEvent[] = range(3 + Math.floor(r() * 4)).map((a) => ({
    id: uid(`act${i}`, a),
    type: pick(["order", "login", "support", "email_open", "review"], r),
    description: pick([
      "Placed an order", "Signed in from a new device", "Opened a support ticket",
      "Opened marketing email", "Left a product review", "Updated shipping address",
    ], r),
    createdAt: daysAgo(Math.floor(r() * 200)),
  }));
  return {
    id: uid("cust", i + 1),
    name,
    email,
    phone: `+1 (${200 + Math.floor(r() * 700)}) 555-${1000 + Math.floor(r() * 8999)}`,
    avatar: IMG.avatar(i),
    location: `${loc.city}, ${loc.state}`,
    address: address(r),
    createdAt: daysAgo(Math.floor(r() * 700) + 5),
    ordersCount,
    totalSpent,
    lifetimeValue: Math.round(totalSpent * (1.1 + r() * 0.6) * 100) / 100,
    averageOrderValue: aov,
    tags: r() > 0.7 ? [pick(TAGS, r)] : [],
    status: ordersCount === 0 ? "churned" : pick(customerStatuses, r),
    marketingOptIn: r() > 0.35,
    notes,
    activity,
  };
});

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
const ORDER_COUNT = 180;
const orderStatuses: OrderStatus[] = ["pending", "processing", "fulfilled", "shipped", "delivered", "delivered", "delivered", "cancelled", "refunded"];
const channels: Order["channel"][] = ["online_store", "online_store", "online_store", "pos", "marketplace", "api"];

function buildTimeline(r: () => number, status: OrderStatus, createdAt: string): OrderTimelineEvent[] {
  const events: OrderTimelineEvent[] = [
    { id: uid("tl", 0), label: "Order placed", description: "Customer completed checkout", createdAt, actor: "System", type: "order" },
    { id: uid("tl", 1), label: "Payment captured", description: "Payment authorized and captured via card", createdAt, actor: "Stripe", type: "payment" },
  ];
  if (["processing", "fulfilled", "shipped", "delivered"].includes(status)) {
    events.push({ id: uid("tl", 2), label: "Order confirmed", description: "Inventory reserved and order confirmed", createdAt, actor: "System", type: "order" });
  }
  if (["fulfilled", "shipped", "delivered"].includes(status)) {
    events.push({ id: uid("tl", 3), label: "Fulfillment created", description: "Items picked and packed at Warehouse A", createdAt, actor: "Warehouse team", type: "shipment" });
  }
  if (["shipped", "delivered"].includes(status)) {
    events.push({ id: uid("tl", 4), label: "Shipment dispatched", description: "Package handed to carrier", createdAt, actor: "Carrier", type: "shipment" });
  }
  if (status === "delivered") {
    events.push({ id: uid("tl", 5), label: "Delivered", description: "Package delivered to customer address", createdAt, actor: "Carrier", type: "shipment" });
  }
  if (status === "cancelled") {
    events.push({ id: uid("tl", 6), label: "Order cancelled", description: "Cancelled at customer request", createdAt, actor: "Support team", type: "system" });
  }
  if (status === "refunded") {
    events.push({ id: uid("tl", 7), label: "Refund issued", description: "Full refund processed to original payment method", createdAt, actor: "Finance team", type: "refund" });
  }
  return events;
}

export const ORDERS: Order[] = range(ORDER_COUNT).map((i) => {
  const r = seededRandom(3000 + i);
  const customer = pick(CUSTOMERS, r);
  const itemCount = 1 + Math.floor(r() * 4);
  const items: OrderLineItem[] = range(itemCount).map((li) => {
    const product = pick(PRODUCTS, r);
    const variant = pick(product.variants, r);
    const qty = 1 + Math.floor(r() * 3);
    return {
      id: uid(`li${i}`, li),
      productId: product.id,
      productTitle: product.title,
      variant: variant.name,
      image: product.images[0]?.url ?? IMG.product(i),
      quantity: qty,
      price: variant.price,
      sku: variant.sku,
    };
  });
  const subtotal = Math.round(items.reduce((s, it) => s + it.price * it.quantity, 0) * 100) / 100;
  const shipping = r() > 0.3 ? Math.round((5 + r() * 15) * 100) / 100 : 0;
  const tax = Math.round(subtotal * 0.0825 * 100) / 100;
  const discount = r() > 0.75 ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const total = Math.round((subtotal + shipping + tax - discount) * 100) / 100;
  const status = pick(orderStatuses, r);
  const createdAt = daysAgo(Math.floor(r() * 180));
  const addr = address(r);
  return {
    id: uid("order", i + 1),
    number: `#${10234 + i}`,
    customer: { id: customer.id, name: customer.name, email: customer.email, avatar: customer.avatar },
    status,
    paymentStatus: status === "refunded" ? "refunded" : status === "cancelled" ? "failed" : r() > 0.1 ? "paid" : "pending",
    fulfillmentStatus: ["shipped", "delivered"].includes(status) ? "fulfilled" : status === "fulfilled" ? "fulfilled" : status === "processing" ? "partial" : "unfulfilled",
    items,
    subtotal,
    shipping,
    tax,
    discount,
    total,
    channel: pick(channels, r),
    shippingAddress: addr,
    billingAddress: addr,
    trackingNumber: ["shipped", "delivered"].includes(status) ? `1Z${Math.floor(100000000 + r() * 899999999)}US` : undefined,
    carrier: ["shipped", "delivered"].includes(status) ? pick(["UPS", "FedEx", "USPS", "DHL"], r) : undefined,
    createdAt,
    updatedAt: daysAgo(Math.floor(r() * 5)),
    timeline: buildTimeline(r, status, createdAt),
    tags: r() > 0.8 ? [pick(["priority", "gift", "wholesale", "vip"], r)] : [],
    riskLevel: r() > 0.9 ? "high" : r() > 0.75 ? "medium" : "low",
  };
});

// ---------------------------------------------------------------------------
// Warehouses & Inventory
// ---------------------------------------------------------------------------
export const WAREHOUSES: Warehouse[] = [
  { name: "Austin Distribution Center", code: "AUS-1" },
  { name: "Portland Fulfillment Hub", code: "PDX-1" },
  { name: "Newark East Coast Facility", code: "EWR-1" },
  { name: "Amsterdam EU Hub", code: "AMS-1" },
].map((w, i) => {
  const r = seededRandom(4000 + i);
  const capacity = 40000 + Math.floor(r() * 20000);
  const itemCount = Math.floor(capacity * (0.4 + r() * 0.5));
  return {
    id: uid("wh", i + 1),
    name: w.name,
    code: w.code,
    address: address(r),
    manager: fullName(r),
    capacity,
    utilization: Math.round((itemCount / capacity) * 1000) / 10,
    itemCount,
    status: "active",
  };
});

export const INVENTORY: InventoryItem[] = PRODUCTS.flatMap((p, i) =>
  WAREHOUSES.slice(0, 1 + (i % 3)).map((w, wi) => {
    const r = seededRandom(5000 + i * 10 + wi);
    const onHand = Math.floor(r() * 300);
    const reserved = Math.floor(onHand * r() * 0.3);
    const available = Math.max(0, onHand - reserved);
    const reorderPoint = 20 + Math.floor(r() * 30);
    const status: InventoryItem["status"] =
      available === 0 ? "out_of_stock" : available < reorderPoint ? "low_stock" : available > reorderPoint * 6 ? "overstock" : "in_stock";
    return {
      id: uid(`inv${i}`, wi),
      productId: p.id,
      productTitle: p.title,
      sku: p.sku,
      image: p.images[0]?.url ?? IMG.product(i),
      warehouseId: w.id,
      warehouseName: w.name,
      onHand,
      reserved,
      available,
      reorderPoint,
      incoming: r() > 0.7 ? Math.floor(r() * 150) : 0,
      status,
    };
  })
);

// ---------------------------------------------------------------------------
// Coupons & Campaigns
// ---------------------------------------------------------------------------
const COUPON_SEEDS: { code: string; type: Coupon["type"]; value: number }[] = [
  { code: "WELCOME10", type: "percentage", value: 10 },
  { code: "FREESHIP", type: "free_shipping", value: 0 },
  { code: "SUMMER25", type: "percentage", value: 25 },
  { code: "SAVE20", type: "fixed", value: 20 },
  { code: "VIP15", type: "percentage", value: 15 },
  { code: "FLASH50", type: "percentage", value: 50 },
  { code: "GIFT5", type: "fixed", value: 5 },
  { code: "WHOLESALE30", type: "percentage", value: 30 },
];

export const COUPONS: Coupon[] = COUPON_SEEDS.map((c, i) => {
  const r = seededRandom(6000 + i);
  const status: Coupon["status"] = pick(["active", "active", "scheduled", "expired", "disabled"], r);
  return {
    id: uid("coup", i + 1),
    code: c.code,
    type: c.type,
    value: c.value,
    status,
    usageCount: Math.floor(r() * 2000),
    usageLimit: r() > 0.5 ? Math.floor(500 + r() * 4000) : null,
    startsAt: daysAgo(Math.floor(r() * 60) + 5),
    endsAt: r() > 0.4 ? daysAgo(-Math.floor(r() * 60) - 5) : null,
    minimumSpend: r() > 0.5 ? Math.round((25 + r() * 100) * 100) / 100 : null,
    appliesTo: pick(["All products", "Apparel only", "New customers", "Outdoor & Travel"], r),
  };
});

export const CAMPAIGNS: Campaign[] = [
  { name: "Fall Collection Launch", channel: "email" },
  { name: "Abandoned Cart Recovery", channel: "email" },
  { name: "VIP Early Access", channel: "sms" },
  { name: "Retargeting — Warm Audience", channel: "social" },
  { name: "Holiday Gift Guide", channel: "search" },
  { name: "Win-back: 60-day Inactive", channel: "email" },
].map((c, i) => {
  const r = seededRandom(7000 + i);
  const sent = Math.floor(2000 + r() * 40000);
  const opened = Math.floor(sent * (0.25 + r() * 0.35));
  const clicked = Math.floor(opened * (0.15 + r() * 0.25));
  const converted = Math.floor(clicked * (0.05 + r() * 0.15));
  return {
    id: uid("camp", i + 1),
    name: c.name,
    channel: c.channel as Campaign["channel"],
    status: pick(["active", "active", "scheduled", "draft", "completed"], r),
    audience: pick(["All subscribers", "VIP customers", "Cart abandoners", "New leads", "Repeat buyers"], r),
    sent,
    opened,
    clicked,
    converted,
    revenue: Math.round(converted * (40 + r() * 120) * 100) / 100,
    startDate: daysAgo(Math.floor(r() * 60)),
    endDate: r() > 0.4 ? daysAgo(-Math.floor(r() * 30)) : null,
  };
});

// ---------------------------------------------------------------------------
// Employees & Roles
// ---------------------------------------------------------------------------
export const ROLES: Role[] = [
  { name: "Owner", description: "Full access to every module, billing, and account settings.", perms: 24, isSystem: true },
  { name: "Administrator", description: "Manage store operations, staff, and settings — excludes billing.", perms: 20, isSystem: true },
  { name: "Merchandiser", description: "Manage products, categories, pricing, and inventory.", perms: 10, isSystem: false },
  { name: "Support Agent", description: "View and manage orders, customers, and refunds.", perms: 8, isSystem: false },
  { name: "Marketing Manager", description: "Manage campaigns, coupons, and audience segments.", perms: 7, isSystem: false },
  { name: "Analyst", description: "Read-only access to analytics and reporting.", perms: 4, isSystem: false },
].map((role, i) => {
  const r = seededRandom(8000 + i);
  const allPerms = [
    "products.view", "products.edit", "orders.view", "orders.edit", "customers.view",
    "customers.edit", "inventory.view", "inventory.edit", "marketing.view", "marketing.edit",
    "analytics.view", "employees.manage", "roles.manage", "settings.manage", "billing.manage",
  ];
  return {
    id: uid("role", i + 1),
    name: role.name,
    description: role.description,
    memberCount: 1 + Math.floor(r() * 12),
    permissions: allPerms.slice(0, role.perms % allPerms.length || allPerms.length),
    isSystem: role.isSystem,
  };
});

export const EMPLOYEES: Employee[] = range(28).map((i) => {
  const r = seededRandom(9000 + i);
  const name = fullName(r);
  const dept = pick(DEPARTMENTS, r);
  return {
    id: uid("emp", i + 1),
    name,
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@commerceos.io`,
    avatar: IMG.avatar(i + 40),
    role: pick(JOB_TITLES, r),
    department: dept,
    status: pick(["active", "active", "active", "invited", "suspended"], r),
    location: `${pick(CITIES, r).city}, ${pick(CITIES, r).country === "United States" ? pick(CITIES, r).state : pick(CITIES, r).country}`,
    joinedAt: daysAgo(Math.floor(r() * 900) + 30),
    lastActive: daysAgo(Math.floor(r() * 5)),
  };
});

// ---------------------------------------------------------------------------
// Notifications & AI insights
// ---------------------------------------------------------------------------
export const NOTIFICATIONS: Notification[] = [
  { title: "Low stock alert", description: "Heritage Trail Backpack is below reorder point at Austin Distribution Center.", type: "inventory", actionLabel: "View inventory", actionHref: "/inventory" },
  { title: "New high-value order", description: "Order #10312 for $842.00 placed by Sophia Bennett.", type: "order", actionLabel: "View order", actionHref: "/orders" },
  { title: "Refund requested", description: "Customer Liam Nakamura requested a refund on order #10298.", type: "order", actionLabel: "Review", actionHref: "/orders" },
  { title: "Campaign completed", description: "\"Fall Collection Launch\" finished sending — 24.6K delivered.", type: "marketing", actionLabel: "View report", actionHref: "/marketing" },
  { title: "New team member invited", description: "Priya Chandrasekaran was invited as Merchandiser.", type: "system" },
  { title: "Unusual sign-in detected", description: "A new sign-in to your admin account from Berlin, DE.", type: "security", actionLabel: "Review activity", actionHref: "/settings" },
  { title: "Weekly revenue milestone", description: "You crossed $120K in revenue this week — up 18% week over week.", type: "system" },
  { title: "Customer churn risk", description: "12 previously active customers have gone quiet for 45+ days.", type: "customer", actionLabel: "View segment", actionHref: "/customers" },
].map((n, i) => {
  const r = seededRandom(10000 + i);
  return {
    id: uid("notif", i + 1),
    title: n.title,
    description: n.description,
    type: n.type as Notification["type"],
    read: r() > 0.55,
    createdAt: daysAgo(Math.floor(r() * 12)),
    actionLabel: n.actionLabel,
    actionHref: n.actionHref,
  };
});

export const AI_INSIGHTS: AiInsight[] = [
  { title: "Bundle opportunity: Trail Backpack + Water Bottle", description: "Customers who buy the Heritage Trail Backpack purchase an Aluminum Water Bottle 34% of the time within 7 days. A bundle discount could lift AOV by an estimated $18.", category: "sales", impact: "high", confidence: 87 },
  { title: "Reorder Merino Wool Crewneck (Stone)", description: "Projected to stock out in 9 days at current velocity. Lead time from Meridian Workshop is 12 days — order now to avoid a stockout.", category: "inventory", impact: "high", confidence: 92 },
  { title: "Re-engage lapsed VIP segment", description: "18 VIP customers haven't purchased in 60+ days, representing $14,200 in historical LTV. A targeted 15% win-back offer historically recovers ~22% of this segment.", category: "customer", impact: "medium", confidence: 74 },
  { title: "Shift ad spend toward Outdoor & Travel", description: "Category conversion rate is 3.1x the store average this month. Reallocating 15% of underperforming Apparel spend could yield an estimated +$6,400 in incremental revenue.", category: "marketing", impact: "medium", confidence: 68 },
  { title: "Price elasticity opportunity: Ceramic Pour-Over Kettle", description: "Demand modeling suggests a 6% price increase would have minimal impact on conversion, adding an estimated $2,100/mo in margin.", category: "sales", impact: "low", confidence: 61 },
].map((a, i) => ({ id: uid("insight", i + 1), title: a.title, description: a.description, category: a.category as AiInsight["category"], impact: a.impact as AiInsight["impact"], confidence: a.confidence }));

export const COMPANY_NAME = COMPANIES[0];
