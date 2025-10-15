"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, Info, Settings, X } from "lucide-react";
import type { Tire } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  pressure: z.coerce.number().min(1, "Pressão é obrigatória"),
  treadDepth: z.coerce.number().min(1, "Profundidade é obrigatória"),
  observations: z.string().optional(),
  movement: z.string().optional(),
});

type TireInfoSheetProps = {
  tire: Tire;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedTire: Tire) => void;
};

export function TireInfoSheet({ tire, isOpen, onOpenChange, onSave }: TireInfoSheetProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pressure: tire.pressure,
      treadDepth: tire.treadDepth,
      observations: tire.observations || "",
      movement: "none",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedTire = { ...tire, ...values };
    onSave(updatedTire);
    setIsSuccess(true);
    setTimeout(() => {
      onOpenChange(false);
      setTimeout(() => setIsSuccess(false), 300); // Reset success state after transition
    }, 1500);
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-4">
        {isSuccess ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold">Salvo com Sucesso!</h3>
            <p className="text-muted-foreground">As informações do pneu foram atualizadas.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
              <SheetHeader className="text-left">
                <SheetTitle className="font-headline text-2xl">Pneu Posição {tire.position}</SheetTitle>
                <SheetDescription>
                  Última checagem: {new Date(tire.lastCheck).toLocaleDateString("pt-BR")}
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pressão (PSI)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="120" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="treadDepth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sulco (mm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Desgaste irregular, etc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="movement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Controle de Movimentação</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma ação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Nenhuma ação</SelectItem>
                          <SelectItem value="inspection">Inspeção</SelectItem>
                          <SelectItem value="rotation">Rotação</SelectItem>
                          <SelectItem value="retread">Recapagem</SelectItem>
                          <SelectItem value="storage">Armazenar</SelectItem>
                          <SelectItem value="repair">Reparo</SelectItem>
                          <SelectItem value="discard">Descarte</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <SheetFooter className="grid grid-cols-2 gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  );
}
