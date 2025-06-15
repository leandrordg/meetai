import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  meetingId: string;
}

export function UpcomingState({ meetingId }: Props) {
  return (
    <div className="bg-background rounded-lg p-4 md:p-8 flex flex-col gap-8 items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="Reunião não iniciada"
        description="Uma vez que você iniciar a reunião, um resumo irá aparecer aqui."
      />

      <Button className="w-full lg:w-auto" asChild>
        <Link href={`/call/${meetingId}`}>
          <VideoIcon />
          Iniciar reunião
        </Link>
      </Button>
    </div>
  );
}
