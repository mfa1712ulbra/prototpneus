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

const formSchema = z.object({
  brand: z.string().min(2, "A marca é obrigatória."),
  model: z.string().min(2, "O modelo é obrigatório."),
});

export default function TireTypeRegistrationPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      model: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Sucesso!",
      description: "Tipo de pneu cadastrado com sucesso.",
    });
    form.reset({ brand: "", model: "" });
  }

  return (
    <div className="space-y-4">
      <h2 className="font-headline text-2xl font-semibold text-gray-800">
        Cadastrar Tipo de Pneu
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Tipo de Pneu</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="brand"
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
                name="model"
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
