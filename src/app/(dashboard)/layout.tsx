import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
import { MobileNav } from "@/components/shared/mobile-nav";
import { CommandPalette } from "@/components/shared/command-palette";
import { ThemeEffect } from "@/components/shared/theme-effect";
import { ErrorBoundary } from "@/components/shared/error-boundary";

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <ThemeEffect />
      <Sidebar />
      <MobileNav />
      <CommandPalette />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-[1400px] py-6">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
