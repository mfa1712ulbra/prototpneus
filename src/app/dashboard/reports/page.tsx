
import { listaRelatorios } from "@/lib/tipos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { RelatorioManutencao } from "@/lib/tipos";

const getBadgeVariant = (operacao: RelatorioManutencao['operacao']) => {
    switch(operacao) {
        case 'Recapagem': return 'default';
        case 'Reparo': return 'secondary';
        case 'Inspeção': return 'outline';
        case 'Descarte': return 'destructive';
        default: return 'default';
    }
}

export default function PaginaRelatorios() {
  return (
    <div className="space-y-4">
      <h2 className="font-headline text-2xl font-semibold text-gray-800">Histórico de Manutenções</h2>
      <div className="rounded-lg border">
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
    </div>
  );
}
