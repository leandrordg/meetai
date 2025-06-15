import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { generateAvatar } from "@/lib/avatar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import Highlighter from "react-highlight-words";

interface Props {
  meetingId: string;
}

export function Transcript({ meetingId }: Props) {
  const trpc = useTRPC();

  const { data } = useQuery(
    trpc.meetings.getTranscript.queryOptions({ id: meetingId })
  );

  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = (data ?? []).filter((item) =>
    item.text.toString().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-background rounded-lg border p-4 flex flex-col gap-4 w-full">
      <div className="relative">
        <Input
          value={searchQuery}
          placeholder="Pesquisar transcrição..."
          className="h-9 bg-background min-w-48 pl-7"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <SearchIcon className="size-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
      </div>

      <ScrollArea>
        <div className="flex flex-col gap-4">
          {filteredData.map((item) => {
            return (
              <div
                key={item.start_ts}
                className="flex flex-col gap-2 hover:bg-muted p-4 rounded-md border"
              >
                <div className="flex gap-2 items-center">
                  <Avatar className="size-6">
                    <AvatarImage
                      alt={item.user.name}
                      src={
                        item.user.image ??
                        generateAvatar({
                          seed: item.user.name,
                          variant: "initials",
                        })
                      }
                    />
                  </Avatar>
                  <p className="text-sm font-medium">{item.user.name}</p>
                  <p className="text-sm text-blue-500 font-medium">
                    {format(new Date(0, 0, 0, 0, 0, 0, item.start_ts), "mm:ss")}
                  </p>
                </div>

                <Highlighter
                  className="text-sm text-muted-foreground leading-relaxed"
                  highlightClassName="bg-yellow-200"
                  searchWords={[searchQuery]}
                  textToHighlight={item.text}
                  autoEscape={true}
                />
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
