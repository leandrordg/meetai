import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export function CancelledState() {
  return (
    <div className="bg-background rounded-lg p-4 md:p-8 flex flex-col gap-8 items-center justify-center">
      <EmptyState
        image="/cancelled.svg"
        title="Reunião cancelada"
        description="A reunião foi cancelada e não será mais realizada."
      />

      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button variant="secondary" className="w-full lg:w-auto" asChild>
          <Link href={`/meetings`}>
            <ChevronLeftIcon />
            Voltar
          </Link>
        </Button>
      </div>
    </div>
  );
}
