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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "O nome do veículo é obrigatório."),
  plate: z.string().min(7, "A placa deve ter 7 caracteres.").max(7),
  model: z.string({
    required_error: "Selecione o modelo do veículo.",
  }),
});

export default function VehicleRegistrationPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Sucesso!",
      description: "Veículo cadastrado com sucesso.",
    });
    form.reset({ name: "", plate: "", model: "" });
  }

  return (
    <div className="space-y-4">
      <h2 className="font-headline text-2xl font-semibold text-gray-800">
        Cadastrar Veículo
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Informações do Veículo</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
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
                name="plate"
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
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
    </div>
  );
}
