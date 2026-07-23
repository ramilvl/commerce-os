// Core domain models for CommerceOS. These mirror the shape a real Supabase
// schema would expose (snake_case in DB, camelCase at the app boundary).

export type ID = string;

export interface Money {
  amount: number;
  currency: "USD";
}

export type ProductStatus = "active" | "draft" | "archived";
export type OrderStatus = "pending" | "processing" | "fulfilled" | "shipped" | "delivered" | "cancelled" | "refunded";
export type PaymentStatus = "paid" | "pending" | "failed" | "refunded" | "partially_refunded";
export type FulfillmentStatus = "unfulfilled" | "partial" | "fulfilled";

export interface ProductVariant {
  id: ID;
  productId: ID;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  option1?: string;
  option2?: string;
  barcode?: string;
  weightGrams: number;
}

export interface ProductImage {
  id: ID;
  url: string;
  alt: string;
  position: number;
}

export interface Product {
  id: ID;
  title: string;
  slug: string;
  description: string;
  status: ProductStatus;
  categoryId: ID;
  vendor: string;
  price: number;
  compareAtPrice?: number;
  costPerItem: number;
  sku: string;
  barcode: string;
  inventory: number;
  trackInventory: boolean;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
  updatedAt: string;
  rating: number;
  reviewCount: number;
  unitsSold: number;
  revenue: number;
}

export interface Category {
  id: ID;
  name: string;
  slug: string;
  description: string;
  parentId: ID | null;
  productCount: number;
  image: string;
  createdAt: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Customer {
  id: ID;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  address: Address;
  createdAt: string;
  ordersCount: number;
  totalSpent: number;
  lifetimeValue: number;
  averageOrderValue: number;
  tags: string[];
  status: "active" | "vip" | "at_risk" | "churned";
  marketingOptIn: boolean;
  notes: CustomerNote[];
  activity: ActivityEvent[];
}

export interface CustomerNote {
  id: ID;
  author: string;
  content: string;
  createdAt: string;
}

export interface ActivityEvent {
  id: ID;
  type: string;
  description: string;
  createdAt: string;
}

export interface OrderLineItem {
  id: ID;
  productId: ID;
  productTitle: string;
  variant: string;
  image: string;
  quantity: number;
  price: number;
  sku: string;
}

export interface OrderTimelineEvent {
  id: ID;
  label: string;
  description: string;
  createdAt: string;
  actor: string;
  type: "order" | "payment" | "shipment" | "note" | "refund" | "system";
}

export interface Order {
  id: ID;
  number: string;
  customer: Pick<Customer, "id" | "name" | "email" | "avatar">;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: OrderLineItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  channel: "online_store" | "pos" | "marketplace" | "api";
  shippingAddress: Address;
  billingAddress: Address;
  trackingNumber?: string;
  carrier?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
  tags: string[];
  riskLevel: "low" | "medium" | "high";
}

export interface Warehouse {
  id: ID;
  name: string;
  code: string;
  address: Address;
  manager: string;
  capacity: number;
  utilization: number;
  itemCount: number;
  status: "active" | "inactive";
}

export interface InventoryItem {
  id: ID;
  productId: ID;
  productTitle: string;
  sku: string;
  image: string;
  warehouseId: ID;
  warehouseName: string;
  onHand: number;
  reserved: number;
  available: number;
  reorderPoint: number;
  incoming: number;
  status: "in_stock" | "low_stock" | "out_of_stock" | "overstock";
}

export interface Coupon {
  id: ID;
  code: string;
  type: "percentage" | "fixed" | "free_shipping";
  value: number;
  status: "active" | "scheduled" | "expired" | "disabled";
  usageCount: number;
  usageLimit: number | null;
  startsAt: string;
  endsAt: string | null;
  minimumSpend: number | null;
  appliesTo: string;
}

export interface Campaign {
  id: ID;
  name: string;
  channel: "email" | "sms" | "social" | "search";
  status: "active" | "scheduled" | "draft" | "completed";
  audience: string;
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  startDate: string;
  endDate: string | null;
}

export interface Employee {
  id: ID;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  status: "active" | "invited" | "suspended";
  location: string;
  joinedAt: string;
  lastActive: string;
}

export interface Role {
  id: ID;
  name: string;
  description: string;
  memberCount: number;
  permissions: string[];
  isSystem: boolean;
}

export interface Notification {
  id: ID;
  title: string;
  description: string;
  type: "order" | "inventory" | "customer" | "system" | "marketing" | "security";
  read: boolean;
  createdAt: string;
  actionLabel?: string;
  actionHref?: string;
}

export interface AiInsight {
  id: ID;
  title: string;
  description: string;
  category: "sales" | "inventory" | "marketing" | "customer";
  impact: "high" | "medium" | "low";
  confidence: number;
}

export interface ChatMessage {
  id: ID;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}
