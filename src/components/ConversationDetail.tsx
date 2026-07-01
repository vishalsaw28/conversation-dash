import { useState, useRef, useEffect } from "react";
import type { Conversation } from "../types";
import {
  formatWaitTime,
  formatTimestamp,
  getPriorityClasses,
  getChannelIcon,
  getSentimentIcon,
  SENTIMENT_LABELS,
  PRIORITY_LABELS,
} from "../utils/conversation";
import { MOCK_AGENTS, CURRENT_AGENT_ID } from "../mocks/data";

type ActionResult =
  | { ok: true; conversation: Conversation }
  | { ok: false; error: string };

interface ConversationDetailProps {
  conversation: Conversation;
  isPending: boolean;
  onResolve: (id: string) => Promise<ActionResult>;
  onAssign: (id: string, agentId: string) => Promise<ActionResult>;
  onSnooze: (id: string, until: string) => Promise<ActionResult>;
  onReply: (id: string, message: string) => Promise<ActionResult>;
  onToast: (type: "success" | "error" | "info", message: string) => void;
}

export function ConversationDetail({
  conversation: conv,
  isPending,
  onResolve,
  onAssign,
  onSnooze,
  onReply,
  onToast,
}: ConversationDetailProps) {
  const [reply, setReply] = useState("");
  const [showSnooze, setShowSnooze] = useState(false);
  const [showAssign, setShowAssign] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const replyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conv.messages]);

  // Cmd/Ctrl+Enter to send reply
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (document.activeElement === replyRef.current && reply.trim()) {
          void handleReply();
        }
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  const handleResolve = async () => {
    const result = await onResolve(conv.id);
    if (result.ok) {
      onToast("success", "Conversation resolved.");
    } else {
      onToast("error", result.error);
    }
  };

  const handleAssign = async (agentId: string) => {
    setShowAssign(false);
    const result = await onAssign(conv.id, agentId);
    const agentName =
      MOCK_AGENTS.find((a) => a.id === agentId)?.name ?? agentId;
    if (result.ok) {
      onToast("success", `Assigned to ${agentName}.`);
    } else {
      onToast("error", result.error);
    }
  };

  const handleSnooze = async (minutes: number) => {
    setShowSnooze(false);
    const until = new Date(Date.now() + minutes * 60_000).toISOString();
    const result = await onSnooze(conv.id, until);
    if (result.ok) {
      onToast(
        "success",
        `Snoozed for ${minutes < 60 ? `${minutes}m` : `${minutes / 60}h`}.`,
      );
    } else {
      onToast("error", result.error);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    const text = reply.trim();
    setReply("");
    const result = await onReply(conv.id, text);
    if (result.ok) {
      onToast("success", "Reply sent.");
    } else {
      setReply(text); // restore on failure
      onToast("error", result.error);
    }
  };

  const { badge, dot } = getPriorityClasses(conv.priority);
  const isResolved = conv.status === "resolved";

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
      {/* Header */}
      <header className="px-6 py-4 border-b border-slate-800 bg-slate-900 shrink-0">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
              conv.priority === "critical"
                ? "bg-red-900 text-red-200"
                : conv.priority === "high"
                  ? "bg-orange-900 text-orange-200"
                  : "bg-slate-700 text-slate-300"
            }`}
          >
            {conv.customer.avatarInitials}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-white">
                {conv.customer.name}
              </h1>
              <span className="text-slate-500 text-sm">
                {conv.customer.email}
              </span>
              <span>{getChannelIcon(conv.channel)}</span>
            </div>
            <p className="text-sm text-slate-300 mt-0.5 font-medium truncate">
              {conv.subject}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span
                className={`text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-1 ${badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                {PRIORITY_LABELS[conv.priority]}
              </span>

              <span className="text-xs text-slate-400 flex items-center gap-1">
                {getSentimentIcon(conv.sentiment)}
                {SENTIMENT_LABELS[conv.sentiment]}
              </span>

              <span className="text-xs text-slate-400">
                ⏱ Waiting {formatWaitTime(conv.waitingSince)}
              </span>

              {conv.csatRisk && (
                <span className="text-xs font-semibold text-amber-400 bg-amber-950 border border-amber-700 px-2 py-0.5 rounded">
                  ⚠ CSAT risk
                </span>
              )}

              {conv._failWrites && (
                <span className="text-xs font-semibold text-red-400 bg-red-950 border border-red-700 px-2 py-0.5 rounded">
                  ⚡ Write failures enabled (demo)
                </span>
              )}
            </div>

            {/* Escalation reason */}
            <p className="text-[11px] text-slate-500 mt-1.5 italic">
              Escalated: {conv.escalationReason}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {!isResolved && (
              <>
                {/* Assign */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowAssign(!showAssign);
                      setShowSnooze(false);
                    }}
                    disabled={isPending}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg transition-colors disabled:opacity-50"
                    aria-label="Assign conversation"
                  >
                    {conv.assignedTo
                      ? `👤 ${MOCK_AGENTS.find((a) => a.id === conv.assignedTo)?.name ?? conv.assignedTo}`
                      : "👤 Assign"}
                  </button>
                  {showAssign && (
                    <div className="absolute right-0 top-8 z-20 bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-40 py-1">
                      {MOCK_AGENTS.map((agent) => (
                        <button
                          key={agent.id}
                          onClick={() => void handleAssign(agent.id)}
                          className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                        >
                          {agent.id === CURRENT_AGENT_ID && (
                            <span className="text-indigo-400">●</span>
                          )}
                          {agent.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Snooze */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowSnooze(!showSnooze);
                      setShowAssign(false);
                    }}
                    disabled={isPending}
                    className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg transition-colors disabled:opacity-50"
                    aria-label="Snooze conversation"
                  >
                    💤 Snooze
                  </button>
                  {showSnooze && (
                    <div className="absolute right-0 top-8 z-20 bg-slate-800 border border-slate-700 rounded-lg shadow-xl min-w-36 py-1">
                      {[
                        { label: "30 minutes", mins: 30 },
                        { label: "1 hour", mins: 60 },
                        { label: "4 hours", mins: 240 },
                        { label: "Tomorrow", mins: 1440 },
                      ].map((opt) => (
                        <button
                          key={opt.mins}
                          onClick={() => void handleSnooze(opt.mins)}
                          className="w-full text-left px-3 py-2 text-sm text-slate-200 hover:bg-slate-700"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Resolve */}
                <button
                  onClick={() => void handleResolve()}
                  disabled={isPending}
                  className="px-3 py-1.5 text-xs bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
                  aria-label="Resolve conversation"
                >
                  {isPending ? <span className="animate-spin">⟳</span> : "✓"}
                  Resolve
                </button>
              </>
            )}

            {isResolved && (
              <span className="px-3 py-1.5 text-xs bg-emerald-950 border border-emerald-700 text-emerald-400 rounded-lg font-semibold">
                ✓ Resolved
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Message thread */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {conv.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "agent" || msg.role === "bot" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                msg.role === "customer"
                  ? "bg-slate-700 text-slate-300"
                  : msg.role === "agent"
                    ? "bg-indigo-700 text-indigo-100"
                    : "bg-violet-900 text-violet-300"
              }`}
            >
              {msg.role === "customer"
                ? conv.customer.avatarInitials
                : msg.role === "agent"
                  ? "PS"
                  : "AI"}
            </div>

            <div
              className={`max-w-[70%] ${msg.role === "agent" || msg.role === "bot" ? "items-end" : "items-start"} flex flex-col gap-0.5`}
            >
              <div
                className={`flex items-center gap-2 text-[11px] text-slate-500 ${msg.role !== "customer" ? "flex-row-reverse" : ""}`}
              >
                <span>
                  {msg.role === "customer"
                    ? conv.customer.name
                    : msg.role === "agent"
                      ? "You"
                      : "AI Bot"}
                </span>
                <span>{formatTimestamp(msg.timestamp)}</span>
              </div>
              <div
                className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.role === "customer"
                    ? "bg-slate-800 text-slate-200 rounded-tl-none"
                    : msg.role === "agent"
                      ? "bg-indigo-700 text-indigo-50 rounded-tr-none"
                      : "bg-violet-950 text-violet-200 border border-violet-800 rounded-tr-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply box */}
      {!isResolved && (
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 shrink-0">
          <div className="relative">
            <textarea
              ref={replyRef}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply to customer… (⌘ + Enter to send)"
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none pr-24"
              aria-label="Reply message"
            />
            <button
              onClick={() => void handleReply()}
              disabled={!reply.trim() || isPending}
              className="absolute bottom-3 right-3 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-semibold rounded-lg transition-colors"
              aria-label="Send reply"
            >
              {isPending ? "…" : "Send →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
