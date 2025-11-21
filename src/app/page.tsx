
"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function PaginaLogin() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <Card className="border-none bg-transparent shadow-none">
          <CardHeader className="items-center text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Truck className="h-10 w-10" />
            </div>
            <CardTitle className="font-headline text-3xl font-bold text-primary">
              PrototPneus
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Gerencie os pneus da sua frota com facilidade.
            </CardDescription>
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
                  className="bg-card"
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
                  className="bg-card"
                />
              </div>
              <Button type="submit" className="w-full bg-accent font-bold text-accent-foreground hover:bg-accent/90">
                Entrar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="absolute bottom-4 text-sm text-muted-foreground">
        Versão 1.0.0
      </div>
    </main>
  );
}
