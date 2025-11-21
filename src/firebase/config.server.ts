// SOMENTE PARA USO NO SERVIDOR (SERVER-SIDE)
import { initializeApp, getApps, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App;

// Em ambientes de servidor (como App Hosting ou Cloud Functions),
// o SDK Admin é inicializado sem argumentos para usar as credenciais padrão do ambiente.
if (!getApps().length) {
  app = initializeApp();
} else {
  app = getApps()[0]!;
}

export const auth = getAuth(app);
export const db = getFirestore(app);
