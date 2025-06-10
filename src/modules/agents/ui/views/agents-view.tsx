"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function AgentsView() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return <div>{JSON.stringify(data, null, 2)}</div>;
}

export function AgentsViewLoading() {
  return (
    <LoadingState
      title="Buscando agentes..."
      description="Isso pode demorar alguns segundos..."
    />
  );
}

export function AgentsViewError() {
  return (
    <ErrorState
      title="Erro ao carregar agentes"
      description="Tente recarregar a página ou volte mais tarde."
    />
  );
}
