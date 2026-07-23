"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FolderTree, Loader2, Plus } from "lucide-react";
import { useCategories, useCreateCategory } from "@/features/categories/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

export default function CategoriesPage() {
  const { data, isLoading, isError, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80&auto=format&fit=crop");

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createCategory.mutateAsync({ name, description, image });
    setOpen(false);
    setName("");
    setDescription("");
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize your catalog into browsable collections."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> New category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="cat-name">Name</Label>
                  <Input id="cat-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Outerwear" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cat-desc">Description</Label>
                  <Textarea id="cat-desc" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cat-image">Cover image URL</Label>
                  <Input id="cat-image" value={image} onChange={(e) => setImage(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!name.trim() || createCategory.isPending} className="gap-1.5">
                  {createCategory.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create category
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState icon={FolderTree} title="No categories yet" description="Create your first category to start organizing products." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="group overflow-hidden transition-shadow hover:shadow-panel">
                <div className="relative h-28 w-full overflow-hidden bg-muted">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="300px"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="truncate text-sm font-semibold">{category.name}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{category.description}</p>
                  <p className="mt-2 text-xs font-medium text-accent">{category.productCount} products</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
