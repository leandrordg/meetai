"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  MAX_FREE_AGENTS,
  MAX_FREE_MEETINGS,
} from "@/modules/premium/constants";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { RocketIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

export function DashboardTrial() {
  const trpc = useTRPC();

  const { data } = useQuery(trpc.premium.getFreeUsage.queryOptions());

  if (!data) return null;

  return (
    <div className="border rounded-lg w-full flex bg-background flex-col gap-2 min-h-52">
      <div className="p-3 flex flex-col h-full gap-4">
        <div className="flex items-center gap-2">
          <RocketIcon className="size-4" />
          <p className="text-sm font-medium">Teste gratuito</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs">
            {data.agentCount}/{MAX_FREE_AGENTS} agentes
          </p>

          <Progress value={(data.agentCount / MAX_FREE_AGENTS) * 100} />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xs">
            {data.meetingCount}/{MAX_FREE_MEETINGS} encontros
          </p>

          <Progress value={(data.meetingCount / MAX_FREE_MEETINGS) * 100} />
        </div>

        <Button className="mt-auto" asChild>
          <Link href="/upgrade">
            <SparklesIcon />
            Fazer upgrade
          </Link>
        </Button>
      </div>
    </div>
  );
}
