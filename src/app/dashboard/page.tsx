import Link from "next/link";
import { vehicles } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Truck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="font-headline text-2xl font-semibold text-gray-800">Sua Frota</h2>
      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <Link
            href={`/dashboard/vehicles/${vehicle.id}`}
            key={vehicle.id}
            className="block"
          >
            <Card className="transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="font-headline text-lg">{vehicle.name}</CardTitle>
                    <CardDescription>{vehicle.plate}</CardDescription>
                  </div>
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Truck className="h-6 w-6" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Modelo: {vehicle.model}</span>
                  <span>Pneus: {vehicle.tires.length}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Button
        className="fixed bottom-20 right-4 z-20 h-14 w-14 rounded-full shadow-xl"
        aria-label="Adicionar novo veículo"
      >
        <Plus className="h-7 w-7" />
      </Button>
    </div>
  );
}
