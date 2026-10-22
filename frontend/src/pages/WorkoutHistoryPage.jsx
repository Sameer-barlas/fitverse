import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ClipboardList, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getLogs } from '../api/logApi.js';
import LogCard from '../components/logs/LogCard.jsx';
import Button from '../components/ui/Button.jsx';
import QuoteLoader from '../components/QuoteLoader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

export default function WorkoutHistoryPage() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getLogs({ from, to, page, limit });
      setLogs(res.data || []);
      if (res.meta) setMeta(res.meta);
    } catch (err) {
      setError(err.message || 'Failed to load workout history');
    } finally {
      setLoading(false);
    }
  }, [from, to, page, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleClearDates = () => {
    setFrom('');
    setTo('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F9FAFB]">
            Workout History
          </h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            Inspect, filter, or edit your completed training sessions.
          </p>
        </div>

        <Link to="/logs/new">
          <Button>
            <Plus className="h-4 w-4" />
            <span>Log Workout</span>
          </Button>
        </Link>
      </div>

      {/* Date Filter Bar */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-4 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="filter-from" className="block text-xs text-[#9CA3AF] mb-1">
            From Date
          </label>
          <input
            id="filter-from"
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setPage(1);
            }}
            className="rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2 text-sm text-[#F9FAFB] font-mono-num focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          />
        </div>

        <div>
          <label htmlFor="filter-to" className="block text-xs text-[#9CA3AF] mb-1">
            To Date
          </label>
          <input
            id="filter-to"
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setPage(1);
            }}
            className="rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2 text-sm text-[#F9FAFB] font-mono-num focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          />
        </div>

        {(from || to) && (
          <Button variant="ghost" size="sm" onClick={handleClearDates}>
            <X className="h-4 w-4" />
            <span>Clear Dates</span>
          </Button>
        )}

        <div className="ml-auto text-xs text-[#9CA3AF] font-mono-num">
          Total sessions: <span className="text-[#F9FAFB] font-semibold">{meta.total}</span>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={fetchLogs} />}

      {loading ? (
        <QuoteLoader statusText="Retrieving workout history..." />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No workouts logged yet"
          description={
            from || to
              ? 'No workout sessions match the selected date range.'
              : 'Start tracking your sets, reps, and personal records by logging your first session.'
          }
          action={
            <Link to="/logs/new">
              <Button>
                <Plus className="h-4 w-4" />
                <span>Log Your First Workout</span>
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <LogCard key={log.id} log={log} />
          ))}

          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#1E293B] pt-4">
              <p className="text-xs text-[#9CA3AF] font-mono-num">
                Page {meta.page} of {meta.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={meta.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
