"use client";

import { ErrorState } from "@/components/error-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";
import { AgentIdViewHeader } from "@/modules/agents/ui/components/agent-id-view-header";
import { UpdateAgentDialog } from "@/modules/agents/ui/components/update-agent-dialog";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { VideoIcon } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  agentId: string;
}

export function AgentIdView({ agentId }: Props) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId })
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
        queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());
        router.push("/agents");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm({
    title: "Você tem certeza?",
    description: `Essa ação irá remover ${data.meetingCount} reunião(ões) agendada(s)`,
  });

  async function handleRemoveAgent() {
    const confirmed = await confirmRemove();
    if (!confirmed) return;
    await removeAgent.mutateAsync({ id: agentId });
  }

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
      />

      <div className="flex-1 p-4 md:px-8 flex flex-col gap-4">
        <AgentIdViewHeader
          agentId={agentId}
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={handleRemoveAgent}
        />

        <div className="bg-background rounded-lg border">
          <div className="p-4 gap-5 flex flex-col col-span-5">
            <div className="flex items-center gap-3">
              <GeneratedAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-10"
              />
              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>

            <Badge variant="outline" className="flex items-center gap-2">
              <VideoIcon className="size-4 text-blue-700" />
              {data.meetingCount}
              {data.meetingCount === 1 ? " reunião" : " reuniões"}
            </Badge>

            <div className="flex flex-col gap-4">
              <p className="text-lg font-medium">Instruções</p>
              <p className="text-neutral-800">{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function AgentIdViewError() {
  return (
    <ErrorState
      title="Erro ao carregar o agente"
      description="O agente que você está tentando acessar não existe ou foi removido."
    />
  );
}
