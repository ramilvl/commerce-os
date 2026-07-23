"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ProductForm } from "@/features/products/components/product-form";
import { productFormDefaults, type ProductFormValues } from "@/features/products/schema";
import { useCreateProduct } from "@/features/products/hooks";

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();

  const handleSubmit = async (values: ProductFormValues) => {
    const product = await createProduct.mutateAsync(values);
    router.push(`/products/${product.id}`);
  };

  return (
    <div>
      <PageHeader
        title="Add product"
        description="Create a new product and publish it to your catalog."
        breadcrumbs={[{ label: "Products", href: "/products" }, { label: "New" }]}
      />
      <ProductForm
        defaultValues={productFormDefaults}
        onSubmit={handleSubmit}
        isSubmitting={createProduct.isPending}
        submitLabel="Create product"
        onCancel={() => router.push("/products")}
      />
    </div>
  );
}
