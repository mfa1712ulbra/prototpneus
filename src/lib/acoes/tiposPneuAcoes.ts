'use server';

import { getDb } from '@/firebase/config.server';
import { revalidatePath } from 'next/cache';

interface DadosTipoPneu {
  marca: string;
  modelo: string;
}

export async function criarTipoPneu(
  usuarioId: string,
  dados: DadosTipoPneu
) {
  const db = getDb();
  if (!usuarioId) {
    throw new Error('ID do usuário é necessário para criar um tipo de pneu.');
  }

  const tipoPneuRef = db.collection(`usuarios/${usuarioId}/tiposPneu`).doc();
  await tipoPneuRef.set({
    id: tipoPneuRef.id,
    ...dados,
  });

  revalidatePath('/dashboard/registrations/tires');
}

export async function excluirTipoPneu(usuarioId: string, tipoPneuId: string) {
  const db = getDb();
  if (!usuarioId || !tipoPneuId) {
    throw new Error('IDs são necessários para excluir um tipo de pneu.');
  }

  await db
    .doc(`usuarios/${usuarioId}/tiposPneu/${tipoPneuId}`)
    .delete();

  revalidatePath('/dashboard/registrations/tires');
}
