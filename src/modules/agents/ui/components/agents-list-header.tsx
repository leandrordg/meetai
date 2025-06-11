"use client";

import { Button } from "@/components/ui/button";
import { DEFAULT_PAGE } from "@/constants";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { AgentsSearchFilters } from "@/modules/agents/ui/components/agents-search-filter";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";

export function AgentsListHeader() {
  const [filters, setFilters] = useAgentsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified = !!filters.search;

  const onClearFilters = () => {
    setFilters({ page: DEFAULT_PAGE, search: "" });
  };

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="p-4 md:px-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Meus agentes</h5>

          <Button type="button" onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            Novo agente
          </Button>
        </div>

        <div className="flex items-center w-full gap-2 p-1">
          <AgentsSearchFilters />
          {isAnyFilterModified && (
            <Button variant="outline" onClick={onClearFilters}>
              <XCircleIcon />
              Limpar filtros
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
