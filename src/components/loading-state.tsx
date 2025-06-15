import { LoaderIcon } from "lucide-react";

export function LoadingState() {
  return (
    <div className="py-4 px-8 flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <LoaderIcon className="size-6 animate-spin text-primary" />
      </div>
    </div>
  );
}
