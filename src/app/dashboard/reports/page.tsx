
import { listaRelatorios, listaVeiculos } from "@/lib/tipos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RelatorioManutencao } from "@/lib/tipos";
import { Wrench, TriangleAlert, Truck } from "lucide-react";

const getBadgeVariant = (operacao: RelatorioManutencao['operacao']) => {
    switch(operacao) {
        case 'Recapagem': return 'default';
        case 'Reparo': return 'secondary';
        case 'Inspeção': return 'outline';
        case 'Descarte': return 'destructive';
        default: return 'default';
    }
}

function getPneusEmAlerta() {
    return listaVeiculos.flatMap(v => v.pneus).filter(p => p.profundidadeSulco <= 4).length;
}

export default function PaginaRelatorios() {
  const totalManutencoes = listaRelatorios.length;
  const recapagensMes = listaRelatorios.filter(r => r.operacao === 'Recapagem').length; // Simplificado para total
  const pneusEmAlerta = getPneusEmAlerta();

  return (
    <div className="space-y-6">
      <h2 className="font-headline text-2xl font-semibold text-foreground">Relatórios e Histórico</h2>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Manutenções
            </CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalManutencoes}</div>
            <p className="text-xs text-muted-foreground">
              registros no total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recapagens
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recapagensMes}</div>
             <p className="text-xs text-muted-foreground">
              no período
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pneus em Alerta</CardTitle>
            <TriangleAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pneusEmAlerta}</div>
            <p className="text-xs text-muted-foreground">
              com sulco &lt;= 4mm
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
         <CardHeader>
          <CardTitle>Histórico de Manutenções</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Veículo</TableHead>
                  <TableHead>Operação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listaRelatorios.map((relatorio) => (
                  <TableRow key={relatorio.id}>
                    <TableCell className="font-medium">{new Date(relatorio.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{relatorio.placaVeiculo}<br/><span className="text-xs text-muted-foreground">Pneu {relatorio.posicaoPneu}</span></TableCell>
                    <TableCell>
                        <Badge variant={getBadgeVariant(relatorio.operacao)}>{relatorio.operacao}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
