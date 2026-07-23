import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-subtle">
        <Compass className="h-6 w-6 text-accent" />
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">404 error</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">This page doesn't exist</h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          The page you're looking for may have been moved, renamed, or never existed.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
