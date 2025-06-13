import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CallEnded() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-2 text-center">
            <h6 className="text-lg font-medium">Você saiu da chamada</h6>
            <p className="text-sm">
              Resumo da chamada e gravação estão disponíveis em alguns minutos.
            </p>
          </div>

          <Button asChild>
            <Link href="/meetings">Voltar para os encontros</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
