import type { Conversation } from "../types";
import {
  formatWaitTime,
  getPriorityClasses,
  getChannelIcon,
  getSentimentIcon,
  PRIORITY_LABELS,
} from "../utils/conversation";

interface ConversationRowProps {
  conversation: Conversation;
  isSelected: boolean;
  isPending: boolean;
  onClick: () => void;
}

export function ConversationRow({
  conversation: conv,
  isSelected,
  isPending,
  onClick,
}: ConversationRowProps) {
  const { badge } = getPriorityClasses(conv.priority);
  const waitTime = formatWaitTime(conv.waitingSince);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 border-b border-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset cursor-pointer ${
        isSelected
          ? "bg-indigo-950/60 border-l-2 border-l-indigo-500"
          : "hover:bg-slate-800/60 border-l-2 border-l-transparent"
      }`}
      aria-pressed={isSelected}
      aria-label={`${conv.customer.name} — ${conv.subject}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
              conv.priority === "critical"
                ? "bg-red-900 text-red-200"
                : conv.priority === "high"
                  ? "bg-orange-900 text-orange-200"
                  : "bg-slate-700 text-slate-300"
            }`}
          >
            {conv.customer.avatarInitials}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-slate-100 truncate">
              {conv.customer.name}
            </span>
            <span className="text-xs" aria-label={`Channel: ${conv.channel}`}>
              {getChannelIcon(conv.channel)}
            </span>
            <span
              className="text-xs"
              aria-label={`Sentiment: ${conv.sentiment}`}
            >
              {getSentimentIcon(conv.sentiment)}
            </span>
            {conv.csatRisk && (
              <span
                className="text-[10px] font-bold text-amber-400 bg-amber-950 border border-amber-700 px-1 rounded"
                title="CSAT risk"
              >
                CSAT
              </span>
            )}
            <span className="ml-auto shrink-0 text-xs text-slate-500 tabular-nums">
              {waitTime}
            </span>
          </div>

          <p className="text-xs text-slate-300 truncate mb-1 font-medium">
            {conv.subject}
          </p>
          <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>

          <div className="flex items-center gap-2 mt-1.5">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${badge}`}
            >
              {PRIORITY_LABELS[conv.priority]}
            </span>

            {/* Urgency bar */}
            <div className="flex items-center gap-1 flex-1">
              <div className="h-1 flex-1 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    conv.urgencyScore >= 80
                      ? "bg-red-500"
                      : conv.urgencyScore >= 60
                        ? "bg-orange-500"
                        : conv.urgencyScore >= 40
                          ? "bg-yellow-500"
                          : "bg-slate-500"
                  }`}
                  style={{ width: `${conv.urgencyScore}%` }}
                  role="progressbar"
                  aria-valuenow={conv.urgencyScore}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Urgency: ${conv.urgencyScore}/100`}
                />
              </div>
              <span className="text-[10px] text-slate-500 tabular-nums w-5">
                {conv.urgencyScore}
              </span>
            </div>

            {conv.assignedTo && (
              <span className="text-[10px] text-slate-500 shrink-0">
                {conv.status === "in_progress" ? "🟢 Active" : "💤 Snoozed"}
              </span>
            )}

            {isPending && (
              <span className="text-[10px] text-indigo-400 animate-pulse">
                saving…
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
