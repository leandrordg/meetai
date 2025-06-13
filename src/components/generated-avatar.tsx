import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatar } from "@/lib/avatar";
import { cn } from "@/lib/utils";

interface Props {
  seed: string;
  className?: string;
  variant: "botttsNeutral" | "initials";
}

export function GeneratedAvatar({ seed, className, variant }: Props) {
  const avatar = generateAvatar({ seed, variant });

  return (
    <Avatar className={cn(className)}>
      <AvatarImage src={avatar} alt="Avatar" />
      <AvatarFallback>{seed.charAt(0).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
