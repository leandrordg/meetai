import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import {
  MAX_FREE_AGENTS,
  MAX_FREE_MEETINGS,
} from "@/modules/premium/constants";
import { initTRPC, TRPCError } from "@trpc/server";
import { count, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";

export const createTRPCContext = cache(async () => {});

const t = initTRPC.create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Sem permissão.",
    });

  return next({ ctx: { ...ctx, auth: session } });
});

export const premiumProcedure = (entity: "meetings" | "agents") =>
  protectedProcedure.use(async ({ ctx, next }) => {
    const userId = ctx.auth.user.id;

    const customer = await polarClient.customers.getStateExternal({
      externalId: userId,
    });

    const isPremium = customer.activeSubscriptions.length > 0;

    if (entity === "meetings") {
      const [userMeetings] = await db
        .select({
          count: count(meetings.id),
        })
        .from(meetings)
        .where(eq(meetings.userId, userId));

      const isFreeMeetingLimitReached =
        userMeetings.count >= MAX_FREE_MEETINGS && !isPremium;

      if (isFreeMeetingLimitReached) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Você atingiu o limite de reuniões gratuitas.",
        });
      }
    } else if (entity === "agents") {
      const [userAgents] = await db
        .select({
          count: count(agents.id),
        })
        .from(agents)
        .where(eq(agents.userId, userId));

      const isFreeAgentLimitReached =
        userAgents.count >= MAX_FREE_AGENTS && !isPremium;

      if (isFreeAgentLimitReached) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Você atingiu o limite de agentes gratuitos.",
        });
      }
    }

    return next({ ctx: { ...ctx, customer } });
  });
