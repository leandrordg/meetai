import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";
import { MAX_PAGE_SIZE } from "@/constants";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from 'nextjs-toploader/app';
import { useState } from "react";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function DashboardCommand({ open, setOpen }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const trpc = useTRPC();

  const meetings = useQuery(
    trpc.meetings.getMany.queryOptions({
      search,
      pageSize: MAX_PAGE_SIZE,
    })
  );

  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      search,
      pageSize: MAX_PAGE_SIZE,
    })
  );

  return (
    <CommandResponsiveDialog
      open={open}
      shouldFilter={false}
      onOpenChange={setOpen}
    >
      <CommandInput
        value={search}
        onValueChange={(value) => setSearch(value)}
        placeholder="Busque por reunião ou agente..."
      />
      <CommandList>
        <CommandGroup heading="Reuniões">
          <CommandEmpty>
            <span className="text-muted-foreground">
              Nenhuma reunião encontrada.
            </span>
          </CommandEmpty>

          {meetings.data?.items.map((meeting) => (
            <CommandItem
              key={meeting.id}
              onSelect={() => {
                router.push(`/meetings/${meeting.id}`);
                setOpen(false);
              }}
            >
              {meeting.name}
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Agentes">
          <CommandEmpty>
            <span className="text-muted-foreground">
              Nenhum agente encontrado.
            </span>
          </CommandEmpty>

          {agents.data?.items.map((agent) => (
            <CommandItem
              key={agent.id}
              onSelect={() => {
                router.push(`/agents/${agent.id}`);
                setOpen(false);
              }}
            >
              <GeneratedAvatar
                seed={agent.name}
                variant="botttsNeutral"
                className="size-5"
              />
              {agent.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
}
