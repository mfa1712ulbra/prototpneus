"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle, X } from "lucide-react";
import type { Tire } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { cn } from "@/lib/utils";

const formSchema = z.object({
  pressure: z.coerce.number().min(1, "Pressão é obrigatória"),
  treadDepth: z.coerce.number().min(1, "Profundidade é obrigatória"),
  observations: z.string().optional(),
  movement: z.string().optional(),
});

type TireInfoDialogProps = {
  tire: Tire;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedTire: Tire) => void;
};

export function TireInfoDialog({ tire, isOpen, onOpenChange, onSave }: TireInfoDialogProps) {
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

  // Reset form when tire changes
  useEffect(() => {
    if (tire) {
      form.reset({
        pressure: tire.pressure,
        treadDepth: tire.treadDepth,
        observations: tire.observations || "",
        movement: "none",
      });
    }
    setIsSuccess(false);
  }, [tire, isOpen, form]);

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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
            "top-0 translate-y-0 sm:top-[5vh] sm:rounded-lg p-4",
            "data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-full"
        )}
      >
        {isSuccess ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold">Salvo com Sucesso!</h3>
            <p className="text-muted-foreground">As informações do pneu foram atualizadas.</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col">
              <DialogHeader className="text-left space-y-1">
                <DialogTitle className="font-headline text-xl">Pneu Posição {tire.position}</DialogTitle>
                <DialogDescription>
                  Última checagem: {new Date(tire.lastCheck).toLocaleDateString("pt-BR")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="pressure"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pressão (PSI)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="120" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
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
                        <FormMessage className="text-xs" />
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
                        <Textarea placeholder="Desgaste irregular, etc." className="min-h-[60px]" {...field} />
                      </FormControl>
                      <FormMessage className="text-xs" />
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
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}