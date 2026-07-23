import { delay } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { Employee } from "@/types/domain";

export async function fetchEmployees(): Promise<Employee[]> {
  await delay(400);
  return [...db.employees].sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchEmployee(id: string): Promise<Employee> {
  await delay(300);
  const employee = db.employees.find((e) => e.id === id);
  if (!employee) throw new Error("Employee not found");
  return employee;
}

export interface InviteEmployeeInput {
  name: string;
  email: string;
  role: string;
  department: string;
}

export async function inviteEmployee(values: InviteEmployeeInput): Promise<Employee> {
  await delay(500);
  const employee: Employee = {
    id: `emp_${Math.random().toString(36).slice(2, 8)}`,
    name: values.name,
    email: values.email,
    avatar: `https://i.pravatar.cc/150?u=${values.email}`,
    role: values.role,
    department: values.department,
    status: "invited",
    location: "Remote",
    joinedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
  };
  db.employees.unshift(employee);
  return employee;
}
