"use client";

import { use } from "react";
import { formatDate, formatRelativeTime, initials } from "@/lib/utils";
import { useEmployee } from "@/features/employees/hooks";
import { PageHeader } from "@/components/shared/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { DetailPageSkeleton } from "@/components/shared/skeletons";
import { EmployeeStatusBadge } from "@/components/shared/status-badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function EmployeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: employee, isLoading, isError, refetch } = useEmployee(id);

  if (isError) {
    return (
      <div>
        <PageHeader title="Employee" breadcrumbs={[{ label: "Employees", href: "/employees" }, { label: "Not found" }]} />
        <ErrorState title="Employee not found" onRetry={() => refetch()} />
      </div>
    );
  }

  if (isLoading || !employee) {
    return (
      <div>
        <PageHeader title="Loading employee..." breadcrumbs={[{ label: "Employees", href: "/employees" }]} />
        <DetailPageSkeleton />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={employee.name}
        breadcrumbs={[{ label: "Employees", href: "/employees" }, { label: employee.name }]}
        actions={<EmployeeStatusBadge status={employee.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <Avatar className="h-16 w-16">
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback className="text-lg">{initials(employee.name)}</AvatarFallback>
            </Avatar>
            <p className="mt-3 text-base font-semibold">{employee.name}</p>
            <p className="text-sm text-muted-foreground">{employee.role}</p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email</span>
              <span>{employee.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Department</span>
              <span>{employee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Location</span>
              <span>{employee.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joined</span>
              <span>{formatDate(employee.joinedAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last active</span>
              <span>{formatRelativeTime(employee.lastActive)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
