'use client';

import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Truck } from 'lucide-react';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Veiculo } from '@/lib/defs';
import { Skeleton } from '@/components/ui/skeleton';

export default function PaginaDashboard() {
  const { user } = useUser();
  const firestore = useFirestore();

  const veiculosQuery = useMemoFirebase(
    () =>
      user
        ? query(collection(firestore, `usuarios/${user.uid}/veiculos`))
        : null,
    [user, firestore]
  );

  const { data: listaVeiculos, isLoading } = useCollection<Veiculo>(veiculosQuery);

  return (
    <div className="space-y-4">
      <h2 className="font-headline text-2xl font-semibold text-gray-800">
        Sua Frota
      </h2>
      <div className="space-y-3">
        {isLoading && (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        )}
        {listaVeiculos && listaVeiculos.map((veiculo) => (
          <Link
            href={`/dashboard/vehicles/${veiculo.id}`}
            key={veiculo.id}
            className="block transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-headline text-lg">
                      {veiculo.marca} {veiculo.modelo}
                    </CardTitle>
                    <CardDescription>{veiculo.placa}</CardDescription>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Truck className="h-6 w-6" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Modelo: {veiculo.modelo}</span>
                  {/* A contagem de pneus virá da subcoleção no futuro */}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
         {!isLoading && (!listaVeiculos || listaVeiculos.length === 0) && (
            <p className="text-center text-muted-foreground">Nenhum veículo cadastrado ainda.</p>
        )}
      </div>
    </div>
  );
}
