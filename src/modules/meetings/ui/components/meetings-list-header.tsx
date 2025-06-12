"use client";

import { Button } from "@/components/ui/button";
import { NewMeetingDialog } from "@/modules/meetings/ui/components/new-meeting-dialog";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export function MeetingsListHeader() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

      <div className="p-4 md:px-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h5 className="font-medium text-xl">Meus encontros</h5>

          <Button type="button" onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            Novo encontro
          </Button>
        </div>

        <div className="flex items-center w-full gap-2 p-1">
          TODO: add meeting form
        </div>
      </div>
    </>
  );
}
