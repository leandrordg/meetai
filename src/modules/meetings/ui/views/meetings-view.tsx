"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function MeetingsView() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

  return <div>{JSON.stringify(data)}</div>;
}

export function MeetingsViewLoading() {
  return (
    <LoadingState
      title="Buscando encontros..."
      description="Isso pode demorar alguns segundos..."
    />
  );
}

export function MeetingsViewError() {
  return (
    <ErrorState
      title="Erro ao buscar os encontros"
      description="Tente recarregar a página ou volte mais tarde."
    />
  );
}
