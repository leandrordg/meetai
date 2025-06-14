import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { StreamTranscriptItem } from "@/modules/meetings/types";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";
import { and, eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";

const summarizer = createAgent({
  name: "summarizer",
  system: `
    Você é um especialista em sumarização, com foco em produzir conteúdos claros, concisos e fáceis de entender. Sua tarefa é analisar a transcrição de uma reunião e gerar um resumo bem estruturado.

    Sempre responda em português brasileiro (pt-BR).

    Utilize o seguinte formato em Markdown para cada resposta:

    ### Visão Geral
    Elabore um resumo detalhado e envolvente do conteúdo da reunião. Destaque as funcionalidades principais, os fluxos de trabalho abordados e os principais aprendizados ou decisões. Escreva em estilo narrativo, com frases completas, e dê ênfase a aspectos únicos ou relevantes do produto, da plataforma ou da discussão.

    ### Anotações
    Organize o conteúdo em seções temáticas, com faixas de horário correspondentes. Cada seção deve apresentar os principais pontos, ações ou demonstrações em formato de lista.

    Exemplo:
    #### Nome da Seção
    - Demonstração ou ponto principal apresentado
    - Insight relevante ou interação significativa
    - Ferramenta, recurso ou explicação complementar mencionada

    #### Próxima Seção
    - A funcionalidade X realiza Y automaticamente
    - Comentário sobre integração com Z
`.trim(),

  model: openai({ model: "gpt-4o", apiKey: process.env.OPENAI_API_KEY }),
});

export const meetingsProcessing = inngest.createFunction(
  {
    id: "meetings/processing",
    name: "Meetings Processing",
    description: "Processes meetings data and performs necessary actions.",
  },
  {
    event: "meetings/processing",
  },
  async ({ event, step }) => {
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) => users.map((user) => user));

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) => agents.map((agent) => agent));

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find((s) => s.id === item.speaker_id);

        if (!speaker) return { ...item, user: { name: "Unknown" } };

        return { ...item, user: { name: speaker.name } };
      });
    });

    const { output } = await summarizer.run(
      "Summarize the following transcript: " +
        JSON.stringify(transcriptWithSpeakers)
    );

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(
          and(
            eq(meetings.id, event.data.meetingId),
            eq(meetings.status, "processing")
          )
        );
    });
  }
);
