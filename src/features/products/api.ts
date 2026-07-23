import { delay, slugify } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { Product, ProductStatus } from "@/types/domain";
import type { ProductFormValues } from "./schema";

export interface ProductListParams {
  status?: ProductStatus | "all";
  categoryId?: string | "all";
}

export async function fetchProducts(params: ProductListParams = {}): Promise<Product[]> {
  await delay(450);
  let items = [...db.products];
  if (params.status && params.status !== "all") items = items.filter((p) => p.status === params.status);
  if (params.categoryId && params.categoryId !== "all") items = items.filter((p) => p.categoryId === params.categoryId);
  return items.sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
}

export async function fetchProduct(id: string): Promise<Product> {
  await delay(350);
  const product = db.products.find((p) => p.id === id);
  if (!product) throw new Error("Product not found");
  return product;
}

export async function createProduct(values: ProductFormValues): Promise<Product> {
  await delay(600);
  const now = new Date().toISOString();
  const id = `prod_${Math.random().toString(36).slice(2, 8)}`;
  const product: Product = {
    id,
    title: values.title,
    slug: slugify(values.title),
    description: values.description,
    status: values.status,
    categoryId: values.categoryId,
    vendor: values.vendor,
    price: values.price,
    compareAtPrice: values.compareAtPrice,
    costPerItem: values.costPerItem ?? 0,
    sku: values.sku,
    barcode: values.barcode ?? "",
    inventory: values.inventory,
    trackInventory: values.trackInventory,
    tags: values.tags,
    images: values.imageUrl ? [{ id: `img_${id}`, url: values.imageUrl, alt: values.title, position: 0 }] : [],
    variants: [
      {
        id: `var_${id}`,
        productId: id,
        name: "Default",
        sku: values.sku,
        price: values.price,
        compareAtPrice: values.compareAtPrice,
        inventory: values.inventory,
        weightGrams: 200,
      },
    ],
    seoTitle: values.seoTitle || values.title,
    seoDescription: values.seoDescription || values.description.slice(0, 150),
    createdAt: now,
    updatedAt: now,
    rating: 0,
    reviewCount: 0,
    unitsSold: 0,
    revenue: 0,
  };
  db.products.unshift(product);
  return product;
}

export async function updateProduct(id: string, values: Partial<ProductFormValues>): Promise<Product> {
  await delay(500);
  const idx = db.products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Product not found");
  const existing = db.products[idx] as Product;
  const updated: Product = {
    ...existing,
    ...values,
    updatedAt: new Date().toISOString(),
  } as Product;
  db.products[idx] = updated;
  return updated;
}

export async function deleteProducts(ids: string[]): Promise<void> {
  await delay(400);
  for (const id of ids) {
    const idx = db.products.findIndex((p) => p.id === id);
    if (idx !== -1) db.products.splice(idx, 1);
  }
}

export async function bulkUpdateStatus(ids: string[], status: ProductStatus): Promise<void> {
  await delay(400);
  ids.forEach((id) => {
    const idx = db.products.findIndex((p) => p.id === id);
    if (idx !== -1 && db.products[idx]) {
      (db.products[idx] as Product).status = status;
      (db.products[idx] as Product).updatedAt = new Date().toISOString();
    }
  });
}

/** Simulated AI product description generator (see AI Assistant module for the real flow). */
export async function generateProductDescription(title: string, vendor: string): Promise<string> {
  await delay(1200);
  return `Introducing the ${title} from ${vendor} — thoughtfully designed for durability and everyday performance. Crafted from premium materials and refined through multiple prototyping rounds, it balances form and function without compromise. Backed by a 2-year warranty and free returns within 30 days, this is a piece built to earn its place in your daily rotation.`;
}
