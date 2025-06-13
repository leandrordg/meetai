"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useConfirm } from "@/hooks/use-confirm";
import { MeetingIdViewHeader } from "@/modules/meetings/ui/components/meeting-id-view-header";
import { UpdateMeetingDialog } from "@/modules/meetings/ui/components/update-meeting-dialog";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
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
        // TODO: invalidate free tier usage
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

        {JSON.stringify(data, null, 2)}
      </div>
    </>
  );
}

export function MeetingIdViewLoading() {
  return (
    <LoadingState
      title="Buscando encontro..."
      description="Isso pode demorar alguns segundos..."
    />
  );
}

export function MeetingIdViewError() {
  return (
    <ErrorState
      title="Erro ao buscar o encontro"
      description="Tente recarregar a página ou volte mais tarde."
    />
  );
}
