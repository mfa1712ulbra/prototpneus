'use client';

import { useState, useEffect, useRef } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Save, Truck, Pencil, Trash2, X } from 'lucide-react';
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
import { collection, query, doc, setDoc, writeBatch, deleteDoc, updateDoc } from 'firebase/firestore';
import type { Veiculo, Motorista } from '@/lib/defs';
import { Skeleton } from '@/components/ui/skeleton';

const schemaFormulario = z.object({
  placa: z
    .string()
    .min(7, 'A placa deve ter 7 caracteres.')
    .max(7, 'A placa deve ter 7 caracteres.'),
  marca: z.string().min(2, 'A marca é obrigatória.'),
  modelo: z.string({
    required_error: 'Selecione o modelo do veículo.',
  }),
  motoristaId: z.string().optional(),
});

const posicoesParaModelo: Record<string, number> = {
    '4x2': 4,
    '6x2': 6,
    '6x4': 10,
}

export default function PaginaCadastroVeiculo() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState<Veiculo | any | null>(null);
  const [veiculoParaEditar, setVeiculoParaEditar] = useState<Veiculo | null>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  const veiculosQuery = useMemoFirebase(
    () =>
      user ? query(collection(firestore, `usuarios/${user.uid}/veiculos`)) : null,
    [user, firestore]
  );
  
  const { data: listaDeVeiculos, isLoading: isLoadingVeiculos } = useCollection<Veiculo>(veiculosQuery);

  const motoristasQuery = useMemoFirebase(
    () => (user ? query(collection(firestore, `usuarios/${user.uid}/motoristas`)) : null),
    [user, firestore]
  );
  const { data: listaMotoristas, isLoading: isLoadingMotoristas } = useCollection<Motorista>(motoristasQuery);

  const form = useForm<z.infer<typeof schemaFormulario>>({
    resolver: zodResolver(schemaFormulario),
    defaultValues: {
      placa: '',
      marca: '',
      modelo: undefined,
      motoristaId: undefined,
    },
  });

  useEffect(() => {
    if (veiculoParaEditar) {
      form.reset({
        placa: veiculoParaEditar.placa,
        marca: veiculoParaEditar.marca,
        modelo: veiculoParaEditar.modelo,
        motoristaId: veiculoParaEditar.motoristaId || undefined,
      });
    } else {
       form.reset({ placa: '', marca: '', modelo: undefined, motoristaId: undefined });
    }
  }, [veiculoParaEditar, form]);

  async function aoSubmeter(valores: z.infer<typeof schemaFormulario>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você precisa estar logado para gerenciar veículos.',
      });
      return;
    }

    const dadosParaSalvar = {
      ...valores,
      motoristaId: valores.motoristaId || null, // Garante que será null se for undefined ou ''
    };

    try {
      if (veiculoParaEditar) {
        // Lógica de atualização
        if (valores.modelo !== veiculoParaEditar.modelo) {
           toast({
            variant: 'destructive',
            title: 'Atenção',
            description: 'A alteração do modelo de um veículo não é permitida para não afetar o diagrama de pneus. Exclua e cadastre novamente.',
          });
          return;
        }
        const veiculoDocRef = doc(firestore, `usuarios/${user.uid}/veiculos`, veiculoParaEditar.id);
        await updateDoc(veiculoDocRef, dadosParaSalvar);
        toast({
          title: 'Sucesso!',
          description: 'Veículo atualizado com sucesso.',
        });
        setVeiculoParaEditar(null);
      } else {
        // Lógica de criação
        const veiculosCollectionRef = collection(firestore, `usuarios/${user.uid}/veiculos`);
        const veiculoDocRef = doc(veiculosCollectionRef);
        
        await setDoc(veiculoDocRef, {
          id: veiculoDocRef.id,
          ...dadosParaSalvar,
        });

        const numPneus = posicoesParaModelo[valores.modelo] || 0;
        const batch = writeBatch(firestore);
        for (let i = 1; i <= numPneus; i++) {
          const pneuRef = doc(collection(veiculoDocRef, 'pneus'));
          batch.set(pneuRef, {
              id: pneuRef.id,
              posicao: i.toString(),
              pressao: 0,
              profundidade: 0,
              observacoes: '',
              ultimaChecagem: null
          });
        }
        await batch.commit();

        toast({
          title: 'Sucesso!',
          description: 'Veículo cadastrado com sucesso.',
        });
      }
      form.reset({ placa: '', marca: '', modelo: undefined, motoristaId: undefined });
    } catch (error) {
      console.error("Erro ao salvar veículo: ", error);
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o veículo. Tente novamente.',
      });
    }
  }

  const handleEditar = (veiculo: Veiculo) => {
    setVeiculoParaEditar(veiculo);
    formCardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelarEdicao = () => {
    setVeiculoParaEditar(null);
    form.reset({ placa: '', marca: '', modelo: undefined, motoristaId: undefined });
  };


  async function handleExcluirVeiculo() {
    if (veiculoParaExcluir && user && firestore) {
      try {
        await deleteDoc(doc(firestore, `usuarios/${user.uid}/veiculos`, veiculoParaExcluir.id));
        toast({
          title: 'Sucesso!',
          description: 'Veículo excluído.',
        });
        setVeiculoParaExcluir(null);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir',
          description: 'Não foi possível excluir o veículo. Tente novamente.',
        });
      }
    }
  }

  const getNomeMotorista = (motoristaId?: string) => {
    if (!motoristaId || !listaMotoristas) return 'N/A';
    const motorista = listaMotoristas.find(m => m.id === motoristaId);
    return motorista ? motorista.nome : 'N/A';
  }

  const isLoading = isLoadingVeiculos || isLoadingMotoristas;

  return (
    <div className="space-y-3">
      <Card ref={formCardRef}>
        <CardHeader className="p-4">
          <CardTitle>{veiculoParaEditar ? 'Editar Veículo' : 'Cadastrar Novo Veículo'}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(aoSubmeter)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="placa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC1D23" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marca"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <FormControl>
                      <Input placeholder="Scania" {...field} />
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue=""
                      disabled={!!veiculoParaEditar}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o modelo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="4x2">4x2</SelectItem>
                        <SelectItem value="6x2">6x2</SelectItem>
                        <SelectItem value="6x4">6x4</SelectItem>
                      </SelectContent>
                    </Select>
                    {veiculoParaEditar && <p className="text-xs text-muted-foreground">O modelo não pode ser alterado na edição.</p>}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motoristaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motorista</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um motorista" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                         {isLoadingMotoristas ? (
                           <SelectItem value="loading" disabled>Carregando...</SelectItem>
                         ) : (
                          <>
                           {listaMotoristas?.map((motorista) => (
                            <SelectItem key={motorista.id} value={motorista.id}>
                              {motorista.nome}
                            </SelectItem>
                          ))}
                          </>
                         )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="flex gap-2">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {veiculoParaEditar ? 'Atualizar' : 'Salvar Veículo'}
                </Button>
                {veiculoParaEditar && (
                  <Button variant="outline" type="button" onClick={handleCancelarEdicao}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar Edição
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Veículos Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Marca</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead>Motorista</TableHead>
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && (
                   <TableRow>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                   </TableRow>
                )}
                {listaDeVeiculos && listaDeVeiculos.map((veiculo) => (
                  <TableRow key={veiculo.id}>
                    <TableCell className="font-medium">
                      {veiculo.marca}
                    </TableCell>
                    <TableCell>{veiculo.placa}</TableCell>
                    <TableCell>{veiculo.modelo}</TableCell>
                    <TableCell>{getNomeMotorista(veiculo.motoristaId)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleEditar(veiculo)}
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
                            onClick={() => setVeiculoParaExcluir(veiculo)}
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
                              permanentemente o veículo e todos os seus pneus.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setVeiculoParaExcluir(null)}
                            >
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleExcluirVeiculo}>
                              Continuar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && (!listaDeVeiculos || listaDeVeiculos.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={5} className="text-center">Nenhum veículo cadastrado.</TableCell>
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
