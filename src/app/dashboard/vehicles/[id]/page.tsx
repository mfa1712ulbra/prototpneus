import { listaVeiculos } from "@/lib/tipos";
import { DiagramaVeiculo } from "@/components/diagrama-veiculo";
import { notFound } from "next/navigation";

type PaginaDetalheVeiculoProps = {
  params: { id: string };
};

export default function PaginaDetalheVeiculo({ params }: PaginaDetalheVeiculoProps) {
  const veiculo = listaVeiculos.find((v) => v.id === params.id);

  if (!veiculo) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-semibold text-gray-800">{veiculo.nome}</h2>
        <p className="text-muted-foreground">{veiculo.placa}</p>
      </div>
      <DiagramaVeiculo veiculo={veiculo} />
    </div>
  );
}
