import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  meetingId: string;
}

export function ActiveState({ meetingId }: Props) {
  return (
    <div className="bg-background rounded-lg p-4 md:p-8 flex flex-col gap-8 items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="Reunião ativa"
        description="A reunião irá ser finalizada uma vez que todos os participantes saírem."
      />

      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button className="w-full lg:w-auto" asChild>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Participar
          </Link>
        </Button>
      </div>
    </div>
  );
}
