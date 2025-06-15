"use client";

import { authClient } from "@/lib/auth-client";
import { generateAvatar } from "@/lib/avatar";
import { CallConnect } from "@/modules/call/ui/components/call-connect";
import { LoaderIcon } from "lucide-react";

interface Props {
  meetingId: string;
  meetingName: string;
}

export function CallProvider({ meetingId, meetingName }: Props) {
  const { data, isPending } = authClient.useSession();

  if (!data || isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={data.user.id}
      userName={data.user.name}
      userImage={
        data.user.image ??
        generateAvatar({
          seed: data.user.name,
          variant: "initials",
        })
      }
    />
  );
}
