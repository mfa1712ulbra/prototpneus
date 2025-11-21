'use server';

import { db } from '@/firebase/config.server';
import { revalidatePath } from 'next/cache';

interface DadosMotorista {
  nome: string;
  cnh: string;
}

export async function criarMotorista(
  usuarioId: string,
  dados: DadosMotorista
) {
  if (!usuarioId) {
    throw new Error('ID do usuário é necessário para criar um motorista.');
  }

  const motoristaRef = db.collection(`usuarios/${usuarioId}/motoristas`).doc();
  await motoristaRef.set({
    id: motoristaRef.id,
    ...dados,
  });

  revalidatePath('/dashboard/registrations/drivers');
}

export async function excluirMotorista(usuarioId: string, motoristaId: string) {
  if (!usuarioId || !motoristaId) {
    throw new Error('IDs são necessários para excluir um motorista.');
  }

  await db
    .doc(`usuarios/${usuarioId}/motoristas/${motoristaId}`)
    .delete();

  revalidatePath('/dashboard/registrations/drivers');
}
