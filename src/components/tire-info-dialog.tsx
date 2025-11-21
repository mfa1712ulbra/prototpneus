'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CheckCircle, X } from 'lucide-react';
import type { Pneu } from '@/lib/defs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const schemaFormulario = z.object({
  pressao: z.coerce.number().min(1, 'Pressão é obrigatória'),
  profundidade: z.coerce.number().min(0.1, 'Profundidade é obrigatória'),
  observacoes: z.string().optional(),
  movimentacao: z.string().optional(),
});

type DialogoInfoPneuProps = {
  pneu: Pneu;
  estaAberto: boolean;
  onAbrirMudar: (aberto: boolean) => void;
  onSalvar: (pneuAtualizado: Pneu) => void;
};

export function DialogoInfoPneu({
  pneu,
  estaAberto,
  onAbrirMudar,
  onSalvar,
}: DialogoInfoPneuProps) {
  const [sucesso, setSucesso] = useState(false);

  const form = useForm<z.infer<typeof schemaFormulario>>({
    resolver: zodResolver(schemaFormulario),
  });

  useEffect(() => {
    if (pneu) {
      form.reset({
        pressao: pneu.pressao,
        profundidade: pneu.profundidade,
        observacoes: pneu.observacoes || '',
        movimentacao: 'nenhuma',
      });
    }
    setSucesso(false);
  }, [pneu, estaAberto, form]);

  async function aoSubmeter(valores: z.infer<typeof schemaFormulario>) {
    // Adiciona o ID do pneu aos valores antes de salvar
    const pneuAtualizado = { ...pneu, ...valores };
    await onSalvar(pneuAtualizado);
    setSucesso(true);
    setTimeout(() => {
      onAbrirMudar(false);
      setTimeout(() => setSucesso(false), 300);
    }, 1500);
  }

  const ultimaChecagemFormatada = pneu.ultimaChecagem
    ? format(new Date(pneu.ultimaChecagem), 'dd/MM/yyyy')
    : 'Nunca';

  return (
    <Dialog open={estaAberto} onOpenChange={onAbrirMudar}>
      <DialogContent
        className={cn(
          'top-0 mt-4 translate-y-0 sm:top-[5vh] sm:rounded-lg p-4',
          'data-[state=closed]:slide-out-to-top-full data-[state=open]:slide-in-from-top-full'
        )}
      >
        {sucesso ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center p-8">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold">Salvo com Sucesso!</h3>
            <p className="text-muted-foreground">
              As informações do pneu foram atualizadas.
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(aoSubmeter)}
              className="flex h-full flex-col"
            >
              <DialogHeader className="text-left space-y-1">
                <DialogTitle className="font-headline text-xl">
                  Pneu Posição {pneu.posicao}
                </DialogTitle>
                <DialogDescription>
                  Última checagem: {ultimaChecagemFormatada}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="pressao"
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
                    name="profundidade"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sulco (mm)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" placeholder="8" {...field} />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Desgaste irregular, etc."
                          className="min-h-[60px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="movimentacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Controle de Movimentação</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma ação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="nenhuma">Nenhuma ação</SelectItem>
                          <SelectItem value="inspecao">Inspeção</SelectItem>
                          <SelectItem value="rotacao">Rotação</SelectItem>
                          <SelectItem value="recapagem">Recapagem</SelectItem>
                          <SelectItem value="armazenar">Armazenar</SelectItem>
                          <SelectItem value="reparo">Reparo</SelectItem>
                          <SelectItem value="descarte">Descarte</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => onAbrirMudar(false)}
                >
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
