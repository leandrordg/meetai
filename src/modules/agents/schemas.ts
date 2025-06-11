import { z } from "zod/v4";

export const agentsInsertSchema = z.object({
  name: z.string().nonempty("Nome obrigatório."),
  instructions: z.string().nonempty("Instruções obrigatórias."),
});
