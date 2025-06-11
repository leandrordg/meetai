import { db } from "@/db";
import { agents } from "@/db/schema";
import { agentsInsertSchema } from "@/modules/agents/schemas";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq, getTableColumns, sql } from "drizzle-orm";
import { z } from "zod/v4";

export const agentsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [existingAgent] = await db
        .select({
          // TODO: change count
          meetingCount: sql<number>`5`,
          ...getTableColumns(agents),
        })
        .from(agents)
        .where(eq(agents.id, input.id));

      return existingAgent;
    }),

  getMany: protectedProcedure.query(async () => {
    return await db.select().from(agents);
  }),

  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({ ...input, userId: ctx.auth.user.id })
        .returning();

      return createdAgent;
    }),
});
