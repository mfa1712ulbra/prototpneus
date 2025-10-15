import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-background">
        <div className="relative flex min-h-screen flex-col bg-background font-sans">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-4 pb-20">
                {children}
            </main>
            <BottomNav />
        </div>
    </div>
  );
}
