export function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-950 text-center px-8">
      <div className="text-5xl mb-4 opacity-60">📬</div>
      <h2 className="text-lg font-semibold text-slate-300 mb-2">
        Select a conversation
      </h2>
      <p className="text-slate-500 text-sm max-w-xs">
        Pick a conversation from the list to read the thread and take action.
      </p>
      <p className="text-slate-600 text-xs mt-4">
        Tip: press{" "}
        <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">
          /
        </kbd>{" "}
        to search
      </p>
    </div>
  );
}
