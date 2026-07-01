import { http, HttpResponse, delay } from "msw";
import type { Conversation } from "../types";
import { MOCK_CONVERSATIONS } from "./data";

// In-memory store
let conversations: Conversation[] = JSON.parse(
  JSON.stringify(MOCK_CONVERSATIONS),
);

const randomDelay = () => delay(200 + Math.random() * 300);

export const handlers = [
  // GET all conversations
  http.get("/api/conversations", async () => {
    await randomDelay();
    return HttpResponse.json(conversations);
  }),

  // GET single conversation
  http.get("/api/conversations/:id", async ({ params }) => {
    await randomDelay();
    const conv = conversations.find((c) => c.id === params["id"]);
    if (!conv)
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    return HttpResponse.json(conv);
  }),

  // resolve conversation
  http.patch("/api/conversations/:id/resolve", async ({ params }) => {
    await randomDelay();
    const conv = conversations.find((c) => c.id === params["id"]);
    if (!conv)
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    if (conv._failWrites) {
      return HttpResponse.json(
        { error: "Action failed — connection lost. Try again." },
        { status: 503 },
      );
    }
    conv.status = "resolved";
    conv.updatedAt = new Date().toISOString();
    return HttpResponse.json(conv);
  }),

  // assign conversation
  http.patch("/api/conversations/:id/assign", async ({ params, request }) => {
    await randomDelay();
    const conv = conversations.find((c) => c.id === params["id"]);
    if (!conv)
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    if (conv._failWrites) {
      return HttpResponse.json(
        { error: "Action failed — connection lost. Try again." },
        { status: 503 },
      );
    }
    const body = (await request.json()) as { agentId: string };
    conv.assignedTo = body.agentId;
    conv.status = "in_progress";
    conv.updatedAt = new Date().toISOString();
    return HttpResponse.json(conv);
  }),

  // snooze conversation
  http.patch("/api/conversations/:id/snooze", async ({ params, request }) => {
    await randomDelay();
    const conv = conversations.find((c) => c.id === params["id"]);
    if (!conv)
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    if (conv._failWrites) {
      return HttpResponse.json(
        { error: "Action failed — connection lost. Try again." },
        { status: 503 },
      );
    }
    const body = (await request.json()) as { until: string };
    conv.status = "snoozed";
    conv.updatedAt = new Date().toISOString();
    // Store snooze until (could be used in real app)
    void body.until;
    return HttpResponse.json(conv);
  }),

  // POST send reply
  http.post("/api/conversations/:id/reply", async ({ params, request }) => {
    await randomDelay();
    const conv = conversations.find((c) => c.id === params["id"]);
    if (!conv)
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    if (conv._failWrites) {
      return HttpResponse.json(
        { error: "Message failed to send. Check your connection." },
        { status: 503 },
      );
    }
    const body = (await request.json()) as { message: string };
    const newMessage = {
      id: `m${Date.now()}`,
      role: "agent" as const,
      content: body.message,
      timestamp: new Date().toISOString(),
    };
    conv.messages.push(newMessage);
    conv.lastMessage = body.message;
    conv.updatedAt = new Date().toISOString();
    conv.status = "in_progress";
    return HttpResponse.json(conv);
  }),

  // DELETE (toggle fail writes for demo)
  http.patch("/api/conversations/:id/toggle-fail", async ({ params }) => {
    const conv = conversations.find((c) => c.id === params["id"]);
    if (!conv)
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    conv._failWrites = !conv._failWrites;
    return HttpResponse.json({ failing: conv._failWrites });
  }),
];
