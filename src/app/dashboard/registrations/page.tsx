
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck, User, Cog } from "lucide-react";
import Link from "next/link";

const itensCadastro = [
  {
    titulo: "Veículos",
    descricao: "Cadastre e gerencie seus veículos",
    icone: Truck,
    href: "/dashboard/registrations/vehicles",
  },
  {
    titulo: "Motoristas",
    descricao: "Adicione e edite informações dos motoristas",
    icone: User,
    href: "/dashboard/registrations/drivers",
  },
  {
    titulo: "Tipos de Pneu",
    descricao: "Gerencie os modelos e marcas de pneus",
    icone: Cog,
    href: "/dashboard/registrations/tires",
  },
];

export default function PaginaCadastros() {
  return (
    <div className="space-y-4">
      <h2 className="font-headline text-2xl font-semibold text-gray-800">Cadastros</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {itensCadastro.map((item) => (
          <Link href={item.href} key={item.titulo}>
            <Card className="transform transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <item.icone className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="font-headline text-lg">{item.titulo}</CardTitle>
                  <CardDescription>{item.descricao}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
