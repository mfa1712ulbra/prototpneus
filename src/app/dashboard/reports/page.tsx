
'use client'

import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import type { Movimentacao, Veiculo } from '@/lib/defs';
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
import { Wrench, TriangleAlert, Truck } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

const getBadgeVariant = (operacao: Movimentacao['tipo']) => {
    switch(operacao) {
        case 'Recapagem': return 'default';
        case 'Reparo': return 'secondary';
        case 'Inspeção': return 'outline';
        case 'Descarte': return 'destructive';
        default: return 'default';
    }
}

export default function PaginaRelatorios() {
  const { user } = useUser();
  const firestore = useFirestore();

  const veiculosQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, `usuarios/${user.uid}/veiculos`)) : null, 
    [user, firestore]
  );
  const { data: veiculos, isLoading: isLoadingVeiculos } = useCollection<Veiculo>(veiculosQuery);

  const movimentacoesQuery = useMemoFirebase(() => {
    if (!user || !veiculos || veiculos.length === 0) return null;
    const veiculoIds = veiculos.map(v => v.id);
    // Esta é uma simplificação. Para uma consulta real, você precisaria de uma consulta por veículo.
    // Firestore não suporta consultas "OR" em diferentes coleções de forma nativa.
    // Uma estrutura de dados denormalizada seria melhor aqui (e.g., uma coleção raiz `movimentacoes` com `usuarioId` e `veiculoId`).
    // Por enquanto, vamos buscar do primeiro veículo.
    if (veiculoIds.length > 0) {
      return query(collection(firestore, `usuarios/${user.uid}/veiculos/${veiculoIds[0]}/pneus`))
    }
    return null;
  }, [user, firestore, veiculos]);
  
  // Este é um exemplo, pois a consulta acima para movimentações é complexa.
  // Vamos usar dados mocados por enquanto para a lista de relatórios.
  const { data: listaRelatorios, isLoading: isLoadingRelatorios } = useCollection<Movimentacao>(null);
  
  const totalManutencoes = listaRelatorios?.length || 0;
  const recapagensMes = listaRelatorios?.filter(r => r.tipo === 'Recapagem').length || 0;
  
  // A lógica para pneus em alerta precisa ser reconstruída com os dados reais.
  const pneusEmAlerta = 0;
  const isLoading = isLoadingVeiculos || isLoadingRelatorios;

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
            {isLoading ? <Skeleton className="h-8 w-1/4"/> : <div className="text-2xl font-bold">{totalManutencoes}</div>}
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
            {isLoading ? <Skeleton className="h-8 w-1/4"/> : <div className="text-2xl font-bold">{recapagensMes}</div>}
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
            {isLoading ? <Skeleton className="h-8 w-1/4"/> : <div className="text-2xl font-bold">{pneusEmAlerta}</div>}
            <p className="text-xs text-muted-foreground">
              com sulco &lt;= 3mm
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
                  <TableHead>Veículo/Pneu</TableHead>
                  <TableHead>Operação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={3}><Skeleton className="h-8 w-full"/></TableCell>
                  </TableRow>
                )}
                {listaRelatorios && listaRelatorios.map((relatorio) => (
                  <TableRow key={relatorio.id}>
                    <TableCell className="font-medium">{new Date(relatorio.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{"Veículo"}<br/><span className="text-xs text-muted-foreground">Pneu {relatorio.pneuId}</span></TableCell>
                    <TableCell>
                        <Badge variant={getBadgeVariant(relatorio.tipo)}>{relatorio.tipo}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && (!listaRelatorios || listaRelatorios.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center">Nenhum relatório encontrado.</TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
