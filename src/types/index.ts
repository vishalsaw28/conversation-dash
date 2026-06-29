export type Priority = "critical" | "high" | "medium" | "low";
export type Status = "waiting" | "in_progress" | "resolved" | "snoozed";
export type Channel = "chat" | "email" | "whatsapp" | "voice";
export type SortField =
  | "priority"
  | "waitTime"
  | "sentiment"
  | "updatedAt"
  | "urgencyScore";
export type SortDirection = "asc" | "desc";

export interface Message {
  id: string;
  role: "customer" | "agent" | "bot";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  customer: {
    name: string;
    email: string;
    avatarInitials: string;
  };
  channel: Channel;
  status: Status;
  priority: Priority;
  urgencyScore: number;
  subject: string;
  lastMessage: string;
  waitingSince: string; // ISO
  updatedAt: string; // ISO
  assignedTo: string | null;
  tags: string[];
  sentiment: "positive" | "neutral" | "negative" | "very_negative";
  csatRisk: boolean;
  escalationReason: string;
  messages: Message[];
  _failWrites?: boolean;
}

export interface FilterState {
  status: Status[];
  priority: Priority[];
  channel: Channel[];
  assignedToMe: boolean;
  csatRisk: boolean;
  search: string;
}

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

export type ConversationAction =
  | { type: "RESOLVE"; conversationId: string }
  | { type: "ASSIGN"; conversationId: string; agentId: string }
  | { type: "SNOOZE"; conversationId: string; until: string }
  | { type: "REPLY"; conversationId: string; message: string };
