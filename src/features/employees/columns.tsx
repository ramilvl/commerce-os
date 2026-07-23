"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { formatRelativeTime, initials } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmployeeStatusBadge } from "@/components/shared/status-badges";
import type { Employee } from "@/types/domain";

export const employeeColumns: ColumnDef<Employee, any>[] = [
  {
    accessorKey: "name",
    header: "Employee",
    cell: ({ row }) => (
      <div className="flex min-w-0 items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.original.avatar} alt={row.original.name} />
          <AvatarFallback>{initials(row.original.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <span className="text-sm">{row.original.role}</span>,
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.department}</span>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <EmployeeStatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.location}</span>,
  },
  {
    accessorKey: "lastActive",
    header: "Last active",
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatRelativeTime(row.original.lastActive)}</span>,
  },
];
