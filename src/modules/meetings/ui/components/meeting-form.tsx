"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MAX_PAGE_SIZE } from "@/constants";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { meetingsInsertSchema } from "@/modules/meetings/schemas";
import { MeetingGetOne } from "@/modules/meetings/types";
import { CommandSelect } from "@/modules/meetings/ui/components/command-select";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

interface Props {
  onSuccess?: (id?: string) => void;
  onCancel?: () => void;
  initialValues?: MeetingGetOne;
}

export function MeetingForm({ onSuccess, onCancel, initialValues }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [openNewAgentDialog, setOpenNewAgentDialog] = useState(false);
  const [agentsSearch, setAgentsSearch] = useState("");

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: agentsSearch,
    })
  );

  const createMeeting = useMutation(
    trpc.meetings.create.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        // TODO: invalidate free tier usage
        onSuccess?.(data.id);
      },
      onError: (error) => {
        toast.error(error.message);
        // TODO: check if error code is forbidden, redirect to upgrade
      },
    })
  );

  const updateMeeting = useMutation(
    trpc.meetings.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        if (initialValues?.id) {
          queryClient.invalidateQueries(
            trpc.meetings.getOne.queryOptions({ id: initialValues.id })
          );
        }
        onSuccess?.();
      },
      onError: (error) => {
        toast.error(error.message);
        // TODO: check if error code is forbidden, redirect to upgrade
      },
    })
  );

  const form = useForm<z.infer<typeof meetingsInsertSchema>>({
    resolver: zodResolver(meetingsInsertSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      agentId: initialValues?.agentId ?? "",
    },
  });

  const isEdit = !!initialValues?.id;
  const isPending = createMeeting.isPending || updateMeeting.isPending;

  async function onSubmit(values: z.infer<typeof meetingsInsertSchema>) {
    if (isEdit) {
      await updateMeeting.mutateAsync({ id: initialValues.id, ...values });
    } else {
      await createMeeting.mutateAsync(values);
    }
  }

  const { isDirty } = form.formState;

  return (
    <>
      <NewAgentDialog
        open={openNewAgentDialog}
        onOpenChange={setOpenNewAgentDialog}
      />

      <Form {...form}>
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do encontro</FormLabel>
                <FormControl>
                  <Input placeholder="ex. Literatura do dia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Agente</FormLabel>
                <FormControl>
                  <CommandSelect
                    value={field.value}
                    onSelect={field.onChange}
                    onSearch={setAgentsSearch}
                    placeholder="Selecione um agente"
                    options={(agents.data?.items ?? []).map((agent) => ({
                      id: agent.id,
                      label: agent.name,
                      value: agent.id,
                      children: (
                        <div className="flex items-center gap-2">
                          <GeneratedAvatar
                            seed={agent.name}
                            variant="botttsNeutral"
                            className="size-6 border"
                          />
                          <span>{agent.name}</span>
                        </div>
                      ),
                    }))}
                  />
                </FormControl>
                <FormDescription>
                  Não encontrou o agente?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => setOpenNewAgentDialog(true)}
                  >
                    Crie um novo agente.
                  </button>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between gap-2">
            {onCancel && (
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={onCancel}
              >
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isPending || !isDirty}>
              {isEdit ? "Salvar alterações" : "Criar encontro"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
