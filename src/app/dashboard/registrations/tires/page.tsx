'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Cog, Pencil, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { TipoPneu } from '@/lib/defs';
import { Skeleton } from '@/components/ui/skeleton';
import { criarTipoPneu, excluirTipoPneu } from '@/lib/acoes/tiposPneuAcoes';

const schemaFormulario = z.object({
  marca: z.string().min(2, 'A marca é obrigatória.'),
  modelo: z.string().min(2, 'O modelo é obrigatório.'),
});

export default function PaginaCadastroTipoPneu() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [tipoPneuParaExcluir, setTipoPneuParaExcluir] = useState<TipoPneu | any | null>(null);

  const tiposPneuQuery = useMemoFirebase(
    () => (user ? query(collection(firestore, `usuarios/${user.uid}/tiposPneu`)) : null),
    [user, firestore]
  );
  
  const { data: listaTiposPneu, isLoading } = useCollection<TipoPneu>(tiposPneuQuery);

  const form = useForm<z.infer<typeof schemaFormulario>>({
    resolver: zodResolver(schemaFormulario),
    defaultValues: {
      marca: '',
      modelo: '',
    },
  });

  async function aoSubmeter(valores: z.infer<typeof schemaFormulario>) {
     if (!user) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você precisa estar logado para cadastrar um tipo de pneu.',
      });
      return;
    }

    try {
      await criarTipoPneu(user.uid, valores);
      toast({
        title: 'Sucesso!',
        description: 'Tipo de pneu cadastrado com sucesso.',
      });
      form.reset({ marca: '', modelo: '' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao cadastrar',
        description: 'Não foi possível salvar o tipo de pneu. Tente novamente.',
      });
    }
  }

  async function handleExcluirTipoPneu() {
    if (tipoPneuParaExcluir && user) {
       try {
        await excluirTipoPneu(user.uid, tipoPneuParaExcluir.id);
        toast({
          title: 'Sucesso!',
          description: 'Tipo de pneu excluído.',
        });
        setTipoPneuParaExcluir(null);
      } catch (error) {
         toast({
          variant: 'destructive',
          title: 'Erro ao excluir',
          description: 'Não foi possível excluir o tipo de pneu. Tente novamente.',
        });
      }
    }
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="p-4">
          <CardTitle>Cadastrar Tipo de Pneu</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(aoSubmeter)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Michelin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="X Multi Z" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar Tipo de Pneu
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2">
            <Cog className="h-5 w-5" />
            Tipos de Pneu Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Marca</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {isLoading && (
                   <TableRow>
                      <TableCell colSpan={3}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                   </TableRow>
                )}
                {listaTiposPneu && listaTiposPneu.map((tipo) => (
                  <TableRow key={tipo.id}>
                    <TableCell className="font-medium">{tipo.marca}</TableCell>
                    <TableCell>{tipo.modelo}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => console.log('Editar', tipo.id)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setTipoPneuParaExcluir(tipo)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Você tem certeza?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Isso excluirá
                              permanentemente o tipo de pneu.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setTipoPneuParaExcluir(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleExcluirTipoPneu}
                            >
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && (!listaTiposPneu || listaTiposPneu.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center">Nenhum tipo de pneu cadastrado.</TableCell>
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
