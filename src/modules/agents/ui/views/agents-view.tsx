"use client";

import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { columns } from "@/modules/agents/ui/components/columns";
import { DataPagination } from "@/modules/agents/ui/components/data-pagination";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";

export function AgentsView() {
  const trpc = useTRPC();
  const router = useRouter();

  const [filters, setFilters] = useAgentsFilters();

  const { data } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ ...filters })
  );

  return (
    <div className="flex-1 px-4 md:px-8 flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={data.items}
        onRowClick={(row) => router.push(`/agents/${row.id}`)}
      />

      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />

      {!filters.search && data.items.length === 0 && (
        <EmptyState
          title="Crie o seu primeiro agente!"
          description="Agentes são IA&apos;s personalizadas que ajudam você em suas conversas e tarefas."
        />
      )}
    </div>
  );
}

export function AgentsViewError() {
  return (
    <ErrorState
      title="Erro ao carregar agentes"
      description="Ocorreu um erro ao carregar os agentes. Tente novamente mais tarde."
    />
  );
}
