import Link from "next/link";
import { vehicles } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="font-headline text-2xl font-semibold text-gray-800">Sua Frota</h2>
      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <Link
            href={`/dashboard/vehicles/${vehicle.id}`}
            key={vehicle.id}
            className="block transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
          >
            <Card>
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
    </div>
  );
}
