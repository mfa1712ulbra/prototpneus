'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { fazerLoginComEmailESenha } from '@/lib/acoes/autenticacaoAcoes';
import { useUser } from '@/firebase';

export default function PaginaLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('tecnico@prototpneus.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const { user, isUserLoading } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fazerLoginComEmailESenha(email, password);
      toast({
        title: 'Login bem-sucedido!',
        description: 'Redirecionando para o dashboard...',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description:
          error.message || 'Ocorreu um erro. Verifique seu e-mail e senha.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
    // Se o usuário já estiver logado, redirecione para o dashboard
  if (isUserLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <p>Carregando...</p>
      </main>
    );
  }

  if (user) {
    router.replace('/dashboard');
    return null;
  }

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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-card"
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-card"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-accent font-bold text-accent-foreground hover:bg-accent/90"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
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
