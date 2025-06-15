"use client";

import { ErrorState } from "@/components/error-state";
import { useConfirm } from "@/hooks/use-confirm";
import { ActiveState } from "@/modules/meetings/ui/components/active-state";
import { CancelledState } from "@/modules/meetings/ui/components/cancelled-state";
import { CompletedState } from "@/modules/meetings/ui/components/completed-state";
import { MeetingIdViewHeader } from "@/modules/meetings/ui/components/meeting-id-view-header";
import { ProcessingState } from "@/modules/meetings/ui/components/processing-state";
import { UpcomingState } from "@/modules/meetings/ui/components/upcoming-state";
import { UpdateMeetingDialog } from "@/modules/meetings/ui/components/update-meeting-dialog";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  meetingId: string;
}

export function MeetingIdView({ meetingId }: Props) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId })
  );

  const removeMeeting = useMutation(
    trpc.meetings.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
        queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions());
        router.push("/meetings");
      },
      onError: (error) => toast.error(error.message),
    })
  );

  const [RemoveConfirmation, confirmRemove] = useConfirm({
    title: "Você tem certeza?",
    description: "Essa ação não pode ser desfeita.",
  });

  const handleRemoveMeeting = async () => {
    const confirmed = await confirmRemove();

    if (!confirmed) return;

    await removeMeeting.mutateAsync({ id: meetingId });
  };

  const isActive = data.status === "active";
  const isUpcoming = data.status === "upcoming";
  const isCancelled = data.status === "cancelled";
  const isCompleted = data.status === "completed";
  const isProcessing = data.status === "processing";

  return (
    <>
      <RemoveConfirmation />

      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />

      <div className="flex-1 p-4 md:px-8 flex flex-col gap-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onRemove={handleRemoveMeeting}
          onEdit={() => setUpdateMeetingDialogOpen(true)}
        />

        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isCompleted && <CompletedState data={data} />}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isUpcoming && <UpcomingState meetingId={meetingId} />}
      </div>
    </>
  );
}

export function MeetingIdViewError() {
  return (
    <ErrorState
      title="Erro ao buscar a reunião"
      description="Tente recarregar a página ou volte mais tarde."
    />
  );
}
