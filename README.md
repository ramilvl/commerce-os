# CommerceOS

**CommerceOS** is an enterprise e-commerce administration platform — a portfolio-grade admin console in the spirit of Shopify Admin, Stripe Dashboard, Vercel Dashboard, and Linear. It covers the full operational surface of running a commerce business: catalog, orders, customers, inventory, marketing, analytics, team/permissions, and an AI assistant.

The app runs end-to-end against a **deterministic, seeded mock data layer** out of the box — no backend required to explore it — while being architected so that layer is a drop-in swap for real Supabase calls.

![CommerceOS](https://img.shields.io/badge/Next.js-15-black) ![React](https://img.shields.io/badge/React-19-61DAFB) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38BDF8)

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/dashboard`. The login screen at `/login` accepts any email/password (demo mode).

```bash
npm run build   # production build
npm run start   # serve the production build
npm run typecheck
npm run lint
```

### Connecting a real Supabase project (optional)

The app works fully without any environment variables. To point it at a real Supabase project instead of the mock data layer:

1. Copy `.env.local.example` to `.env.local`
2. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Replace the calls in each `src/features/*/api.ts` file with real Supabase queries — the function signatures are already shaped to match, so this is a mechanical swap module-by-module (see [Architecture](#architecture) below).

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling | Tailwind CSS + a small shadcn/ui-style primitive layer (Radix under the hood) |
| Motion | Framer Motion (page/element transitions), CSS keyframes for skeletons/pulses |
| Server state | TanStack Query (caching, mutations, optimistic-friendly invalidation) |
| Client/UI state | Zustand (sidebar, theme, command palette, row selection) |
| Forms | React Hook Form + Zod resolvers |
| Tables | TanStack Table (sorting, filtering, pagination, column visibility, row selection) |
| Charts | Recharts (area, bar, donut, dual-line, custom funnel) |
| Drag & drop | dnd-kit (installed, ready for kanban/reorder UIs) |
| Icons | lucide-react |
| Auth | Supabase Auth (`@supabase/ssr`), demo-mode fallback |
| Database | Supabase (Postgres), with a seeded in-memory mock layer standing in for local dev |

---

## Architecture

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/login/           # Public auth routes
│   └── (dashboard)/            # Authenticated shell — one folder per module
│       ├── layout.tsx          # Sidebar + topbar + command palette shell
│       ├── dashboard/
│       ├── products/[id]/new/
│       ├── orders/[id]/
│       ├── customers/[id]/
│       ├── analytics/
│       ├── ai-assistant/
│       └── ... (categories, inventory, warehouses, marketing, coupons,
│                employees, roles, notifications, settings)
│
├── features/                   # Feature-based modules (one per domain)
│   └── <feature>/
│       ├── api.ts              # Data-access layer — the ONLY file that
│       │                       # talks to the data source. Swap mock → Supabase here.
│       ├── hooks.ts            # TanStack Query hooks wrapping api.ts
│       ├── schema.ts           # Zod validation schemas (where forms exist)
│       ├── columns.tsx         # TanStack Table column defs (where tables exist)
│       └── components/         # Feature-specific UI (forms, widgets, dialogs)
│
├── components/
│   ├── ui/                     # Design-system primitives (Button, Card, Dialog, ...)
│   └── shared/                 # Cross-feature composites (DataTable, KpiCard,
│                                # PageHeader, EmptyState, ErrorState, charts/, skeletons)
│
├── lib/
│   ├── mock/                   # Seeded mock "database" + aggregation queries
│   ├── supabase/               # Browser + server Supabase clients
│   ├── nav-config.ts           # Single source of truth for sidebar/command palette
│   └── utils.ts                # Formatting, slugify, seeded RNG, cn()
│
├── store/                      # Zustand stores (ui-store, selection-store)
└── types/domain.ts             # Shared TypeScript domain models
```

### Why this structure

- **One data-access seam per feature.** Every feature's `api.ts` is the only place that reads/writes data. UI components never import the mock layer directly. This is what makes swapping mock data for Supabase (or any other backend) a contained, mechanical change instead of a rewrite.
- **Shared primitives, not copy-paste.** All 15 modules' list pages are built from the same `DataTable`, `PageHeader`, `EmptyState`, `ErrorState`, and skeleton components. Status badges are generated from a single `makeStatusBadge()` factory rather than 10 bespoke badge components.
- **Every list/detail screen implements the same 4 states**: loading (skeleton), error (retry affordance), empty (icon + copy + CTA), and populated — per the brief's requirement that every module ship all of these.
- **Mock data is deterministic**, not random-per-render: a seeded PRNG (`seededRandom`) means the same product always has the same price, the same order always has the same timeline, etc. This avoids SSR/hydration mismatches and makes the demo feel like a real, stable dataset rather than shuffling on every refresh.

### Flagship modules (fully custom-built)

**Dashboard**, **Products**, **Orders**, **Customers**, **Analytics**, and **AI Assistant** received bespoke, deep implementations:

- **Products** — sectioned create/edit form (basic info, pricing, inventory, SEO, organization/tags), AI-assisted description generation, variant table, image gallery, bulk status actions, CSV import/export affordances.
- **Orders** — line items with running totals, payment/fulfillment/risk badges, shipment tracking, a full refund workflow (partial or full, with reason capture), an editable status timeline, and internal notes.
- **Customers** — lifetime value & AOV panel, tabbed purchase history / activity log / internal notes.
- **Analytics** — revenue trend, category & product performance, a conversion funnel, 12-month customer growth, and geographic sales breakdown, all driven by one date-range control.
- **AI Assistant** — a chat interface that answers questions about *live* store data (revenue, low-stock SKUs, churn-risk segments, campaign ideas) plus a categorized recommendations feed.

The remaining modules (**Categories, Inventory, Warehouses, Marketing, Coupons, Employees, Roles & Permissions, Notifications, Settings**) follow the same architectural pattern — dedicated `api.ts` / `hooks.ts` / `columns.tsx` / pages — so they're equally real and functional, just leaner where the domain calls for it (e.g. Categories is a visual card grid rather than a dense table; Roles ships an editable permission matrix).

---

## Design system

The visual language is deliberately restrained: a near-monochrome neutral palette, a single indigo-violet accent (`--accent`), and **tabular monospace numerals on every metric, price, and count** (`font-mono` + `font-variant-numeric: tabular-nums`) — the one consistent "signature" detail that ties dashboards, tables, and detail pages together and gives the numbers a precision-instrument feel rather than a generic-template one.

- Full light/dark theming via CSS custom properties in `globals.css`, toggle in the topbar (light / dark / system), persisted via Zustand.
- A command palette (`⌘K` / `Ctrl+K`) for navigation and quick actions, in the tradition of Linear/Vercel.
- Consistent focus rings, `prefers-reduced-motion` support, and semantic status-color tokens (`success` / `warning` / `danger` / `info`) used consistently across badges, charts, and alerts.
- All interactive primitives (dialogs, dropdowns, tabs, popovers, tooltips, selects) are accessible Radix primitives under the hood, styled to match.

---

## Mock data & seed data

`src/lib/mock/generators.ts` seeds:

- 64 products (with variants, images, tags, SEO fields)
- 90 customers (with notes, activity, LTV)
- 180 orders (full timelines, line items, addresses)
- 4 warehouses + derived inventory records
- 8 coupons, 6 marketing campaigns
- 28 employees, 6 roles with permission sets
- 8 notifications, 5 AI insights

`src/lib/mock/db.ts` layers analytics/aggregation on top (revenue series, KPI deltas, top products, low-stock alerts, geo sales, conversion funnel, customer growth) — this is what backs the Dashboard and Analytics modules.

All of it is generated from a seeded PRNG (`seededRandom` in `src/lib/utils.ts`), so the dataset is stable across reloads and safe for SSR.

---

## Known limitations (by design, for a demo/portfolio build)

- Mutations write to an in-memory array (`db.ts`) that resets on server restart — there's no persistence layer wired up, by design, so the app can run with zero external dependencies.
- Supabase Auth is wired for real usage (`src/lib/supabase/`) but the login page currently simulates the round trip so the app is explorable without credentials.
- CSV import/export and some secondary actions (e.g. "Generate custom role") are UI affordances that surface a toast rather than performing real I/O — swap these for real handlers alongside the Supabase migration.

---

## License

Built as a portfolio/demonstration project. Free to use as a reference or starting point.
