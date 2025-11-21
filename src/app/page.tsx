
"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaginaLogin() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <Card className="border-none shadow-none">
          <CardHeader className="items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck className="h-10 w-10" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold text-[#008080]">
              PrototPneus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="seu.usuario"
                  defaultValue="tecnico"
                  required
                  className="bg-gray-100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  defaultValue="123456"
                  required
                  className="bg-gray-100"
                />
              </div>
              <Button type="submit" className="w-full font-bold">
                Entrar
                <ArrowRight className="ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="absolute bottom-4 text-sm text-muted-foreground">
        Versão 1.00
      </div>
    </main>
  );
}
