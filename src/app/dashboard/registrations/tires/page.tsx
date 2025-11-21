
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
  marca: z.string().min(2, "A marca é obrigatória."),
  modelo: z.string().min(2, "O modelo é obrigatório."),
});

export default function PaginaCadastroTipoPneu() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof schemaFormulario>>({
    resolver: zodResolver(schemaFormulario),
    defaultValues: {
      marca: "",
      modelo: "",
    },
  });

  function aoSubmeter(valores: z.infer<typeof schemaFormulario>) {
    console.log(valores);
    toast({
      title: "Sucesso!",
      description: "Tipo de pneu cadastrado com sucesso.",
    });
    form.reset({ marca: "", modelo: "" });
  }

  return (
    <div className="space-y-3">
      <Card>
        <CardHeader className="p-4">
          <CardTitle>Cadastrar Tipo de Pneu</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(aoSubmeter)} className="space-y-2">
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
    </div>
  );
}
