import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type MeetingGetMany =
  inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"];
export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export enum MeetingStatus {
  Upcoming = "upcoming", // pt-BR: "agendado"
  Active = "active", // pt-BR: "em andamento"
  Completed = "completed", // pt-BR: "concluído"
  Processing = "processing", // pt-BR: "processando"
  Cancelled = "cancelled", // pt-BR: "cancelado"
}
