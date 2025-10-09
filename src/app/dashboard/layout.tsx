import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/app-header";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="bg-background">
        <div className="relative flex min-h-screen flex-col bg-background font-sans">
            <AppHeader />
            <main className="flex-1 overflow-y-auto p-4">
                {children}
            </main>
        </div>
    </div>
  );
}
