"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  
  const isDashboardHome = pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between bg-[#008080] p-4 text-primary-foreground shadow-md">
      <div className="w-10">
        {!isDashboardHome && (
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white" onClick={() => router.back()}>
            <ArrowLeft className="h-6 w-6" />
            <span className="sr-only">Voltar</span>
          </Button>
        )}
      </div>
      
      <h1 className="font-headline text-xl font-bold">TireControl</h1>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
            <User className="h-6 w-6" />
            <span className="sr-only">Menu do usuário</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => router.push('/')}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
