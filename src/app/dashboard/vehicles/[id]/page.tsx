'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { DiagramaVeiculo } from '@/components/vehicle-diagram';
import { useDoc, useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, collection, query } from 'firebase/firestore';
import type { Veiculo, Pneu } from '@/lib/defs';
import { Skeleton } from '@/components/ui/skeleton';
import { atualizarPneu } from '@/lib/acoes/pneusAcoes';
import { useToast } from '@/hooks/use-toast';

export default function PaginaDetalheVeiculo() {
  const params = useParams();
  const { id } = params;
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const veiculoRef = useMemoFirebase(
    () => (user && id ? doc(firestore, `usuarios/${user.uid}/veiculos/${id}`) : null),
    [user, id, firestore]
  );
  const { data: veiculo, isLoading: isLoadingVeiculo } = useDoc<Veiculo>(veiculoRef);
  
  const pneusQuery = useMemoFirebase(
    () => (user && id ? query(collection(firestore, `usuarios/${user.uid}/veiculos/${id}/pneus`)) : null),
    [user, id, firestore]
  );
  const { data: pneus, isLoading: isLoadingPneus } = useCollection<Pneu>(pneusQuery);

  if (isLoadingVeiculo || isLoadingPneus) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-6 w-24 mx-auto mt-2" />
        </div>
        <Skeleton className="h-96 w-48 mx-auto" />
      </div>
    );
  }

  if (!veiculo) {
    notFound();
  }

  const handleSalvarPneu = async (pneuAtualizado: Pneu) => {
    if (!user || !id) return;
    try {
      await atualizarPneu(user.uid, id.toString(), pneuAtualizado.id, {
        pressao: pneuAtualizado.pressao,
        profundidade: pneuAtualizado.profundidade,
        observacoes: pneuAtualizado.observacoes,
      });
       toast({
        title: "Sucesso",
        description: `Pneu ${pneuAtualizado.posicao} atualizado.`
      })
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o pneu."
      })
    }
  };

  const veiculoCompleto = { ...veiculo, pneus: pneus || [] };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-semibold text-gray-800">
          {veiculo.marca} {veiculo.modelo}
        </h2>
        <p className="text-muted-foreground">{veiculo.placa}</p>
      </div>
      <DiagramaVeiculo
        veiculo={veiculoCompleto}
        onSalvarPneu={handleSalvarPneu}
      />
    </div>
  );
}
