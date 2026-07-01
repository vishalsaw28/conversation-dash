import { useRef, useEffect } from "react";
import type { Conversation, FilterState } from "../types";
import { ConversationRow } from "./ConversationRow";

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  pendingActions: Set<string>;
  filters: FilterState;
  onFilterChange: (f: FilterState) => void;
  onSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  selectedId,
  pendingActions,
  filters,
  onFilterChange,
  onSelect,
}: ConversationListProps) {
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: / focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="w-80 shrink-0 flex flex-col border-r border-slate-800 bg-slate-900">
      {/* Search */}
      <div className="px-3 py-3 border-b border-slate-800">
        <div className="relative">
          <input
            ref={searchRef}
            type="search"
            placeholder="Search conversations…"
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-8 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            aria-label="Search conversations"
          />
          <span
            className="absolute left-2.5 top-2.5 text-slate-500 text-sm"
            aria-hidden
          >
            🔍
          </span>
          <kbd className="absolute right-2 top-2 text-[10px] text-slate-600 bg-slate-700 px-1 rounded hidden sm:block">
            /
          </kbd>
        </div>
      </div>

      {/* List */}
      <div
        className="flex-1 overflow-y-auto"
        role="list"
        aria-label="Conversations"
      >
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-slate-300 font-medium mb-1">Queue is clear</p>
            <p className="text-slate-500 text-sm">
              {filters.search
                ? `No conversations match "${filters.search}"`
                : "No open conversations match your filters."}
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div key={conv.id} role="listitem">
              <ConversationRow
                conversation={conv}
                isSelected={conv.id === selectedId}
                isPending={pendingActions.has(conv.id)}
                onClick={() => onSelect(conv.id)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
