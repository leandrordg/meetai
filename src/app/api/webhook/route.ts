import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { generateAvatar } from "@/lib/avatar";
import { openAiClient } from "@/lib/open-ai";
import { streamChat } from "@/lib/stream-chat";
import { streamVideo } from "@/lib/stream-video";
import {
  CallEndedEvent,
  CallRecordingReadyEvent,
  CallSessionParticipantLeftEvent,
  CallSessionStartedEvent,
  CallTranscriptionReadyEvent,
  MessageNewEvent,
} from "@stream-io/node-sdk";
import { and, eq, not } from "drizzle-orm";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

function verifySignatureWithSDK(body: string, signature: string) {
  return streamVideo.verifyWebhook(body, signature);
}

export async function POST(req: NextRequest) {
  const headersStore = await headers();

  const signature = headersStore.get("x-signature");
  const apiKey = headersStore.get("x-api-key");

  if (!signature || !apiKey) {
    return NextResponse.json(
      { error: "Missing signature or API key" },
      { status: 400 }
    );
  }

  const body = await req.text();

  if (!verifySignatureWithSDK(body, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;

  try {
    payload = JSON.parse(body) as Record<string, unknown>;
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  const eventType = (payload as Record<string, unknown>)?.type;

  if (eventType === "call.session_started") {
    const event = payload as CallSessionStartedEvent;
    const meetingId = event.call.custom.meetingId as string | undefined;

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in call session started event" },
        { status: 400 }
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.id, meetingId),
          not(eq(meetings.status, "active")),
          not(eq(meetings.status, "completed")),
          not(eq(meetings.status, "cancelled")),
          not(eq(meetings.status, "processing"))
        )
      );

    if (!existingMeeting) {
      return NextResponse.json(
        { error: "Meeting not found or not in a valid state" },
        { status: 404 }
      );
    }

    await db
      .update(meetings)
      .set({ status: "active", startedAt: new Date() })
      .where(eq(meetings.id, existingMeeting.id));

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const call = streamVideo.video.call("default", meetingId);

    const realtimeClient = await streamVideo.video.connectOpenAi({
      call,
      openAiApiKey: process.env.OPENAI_API_KEY!,
      agentUserId: existingAgent.id,
    });

    realtimeClient.updateSession({
      instructions: existingAgent.instructions,
    });
  } else if (eventType === "call.session_participant_left") {
    const event = payload as CallSessionParticipantLeftEvent;
    const meetingId = event.call_cid.split(":")[1] as string | undefined; // `type:meetingId`

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in call session participant left event" },
        { status: 400 }
      );
    }

    const call = streamVideo.video.call("default", meetingId);

    await call.end();
  } else if (eventType === "call.session_ended") {
    const event = payload as CallEndedEvent;
    const meetingId = event.call.custom.meetingId as string | undefined;

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in call session ended event" },
        { status: 400 }
      );
    }

    await db
      .update(meetings)
      .set({ status: "processing", endedAt: new Date() })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "active")));
  } else if (eventType === "call.transcription_ready") {
    const event = payload as CallTranscriptionReadyEvent;
    const meetingId = event.call_cid.split(":")[1] as string | undefined; // `type:meetingId`

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in transcription ready event" },
        { status: 400 }
      );
    }

    const [updatedMeeting] = await db
      .update(meetings)
      .set({ transcriptUrl: event.call_transcription.url })
      .where(and(eq(meetings.id, meetingId), eq(meetings.status, "processing")))
      .returning();

    if (!updatedMeeting) {
      return NextResponse.json(
        { error: "Meeting not found or not in processing state" },
        { status: 404 }
      );
    }

    await inngest.send({
      name: "meetings/processing",
      data: {
        meetingId: updatedMeeting.id,
        transcriptUrl: updatedMeeting.transcriptUrl,
      },
    });
  } else if (eventType === "call.recording_ready") {
    const event = payload as CallRecordingReadyEvent;
    const meetingId = event.call_cid.split(":")[1] as string | undefined; // `type:meetingId`

    if (!meetingId) {
      return NextResponse.json(
        { error: "Missing meetingId in recording ready event" },
        { status: 400 }
      );
    }

    await db
      .update(meetings)
      .set({ recordingUrl: event.call_recording.url })
      .where(
        and(eq(meetings.id, meetingId), eq(meetings.status, "processing"))
      );
  } else if (eventType === "message.new") {
    const event = payload as MessageNewEvent;

    const userId = event.user?.id;
    const text = event.message?.text;
    const channelId = event.channel_id;

    if (!userId || !text || !channelId) {
      return NextResponse.json(
        { error: "Missing userId, text or channelId in message new event" },
        { status: 400 }
      );
    }

    const [existingMeeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, channelId), eq(meetings.status, "completed")));

    if (!existingMeeting) {
      return NextResponse.json(
        { error: "Meeting not found or not completed" },
        { status: 404 }
      );
    }

    const [existingAgent] = await db
      .select()
      .from(agents)
      .where(eq(agents.id, existingMeeting.agentId));

    if (!existingAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (userId !== existingAgent.id) {
      const instructions = `
        Você é um assistente de IA ajudando o usuário a revisar uma reunião que foi concluída recentemente.
        Abaixo está um resumo da reunião, gerado a partir da transcrição:

        ${existingMeeting.summary}

        A seguir, estão as instruções originais do assistente ao vivo da reunião. Continue seguindo essas diretrizes comportamentais ao auxiliar o usuário:

        ${existingAgent.instructions}

        O usuário pode fazer perguntas sobre a reunião, solicitar esclarecimentos ou pedir ações de acompanhamento.
        Sempre baseie suas respostas no resumo da reunião apresentado acima.

        Você também tem acesso ao histórico recente de conversas entre você e o usuário. Use o contexto das mensagens anteriores para fornecer respostas relevantes, coerentes e úteis. Se a pergunta do usuário se referir a algo já discutido, leve isso em consideração e mantenha a continuidade da conversa.

        Caso o resumo não contenha informações suficientes para responder a uma pergunta, informe isso ao usuário de forma educada.

        Seja conciso, prestativo e foque em fornecer informações precisas com base na reunião e na conversa em andamento.
      `.trim();

      const channel = streamChat.channel("messaging", channelId);

      await channel.watch();

      const previousMessages = channel.state.messages
        .slice(-5)
        .filter((msg) => msg.text && msg.text.trim() !== "")
        .map<ChatCompletionMessageParam>((message) => ({
          role: message.user?.id === existingAgent.id ? "assistant" : "user",
          content: message.text || "",
        }));

      const chatCompletion = await openAiClient.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: instructions },
          ...previousMessages,
          { role: "user", content: text },
        ],
      });

      const responseText = chatCompletion.choices[0].message.content;

      if (!responseText) {
        return NextResponse.json(
          { error: "No response generated by AI" },
          { status: 500 }
        );
      }

      const avatarUrl = generateAvatar({
        seed: existingAgent.name,
        variant: "botttsNeutral",
      });

      streamChat.upsertUser({
        id: existingAgent.id,
        name: existingAgent.name,
        image: avatarUrl,
      });

      channel.sendMessage({
        text: responseText,
        user: {
          id: existingAgent.id,
          name: existingAgent.name,
          image: avatarUrl,
        },
      });
    }
  }

  return NextResponse.json({ status: "success" }, { status: 200 });
}
