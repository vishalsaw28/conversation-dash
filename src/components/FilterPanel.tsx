import type {
  FilterState,
  SortState,
  Status,
  Priority,
  Channel,
} from "../types";

interface FilterPanelProps {
  filters: FilterState;
  sort: SortState;
  onFilterChange: (filters: FilterState) => void;
  onSortChange: (sort: SortState) => void;
  totalCount: number;
  visibleCount: number;
}

function FilterChip({
  label,
  active,
  onClick,
  colorClass = "",
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  colorClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded text-xs font-medium transition-all border cursor-pointer ${
        active
          ? `${colorClass || "bg-indigo-600 border-indigo-500 text-white"}`
          : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "waiting", label: "Waiting" },
  { value: "in_progress", label: "In Progress" },
  { value: "snoozed", label: "Snoozed" },
  { value: "resolved", label: "Resolved" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string; color: string }[] = [
  {
    value: "critical",
    label: "Critical",
    color: "bg-red-950 border-red-700 text-red-300",
  },
  {
    value: "high",
    label: "High",
    color: "bg-orange-950 border-orange-700 text-orange-300",
  },
  {
    value: "medium",
    label: "Medium",
    color: "bg-yellow-950 border-yellow-700 text-yellow-300",
  },
  {
    value: "low",
    label: "Low",
    color: "bg-slate-700 border-slate-600 text-slate-300",
  },
];

const CHANNEL_OPTIONS: { value: Channel; label: string }[] = [
  { value: "chat", label: "💬 Chat" },
  { value: "email", label: "📧 Email" },
  { value: "whatsapp", label: "📱 WhatsApp" },
  { value: "voice", label: "📞 Voice" },
];

export function FilterPanel({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  totalCount,
  visibleCount,
}: FilterPanelProps) {
  const toggleStatus = (status: Status) => {
    const next = filters.status.includes(status)
      ? filters.status.filter((s) => s !== status)
      : [...filters.status, status];
    onFilterChange({ ...filters, status: next });
  };

  const togglePriority = (priority: Priority) => {
    const next = filters.priority.includes(priority)
      ? filters.priority.filter((p) => p !== priority)
      : [...filters.priority, priority];
    onFilterChange({ ...filters, priority: next });
  };

  const toggleChannel = (channel: Channel) => {
    const next = filters.channel.includes(channel)
      ? filters.channel.filter((c) => c !== channel)
      : [...filters.channel, channel];
    onFilterChange({ ...filters, channel: next });
  };

  const hasActiveFilters =
    filters.priority.length > 0 ||
    filters.channel.length > 0 ||
    filters.assignedToMe ||
    filters.csatRisk ||
    filters.search;

  const clearAll = () => {
    onFilterChange({
      status: ["waiting", "in_progress"],
      priority: [],
      channel: [],
      assignedToMe: false,
      csatRisk: false,
      search: "",
    });
  };

  return (
    <aside className="w-56 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg font-bold text-white tracking-tight">
            Inbox
          </span>
          <span className="ml-auto text-xs text-slate-500 tabular-nums">
            {visibleCount}/{totalCount}
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="px-4 py-4 space-y-5 flex-1">
        {/* Sort */}
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Sort by
          </p>
          <select
            value={`${sort.field}:${sort.direction}`}
            onChange={(e) => {
              const [field, direction] = e.target.value.split(":") as [
                SortState["field"],
                SortState["direction"],
              ];
              onSortChange({ field, direction });
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded text-sm text-slate-200 px-2 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="priority:asc">Priority (Critical first)</option>
            <option value="urgencyScore:desc">Urgency score</option>
            <option value="waitTime:asc">Wait time (longest)</option>
            <option value="updatedAt:desc">Recently updated</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Status
          </p>
          <div className="flex flex-wrap gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={filters.status.includes(opt.value)}
                onClick={() => toggleStatus(opt.value)}
              />
            ))}
          </div>
        </div>

        {/* Priority */}
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Priority
          </p>
          <div className="flex flex-wrap gap-1.5">
            {PRIORITY_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={filters.priority.includes(opt.value)}
                onClick={() => togglePriority(opt.value)}
                colorClass={opt.color}
              />
            ))}
          </div>
        </div>

        {/* Channel */}
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Channel
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CHANNEL_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                label={opt.label}
                active={filters.channel.includes(opt.value)}
                onClick={() => toggleChannel(opt.value)}
              />
            ))}
          </div>
        </div>

        {/* Quick filters */}
        <div>
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Quick filters
          </p>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.assignedToMe}
                onChange={(e) =>
                  onFilterChange({ ...filters, assignedToMe: e.target.checked })
                }
                className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                Assigned to me
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.csatRisk}
                onChange={(e) =>
                  onFilterChange({ ...filters, csatRisk: e.target.checked })
                }
                className="rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900"
              />
              <span className="text-sm text-slate-400 group-hover:text-slate-200 transition-colors">
                CSAT risk only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Agent badge */}
      <div className="px-4 py-3 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            PS
          </div>
          <div>
            <p className="text-xs font-medium text-slate-200">Priya S.</p>
            <p className="text-[10px] text-emerald-400">● Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
