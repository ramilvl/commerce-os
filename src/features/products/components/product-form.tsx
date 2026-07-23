"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Sparkles, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { productFormSchema, type ProductFormValues } from "../schema";
import { generateProductDescription } from "../api";
import { CATEGORIES } from "@/lib/mock/generators";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductFormProps {
  defaultValues: ProductFormValues;
  onSubmit: (values: ProductFormValues) => Promise<void> | void;
  submitLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export function ProductForm({ defaultValues, onSubmit, submitLabel = "Save product", isSubmitting, onCancel }: ProductFormProps) {
  const [tagInput, setTagInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const tags = watch("tags") ?? [];
  const status = watch("status");
  const trackInventory = watch("trackInventory");
  const title = watch("title");
  const vendor = watch("vendor");

  const addTag = () => {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) {
      setValue("tags", [...tags, value]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => setValue("tags", tags.filter((t) => t !== tag));

  const handleGenerateDescription = async () => {
    if (!title) {
      toast.error("Add a product title first so AI has context to work with.");
      return;
    }
    setGenerating(true);
    try {
      const description = await generateProductDescription(title, vendor || "your brand");
      setValue("description", description, { shouldValidate: true });
      toast.success("Description generated");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values))} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic information</CardTitle>
              <CardDescription>The core details customers see on your storefront.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. Heritage Trail Backpack" {...register("title")} />
                {errors.title && <p className="text-xs text-danger">{errors.title.message}</p>}
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description</Label>
                  <Button type="button" variant="ghost" size="sm" className="h-7 gap-1 text-xs text-accent" onClick={handleGenerateDescription} disabled={generating}>
                    {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                    {generating ? "Generating..." : "Generate with AI"}
                  </Button>
                </div>
                <Textarea id="description" rows={6} placeholder="Describe the product, its materials, and what makes it worth buying..." {...register("description")} />
                {errors.description && <p className="text-xs text-danger">{errors.description.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="imageUrl">Primary image URL</Label>
                <Input id="imageUrl" placeholder="https://images.example.com/product.jpg" {...register("imageUrl")} />
                {errors.imageUrl && <p className="text-xs text-danger">{errors.imageUrl.message}</p>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set the price customers pay and your internal cost basis.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" {...register("price")} />
                {errors.price && <p className="text-xs text-danger">{errors.price.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="compareAtPrice">Compare-at price</Label>
                <Input id="compareAtPrice" type="number" step="0.01" {...register("compareAtPrice")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="costPerItem">Cost per item</Label>
                <Input id="costPerItem" type="number" step="0.01" {...register("costPerItem")} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Track stock levels and identifiers for this product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Track inventory</p>
                  <p className="text-xs text-muted-foreground">Automatically deduct stock as orders come in.</p>
                </div>
                <Switch checked={trackInventory} onCheckedChange={(v) => setValue("trackInventory", v)} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" {...register("sku")} />
                  {errors.sku && <p className="text-xs text-danger">{errors.sku.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="barcode">Barcode</Label>
                  <Input id="barcode" {...register("barcode")} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="inventory">Quantity</Label>
                  <Input id="inventory" type="number" {...register("inventory")} />
                  {errors.inventory && <p className="text-xs text-danger">{errors.inventory.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Search engine listing</CardTitle>
              <CardDescription>Optimize how this product appears in search results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="seoTitle">SEO title</Label>
                <Input id="seoTitle" {...register("seoTitle")} />
                {errors.seoTitle && <p className="text-xs text-danger">{errors.seoTitle.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seoDescription">SEO description</Label>
                <Textarea id="seoDescription" rows={3} {...register("seoDescription")} />
                {errors.seoDescription && <p className="text-xs text-danger">{errors.seoDescription.message}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={status} onValueChange={(v) => setValue("status", v as ProductFormValues["status"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select defaultValue={defaultValues.categoryId} onValueChange={(v) => setValue("categoryId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-xs text-danger">{errors.categoryId.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="vendor">Vendor</Label>
                <Input id="vendor" placeholder="e.g. Atlas Supply Co." {...register("vendor")} />
                {errors.vendor && <p className="text-xs text-danger">{errors.vendor.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="tagInput">Tags</Label>
                <div className="flex gap-1.5">
                  <Input
                    id="tagInput"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag and press Enter"
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="gap-1 pr-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag} tag`}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-2 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting} className="gap-1.5 min-w-32">
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
