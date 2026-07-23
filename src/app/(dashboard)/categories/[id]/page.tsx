"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCategory } from "@/features/categories/hooks";
import { useProducts } from "@/features/products/hooks";
import { productColumns } from "@/features/products/columns";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ErrorState } from "@/components/shared/error-state";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { Card } from "@/components/ui/card";

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: category, isLoading, isError, refetch } = useCategory(id);
  const { data: products, isLoading: productsLoading } = useProducts({ categoryId: id });

  if (isError) {
    return (
      <div>
        <PageHeader title="Category" breadcrumbs={[{ label: "Categories", href: "/categories" }, { label: "Not found" }]} />
        <ErrorState title="Category not found" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !category) {
    return (
      <div>
        <PageHeader title="Loading category..." breadcrumbs={[{ label: "Categories", href: "/categories" }]} />
        <DetailPageSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={category.name}
        description={category.description}
        breadcrumbs={[{ label: "Categories", href: "/categories" }, { label: category.name }]}
      />

      <Card className="mb-6 overflow-hidden">
        <div className="relative h-40 w-full bg-muted">
          <Image src={category.image} alt={category.name} fill className="object-cover" sizes="1200px" />
        </div>
      </Card>

      <h2 className="mb-3 text-sm font-semibold text-foreground">Products in this category</h2>
      <DataTable
        columns={productColumns}
        data={products ?? []}
        isLoading={productsLoading}
        searchKey="title"
        searchPlaceholder="Search products in this category..."
        onRowClick={(row) => router.push(`/products/${row.id}`)}
        emptyTitle="No products in this category yet"
      />
    </div>
  );
}
