"use client";

import { usePathname } from "next/navigation";
import { Menu, Moon, Search, Sun, SunMoon } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-config";
import { useUiStore } from "@/store/ui-store";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationsPopover } from "@/components/shared/notifications-popover";

function useBreadcrumb() {
  const pathname = usePathname();
  const match = NAV_ITEMS.find((i) => pathname === i.href || pathname.startsWith(i.href + "/"));
  const segments = pathname.split("/").filter(Boolean);
  const isDetail = match && segments.length > 1 && segments[1] !== "new";
  return { section: match?.section ?? "CommerceOS", label: match?.label ?? "Overview", isDetail };
}

export function Topbar() {
  const setCommandPaletteOpen = useUiStore((s) => s.setCommandPaletteOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const { section, label } = useBreadcrumb();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur-md md:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileNavOpen(true)} aria-label="Open navigation">
        <Menu className="h-4 w-4" />
      </Button>

      <div className="hidden min-w-0 flex-col leading-tight md:flex">
        <span className="text-[11px] font-medium text-muted-foreground">{section}</span>
        <span className="truncate text-sm font-semibold">{label}</span>
      </div>

      <button
        onClick={() => setCommandPaletteOpen(true)}
        className="ml-2 flex h-9 w-full max-w-xs items-center gap-2 rounded-md border border-border bg-muted/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:ml-6"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search everything...</span>
        <span className="ml-auto hidden items-center gap-0.5 rounded border border-border-strong bg-surface px-1.5 py-0.5 text-[10px] font-medium sm:flex">
          ⌘K
        </span>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Toggle theme">
              {theme === "dark" ? <Moon className="h-4 w-4" /> : theme === "light" ? <Sun className="h-4 w-4" /> : <SunMoon className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun /> Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon /> Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <SunMoon /> System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <NotificationsPopover />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-accent">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="Jordan Avery" />
                <AvatarFallback>JA</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-foreground">Jordan Avery</span>
                <span className="text-xs text-muted-foreground">jordan@commerceos.io</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Your profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Workspace settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
