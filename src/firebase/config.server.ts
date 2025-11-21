// SOMENTE PARA USO NO SERVIDOR (SERVER-SIDE)
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App;
let auth: Auth;
let db: Firestore;

function initializeAdminApp() {
  if (!getApps().length) {
    // Em ambientes de servidor (como App Hosting ou Cloud Functions),
    // o SDK Admin é inicializado sem argumentos para usar as credenciais padrão do ambiente.
    app = initializeApp();
  } else {
    app = getApps()[0]!;
  }
  auth = getAuth(app);
  db = getFirestore(app);
}

// Inicializa na primeira carga
initializeAdminApp();

// Funções "getter" para garantir que a instância seja retornada
export const getDb = () => db;
export const getAuthAdmin = () => auth;
