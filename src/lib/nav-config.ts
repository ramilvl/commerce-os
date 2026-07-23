import {
  LayoutDashboard, Package, FolderTree, ShoppingCart, Users, Boxes, Warehouse,
  Megaphone, TicketPercent, BarChart3, UserCog, ShieldCheck, Bell, Sparkles, Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  section: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, section: "Overview" },
  { label: "Analytics", href: "/analytics", icon: BarChart3, section: "Overview" },

  { label: "Products", href: "/products", icon: Package, section: "Catalog" },
  { label: "Categories", href: "/categories", icon: FolderTree, section: "Catalog" },
  { label: "Inventory", href: "/inventory", icon: Boxes, section: "Catalog" },
  { label: "Warehouses", href: "/warehouses", icon: Warehouse, section: "Catalog" },

  { label: "Orders", href: "/orders", icon: ShoppingCart, section: "Sales" },
  { label: "Customers", href: "/customers", icon: Users, section: "Sales" },

  { label: "Marketing", href: "/marketing", icon: Megaphone, section: "Growth" },
  { label: "Coupons", href: "/coupons", icon: TicketPercent, section: "Growth" },
  { label: "AI Assistant", href: "/ai-assistant", icon: Sparkles, section: "Growth" },

  { label: "Employees", href: "/employees", icon: UserCog, section: "Organization" },
  { label: "Roles & Permissions", href: "/roles", icon: ShieldCheck, section: "Organization" },

  { label: "Notifications", href: "/notifications", icon: Bell, section: "System" },
  { label: "Settings", href: "/settings", icon: Settings, section: "System" },
];

export const NAV_SECTIONS = Array.from(new Set(NAV_ITEMS.map((i) => i.section)));
