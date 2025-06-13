"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE } from "@/constants";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { AgentIdFilter } from "@/modules/meetings/ui/components/agent-id-filter";
import { MeetingsSearchFilter } from "@/modules/meetings/ui/components/meetings-search-filter";
import { NewMeetingDialog } from "@/modules/meetings/ui/components/new-meeting-dialog";
import { StatusFilter } from "@/modules/meetings/ui/components/status-filter";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";

export function MeetingsListHeader() {
  const [filters, setFilters] = useMeetingsFilters();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const isAnyFilterModified =
    !!filters.status || !!filters.agentId || !!filters.search;

  const onClearFilters = () => {
    setFilters({
      page: DEFAULT_PAGE,
      status: null,
      agentId: "",
      search: "",
    });
  };

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="p-4 md:px-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Meus encontros</h5>

          <Button type="button" onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            <span className="hidden md:block">Novo encontro</span>
          </Button>
        </div>

        <ScrollArea>
          <div className="flex items-center w-full gap-2">
            <MeetingsSearchFilter />
            <StatusFilter />
            <AgentIdFilter />

            {isAnyFilterModified && (
              <Button variant="outline" onClick={onClearFilters}>
                <XCircleIcon />
                Limpar
              </Button>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}
