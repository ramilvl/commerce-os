"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-subtle">
            <AlertOctagon className="h-6 w-6 text-danger" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              An unexpected error occurred. Our team has been notified — please try again.
            </p>
          </div>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
