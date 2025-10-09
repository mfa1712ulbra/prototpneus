import { vehicles } from "@/lib/data";
import { VehicleDiagram } from "@/components/vehicle-diagram";
import { notFound } from "next/navigation";

type VehicleDetailPageProps = {
  params: { id: string };
};

export default function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const vehicle = vehicles.find((v) => v.id === params.id);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-semibold text-gray-800">{vehicle.name}</h2>
        <p className="text-muted-foreground">{vehicle.plate}</p>
      </div>
      <VehicleDiagram vehicle={vehicle} />
    </div>
  );
}
