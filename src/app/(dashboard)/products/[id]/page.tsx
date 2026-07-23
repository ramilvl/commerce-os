"use client";

import { use, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Archive, Copy, MoreHorizontal, Package, Star, Trash2, TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { useDeleteProducts, useProduct, useUpdateProduct } from "@/features/products/hooks";
import { ProductForm } from "@/features/products/components/product-form";
import { CATEGORIES } from "@/lib/mock/generators";
import { PageHeader } from "@/components/shared/page-header";
import { ProductStatusBadge } from "@/components/shared/status-badges";
import { ErrorState } from "@/components/shared/error-state";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: product, isLoading, isError, refetch } = useProduct(id);
  const updateProduct = useUpdateProduct(id);
  const deleteProducts = useDeleteProducts();
  const [tab, setTab] = useState("overview");

  if (isError) {
    return (
      <div>
        <PageHeader title="Product" breadcrumbs={[{ label: "Products", href: "/products" }, { label: "Not found" }]} />
        <ErrorState title="Product not found" description="This product may have been deleted." onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !product) {
    return (
      <div>
        <PageHeader title="Loading product..." breadcrumbs={[{ label: "Products", href: "/products" }]} />
        <DetailPageSkeleton />
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.id === product.categoryId);
  const margin = product.price > 0 ? ((product.price - product.costPerItem) / product.price) * 100 : 0;

  return (
    <div>
      <PageHeader
        title={product.title}
        breadcrumbs={[{ label: "Products", href: "/products" }, { label: product.title }]}
        actions={
          <>
            <ProductStatusBadge status={product.status} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="More actions">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTab("edit")}>Edit product</DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="h-3.5 w-3.5" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => updateProduct.mutate({ status: "archived" })}>
                  <Archive className="h-3.5 w-3.5" /> Archive
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  destructive
                  onClick={async () => {
                    await deleteProducts.mutateAsync([product.id]);
                    router.push("/products");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete product
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Revenue</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{formatCurrency(product.revenue)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Units sold</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{formatNumber(product.unitsSold)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Margin</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{margin.toFixed(0)}%</p>
        </Card>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="variants">Variants ({product.variants.length})</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Images</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.images.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                      {product.images.map((img) => (
                        <div key={img.id} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                          <Image src={img.url} alt={img.alt} fill className="object-cover" sizes="200px" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price</span>
                    <span className="font-mono font-medium tabular-fig">{formatCurrency(product.price)}</span>
                  </div>
                  {product.compareAtPrice && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Compare at</span>
                      <span className="font-mono tabular-fig text-muted-foreground line-through">{formatCurrency(product.compareAtPrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cost per item</span>
                    <span className="font-mono font-medium tabular-fig">{formatCurrency(product.costPerItem)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Vendor</span>
                    <span className="font-medium">{product.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span className="font-medium">{category?.name ?? "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SKU</span>
                    <span className="font-mono tabular-fig">{product.sku}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Inventory</span>
                    <span className="font-mono font-medium tabular-fig">{formatNumber(product.inventory)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{formatDate(product.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-warning">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-current" : ""}`} />
                      ))}
                    </div>
                    <span className="font-mono text-sm font-medium tabular-fig">{product.rating.toFixed(1)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{formatNumber(product.reviewCount)} reviews</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variants">
          <Card>
            <CardContent className="p-0">
              {product.variants.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  <Package className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                  No variants configured.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Variant</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Inventory</TableHead>
                      <TableHead>Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {product.variants.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-medium">{v.name}</TableCell>
                        <TableCell className="font-mono text-xs tabular-fig text-muted-foreground">{v.sku}</TableCell>
                        <TableCell className="font-mono tabular-fig">{formatCurrency(v.price)}</TableCell>
                        <TableCell className="font-mono tabular-fig">
                          <span className={v.inventory < 20 ? "text-warning" : ""}>{v.inventory}</span>
                        </TableCell>
                        <TableCell className="font-mono text-xs tabular-fig text-muted-foreground">{v.weightGrams}g</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>Search engine preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <p className="truncate text-sm text-info">commerceos.io/products/{product.slug}</p>
                <p className="mt-0.5 truncate text-base text-accent">{product.seoTitle}</p>
                <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">{product.seoDescription}</p>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" />
                Well-optimized listings can improve organic click-through by up to 12%.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <ProductForm
            defaultValues={{
              title: product.title,
              description: product.description,
              status: product.status,
              categoryId: product.categoryId,
              vendor: product.vendor,
              price: product.price,
              compareAtPrice: product.compareAtPrice,
              costPerItem: product.costPerItem,
              sku: product.sku,
              barcode: product.barcode,
              inventory: product.inventory,
              trackInventory: product.trackInventory,
              tags: product.tags,
              imageUrl: product.images[0]?.url ?? "",
              seoTitle: product.seoTitle,
              seoDescription: product.seoDescription,
            }}
            onSubmit={async (values) => {
              await updateProduct.mutateAsync(values);
              setTab("overview");
            }}
            isSubmitting={updateProduct.isPending}
            submitLabel="Save changes"
            onCancel={() => setTab("overview")}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
