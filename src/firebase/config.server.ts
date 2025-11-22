
// SOMENTE PARA USO NO SERVIDOR (SERVER-SIDE)
import { initializeApp, getApps, App, cert } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Variáveis para armazenar as instâncias inicializadas
let app: App;
let auth: Auth;
let db: Firestore;

// Função para garantir que o Firebase seja inicializado apenas uma vez.
function initializeAdminApp() {
  if (!getApps().length) {
    // Em um ambiente de produção (como o App Hosting),
    // o SDK Admin é inicializado sem argumentos para usar as credenciais padrão do ambiente.
    app = initializeApp();
  } else {
    // Se já estiver inicializado, apenas obtenha a instância existente.
    app = getApps()[0]!;
  }
  // Obtenha as instâncias dos serviços
  auth = getAuth(app);
  db = getFirestore(app);
}

// Chame a função de inicialização uma vez no carregamento do módulo.
initializeAdminApp();

// Funções "getter" que retornam as instâncias já inicializadas.
// As Server Actions importarão estas funções.
export const getDb = () => db;
export const getAuthAdmin = () => auth;
