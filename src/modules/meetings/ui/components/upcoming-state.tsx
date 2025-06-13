import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  meetingId: string;
  onCancelMeeting: () => void;
  isCancelling: boolean;
}

export function UpcomingState({
  meetingId,
  onCancelMeeting,
  isCancelling,
}: Props) {
  return (
    <div className="bg-background rounded-lg p-4 md:p-8 flex flex-col gap-8 items-center justify-center">
      <EmptyState
        image="/upcoming.svg"
        title="Encontro não iniciado"
        description="Uma vez que você iniciar o encontro, um resumo irá aparecer aqui."
      />

      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button
          variant="secondary"
          className="w-full lg:w-auto"
          onClick={onCancelMeeting}
          disabled={isCancelling}
        >
          <BanIcon />
          Cancelar encontro
        </Button>

        <Button className="w-full lg:w-auto" disabled={isCancelling} asChild>
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Iniciar encontro
          </Link>
        </Button>
      </div>
    </div>
  );
}
