// Tipos para dados do Firestore, sem dados estáticos

export type Pneu = {
  id: string;
  posicao: number;
  pressao: number;
  profundidade: number;
  ultimaChecagem: string; // ou Date
  observacoes?: string;
};

export type Veiculo = {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  // A lista de pneus agora é uma subcoleção e será carregada separadamente
};

export type Motorista = {
  id: string;
  nome: string;
  cnh: string;
};

export type TipoPneu = {
  id: string;
  marca: string;
  modelo: string;
};

export type RelatorioManutencao = {
  id: string;
  data: string;
  placaVeiculo: string;
  posicaoPneu: number;
  operacao: 'Recapagem' | 'Descarte' | 'Reparo' | 'Inspeção';
  detalhes: string;
  tecnico: string;
};
