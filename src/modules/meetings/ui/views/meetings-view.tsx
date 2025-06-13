"use client";

import { DataPagination } from "@/components/data-pagination";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { columns } from "@/modules/meetings/ui/components/columns";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function MeetingsView() {
  const trpc = useTRPC();
  const router = useRouter();

  const [filters, setFilters] = useMeetingsFilters();

  const { data } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({
      ...filters,
    })
  );

  return (
    <div className="flex-1 px-4 md:px-8 flex flex-col gap-4">
      <DataTable
        data={data.items}
        columns={columns}
        onRowClick={(row) => router.push(`/meetings/${row.id}`)}
      />

      <DataPagination
        page={filters.page}
        totalPages={data.totalPages}
        onPageChange={(page) => setFilters({ page })}
      />

      {data.items.length === 0 && (
        <EmptyState
          title="Vamos começar criando um encontro."
          description="Adicione encontros para interagir com outras pessoas. Encontros proporcionam uma maneira de se conectar e colaborar com outros usuários."
        />
      )}
    </div>
  );
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
