'use client';

import { useState } from 'react';
import type { Veiculo, Pneu } from '@/lib/tipos';
import { DialogoInfoPneu } from '@/components/tire-info-dialog';
import { cn } from '@/lib/utils';

type DiagramaVeiculoProps = {
  veiculo: Veiculo;
};

// Posições dos pneus para diferentes modelos
const posicoesPneus: Record<string, Record<number, string>> = {
  '6x2': {
    // 6 pneus
    1: 'top-[10%] left-[5%]',
    2: 'top-[10%] right-[5%]',
    3: 'bottom-[10%] left-[5%]',
    4: 'bottom-[10%] right-[5%]',
    5: 'bottom-[10%] left-[25%]',
    6: 'bottom-[10%] right-[25%]',
  },
  '6x4': {
    // 10 pneus
    1: 'top-[5%] left-[5%]',
    2: 'top-[5%] right-[5%]',
    3: 'bottom-[25%] left-[5%]',
    4: 'bottom-[25%] right-[5%]',
    5: 'bottom-[25%] left-[25%]',
    6: 'bottom-[25%] right-[25%]',
    7: 'bottom-[5%] left-[5%]',
    8: 'bottom-[5%] right-[5%]',
    9: 'bottom-[5%] left-[25%]',
    10: 'bottom-[5%] right-[25%]',
  },
  '4x2': {
    // 4 pneus
    1: 'top-[15%] left-[5%]',
    2: 'top-[15%] right-[5%]',
    3: 'bottom-[15%] left-[5%]',
    4: 'bottom-[15%] right-[5%]',
  },
};

export function DiagramaVeiculo({ veiculo }: DiagramaVeiculoProps) {
  const [pneuSelecionado, setPneuSelecionado] = useState<Pneu | null>(null);
  const posicoes = posicoesPneus[veiculo.modelo] || posicoesPneus['6x2'];

  const handleSalvar = (pneuAtualizado: Pneu) => {
    // Aqui você atualizaria o estado ou chamaria uma API
    console.log('Salvando pneu:', pneuAtualizado);
  };

  return (
    <div className="w-full">
      <div className="relative mx-auto h-96 w-48 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-2">
        {/* Representação do chassi */}
        <div className="absolute left-1/2 top-[5%] h-[90%] w-1 -translate-x-1/2 bg-gray-200"></div>
        <div className="absolute left-1/2 top-[10%] h-2 w-24 -translate-x-1/2 rounded-sm bg-gray-300"></div>
        <div className="absolute bottom-[10%] left-1/2 h-2 w-32 -translate-x-1/2 rounded-sm bg-gray-300"></div>

        {veiculo.pneus.map(pneu => (
          <button
            key={pneu.id}
            onClick={() => setPneuSelecionado(pneu)}
            className={cn(
              'absolute flex h-10 w-10 items-center justify-center rounded-full border-2 bg-gray-600 font-bold text-white shadow-md transition-transform hover:scale-110',
              pneu.profundidadeSulco < 5 ? 'border-red-500' : 'border-gray-800',
              posicoes[pneu.posicao],
            )}
            aria-label={`Inspecionar pneu ${pneu.posicao}`}
          >
            {pneu.posicao}
          </button>
        ))}
      </div>
      {pneuSelecionado && (
        <DialogoInfoPneu
          pneu={pneuSelecionado}
          estaAberto={!!pneuSelecionado}
          onAbrirMudar={aberto => {
            if (!aberto) setPneuSelecionado(null);
          }}
          onSalvar={handleSalvar}
        />
      )}
    </div>
  );
}
