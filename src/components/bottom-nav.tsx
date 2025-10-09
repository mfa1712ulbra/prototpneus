"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Truck, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Veículos", icon: Truck },
  { href: "/dashboard/reports", label: "Relatórios", icon: FileText },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-10 mx-auto h-16 w-full border-t bg-card shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
      <div className="grid h-full grid-cols-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-sm font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
