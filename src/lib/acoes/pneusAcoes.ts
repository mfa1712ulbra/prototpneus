'use server';

import { getDb } from '@/firebase/config.server';
import { revalidatePath } from 'next/cache';
import { FieldValue } from 'firebase-admin/firestore';

interface DadosPneu {
  pressao: number;
  profundidade: number;
  observacoes?: string;
}

export async function atualizarPneu(
  usuarioId: string,
  veiculoId: string,
  pneuId: string,
  dados: DadosPneu
) {
  const db = getDb();
  if (!usuarioId || !veiculoId || !pneuId) {
    throw new Error('IDs são necessários para atualizar um pneu.');
  }
  
  const pneuRef = db.doc(`usuarios/${usuarioId}/veiculos/${veiculoId}/pneus/${pneuId}`);

  await pneuRef.update({
    ...dados,
    ultimaChecagem: FieldValue.serverTimestamp(),
  });

  revalidatePath(`/dashboard/vehicles/${veiculoId}`);
}
