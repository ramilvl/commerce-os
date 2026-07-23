# Swapping mock data for Supabase

CommerceOS is built so each feature module's `api.ts` is the single seam between UI and data. Nothing else in the app imports `src/lib/mock` directly except those files. This doc walks through migrating one module — **Products** — as a template for the rest.

## 1. Create the table

```sql
create table products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text not null,
  status text not null check (status in ('active', 'draft', 'archived')),
  category_id uuid references categories(id),
  vendor text not null,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  cost_per_item numeric(10,2) default 0,
  sku text not null,
  barcode text,
  inventory integer not null default 0,
  track_inventory boolean not null default true,
  tags text[] default '{}',
  images jsonb default '[]',
  variants jsonb default '[]',
  seo_title text,
  seo_description text,
  rating numeric(2,1) default 0,
  review_count integer default 0,
  units_sold integer default 0,
  revenue numeric(12,2) default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table products enable row level security;
create policy "Authenticated users can read products"
  on products for select using (auth.role() = 'authenticated');
```

## 2. Replace `src/features/products/api.ts`

The function signatures stay identical — only the body changes:

```ts
import { createClient } from "@/lib/supabase/client";
import type { Product, ProductStatus } from "@/types/domain";

export async function fetchProducts(params: ProductListParams = {}): Promise<Product[]> {
  const supabase = createClient();
  let query = supabase.from("products").select("*").order("updated_at", { ascending: false });

  if (params.status && params.status !== "all") query = query.eq("status", params.status);
  if (params.categoryId && params.categoryId !== "all") query = query.eq("category_id", params.categoryId);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(mapRowToProduct); // small snake_case -> camelCase mapper
}
```

Because `src/features/products/hooks.ts` only calls these exported functions — it never touches Supabase or the mock store directly — **no other file changes**. The React Query hooks, the `DataTable`, the product form, and every page that renders products keep working exactly as before.

## 3. Repeat per module

Apply the same pattern to each `src/features/<module>/api.ts`. A sensible migration order, from simplest to most interconnected:

1. `categories`
2. `products`
3. `customers`
4. `orders` (references products + customers)
5. `inventory` / `warehouses`
6. `coupons` / `marketing`
7. `employees` / `roles`
8. `notifications`

## 4. Auth

`src/lib/supabase/client.ts` and `src/lib/supabase/server.ts` are already wired for Supabase Auth via `@supabase/ssr`. Once `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set, replace the simulated submit handler in `src/app/(auth)/login/page.tsx` with:

```ts
const supabase = createClient();
const { error } = await supabase.auth.signInWithPassword({ email, password });
```

and add a `middleware.ts` at the project root to refresh the session and protect the `(dashboard)` route group, following the standard `@supabase/ssr` Next.js App Router pattern.
