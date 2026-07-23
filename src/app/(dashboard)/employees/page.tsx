"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Plus, UserCog } from "lucide-react";
import { useEmployees, useInviteEmployee } from "@/features/employees/hooks";
import { employeeColumns } from "@/features/employees/columns";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { DEPARTMENTS, JOB_TITLES } from "@/lib/mock/seed-values";

const inviteSchema = z.object({
  name: z.string().min(2, "Enter the employee's full name"),
  email: z.string().email("Enter a valid email address"),
  role: z.string().min(1, "Select a role"),
  department: z.string().min(1, "Select a department"),
});

type InviteValues = z.infer<typeof inviteSchema>;

export default function EmployeesPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data, isLoading, isError, refetch } = useEmployees();
  const inviteEmployee = useInviteEmployee();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<InviteValues>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { name: "", email: "", role: JOB_TITLES[0], department: DEPARTMENTS[0] },
  });

  const role = watch("role");
  const department = watch("department");

  const onSubmit = async (values: InviteValues) => {
    await inviteEmployee.mutateAsync(values);
    setOpen(false);
    reset();
  };

  return (
    <div>
      <PageHeader
        title="Employees"
        description="Manage your team and their access to CommerceOS."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Invite employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite a team member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" {...register("name")} />
                  {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Work email</Label>
                  <Input id="email" type="email" {...register("email")} />
                  {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={(v) => setValue("role", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {JOB_TITLES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Department</Label>
                    <Select value={department} onValueChange={(v) => setValue("department", v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={inviteEmployee.isPending} className="gap-1.5">
                    {inviteEmployee.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Send invite
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <DataTable
          columns={employeeColumns}
          data={data ?? []}
          isLoading={isLoading}
          searchKey="name"
          searchPlaceholder="Search employees..."
          onRowClick={(row) => router.push(`/employees/${row.id}`)}
          emptyIcon={UserCog}
          emptyTitle="No employees yet"
          pageSize={12}
        />
      )}
    </div>
  );
}
