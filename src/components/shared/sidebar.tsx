"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, NAV_SECTIONS } from "@/lib/nav-config";
import { useUiStore } from "@/store/ui-store";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        "hidden shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200 ease-out md:flex",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className={cn("flex h-14 items-center border-b border-border px-4", collapsed && "justify-center px-0")}>
        <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Store className="h-4 w-4" />
          </div>
          {!collapsed && <span className="truncate text-sm font-semibold tracking-tight">CommerceOS</span>}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section} className="mb-5">
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                {section}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {NAV_ITEMS.filter((i) => i.section === section).map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                const link = (
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors",
                      collapsed && "justify-center px-0 py-2",
                      active
                        ? "bg-accent-subtle text-accent"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-accent" : "text-muted-foreground group-hover:text-foreground")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                );
                return (
                  <li key={item.href}>
                    {collapsed ? (
                      <Tooltip>
                        <TooltipTrigger asChild>{link}</TooltipTrigger>
                        <TooltipContent side="right">{item.label}</TooltipContent>
                      </Tooltip>
                    ) : (
                      link
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="w-full justify-center gap-2 text-muted-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && "Collapse"}
        </Button>
      </div>
    </aside>
  );
}
