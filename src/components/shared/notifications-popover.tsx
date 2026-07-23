"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/features/notifications/hooks";
import { NOTIFICATION_META } from "@/features/notifications/meta";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function NotificationsPopover() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}>
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-accent">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button
            onClick={() => markAllRead.mutate()}
            disabled={!unreadCount}
            className="flex items-center gap-1 text-xs font-medium text-accent transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </button>
        </div>
        <ScrollArea className="h-[360px]">
          {isLoading ? (
            <div className="flex flex-col gap-3 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <ul>
              {notifications.map((n) => {
                const meta = NOTIFICATION_META[n.type];
                const Icon = meta.icon;
                return (
                  <li key={n.id} className={cn("border-b border-border px-4 py-3 transition-colors last:border-0 hover:bg-muted/50", !n.read && "bg-accent-subtle/40")}>
                    <button className="flex w-full gap-3 text-left" onClick={() => !n.read && markRead.mutate(n.id)}>
                      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", meta.className)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-snug">{n.title}</p>
                          {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.description}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground/70">{formatRelativeTime(n.createdAt)}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">You're all caught up.</p>
            </div>
          )}
        </ScrollArea>
        <div className="border-t border-border p-2">
          <Button asChild variant="ghost" size="sm" className="w-full justify-center text-xs">
            <Link href="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
