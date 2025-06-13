"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { MAX_PAGE_SIZE } from "@/constants";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { CommandSelect } from "@/modules/meetings/ui/components/command-select";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function AgentIdFilter() {
  const trpc = useTRPC();

  const [filters, setFilters] = useMeetingsFilters();

  const [agentSearch, setAgentSearch] = useState("");

  const { data } = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: MAX_PAGE_SIZE,
      search: agentSearch,
    })
  );

  return (
    <CommandSelect
      className="h-9"
      onSearch={setAgentSearch}
      value={filters.agentId ?? ""}
      placeholder="Agente"
      onSelect={(value) => setFilters({ agentId: value })}
      options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-2">
            <GeneratedAvatar
              seed={agent.name}
              variant="botttsNeutral"
              className="size-4"
            />
            {agent.name}
          </div>
        ),
      }))}
    />
  );
}
