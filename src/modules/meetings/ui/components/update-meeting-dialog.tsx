import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingGetOne } from "@/modules/meetings/types";
import { MeetingForm } from "@/modules/meetings/ui/components/meeting-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
}

export function UpdateMeetingDialog({
  open,
  onOpenChange,
  initialValues,
}: Props) {
  return (
    <ResponsiveDialog
      title="Editar Reunião"
      description="Altere os detalhes do evento"
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
}
