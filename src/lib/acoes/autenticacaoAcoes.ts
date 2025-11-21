'use server';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/config.server';

export async function fazerLoginComEmailESenha(email: string, pass: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    return JSON.parse(JSON.stringify(userCredential.user));
  } catch (error: any) {
    // Para simplificar, estamos relançando o erro.
    // Em um app de produção, você poderia logar o erro ou retornar uma mensagem mais amigável.
    throw new Error(error.code || 'Erro de autenticação desconhecido');
  }
}
