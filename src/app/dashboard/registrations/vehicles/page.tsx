
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Truck, Pencil, Trash2 } from "lucide-react";
import { listaVeiculos as veiculosIniciais, type Veiculo } from "@/lib/tipos";
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
  nome: z.string().min(2, "O nome do veículo é obrigatório."),
  placa: z.string().min(7, "A placa deve ter 7 caracteres.").max(7, "A placa deve ter 7 caracteres."),
  modelo: z.string({
    required_error: "Selecione o modelo do veículo.",
  }),
});

export default function PaginaCadastroVeiculo() {
  const { toast } = useToast();
  const [listaDeVeiculos, setListaDeVeiculos] = useState<Veiculo[]>(veiculosIniciais);
  const [veiculoParaExcluir, setVeiculoParaExcluir] = useState<Veiculo | null>(null);

  const form = useForm<z.infer<typeof schemaFormulario>>({
    resolver: zodResolver(schemaFormulario),
    defaultValues: {
      nome: "",
      placa: "",
      modelo: undefined,
    },
  });

  function aoSubmeter(valores: z.infer<typeof schemaFormulario>) {
    const novoVeiculo: Veiculo = {
        id: new Date().getTime().toString(),
        ...valores,
        pneus: [], // Um novo veículo começa sem pneus detalhados
    }

    setListaDeVeiculos(veiculosAtuais => [novoVeiculo, ...veiculosAtuais]);

    toast({
      title: "Sucesso!",
      description: "Veículo cadastrado com sucesso.",
    });
    form.reset({ nome: "", placa: "", modelo: undefined });
  }

  function handleExcluirVeiculo() {
    if (veiculoParaExcluir) {
      setListaDeVeiculos(listaAtual => listaAtual.filter(v => v.id !== veiculoParaExcluir.id));
      toast({
        title: "Sucesso!",
        description: "Veículo excluído."
      });
      setVeiculoParaExcluir(null);
    }
  }


  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-4">
          <CardTitle>Cadastrar Novo Veículo</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(aoSubmeter)} className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome / Apelido</FormLabel>
                    <FormControl>
                      <Input placeholder="Scania R450" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                name="modelo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue="">
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar Veículo
              </Button>
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
                  <TableHead>Nome</TableHead>
                  <TableHead>Placa</TableHead>
                  <TableHead>Modelo</TableHead>
                  <TableHead className="w-[120px] text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listaDeVeiculos.map((veiculo) => (
                  <TableRow key={veiculo.id}>
                    <TableCell className="font-medium">{veiculo.nome}</TableCell>
                    <TableCell>{veiculo.placa}</TableCell>
                    <TableCell>{veiculo.modelo}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => console.log('Editar', veiculo.id)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setVeiculoParaExcluir(veiculo)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </AlertDialogTrigger>
                         <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o veículo.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setVeiculoParaExcluir(null)}>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={handleExcluirVeiculo}>Continuar</AlertDialogAction>
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
