import { useState, useEffect, useCallback } from "react";
import type { Conversation, FilterState, SortState } from "../types";
import { filterConversations, sortConversations } from "../utils/conversation";

const DEFAULT_FILTERS: FilterState = {
  status: ["waiting", "in_progress"],
  priority: [],
  channel: [],
  assignedToMe: false,
  csatRisk: false,
  search: "",
};

const DEFAULT_SORT: SortState = { field: "priority", direction: "asc" };

type ActionResult =
  | { ok: true; conversation: Conversation }
  | { ok: false; error: string };

export function useConversations() {
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pendingActions, setPendingActions] = useState<Set<string>>(new Set());

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) throw new Error("Failed to load conversations");
      const data = (await res.json()) as Conversation[];
      setAllConversations(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchConversations();
  }, [fetchConversations]);

  const visibleConversations = sortConversations(
    filterConversations(allConversations, filters),
    sort,
  );

  const selectedConversation =
    allConversations.find((c) => c.id === selectedId) ?? null;

  const updateConversation = (updated: Conversation) => {
    setAllConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c)),
    );
  };

  const withPending = async (
    id: string,
    action: () => Promise<ActionResult>,
  ): Promise<ActionResult> => {
    setPendingActions((s) => new Set(s).add(id));
    const result = await action();
    setPendingActions((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
    if (result.ok) updateConversation(result.conversation);
    return result;
  };

  const resolve = (id: string) =>
    withPending(id, async () => {
      const res = await fetch(`/api/conversations/${id}/resolve`, {
        method: "PATCH",
      });
      const data = (await res.json()) as Conversation | { error: string };
      if (!res.ok)
        return { ok: false as const, error: (data as { error: string }).error };
      return { ok: true as const, conversation: data as Conversation };
    });

  const assign = (id: string, agentId: string) =>
    withPending(id, async () => {
      const res = await fetch(`/api/conversations/${id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId }),
      });
      const data = (await res.json()) as Conversation | { error: string };
      if (!res.ok)
        return { ok: false as const, error: (data as { error: string }).error };
      return { ok: true as const, conversation: data as Conversation };
    });

  const snooze = (id: string, until: string) =>
    withPending(id, async () => {
      const res = await fetch(`/api/conversations/${id}/snooze`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ until }),
      });
      const data = (await res.json()) as Conversation | { error: string };
      if (!res.ok)
        return { ok: false as const, error: (data as { error: string }).error };
      return { ok: true as const, conversation: data as Conversation };
    });

  const reply = (id: string, message: string) =>
    withPending(id, async () => {
      const res = await fetch(`/api/conversations/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = (await res.json()) as Conversation | { error: string };
      if (!res.ok)
        return { ok: false as const, error: (data as { error: string }).error };
      return { ok: true as const, conversation: data as Conversation };
    });

  return {
    allConversations,
    visibleConversations,
    loading,
    error,
    filters,
    setFilters,
    sort,
    setSort,
    selectedId,
    setSelectedId,
    selectedConversation,
    pendingActions,
    actions: { resolve, assign, snooze, reply },
    refetch: fetchConversations,
  };
}
