
"use client";

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
import { Save } from "lucide-react";

const schemaFormulario = z.object({
  nome: z.string().min(2, "O nome do motorista é obrigatório."),
  cnh: z.string().min(10, "A CNH é obrigatória.").max(11),
});

export default function PaginaCadastroMotorista() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof schemaFormulario>>({
    resolver: zodResolver(schemaFormulario),
    defaultValues: {
      nome: "",
      cnh: "",
    },
  });

  function aoSubmeter(valores: z.infer<typeof schemaFormulario>) {
    console.log(valores);
    toast({
      title: "Sucesso!",
      description: "Motorista cadastrado com sucesso.",
    });
    form.reset({ nome: "", cnh: "" });
  }

  return (
    <div className="space-y-4">
      <h2 className="font-headline text-2xl font-semibold text-gray-800">
        Cadastrar Motorista
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Motorista</CardTitle>
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
    </div>
  );
}
