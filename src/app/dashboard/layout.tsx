
import type { PropsWithChildren } from "react";
import { CabecalhoApp } from "@/components/cabecalho-app";
import { NavegacaoInferior } from "@/components/navegacao-inferior";

export default function LayoutDashboard({ children }: PropsWithChildren) {
  return (
    <div className="bg-background">
        <div className="relative flex min-h-screen flex-col bg-background font-sans">
            <CabecalhoApp />
            <main className="flex-1 overflow-y-auto p-4 pb-20">
                {children}
            </main>
            <NavegacaoInferior />
        </div>
    </div>
  );
}
