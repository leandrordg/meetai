import { MeetingStatus } from "@/modules/meetings/types";
import { SubscriptionRecurringInterval } from "@polar-sh/sdk/models/components/subscriptionrecurringinterval.js";
import { clsx, type ClassValue } from "clsx";
import humanizeDuration from "humanize-duration";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMeetingStatus(status: MeetingStatus | string) {
  switch (status) {
    case "active":
      return "Em andamento";
    case "completed":
      return "Concluído";
    case "upcoming":
      return "Agendado";
    case "processing":
      return "Processando";
    case "cancelled":
      return "Cancelado";
  }
}

export function formatRecurringInterval(
  interval: SubscriptionRecurringInterval | null
) {
  switch (interval) {
    case "month":
      return "mês";
    case "year":
      return "ano";
    default:
      return "Desconhecido";
  }
}

export function formatDuration(seconds: number) {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ["h", "m", "s"],
    language: "pt",
  });
}
