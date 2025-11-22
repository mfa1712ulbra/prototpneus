'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { DiagramaVeiculo } from '@/components/vehicle-diagram';
import { useDoc, useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { doc, collection, query, updateDoc, serverTimestamp } from 'firebase/firestore';
import type { Veiculo, Pneu, TipoPneu } from '@/lib/defs';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

export default function PaginaDetalheVeiculo() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
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

  const tiposPneuQuery = useMemoFirebase(
    () => (user ? query(collection(firestore, `usuarios/${user.uid}/tiposPneu`)) : null),
    [user, firestore]
  );
  const { data: tiposPneu, isLoading: isLoadingTiposPneu } = useCollection<TipoPneu>(tiposPneuQuery);


  if (isLoadingVeiculo || isLoadingPneus || isLoadingTiposPneu) {
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

  if (!isLoadingVeiculo && !veiculo) {
     return (
      <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full py-10">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-semibold">Veículo não encontrado</h2>
        <p>O veículo que você está procurando não existe ou foi removido.</p>
      </div>
    );
  }

  // A verificação do veículo é feita acima
  if (!veiculo) return null;


  const handleSalvarPneu = async (pneuAtualizado: Pneu) => {
    if (!user || !id || !firestore) return;
    try {
      const pneuDocRef = doc(firestore, `usuarios/${user.uid}/veiculos/${id}/pneus/${pneuAtualizado.id}`);
      await updateDoc(pneuDocRef, {
        pressao: pneuAtualizado.pressao,
        profundidade: pneuAtualizado.profundidade,
        observacoes: pneuAtualizado.observacoes,
        tipoPneuId: pneuAtualizado.tipoPneuId || null,
        ultimaChecagem: serverTimestamp(),
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
        tiposPneu={tiposPneu || []}
      />
    </div>
  );
}
