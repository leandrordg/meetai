import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewAgentDialog({ open, onOpenChange }: Props) {
  return (
    <ResponsiveDialog
      title="Novo agente"
      description="Crie um novo agente."
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
}
