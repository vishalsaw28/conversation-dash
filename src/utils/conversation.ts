import type { Conversation, FilterState, SortState, Priority } from "../types";

export function formatWaitTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return rem > 0 ? `${hours}h ${rem}m` : `${hours}h`;
}

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const PRIORITY_ORDER: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const SENTIMENT_LABELS = {
  very_negative: "Very negative",
  negative: "Negative",
  neutral: "Neutral",
  positive: "Positive",
} as const;

export function filterConversations(
  conversations: Conversation[],
  filters: FilterState,
): Conversation[] {
  return conversations.filter((conv) => {
    if (filters.status.length > 0 && !filters.status.includes(conv.status))
      return false;
    if (
      filters.priority.length > 0 &&
      !filters.priority.includes(conv.priority)
    )
      return false;
    if (filters.channel.length > 0 && !filters.channel.includes(conv.channel))
      return false;
    if (filters.assignedToMe && conv.assignedTo !== "agent_1") return false;
    if (filters.csatRisk && !conv.csatRisk) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (
        !conv.customer.name.toLowerCase().includes(q) &&
        !conv.subject.toLowerCase().includes(q) &&
        !conv.lastMessage.toLowerCase().includes(q) &&
        !conv.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
    }
    return true;
  });
}

export function sortConversations(
  conversations: Conversation[],
  sort: SortState,
): Conversation[] {
  return [...conversations].sort((a, b) => {
    let cmp = 0;
    switch (sort.field) {
      case "priority":
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
        break;
      case "urgencyScore":
      case "sentiment":
        cmp = b.urgencyScore - a.urgencyScore;
        break;
      case "waitTime":
        cmp =
          new Date(a.waitingSince).getTime() -
          new Date(b.waitingSince).getTime();
        break;
      case "updatedAt":
        cmp = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        break;
    }
    return sort.direction === "asc" ? cmp : -cmp;
  });
}

export function getUrgencyColor(score: number): string {
  if (score >= 80) return "text-red-500";
  if (score >= 60) return "text-orange-500";
  if (score >= 40) return "text-yellow-500";
  return "text-slate-400";
}

export function getPriorityClasses(priority: Priority): {
  badge: string;
  dot: string;
} {
  switch (priority) {
    case "critical":
      return {
        badge: "bg-red-950 text-red-400 border border-red-800",
        dot: "bg-red-500",
      };
    case "high":
      return {
        badge: "bg-orange-950 text-orange-400 border border-orange-800",
        dot: "bg-orange-500",
      };
    case "medium":
      return {
        badge: "bg-yellow-950 text-yellow-400 border border-yellow-800",
        dot: "bg-yellow-500",
      };
    case "low":
      return {
        badge: "bg-slate-800 text-slate-400 border border-slate-700",
        dot: "bg-slate-500",
      };
  }
}

export function getChannelIcon(channel: string): string {
  switch (channel) {
    case "chat":
      return "💬";
    case "email":
      return "📧";
    case "whatsapp":
      return "📱";
    case "voice":
      return "📞";
    default:
      return "💬";
  }
}

export function getSentimentIcon(sentiment: string): string {
  switch (sentiment) {
    case "very_negative":
      return "😡";
    case "negative":
      return "😕";
    case "neutral":
      return "😐";
    case "positive":
      return "🙂";
    default:
      return "😐";
  }
}
