import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(120),
  description: z.string().min(10, "Add at least a short description").max(2000),
  status: z.enum(["active", "draft", "archived"]),
  categoryId: z.string().min(1, "Select a category"),
  vendor: z.string().min(1, "Vendor is required"),
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  compareAtPrice: z.coerce.number().optional(),
  costPerItem: z.coerce.number().optional(),
  sku: z.string().min(1, "SKU is required"),
  barcode: z.string().optional(),
  inventory: z.coerce.number().int().min(0, "Inventory can't be negative"),
  trackInventory: z.boolean(),
  tags: z.array(z.string()).default([]),
  imageUrl: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  seoTitle: z.string().max(70, "Keep SEO titles under 70 characters").optional(),
  seoDescription: z.string().max(160, "Keep SEO descriptions under 160 characters").optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const productFormDefaults: ProductFormValues = {
  title: "",
  description: "",
  status: "draft",
  categoryId: "",
  vendor: "",
  price: 0,
  compareAtPrice: undefined,
  costPerItem: undefined,
  sku: "",
  barcode: "",
  inventory: 0,
  trackInventory: true,
  tags: [],
  imageUrl: "",
  seoTitle: "",
  seoDescription: "",
};
