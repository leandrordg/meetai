import "server-only";

import { createTRPCContext } from "@/trpc/init";
import { makeQueryClient } from "@/trpc/query-client";
import { appRouter } from "@/trpc/routers/_app";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";

export const getQueryClient = cache(makeQueryClient);

export const trpc = createTRPCOptionsProxy({
  router: appRouter,
  ctx: createTRPCContext,
  queryClient: getQueryClient,
});

export const caller = appRouter.createCaller(createTRPCContext);
