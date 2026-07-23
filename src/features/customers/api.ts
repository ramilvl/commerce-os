import { delay } from "@/lib/utils";
import { db } from "@/lib/mock/db";
import type { Customer } from "@/types/domain";

export interface CustomerListParams {
  status?: Customer["status"] | "all";
}

export async function fetchCustomers(params: CustomerListParams = {}): Promise<Customer[]> {
  await delay(450);
  let items = [...db.customers];
  if (params.status && params.status !== "all") items = items.filter((c) => c.status === params.status);
  return items.sort((a, b) => b.lifetimeValue - a.lifetimeValue);
}

export async function fetchCustomer(id: string): Promise<Customer> {
  await delay(350);
  const customer = db.customers.find((c) => c.id === id);
  if (!customer) throw new Error("Customer not found");
  return customer;
}

export async function fetchCustomerOrders(customerId: string) {
  await delay(300);
  return db.orders.filter((o) => o.customer.id === customerId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export async function addCustomerNote(id: string, content: string, author = "You"): Promise<Customer> {
  await delay(300);
  const idx = db.customers.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Customer not found");
  const customer = db.customers[idx] as Customer;
  customer.notes = [
    { id: `note_${Math.random().toString(36).slice(2, 8)}`, author, content, createdAt: new Date().toISOString() },
    ...customer.notes,
  ];
  return customer;
}

export async function updateCustomerStatus(id: string, status: Customer["status"]): Promise<Customer> {
  await delay(350);
  const idx = db.customers.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Customer not found");
  const customer = db.customers[idx] as Customer;
  customer.status = status;
  return customer;
}
