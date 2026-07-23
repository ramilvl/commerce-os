"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowRight, Loader2, Lock, Mail, ShieldCheck, Store, Zap } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    // Demo mode: Supabase Auth is wired in src/lib/supabase but this build runs
    // against the mock data layer, so we simulate the network round trip.
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    toast.success("Welcome back", { description: `Signed in as ${values.email}` });
    router.push("/dashboard");
  };

  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8 sm:p-12">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Store className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">CommerceOS</span>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to your workspace</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">Enter your credentials to access the admin console.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
            <div className="space-y-1.5">
              <Label htmlFor="email">Work email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@company.com" className="pl-9" autoComplete="email" {...register("email")} />
              </div>
              {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs font-medium text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-9" autoComplete="current-password" {...register("password")} />
              </div>
              {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full gap-1.5" disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent" />
            Demo mode — any email/password combination signs you in against mock data.
          </div>
        </div>

        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} CommerceOS. All rights reserved.</p>
      </div>

      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--accent)/0.35),transparent_45%),radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.25),transparent_40%)]" />
        <div className="relative flex h-full flex-col justify-center px-16">
          <Zap className="h-8 w-8 text-primary-foreground" />
          <p className="mt-6 max-w-md text-2xl font-medium leading-snug text-primary-foreground">
            "CommerceOS gave our merchandising and fulfillment teams a single source of truth — we shipped 40% faster."
          </p>
          <div className="mt-6 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary-foreground/20" />
            <div>
              <p className="text-sm font-medium text-primary-foreground">Sasha Whitfield</p>
              <p className="text-xs text-primary-foreground/60">VP Operations, Northwind Traders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
