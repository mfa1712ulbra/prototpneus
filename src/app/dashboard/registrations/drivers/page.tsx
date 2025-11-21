
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Users, Pencil, Trash2 } from "lucide-react";
import { listaMotoristas as motoristasIniciais, type Motorista } from "@/lib/tipos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/alert-dialog"

const schemaFormulario = z.object({
  nome: z.string().min(2, "O nome do motorista é obrigatório."),
  cnh: z.string().min(10, "A CNH é obrigatória.").max(11, "A CNH deve ter no máximo 11 caracteres."),
});

export default function PaginaCadastroMotorista() {
  const { toast } = useToast();
  const [listaMotoristas, setListaMotoristas] = useState<Motorista[]>(motoristasIniciais);
  const [motoristaParaExcluir, setMotoristaParaExcluir] = useState<Motorista | null>(null);


  const form = useForm<z.infer<typeof schemaFormulario>>({
    resolver: zodResolver(schemaFormulario),
    defaultValues: {
      nome: "",
      cnh: "",
    },
  });

  function aoSubmeter(valores: z.infer<typeof schemaFormulario>) {
    const novoMotorista: Motorista = {
      id: new Date().getTime().toString(), 
      ...valores,
    };
    
    setListaMotoristas(motoristasAtuais => [novoMotorista, ...motoristasAtuais]);

    toast({
      title: "Sucesso!",
      description: "Motorista cadastrado com sucesso.",
    });
    form.reset({ nome: "", cnh: "" });
  }

  function handleExcluirMotorista() {
    if (motoristaParaExcluir) {
      setListaMotoristas(listaAtual => listaAtual.filter(m => m.id !== motoristaParaExcluir.id));
      toast({
        title: "Sucesso!",
        description: "Motorista excluído."
      });
      setMotoristaParaExcluir(null);
    }
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="p-4">
          <CardTitle>Cadastrar Novo Motorista</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(aoSubmeter)} className="space-y-2">
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
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar Motorista
              </Button>
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
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listaMotoristas.map((motorista) => (
                  <TableRow key={motorista.id}>
                    <TableCell className="font-medium">{motorista.nome}</TableCell>
                    <TableCell>{motorista.cnh}</TableCell>
                    <TableCell className="text-right">
                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => console.log('Editar', motorista.id)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setMotoristaParaExcluir(motorista)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </AlertDialogTrigger>
                         <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o motorista.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setMotoristaParaExcluir(null)}>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleExcluirMotorista}>Continuar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                      </AlertDialog>
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
