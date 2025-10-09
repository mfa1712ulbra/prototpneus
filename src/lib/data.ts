export type Tire = {
  id: number;
  position: number;
  pressure: number;
  treadDepth: number;
  brand: string;
  lastCheck: string;
  observations?: string;
};

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  model: string;
  tires: Tire[];
};

export type Driver = {
  id: string;
  name: string;
  cnh: string;
};

export type MaintenanceReport = {
  id: string;
  date: string;
  vehiclePlate: string;
  tirePosition: number;
  operation: 'Recapagem' | 'Descarte' | 'Reparo' | 'Inspeção';
  details: string;
  technician: string;
};

export const vehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Scania R450',
    plate: 'RTS-4567',
    model: '6x2',
    tires: [
      { id: 1, position: 1, pressure: 120, treadDepth: 8, brand: 'Michelin', lastCheck: '2024-07-20' },
      { id: 2, position: 2, pressure: 120, treadDepth: 8, brand: 'Michelin', lastCheck: '2024-07-20' },
      { id: 3, position: 3, pressure: 110, treadDepth: 6, brand: 'Pirelli', lastCheck: '2024-07-20' },
      { id: 4, position: 4, pressure: 110, treadDepth: 6, brand: 'Pirelli', lastCheck: '2024-07-20' },
      { id: 5, position: 5, pressure: 115, treadDepth: 7, brand: 'Goodyear', lastCheck: '2024-07-20' },
      { id: 6, position: 6, pressure: 115, treadDepth: 7, brand: 'Goodyear', lastCheck: '2024-07-20' },
    ],
  },
  {
    id: '2',
    name: 'Volvo FH540',
    plate: 'VLC-9876',
    model: '6x4',
    tires: [
        { id: 7, position: 1, pressure: 125, treadDepth: 9, brand: 'Bridgestone', lastCheck: '2024-07-21' },
        { id: 8, position: 2, pressure: 125, treadDepth: 9, brand: 'Bridgestone', lastCheck: '2024-07-21' },
        { id: 9, position: 3, pressure: 115, treadDepth: 7, brand: 'Firestone', lastCheck: '2024-07-21' },
        { id: 10, position: 4, pressure: 115, treadDepth: 7, brand: 'Firestone', lastCheck: '2024-07-21' },
        { id: 11, position: 5, pressure: 115, treadDepth: 7, brand: 'Pirelli', lastCheck: '2024-07-21' },
        { id: 12, position: 6, pressure: 115, treadDepth: 7, brand: 'Pirelli', lastCheck: '2024-07-21' },
        { id: 13, position: 7, pressure: 120, treadDepth: 8, brand: 'Michelin', lastCheck: '2024-07-21' },
        { id: 14, position: 8, pressure: 120, treadDepth: 8, brand: 'Michelin', lastCheck: '2024-07-21' },
        { id: 15, position: 9, pressure: 120, treadDepth: 8, brand: 'Michelin', lastCheck: '2024-07-21' },
        { id: 16, position: 10, pressure: 120, treadDepth: 8, brand: 'Michelin', lastCheck: '2024-07-21' },
    ],
  },
  {
    id: '3',
    name: 'Mercedes Actros',
    plate: 'MBZ-1234',
    model: '4x2',
    tires: [
      { id: 17, position: 1, pressure: 120, treadDepth: 7, brand: 'Goodyear', lastCheck: '2024-07-19' },
      { id: 18, position: 2, pressure: 120, treadDepth: 7, brand: 'Goodyear', lastCheck: '2024-07-19' },
      { id: 19, position: 3, pressure: 110, treadDepth: 5, brand: 'Pirelli', lastCheck: '2024-07-19' },
      { id: 20, position: 4, pressure: 110, treadDepth: 5, brand: 'Pirelli', lastCheck: '2024-07-19' },
    ],
  },
];

export const reports: MaintenanceReport[] = [
    { id: '1', date: '2024-07-15', vehiclePlate: 'RTS-4567', tirePosition: 3, operation: 'Recapagem', details: 'Recapagem completa realizada na filial de SP.', technician: 'Carlos' },
    { id: '2', date: '2024-07-12', vehiclePlate: 'VLC-9876', tirePosition: 8, operation: 'Reparo', details: 'Reparo de furo simples.', technician: 'João' },
    { id: '3', date: '2024-07-10', vehiclePlate: 'MBZ-1234', tirePosition: 4, operation: 'Descarte', details: 'Pneu atingiu o fim da vida útil.', technician: 'Carlos' },
    { id: '4', date: '2024-07-20', vehiclePlate: 'RTS-4567', tirePosition: 1, operation: 'Inspeção', details: 'Pressão e sulcos verificados. Tudo OK.', technician: 'Ana' },
    { id: '5', date: '2024-07-21', vehiclePlate: 'VLC-9876', tirePosition: 5, operation: 'Inspeção', details: 'Pressão ajustada. Sulcos OK.', technician: 'Ana' },
];
