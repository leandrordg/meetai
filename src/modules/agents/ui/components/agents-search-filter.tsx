import { Input } from "@/components/ui/input";
import { useAgentsFilters } from "@/modules/agents/hooks/use-agents-filters";
import { SearchIcon } from "lucide-react";

export function AgentsSearchFilters() {
  const [filters, setFilters] = useAgentsFilters();

  return (
    <div className="relative">
      <Input
        placeholder="Buscar pelo nome"
        className="h-9 bg-white w-full md:w-xs pl-7"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
