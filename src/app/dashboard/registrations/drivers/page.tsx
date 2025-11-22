'use client';

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
import { Save, Users, Pencil, Trash2, X } from 'lucide-react';
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
import { collection, query, addDoc, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import type { Motorista } from '@/lib/defs';
import { Skeleton } from '@/components/ui/skeleton';
import { useState, useEffect, useRef } from 'react';

const schemaFormulario = z.object({
  nome: z.string().min(2, 'O nome do motorista é obrigatório.'),
  cnh: z
    .string()
    .min(10, 'A CNH é obrigatória.')
    .max(11, 'A CNH deve ter no máximo 11 caracteres.'),
});

export default function PaginaCadastroMotorista() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const [motoristaParaExcluir, setMotoristaParaExcluir] = useState<
    Motorista | any | null
  >(null);
  const [motoristaParaEditar, setMotoristaParaEditar] = useState<Motorista | null>(null);
  const formCardRef = useRef<HTMLDivElement>(null);

  const motoristasQuery = useMemoFirebase(
    () => (user ? query(collection(firestore, `usuarios/${user.uid}/motoristas`)) : null),
    [user, firestore]
  );
  
  const { data: listaMotoristas, isLoading } = useCollection<Motorista>(motoristasQuery);

  const form = useForm<z.infer<typeof schemaFormulario>>({
    resolver: zodResolver(schemaFormulario),
    defaultValues: {
      nome: '',
      cnh: '',
    },
  });

  useEffect(() => {
    if (motoristaParaEditar) {
      form.reset(motoristaParaEditar);
    } else {
      form.reset({ nome: '', cnh: '' });
    }
  }, [motoristaParaEditar, form]);

  async function aoSubmeter(valores: z.infer<typeof schemaFormulario>) {
    if (!user || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você precisa estar logado para gerenciar motoristas.',
      });
      return;
    }

    try {
      if (motoristaParaEditar) {
        const motoristaDocRef = doc(firestore, `usuarios/${user.uid}/motoristas`, motoristaParaEditar.id);
        await updateDoc(motoristaDocRef, valores);
        toast({
          title: 'Sucesso!',
          description: 'Motorista atualizado com sucesso.',
        });
        setMotoristaParaEditar(null);
      } else {
        const motoristasCollectionRef = collection(firestore, `usuarios/${user.uid}/motoristas`);
        const newDocRef = doc(motoristasCollectionRef);
        await setDoc(newDocRef, { ...valores, id: newDocRef.id });
        toast({
          title: 'Sucesso!',
          description: 'Motorista cadastrado com sucesso.',
        });
      }
      form.reset({ nome: '', cnh: '' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar',
        description: 'Não foi possível salvar o motorista. Tente novamente.',
      });
    }
  }
  
  const handleEditar = (motorista: Motorista) => {
    setMotoristaParaEditar(motorista);
    formCardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelarEdicao = () => {
    setMotoristaParaEditar(null);
    form.reset({ nome: '', cnh: '' });
  };


  async function handleExcluirMotorista() {
    if (motoristaParaExcluir && user && firestore) {
      try {
        await deleteDoc(doc(firestore, `usuarios/${user.uid}/motoristas`, motoristaParaExcluir.id));
        toast({
          title: 'Sucesso!',
          description: 'Motorista excluído.',
        });
        setMotoristaParaExcluir(null);
      } catch (error) {
         toast({
          variant: 'destructive',
          title: 'Erro ao excluir',
          description: 'Não foi possível excluir o motorista. Tente novamente.',
        });
      }
    }
  }

  return (
    <div className="space-y-3">
      <Card ref={formCardRef}>
        <CardHeader className="p-4">
          <CardTitle>{motoristaParaEditar ? 'Editar Motorista' : 'Cadastrar Novo Motorista'}</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(aoSubmeter)}
              className="space-y-2"
            >
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do motorista" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cnh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNH</FormLabel>
                    <FormControl>
                      <Input placeholder="01234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {motoristaParaEditar ? 'Atualizar' : 'Salvar Motorista'}
                </Button>
                {motoristaParaEditar && (
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
            <Users className="h-5 w-5" />
            Motoristas Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNH</TableHead>
                  <TableHead className="w-[80px] text-right">Ações</TableHead>
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
                {listaMotoristas && listaMotoristas.map((motorista) => (
                  <TableRow key={motorista.id}>
                    <TableCell className="font-medium">
                      {motorista.nome}
                    </TableCell>
                    <TableCell>{motorista.cnh}</TableCell>
                    <TableCell>
                      <div className="flex flex-col items-center gap-1 md:flex-row md:justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEditar(motorista)}
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
                              onClick={() => setMotoristaParaExcluir(motorista)}
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
                                permanentemente o motorista.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                onClick={() => setMotoristaParaExcluir(null)}
                              >
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleExcluirMotorista}
                              >
                                Continuar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                 {!isLoading && (!listaMotoristas || listaMotoristas.length === 0) && (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center">Nenhum motorista cadastrado.</TableCell>
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
