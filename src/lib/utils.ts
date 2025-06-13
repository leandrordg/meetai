import { MeetingStatus } from "@/modules/meetings/types";
import { clsx, type ClassValue } from "clsx";
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
