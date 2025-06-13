import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";

interface Props {
  title: string;
  description: string;
}

export function useConfirm({
  title,
  description,
}: Props): [() => JSX.Element, () => Promise<unknown>] {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };

  const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
  };

  const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
  };

  const confirmDialog = () => (
    <ResponsiveDialog
      title={title}
      open={promise !== null}
      onOpenChange={handleClose}
      description={description}
    >
      <div className="w-full flex flex-col-reverse gap-2 lg:flex-row items-center justify-end">
        <Button
          type="button"
          variant="outline"
          className="w-full lg:w-auto"
          onClick={handleCancel}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          className="w-full lg:w-auto"
          onClick={handleConfirm}
        >
          Confirmar
        </Button>
      </div>
    </ResponsiveDialog>
  );

  return [confirmDialog, confirm];
}
