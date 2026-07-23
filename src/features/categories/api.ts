import { delay, slugify } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { Category } from "@/types/domain";

export async function fetchCategories(): Promise<Category[]> {
  await delay(400);
  return [...db.categories].sort((a, b) => b.productCount - a.productCount);
}

export async function fetchCategory(id: string): Promise<Category> {
  await delay(300);
  const category = db.categories.find((c) => c.id === id);
  if (!category) throw new Error("Category not found");
  return category;
}

export async function createCategory(values: { name: string; description: string; image: string }): Promise<Category> {
  await delay(500);
  const category: Category = {
    id: `cat_${Math.random().toString(36).slice(2, 8)}`,
    name: values.name,
    slug: slugify(values.name),
    description: values.description,
    parentId: null,
    productCount: 0,
    image: values.image,
    createdAt: new Date().toISOString(),
  };
  db.categories.unshift(category);
  return category;
}
