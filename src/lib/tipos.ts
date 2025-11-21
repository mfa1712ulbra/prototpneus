export type Pneu = {
  id: number;
  posicao: number;
  pressao: number;
  profundidadeSulco: number;
  marca: string;
  ultimaChecagem: string;
  observacoes?: string;
};

export type Veiculo = {
  id: string;
  nome: string;
  placa: string;
  modelo: string;
  pneus: Pneu[];
};

export type Motorista = {
  id: string;
  nome: string;
  cnh: string;
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

export const listaVeiculos: Veiculo[] = [
  {
    id: '1',
    nome: 'Scania R450',
    placa: 'RTS-4567',
    modelo: '6x2',
    pneus: [
      { id: 1, posicao: 1, pressao: 120, profundidadeSulco: 8, marca: 'Michelin', ultimaChecagem: '2025-09-25' },
      { id: 2, posicao: 2, pressao: 120, profundidadeSulco: 8, marca: 'Michelin', ultimaChecagem: '2025-09-25' },
      { id: 3, posicao: 3, pressao: 110, profundidadeSulco: 6, marca: 'Pirelli', ultimaChecagem: '2025-09-25' },
      { id: 4, posicao: 4, pressao: 110, profundidadeSulco: 6, marca: 'Pirelli', ultimaChecagem: '2025-09-25' },
      { id: 5, posicao: 5, pressao: 115, profundidadeSulco: 7, marca: 'Goodyear', ultimaChecagem: '2025-09-25' },
      { id: 6, posicao: 6, pressao: 115, profundidadeSulco: 7, marca: 'Goodyear', ultimaChecagem: '2025-09-25' },
    ],
  },
  {
    id: '2',
    nome: 'Volvo FH540',
    placa: 'VLC-9876',
    modelo: '6x4',
    pneus: [
        { id: 7, posicao: 1, pressao: 125, profundidadeSulco: 9, marca: 'Bridgestone', ultimaChecagem: '2025-09-26' },
        { id: 8, posicao: 2, pressao: 125, profundidadeSulco: 9, marca: 'Bridgestone', ultimaChecagem: '2025-09-26' },
        { id: 9, posicao: 3, pressao: 115, profundidadeSulco: 7, marca: 'Firestone', ultimaChecagem: '2025-09-26' },
        { id: 10, posicao: 4, pressao: 115, profundidadeSulco: 7, marca: 'Firestone', ultimaChecagem: '2025-09-26' },
        { id: 11, posicao: 5, pressao: 115, profundidadeSulco: 7, marca: 'Pirelli', ultimaChecagem: '2025-09-26' },
        { id: 12, posicao: 6, pressao: 115, profundidadeSulco: 7, marca: 'Pirelli', ultimaChecagem: '2025-09-26' },
        { id: 13, posicao: 7, pressao: 120, profundidadeSulco: 8, marca: 'Michelin', ultimaChecagem: '2025-09-26' },
        { id: 14, posicao: 8, pressao: 120, profundidadeSulco: 8, marca: 'Michelin', ultimaChecagem: '2025-09-26' },
        { id: 15, posicao: 9, pressao: 120, profundidadeSulco: 8, marca: 'Michelin', ultimaChecagem: '2025-09-26' },
        { id: 16, posicao: 10, pressao: 120, profundidadeSulco: 8, marca: 'Michelin', ultimaChecagem: '2025-09-26' },
    ],
  },
  {
    id: '3',
    nome: 'Mercedes Actros',
    placa: 'MBZ-1234',
    modelo: '4x2',
    pneus: [
      { id: 17, posicao: 1, pressao: 120, profundidadeSulco: 7, marca: 'Goodyear', ultimaChecagem: '2025-09-27' },
      { id: 18, posicao: 2, pressao: 120, profundidadeSulco: 7, marca: 'Goodyear', ultimaChecagem: '2025-09-27' },
      { id: 19, posicao: 3, pressao: 110, profundidadeSulco: 5, marca: 'Pirelli', ultimaChecagem: '2025-09-27' },
      { id: 20, posicao: 4, pressao: 110, profundidadeSulco: 5, marca: 'Pirelli', ultimaChecagem: '2025-09-27' },
    ],
  },
];

export const listaMotoristas: Motorista[] = [
    { id: '1', nome: 'João da Silva', cnh: '12345678901' },
    { id: '2', nome: 'Maria Oliveira', cnh: '09876543210' },
    { id: '3', nome: 'Carlos Pereira', cnh: '11223344556' },
];

export const listaRelatorios: RelatorioManutencao[] = [
    { id: '1', data: '2025-09-25', placaVeiculo: 'RTS-4567', posicaoPneu: 3, operacao: 'Recapagem', detalhes: 'Recapagem completa realizada na filial de SP.', tecnico: 'Carlos' },
    { id: '2', data: '2025-09-26', placaVeiculo: 'VLC-9876', posicaoPneu: 8, operacao: 'Reparo', detalhes: 'Reparo de furo simples.', tecnico: 'João' },
    { id: '3', data: '2025-09-27', placaVeiculo: 'MBZ-1234', posicaoPneu: 4, operacao: 'Descarte', detalhes: 'Pneu atingiu o fim da vida útil.', tecnico: 'Carlos' },
    { id: '4', data: '2025-09-28', placaVeiculo: 'RTS-4567', posicaoPneu: 1, operacao: 'Inspeção', detalhes: 'Pressão e sulcos verificados. Tudo OK.', tecnico: 'Ana' },
    { id: '5', data: '2025-09-29', placaVeiculo: 'VLC-9876', posicaoPneu: 5, operacao: 'Inspeção', detalhes: 'Pressão ajustada. Sulcos OK.', tecnico: 'Ana' },
];
