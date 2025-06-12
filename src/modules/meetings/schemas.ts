import { z } from "zod/v4";

export const meetingsInsertSchema = z.object({
  name: z.string().nonempty("Nome obrigatório."),
  agentId: z.string().nonempty("ID do agente obrigatório."),
});

export const meetingsUpdateSchema = meetingsInsertSchema.extend({
  id: z.string().nonempty("ID obrigatório."),
});
