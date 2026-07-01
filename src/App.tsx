import { useConversations } from "./hooks/useConversations";
import { FilterPanel } from "./components/FilterPanel";
import { ConversationList } from "./components/ConversationList";
import { ConversationDetail } from "./components/ConversationDetail";
import { EmptyState } from "./components/EmptyState";
import { ToastContainer, useToast } from "./components/Toast";

function LoadingScreen() {
  return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl mb-4 animate-pulse">📬</div>
        <p className="text-slate-400 text-sm">Loading conversations…</p>
      </div>
    </div>
  );
}

function ErrorScreen({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center max-w-sm px-6">
        <div className="text-3xl mb-4">⚠️</div>
        <p className="text-slate-200 font-semibold mb-1">
          Couldn't load conversations
        </p>
        <p className="text-slate-500 text-sm mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const {
    visibleConversations,
    allConversations,
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
    actions,
    refetch,
  } = useConversations();

  const { toasts, addToast, removeToast } = useToast();

  const toast = (type: "success" | "error" | "info", message: string) => {
    addToast(type, message);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} onRetry={refetch} />;

  return (
    <div className="h-screen flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <FilterPanel
        filters={filters}
        sort={sort}
        onFilterChange={setFilters}
        onSortChange={setSort}
        totalCount={
          allConversations.filter((c) => c.status !== "resolved").length
        }
        visibleCount={visibleConversations.length}
      />
      <ConversationList
        conversations={visibleConversations}
        selectedId={selectedId}
        pendingActions={pendingActions}
        filters={filters}
        onFilterChange={setFilters}
        onSelect={setSelectedId}
      />
      {selectedConversation ? (
        <ConversationDetail
          conversation={selectedConversation}
          isPending={pendingActions.has(selectedConversation.id)}
          onResolve={actions.resolve}
          onAssign={actions.assign}
          onSnooze={actions.snooze}
          onReply={actions.reply}
          onToast={toast}
        />
      ) : (
        <EmptyState />
      )}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}
