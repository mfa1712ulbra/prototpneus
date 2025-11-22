
// SOMENTE PARA USO NO SERVIDOR (SERVER-SIDE)
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Garante que o Firebase seja inicializado apenas uma vez.
const app: App = !getApps().length ? initializeApp() : getApps()[0]!;

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Funções "getter" que retornam as instâncias já inicializadas.
// As Server Actions importarão estas funções.
export const getDb = () => db;
export const getAuthAdmin = () => auth;
