"use client";

import Link from "next/link";
import { Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useRoles } from "@/features/roles/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function RolesPage() {
  const { data, isLoading, isError, refetch } = useRoles();

  return (
    <div>
      <PageHeader
        title="Roles & Permissions"
        description="Control what each role can see and do across CommerceOS."
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => toast.info("Custom roles", { description: "This would open the role builder." })}>
            <Plus className="h-3.5 w-3.5" /> New role
          </Button>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="No roles configured" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((role) => (
            <Link key={role.id} href={`/roles/${role.id}`}>
              <Card className="h-full transition-shadow hover:shadow-panel">
                <CardHeader className="flex-row items-start justify-between space-y-0">
                  <CardTitle>{role.name}</CardTitle>
                  {role.isSystem && <Badge variant="outline">System</Badge>}
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{role.description}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{role.memberCount} members</span>
                    <span className="font-medium text-accent">{role.permissions.length} permissions</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
