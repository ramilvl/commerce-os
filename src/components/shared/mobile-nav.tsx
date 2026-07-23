"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, NAV_SECTIONS } from "@/lib/nav-config";
import { useUiStore } from "@/store/ui-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function MobileNav() {
  const open = useUiStore((s) => s.mobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-72 p-0 sm:max-w-xs">
        <SheetHeader className="flex-row items-center gap-2 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Store className="h-4 w-4" />
          </div>
          <SheetTitle>CommerceOS</SheetTitle>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section} className="mb-5">
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">{section}</p>
              <ul className="flex flex-col gap-0.5">
                {NAV_ITEMS.filter((i) => i.section === section).map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2 py-2 text-sm font-medium transition-colors",
                          active ? "bg-accent-subtle text-accent" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
