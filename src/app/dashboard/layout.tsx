import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/app-header";
import { BottomNav } from "@/components/bottom-nav";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-gray-200">
        <div className="relative mx-auto flex min-h-screen max-w-sm flex-col bg-background font-sans shadow-2xl">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-4 pb-20">
                {children}
            </main>
            <BottomNav />
        </div>
    </div>
  );
}
