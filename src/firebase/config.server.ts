// SOMENTE PARA USO NO SERVIDOR (SERVER-SIDE)
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Este é um padrão robusto para garantir que o firebase-admin seja inicializado apenas uma vez
// no ambiente do servidor, evitando problemas de cache de módulo em ambientes serverless.

let app: App;
let auth: Auth;
let db: Firestore;

if (!getApps().length) {
    try {
        // Tenta inicializar com as credenciais da conta de serviço, se disponíveis
        const serviceAccount = JSON.parse(
            process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
        );
        app = initializeApp({
            credential: cert(serviceAccount),
        });
    } catch (e) {
        // Se falhar (ex: a variável de ambiente não existe), tenta a inicialização padrão.
        // Isso funciona em ambientes do Google Cloud (como o App Hosting) que fornecem credenciais automaticamente.
        console.warn("Falha ao inicializar com a chave da conta de serviço. Tentando inicialização padrão do ambiente.");
        app = initializeApp();
    }
} else {
    // Se já houver um app inicializado, apenas o obtemos.
    app = getApps()[0]!;
}

auth = getAuth(app);
db = getFirestore(app);

// Funções "getter" que retornam as instâncias já inicializadas.
// As Server Actions importarão estas funções.
export const getDb = () => db;
export const getAuthAdmin = () => auth;