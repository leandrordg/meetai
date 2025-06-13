"use client";

import { formatMeetingStatus } from "@/lib/utils";
import { useMeetingsFilters } from "@/modules/meetings/hooks/use-meetings-filters";
import { MeetingStatus } from "@/modules/meetings/types";
import { CommandSelect } from "@/modules/meetings/ui/components/command-select";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
  VideoIcon,
} from "lucide-react";

const options = [
  {
    id: MeetingStatus.Upcoming,
    value: MeetingStatus.Upcoming,
    children: (
      <div className="flex items-center gap-2">
        <ClockArrowUpIcon />
        {formatMeetingStatus(MeetingStatus.Upcoming)}
      </div>
    ),
  },
  {
    id: MeetingStatus.Completed,
    value: MeetingStatus.Completed,
    children: (
      <div className="flex items-center gap-2">
        <CircleCheckIcon />
        {formatMeetingStatus(MeetingStatus.Completed)}
      </div>
    ),
  },
  {
    id: MeetingStatus.Active,
    value: MeetingStatus.Active,
    children: (
      <div className="flex items-center gap-2">
        <VideoIcon />
        {formatMeetingStatus(MeetingStatus.Active)}
      </div>
    ),
  },
  {
    id: MeetingStatus.Processing,
    value: MeetingStatus.Processing,
    children: (
      <div className="flex items-center gap-2">
        <LoaderIcon />
        {formatMeetingStatus(MeetingStatus.Processing)}
      </div>
    ),
  },
  {
    id: MeetingStatus.Cancelled,
    value: MeetingStatus.Cancelled,
    children: (
      <div className="flex items-center gap-2">
        <CircleXIcon />
        {formatMeetingStatus(MeetingStatus.Cancelled)}
      </div>
    ),
  },
];

export function StatusFilter() {
  const [filters, setFilters] = useMeetingsFilters();

  return (
    <CommandSelect
      placeholder="Status"
      className="h-9"
      options={options}
      onSelect={(value) => setFilters({ status: value as MeetingStatus })}
      value={filters.status ?? ""}
    />
  );
}
