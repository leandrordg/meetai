import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generateAvatar } from "@/lib/avatar";
import {
  DefaultVideoPlaceholder,
  StreamVideoParticipant,
  ToggleAudioPreviewButton,
  ToggleVideoPreviewButton,
  useCallStateHooks,
  VideoPreview,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import { AlertCircleIcon, LogInIcon } from "lucide-react";
import Link from "next/link";

interface Props {
  onJoin: () => void;
}

function DisabledVideoPreview() {
  const { data } = authClient.useSession();

  return (
    <DefaultVideoPlaceholder
      participant={
        {
          name: data?.user.name ?? "",
          image:
            data?.user.image ??
            generateAvatar({
              seed: data?.user.name ?? "",
              variant: "initials",
            }),
        } as StreamVideoParticipant
      }
    />
  );
}

function AllowBrowserPermissions() {
  return (
    <div className="flex flex-col items-center gap-4">
      <AlertCircleIcon />

      <p className="text-sm text-center text-balance">
        Por favor, permita o acesso à câmera e ao microfone do seu navegador
        para participar da chamada.
      </p>
    </div>
  );
}

function NoCameraPreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      <AlertCircleIcon />

      <p className="text-sm text-center text-balance">
        Você não possui uma câmera conectada ou não há permissão para usá-la.
      </p>
    </div>
  );
}

export function CallLobby({ onJoin }: Props) {
  const { useCameraState, useMicrophoneState } = useCallStateHooks();

  const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
  const { hasBrowserPermission: hasCameraPermission } = useCameraState();

  const hasBrowserMediaPermissions = hasMicPermission && hasCameraPermission;

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="py-4 px-8 flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-6 bg-background rounded-lg p-10 shadow-sm">
          <div className="flex flex-col gap-2 text-center">
            <h6 className="text-lg font-medium">Pronto para participar?</h6>
            <p className="text-sm">Configure a sua chamada antes de entrar.</p>
          </div>

          <VideoPreview
            NoCameraPreview={NoCameraPreview}
            DisabledVideoPreview={
              hasBrowserMediaPermissions
                ? DisabledVideoPreview
                : AllowBrowserPermissions
            }
          />

          <div className="flex justify-between gap-4 w-full">
            <Button variant="ghost" asChild>
              <Link href="/meetings">Cancelar</Link>
            </Button>

            <ToggleAudioPreviewButton caption="Microfone" />
            <ToggleVideoPreviewButton caption="Câmera" />

            <Button onClick={onJoin}>
              <LogInIcon />
              Entrar na chamada
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
