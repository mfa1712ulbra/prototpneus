// SOMENTE PARA USO NO SERVIDOR (SERVER-SIDE)
import { initializeApp, getApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// As credenciais de serviço são injetadas como variáveis de ambiente no App Hosting.
// Não é necessário um arquivo JSON de credenciais no código.
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
  : undefined;

const app =
  getApps().find((app) => app.name === 'admin') ||
  initializeApp(
    serviceAccount
      ? {
          credential: cert(serviceAccount),
        }
      : undefined,
    'admin'
  );

export const auth = getAuth(app);
export const db = getFirestore(app);
