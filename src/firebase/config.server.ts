// SOMENTE PARA USO NO SERVIDOR (SERVER-SIDE)
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Este é um padrão robusto para garantir que o firebase-admin seja inicializado apenas uma vez
// no ambiente do servidor, evitando problemas de cache de módulo em ambientes serverless.

let app: App;
let auth: Auth;
let db: Firestore;

try {
    const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
    );

    if (!getApps().length) {
        app = initializeApp({
            credential: cert(serviceAccount),
        });
    } else {
        app = getApps()[0]!;
    }
} catch (e: any) {
    console.error("Falha ao inicializar o Firebase Admin SDK com a chave da conta de serviço. Tentando inicialização padrão.");
    // Em ambientes como o App Hosting, a inicialização padrão pode funcionar.
     if (!getApps().length) {
        app = initializeApp();
    } else {
        app = getApps()[0]!;
    }
}


auth = getAuth(app);
db = getFirestore(app);


// Funções "getter" que retornam as instâncias já inicializadas.
// As Server Actions importarão estas funções.
export const getDb = () => db;
export const getAuthAdmin = () => auth;
