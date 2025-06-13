"use client";

import { Input } from "@/components/ui/input";
import { DEFAULT_PAGE } from "@/constants";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { SearchIcon } from "lucide-react";

export function MeetingsSearchFilter() {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <div className="relative">
      <Input
        placeholder="Buscar pelo nome"
        className="h-9 bg-white min-w-[196px] pl-7"
        value={filters.search}
        onChange={(e) =>
          setFilters({ search: e.target.value, page: DEFAULT_PAGE })
        }
      />
      <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
