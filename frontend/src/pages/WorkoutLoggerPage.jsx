import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { Plus, Save, ArrowLeft, Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import { createLog, getLogById, updateLog } from '../api/logApi.js';
import { getPlanById } from '../api/planApi.js';
import EntryEditor from '../components/logs/EntryEditor.jsx';
import ExercisePickerModal from '../components/logs/ExercisePickerModal.jsx';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import QuoteLoader from '../components/QuoteLoader.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

function getTodayLocalStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function WorkoutLoggerPage() {
  const { id: editLogId } = useParams();
  const isEditMode = Boolean(editLogId);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const prefillPlanId = searchParams.get('planId');
  const prefillDayNumber = Number(searchParams.get('day')) || null;

  const [date, setDate] = useState(getTodayLocalStr());
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [planDay, setPlanDay] = useState(null);
  const [entries, setEntries] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [loadingInit, setLoadingInit] = useState(Boolean(isEditMode || prefillPlanId));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Load existing log in edit mode
  useEffect(() => {
    if (!isEditMode) return;
    setLoadingInit(true);
    getLogById(editLogId)
      .then((res) => {
        const log = res.data.log;
        setDate(log.date);
        setTitle(log.title || '');
        setNotes(log.notes || '');
        if (log.planDay?.plan) {
          const planIdVal =
            typeof log.planDay.plan === 'object' ? log.planDay.plan.id : log.planDay.plan;
          setPlanDay({ plan: planIdVal, dayNumber: log.planDay.dayNumber });
        }
        setEntries(
          (log.entries || []).map((e) => ({
            exercise: e.exercise,
            notes: e.notes || '',
            sets: (e.sets || []).map((s) =>
              e.exercise?.trackingType === 'time'
                ? { durationSec: s.durationSec || 30 }
                : { reps: s.reps || 10, weightKg: s.weightKg ?? 0 },
            ),
          })),
        );
      })
      .catch((err) => setError(err.message || 'Failed to load workout session'))
      .finally(() => setLoadingInit(false));
  }, [isEditMode, editLogId]);

  // Pre-fill from plan day if ?planId=...&day=...
  useEffect(() => {
    if (isEditMode || !prefillPlanId || !prefillDayNumber) return;
    setLoadingInit(true);
    getPlanById(prefillPlanId)
      .then((res) => {
        const plan = res.data.plan;
        const matchedDay = (plan.days || []).find((d) => d.dayNumber === prefillDayNumber);
        if (!matchedDay) {
          toast.error('Plan day not found');
          return;
        }
        setTitle(`${plan.name.split('—')[0].trim()} — Day ${matchedDay.dayNumber}: ${matchedDay.title}`.slice(0, 80));
        setPlanDay({ plan: plan.id, dayNumber: matchedDay.dayNumber });

        const prefilledEntries = (matchedDay.exercises || [])
          .filter((item) => item.exercise && typeof item.exercise === 'object')
          .map((item) => {
            const ex = item.exercise;
            const count = item.sets || 3;
            const defaultSets = Array.from({ length: count }, () =>
              ex.trackingType === 'time'
                ? { durationSec: item.durationSec || 30 }
                : { reps: item.repsMin || item.repsMax || 10, weightKg: 0 },
            );
            return {
              exercise: ex,
              notes: '',
              sets: defaultSets,
            };
          });
        setEntries(prefilledEntries);
      })
      .catch((err) => setError(err.message || 'Failed to pre-fill from workout plan'))
      .finally(() => setLoadingInit(false));
  }, [isEditMode, prefillPlanId, prefillDayNumber]);

  const handleAddExercise = (exercise) => {
    if (entries.some((e) => e.exercise?.id === exercise.id)) {
      toast.error('Exercise already in this session');
      return;
    }
    const defaultSet =
      exercise.trackingType === 'time'
        ? { durationSec: 30 }
        : { reps: 10, weightKg: 0 };

    setEntries((prev) => [
      ...prev,
      {
        exercise,
        notes: '',
        sets: [defaultSet],
      },
    ]);
  };

  const handleUpdateEntry = (idx, updatedEntry) => {
    setEntries((prev) => prev.map((item, i) => (i === idx ? updatedEntry : item)));
  };

  const handleRemoveEntry = (idx) => {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (entries.length === 0) {
      setError('Please add at least one exercise to your workout session.');
      return;
    }

    const payload = {
      date,
      title: title.trim() || undefined,
      notes: notes.trim() || undefined,
      ...(planDay ? { planDay } : {}),
      entries: entries.map((entry) => ({
        exercise: entry.exercise.id,
        notes: entry.notes?.trim() || undefined,
        sets: entry.sets.map((s) =>
          entry.exercise.trackingType === 'time'
            ? { durationSec: Number(s.durationSec) }
            : { reps: Number(s.reps), weightKg: Number(s.weightKg ?? 0) },
        ),
      })),
    };

    setSubmitting(true);
    try {
      if (isEditMode) {
        await updateLog(editLogId, payload);
        toast.success('Workout updated');
        navigate(`/logs/${editLogId}`);
      } else {
        const res = await createLog(payload);
        toast.success('Workout logged!');
        navigate(`/logs/${res.data.log.id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to save workout session');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInit) {
    return <QuoteLoader statusText="Initializing workout logger..." />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/logs"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF] hover:text-[#F9FAFB] mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Workout History</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB]">
            {isEditMode ? 'Edit Workout Session' : 'Log Workout Session'}
          </h1>
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="workout-date"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5"
              >
                Workout Date
              </label>
              <input
                id="workout-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3.5 py-2.5 text-sm text-[#F9FAFB] font-mono-num focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="workout-title"
                className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5"
              >
                Session Title
              </label>
              <input
                id="workout-title"
                type="text"
                maxLength={80}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Full Body Day 1 or Upper Body Push"
                className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3.5 py-2.5 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="workout-notes"
              className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] mb-1.5"
            >
              Session Notes (Optional)
            </label>
            <textarea
              id="workout-notes"
              rows={2}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did the session feel? Any energy or recovery notes..."
              className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3.5 py-2 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            />
          </div>
        </Card>

        {/* Entries list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#F9FAFB]">
              Exercises ({entries.length})
            </h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setPickerOpen(true)}
            >
              <Plus className="h-4 w-4" />
              <span>Add Exercise</span>
            </Button>
          </div>

          {entries.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#334155] bg-[#111827]/50 p-10 text-center space-y-3">
              <Dumbbell className="h-8 w-8 text-[#9CA3AF] mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#F9FAFB]">
                  No exercises in this session yet
                </p>
                <p className="text-xs text-[#9CA3AF]">
                  Add exercises from the 76-exercise library to log your sets, reps, or timed holds.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setPickerOpen(true)}
              >
                <Plus className="h-4 w-4" />
                <span>Pick Exercise</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry, idx) => (
                <EntryEditor
                  key={entry.exercise?.id || idx}
                  entry={entry}
                  entryIndex={idx}
                  onChange={handleUpdateEntry}
                  onRemoveEntry={handleRemoveEntry}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/logs')}
          >
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            <Save className="h-4 w-4" />
            <span>{isEditMode ? 'Update Workout' : 'Save Workout'}</span>
          </Button>
        </div>
      </form>

      <ExercisePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectExercise={handleAddExercise}
        selectedExerciseIds={entries.map((e) => e.exercise?.id).filter(Boolean)}
      />
    </div>
  );
}
