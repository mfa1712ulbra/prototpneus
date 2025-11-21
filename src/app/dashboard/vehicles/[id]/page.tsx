
"use client";

import { useState } from "react";
import { listaVeiculos, type Veiculo, type Pneu } from "@/lib/tipos";
import { DiagramaVeiculo } from "@/components/vehicle-diagram";
import { notFound } from "next/navigation";

type PaginaDetalheVeiculoProps = {
  params: { id: string };
};

export default function PaginaDetalheVeiculo({ params }: PaginaDetalheVeiculoProps) {
  const veiculoInicial = listaVeiculos.find((v) => v.id === params.id);
  const [veiculo, setVeiculo] = useState<Veiculo | undefined>(veiculoInicial);

  if (!veiculo) {
    notFound();
  }

  const handleSalvarPneu = (pneuAtualizado: Pneu) => {
    setVeiculo(veiculoAnterior => {
      if (!veiculoAnterior) return undefined;

      const novosPneus = veiculoAnterior.pneus.map(p => 
        p.id === pneuAtualizado.id ? pneuAtualizado : p
      );

      return { ...veiculoAnterior, pneus: novosPneus };
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-semibold text-gray-800">{veiculo.nome}</h2>
        <p className="text-muted-foreground">{veiculo.placa}</p>
      </div>
      <DiagramaVeiculo veiculo={veiculo} onSalvarPneu={handleSalvarPneu} />
    </div>
  );
}
