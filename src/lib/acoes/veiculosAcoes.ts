'use server';

import { db } from '@/firebase/config.server';
import { revalidatePath } from 'next/cache';

interface DadosVeiculo {
  placa: string;
  marca: string;
  modelo: string;
}

const posicoesParaModelo: Record<string, number> = {
    '4x2': 4,
    '6x2': 6,
    '6x4': 10,
}

export async function criarVeiculo(usuarioId: string, dados: DadosVeiculo) {
  if (!usuarioId) {
    throw new Error('ID do usuário é necessário para criar um veículo.');
  }

  const veiculoRef = db.collection(`usuarios/${usuarioId}/veiculos`).doc();
  await veiculoRef.set({
    id: veiculoRef.id,
    ...dados,
  });

  // Cria a subcoleção de pneus
  const numPneus = posicoesParaModelo[dados.modelo] || 0;
  const batch = db.batch();
  for (let i = 1; i <= numPneus; i++) {
    const pneuRef = veiculoRef.collection('pneus').doc();
    batch.set(pneuRef, {
        id: pneuRef.id,
        posicao: i,
        pressao: 0,
        profundidade: 0,
        observacoes: '',
        ultimaChecagem: null
    });
  }
  await batch.commit();


  revalidatePath('/dashboard/registrations/vehicles');
}

export async function excluirVeiculo(usuarioId: string, veiculoId: string) {
  if (!usuarioId || !veiculoId) {
    throw new Error('IDs são necessários para excluir um veículo.');
  }

  const pneusSnapshot = await db.collection(`usuarios/${usuarioId}/veiculos/${veiculoId}/pneus`).get();
  const batch = db.batch();
  pneusSnapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  await db.doc(`usuarios/${usuarioId}/veiculos/${veiculoId}`).delete();

  revalidatePath('/dashboard/registrations/vehicles');
  revalidatePath('/dashboard');
}
