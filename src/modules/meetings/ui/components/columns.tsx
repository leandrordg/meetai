"use client";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatMeetingStatus } from "@/lib/utils";
import { MeetingGetMany } from "@/modules/meetings/types";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import humanizeDuration from "humanize-duration";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  ClockFadingIcon,
  CornerDownRightIcon,
  LoaderIcon,
  LucideIcon,
} from "lucide-react";

function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
  });
}

type MeetingStatus = MeetingGetMany[number]["status"];

const statusIconMap: Record<MeetingStatus, LucideIcon> = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
};

const statusColorMap: Record<MeetingStatus, string> = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Nome do encontro",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-semibold capitalize">{row.original.name}</span>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <CornerDownRightIcon className="size-3 text-muted-foreground" />
            <span className="text-sm text-muted-foreground max-w-[200px] truncate capitalize">
              {row.original.agent.name}
            </span>
          </div>

          <GeneratedAvatar
            variant="botttsNeutral"
            seed={row.original.agent.name}
            className="size-4"
          />

          <span className="text-sm text-muted-foreground">
            {row.original.startedAt
              ? format(row.original.startedAt, "MMM d")
              : ""}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon = statusIconMap[row.original.status];

      const animateSpin =
        row.original.status === "processing" ||
        row.original.status === "active";

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize text-muted-foreground",
            statusColorMap[row.original.status]
          )}
        >
          <Icon className={cn("size-4", animateSpin && "animate-spin")} />
          {formatMeetingStatus(row.original.status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duração",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="capitalize flex items-center gap-2">
          <ClockFadingIcon className="size-4 text-blue-700" />
          {row.original.duration
            ? formatDuration(row.original.duration)
            : "N/A"}
        </Badge>
      );
    },
  },
];
