import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "@/modules/meetings/ui/components/meeting-form";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewMeetingDialog({ open, onOpenChange }: Props) {
  const router = useRouter();

  return (
    <ResponsiveDialog
      title="Novo encontro"
      description="Crie um novo encontro."
      open={open}
      onOpenChange={onOpenChange}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}
