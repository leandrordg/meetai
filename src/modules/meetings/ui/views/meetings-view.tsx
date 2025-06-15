"use client";

import { DataPagination } from "@/components/data-pagination";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { columns } from "@/modules/meetings/ui/components/columns";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";

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

      {!filters.search && data.items.length === 0 && (
        <EmptyState
          title="Vamos começar criando uma reunião."
          description="Reuniões permitem que você converse com seus agentes de IA, obtenha resumos, transcrições e respostas personalizadas."
        />
      )}
    </div>
  );
}

export function MeetingsViewError() {
  return (
    <ErrorState
      title="Erro ao buscar as reuniões"
      description="Tente recarregar a página ou volte mais tarde."
    />
  );
}
