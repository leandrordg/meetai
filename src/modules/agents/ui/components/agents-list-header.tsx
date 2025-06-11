"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { NewAgentDialog } from "./new-agent-dialog";

export function AgentsListHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
      </div>
    </>
  );
}
