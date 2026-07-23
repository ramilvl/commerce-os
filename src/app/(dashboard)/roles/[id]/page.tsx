"use client";

import { use, useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { ALL_PERMISSIONS } from "@/features/roles/api";
import { useRole, useUpdateRolePermissions } from "@/features/roles/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function groupPermissions(perms: string[]) {
  const groups: Record<string, string[]> = {};
  perms.forEach((p) => {
    const [module] = p.split(".");
    if (!module) return;
    groups[module] = [...(groups[module] ?? []), p];
  });
  return groups;
}

const ACTION_LABEL: Record<string, string> = {
  view: "View", edit: "Edit", manage: "Manage",
};

export default function RoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: role, isLoading, isError, refetch } = useRole(id);
  const updatePermissions = useUpdateRolePermissions(id);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (role) setSelected(new Set(role.permissions));
  }, [role]);

  if (isError) {
    return (
      <div>
        <PageHeader title="Role" breadcrumbs={[{ label: "Roles & Permissions", href: "/roles" }, { label: "Not found" }]} />
        <ErrorState title="Role not found" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !role) {
    return (
      <div>
        <PageHeader title="Loading role..." breadcrumbs={[{ label: "Roles & Permissions", href: "/roles" }]} />
        <DetailPageSkeleton />
      </div>
    );
  }

  const groups = groupPermissions(ALL_PERMISSIONS);
  const toggle = (perm: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(perm)) next.delete(perm);
      else next.add(perm);
      return next;
    });
  };

  return (
    <div>
      <PageHeader
        title={role.name}
        description={role.description}
        breadcrumbs={[{ label: "Roles & Permissions", href: "/roles" }, { label: role.name }]}
        actions={
          <>
            {role.isSystem && <Badge variant="outline">System role</Badge>}
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => updatePermissions.mutate(Array.from(selected))}
              disabled={updatePermissions.isPending}
            >
              {updatePermissions.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              Save changes
            </Button>
          </>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Members with this role</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{role.memberCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-muted-foreground">Permissions granted</p>
          <p className="mt-1 font-mono text-lg font-semibold tabular-fig">{selected.size} / {ALL_PERMISSIONS.length}</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Permission matrix</CardTitle>
          <p className="text-xs text-muted-foreground">Toggle individual permissions this role should have access to.</p>
        </CardHeader>
        <CardContent className="space-y-5">
          {Object.entries(groups).map(([module, perms]) => (
            <div key={module}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{module}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {perms.map((perm) => {
                  const action = perm.split(".")[1] ?? perm;
                  return (
                    <label key={perm} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm cursor-pointer hover:bg-muted/50">
                      <Checkbox checked={selected.has(perm)} onCheckedChange={() => toggle(perm)} />
                      <Label className="cursor-pointer font-normal">{ACTION_LABEL[action] ?? action}</Label>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
