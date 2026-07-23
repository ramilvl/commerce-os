"use client";

import Link from "next/link";
import { Bell, CheckCheck } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "@/features/notifications/hooks";
import { NOTIFICATION_META } from "@/features/notifications/meta";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { ListItemRowSkeleton } from "@/components/shared/skeletons";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay on top of orders, inventory, and account activity."
        actions={
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => markAllRead.mutate()} disabled={!unreadCount}>
            <CheckCheck className="h-3.5 w-3.5" /> Mark all as read
          </Button>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <Card className="divide-y divide-border p-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <ListItemRowSkeleton key={i} />
          ))}
        </Card>
      ) : !notifications || notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up. New activity will appear here." />
      ) : (
        <Card className="divide-y divide-border p-0">
          {notifications.map((n) => {
            const meta = NOTIFICATION_META[n.type];
            const Icon = meta.icon;
            return (
              <div key={n.id} className={cn("flex items-start gap-3 px-5 py-4 transition-colors", !n.read && "bg-accent-subtle/30")}>
                <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", meta.className)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">{n.title}</p>
                    {!n.read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{n.description}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <p className="text-xs text-muted-foreground">{formatRelativeTime(n.createdAt)}</p>
                    {n.actionHref && n.actionLabel && (
                      <Link href={n.actionHref} className="text-xs font-medium text-accent hover:underline">
                        {n.actionLabel}
                      </Link>
                    )}
                    {!n.read && (
                      <button onClick={() => markRead.mutate(n.id)} className="text-xs font-medium text-muted-foreground hover:text-foreground">
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
