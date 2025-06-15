"use client";

import { ErrorState } from "@/components/error-state";
import { CallProvider } from "@/modules/call/ui/components/call-provider";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

interface Props {
  meetingId: string;
}

export function CallView({ meetingId }: Props) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({
      id: meetingId,
    })
  );

  if (data.status === "completed") {
    return (
      <div className="flex h-screen items-center justify-center">
        <ErrorState
          title="Reunião finalizado"
          description="A reunião que você está tentando acessar foi finalizada."
        />
      </div>
    );
  }

  return <CallProvider meetingId={meetingId} meetingName={data.name} />;
}

export function CallViewError() {
  return (
    <ErrorState
      title="Erro ao carregar reunião"
      description="Ocorreu um erro ao carregar a reunião. Tente novamente mais tarde."
    />
  );
}
