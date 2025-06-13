"use client";

import { Button } from "@/components/ui/button";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function DataPagination({ page, totalPages, onPageChange }: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 text-sm text-muted-foreground">
        Página {page} de {totalPages || 1}.
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          disabled={page === 1}
          variant="outline"
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Voltar
        </Button>
        <Button
          disabled={page === totalPages || totalPages === 0}
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        >
          Avançar
        </Button>
      </div>
    </div>
  );
}
