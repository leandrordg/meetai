import { GeneratedAvatar } from "@/components/generated-avatar";
import { Markdown } from "@/components/markdown";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDuration } from "@/lib/utils";
import { MeetingGetOne } from "@/modules/meetings/types";
import { ChatProvider } from "@/modules/meetings/ui/components/chat-provider";
import { Transcript } from "@/modules/meetings/ui/components/transcript";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  BookOpenTextIcon,
  ClockFadingIcon,
  FileTextIcon,
  FileVideoIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

interface Props {
  data: MeetingGetOne;
}

export function CompletedState({ data }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <Tabs defaultValue="summary" className="gap-4">
        <div className="bg-white rounded-lg border px-3">
          <ScrollArea>
            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
              <TabsTrigger
                value="summary"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <BookOpenTextIcon />
                Resumo
              </TabsTrigger>
              <TabsTrigger
                value="transcript"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileTextIcon />
                Transcrição
              </TabsTrigger>
              <TabsTrigger
                value="recording"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <FileVideoIcon />
                Gravação
              </TabsTrigger>
              <TabsTrigger
                value="chat"
                className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
              >
                <SparklesIcon />
                Chat com IA
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        <TabsContent value="summary">
          <div className="bg-white rounded-lg border">
            <div className="p-4 gap-4 flex flex-col col-span-5">
              <h2 className="text-2xl font-medium capitalize">{data.name}</h2>
              <div className="flex gap-2 items-center">
                <Link
                  href={`/agents/${data.agentId}`}
                  className="flex items-center gap-2 underline underline-offset-2 capitalize"
                >
                  <GeneratedAvatar
                    variant="botttsNeutral"
                    seed={data.agent.name}
                    className="size-5"
                  />
                  {data.agent.name}
                </Link>{" "}
                <p>
                  {data.startedAt
                    ? format(data.startedAt, "PPP", { locale: ptBR })
                    : "N/A"}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex gap-2 items-center">
                  <SparklesIcon className="size-4" />
                  <p>Resumo geral</p>
                </div>

                <Badge variant="outline" className="flex items-center gap-2">
                  <ClockFadingIcon className="size-4 text-blue-700" />
                  {data.duration ? formatDuration(data.duration) : "N/A"}
                </Badge>
              </div>

              <div>
                <Markdown>{data.summary}</Markdown>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transcript">
          <Transcript meetingId={data.id} />
        </TabsContent>

        <TabsContent value="recording">
          <div className="bg-white rounded-lg border p-4">
            <video
              src={data.recordingUrl!}
              className="w-full rounded-lg"
              controls
            />
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <ChatProvider meetingId={data.id} meetingName={data.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
