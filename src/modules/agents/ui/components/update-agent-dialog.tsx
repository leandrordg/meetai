import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentGetOne } from "@/modules/agents/types";
import { AgentForm } from "@/modules/agents/ui/components/agent-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: AgentGetOne;
}

export function UpdateAgentDialog({
  open,
  onOpenChange,
  initialValues,
}: Props) {
  return (
    <ResponsiveDialog
      title="Atualizar agente"
      description="Atualize os detalhes do agente."
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentForm
        onSuccess={() => onOpenChange(false)}
        onCancel={() => onOpenChange(false)}
        initialValues={initialValues}
      />
    </ResponsiveDialog>
  );
}
