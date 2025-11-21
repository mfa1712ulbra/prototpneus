import Link from "next/link";
import { listaVeiculos } from "@/lib/tipos";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function PaginaDashboard() {
  return (
    <div className="space-y-4">
      <h2 className="font-headline text-2xl font-semibold text-gray-800">Sua Frota</h2>
      <div className="space-y-3">
        {listaVeiculos.map((veiculo) => (
          <Link
            href={`/dashboard/vehicles/${veiculo.id}`}
            key={veiculo.id}
            className="block transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-headline text-lg">{veiculo.nome}</CardTitle>
                    <CardDescription>{veiculo.placa}</CardDescription>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Truck className="h-6 w-6" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Modelo: {veiculo.modelo}</span>
                  <span>Pneus: {veiculo.pneus.length}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
