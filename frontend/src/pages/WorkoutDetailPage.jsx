import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Edit3, Trash2, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import { getLogById, deleteLog } from '../api/logApi.js';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import QuoteLoader from '../components/QuoteLoader.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchLog = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getLogById(id);
      setLog(res.data.log);
    } catch (err) {
      setError(err.message || 'Failed to load workout session');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteLog(id);
      toast.success('Workout deleted');
      navigate('/logs', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Failed to delete workout');
      setDeleting(false);
    }
  };

  if (loading) {
    return <QuoteLoader statusText="Loading workout session..." />;
  }

  if (error || !log) {
    return (
      <div className="space-y-4">
        <Link
          to="/logs"
          className="inline-flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#F9FAFB]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Workout History</span>
        </Link>
        <ErrorBanner message={error || 'Workout not found'} onRetry={fetchLog} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/logs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9CA3AF] hover:text-[#F9FAFB]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to History</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link to={`/logs/${log.id}/edit`}>
            <Button variant="secondary" size="sm">
              <Edit3 className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </Link>

          {!confirmDelete ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-1">
              <span className="text-xs text-[#FCA5A5]">Confirm delete?</span>
              <Button
                variant="danger"
                size="sm"
                loading={deleting}
                onClick={handleDelete}
              >
                Yes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(false)}
              >
                No
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] font-mono-num">
            <Calendar className="h-4 w-4" />
            {log.date}
          </span>
          {log.planDay?.dayNumber && (
            <Badge variant="indigo">Plan Day {log.planDay.dayNumber}</Badge>
          )}
        </div>

        <h1 className="text-2xl font-bold text-[#F9FAFB]">
          {log.title || 'Workout Session'}
        </h1>

        {log.notes && (
          <p className="text-sm text-[#9CA3AF] border-t border-[#1E293B] pt-3">
            {log.notes}
          </p>
        )}
      </Card>

      <div className="space-y-4">
        {(log.entries || []).map((entry, idx) => {
          const ex = typeof entry.exercise === 'object' ? entry.exercise : null;
          const isTime = ex?.trackingType === 'time';

          return (
            <Card key={idx} className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981]">
                    <Dumbbell className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#F9FAFB]">
                      {ex?.name || 'Exercise'}
                    </h3>
                    {entry.notes && (
                      <p className="text-xs text-[#9CA3AF]">{entry.notes}</p>
                    )}
                  </div>
                </div>
                {ex?.muscleGroup && <Badge variant="indigo">{ex.muscleGroup}</Badge>}
              </div>

              <div className="divide-y divide-[#1E293B]/60">
                {(entry.sets || []).map((s, sIdx) => (
                  <div
                    key={sIdx}
                    className="py-2 flex items-center justify-between text-sm font-mono-num"
                  >
                    <span className="text-xs text-[#9CA3AF]">Set #{sIdx + 1}</span>
                    {isTime ? (
                      <span className="font-semibold text-[#F9FAFB]">
                        {s.durationSec} sec
                      </span>
                    ) : (
                      <span className="font-semibold text-[#F9FAFB]">
                        {s.reps} reps × {s.weightKg > 0 ? `${s.weightKg} kg` : 'Bodyweight'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
