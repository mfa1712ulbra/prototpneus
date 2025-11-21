
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
import { Save, Users } from "lucide-react";
import { listaMotoristas as motoristasIniciais, type Motorista } from "@/lib/tipos";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const schemaFormulario = z.object({
  nome: z.string().min(2, "O nome do motorista é obrigatório."),
  cnh: z.string().min(10, "A CNH é obrigatória.").max(11),
});

export default function PaginaCadastroMotorista() {
  const { toast } = useToast();
  const [listaMotoristas, setListaMotoristas] = useState<Motorista[]>(motoristasIniciais);

  const form = useForm<z.infer<typeof schemaFormulario>>({
    resolver: zodResolver(schemaFormulario),
    defaultValues: {
      nome: "",
      cnh: "",
    },
  });

  function aoSubmeter(valores: z.infer<typeof schemaFormulario>) {
    const novoMotorista: Motorista = {
      id: new Date().getTime().toString(), // ID temporário para a lista na tela
      ...valores,
    };
    
    setListaMotoristas(motoristasAtuais => [novoMotorista, ...motoristasAtuais]);

    toast({
      title: "Sucesso!",
      description: "Motorista cadastrado com sucesso.",
    });
    form.reset({ nome: "", cnh: "" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-headline text-2xl font-semibold text-gray-800">
          Gerenciar Motoristas
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cadastrar Novo Motorista</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(aoSubmeter)} className="space-y-8">
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
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Motoristas Cadastrados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNH</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listaMotoristas.map((motorista) => (
                  <TableRow key={motorista.id}>
                    <TableCell className="font-medium">{motorista.nome}</TableCell>
                    <TableCell>{motorista.cnh}</TableCell>
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
