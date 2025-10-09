import { reports } from "@/lib/data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { MaintenanceReport } from "@/lib/data";

const getBadgeVariant = (operation: MaintenanceReport['operation']) => {
    switch(operation) {
        case 'Recapagem': return 'default';
        case 'Reparo': return 'secondary';
        case 'Inspeção': return 'outline';
        case 'Descarte': return 'destructive';
        default: return 'default';
    }
}

export default function ReportsPage() {
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
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{new Date(report.date).toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{report.vehiclePlate}<br/><span className="text-xs text-muted-foreground">Pneu {report.tirePosition}</span></TableCell>
                <TableCell>
                    <Badge variant={getBadgeVariant(report.operation)}>{report.operation}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
