"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../components/columns";
import { DataTable } from "../components/data-table";
import { EmptyState } from "@/components/empty-state";

export function AgentsView() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-4">
      <DataTable columns={columns} data={data} />
      {data.length === 0 && (
        <EmptyState
          title="Crie o seu primeiro agente."
          description="Os agentes são usados para automatizar tarefas e interagir com usuários. Você pode criar agentes personalizados para atender às suas necessidades."
        />
      )}
    </div>
  );
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
      title="Erro ao carregar os agentes"
      description="Tente recarregar a página ou volte mais tarde."
    />
  );
}
