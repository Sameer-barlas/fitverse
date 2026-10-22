import { Plus, Trash2, Copy } from 'lucide-react';
import SetRow from './SetRow.jsx';
import Badge from '../ui/Badge.jsx';

export default function EntryEditor({
  entry,
  entryIndex,
  onChange,
  onRemoveEntry,
}) {
  const { exercise, sets, notes } = entry;
  const trackingType = exercise?.trackingType || 'reps';

  const handleSetChange = (setIdx, updatedSet) => {
    const nextSets = sets.map((s, idx) => (idx === setIdx ? updatedSet : s));
    onChange(entryIndex, { ...entry, sets: nextSets });
  };

  const handleAddSet = () => {
    if (sets.length >= 20) return;
    const lastSet = sets[sets.length - 1];
    const newSet =
      trackingType === 'time'
        ? { durationSec: lastSet?.durationSec || 30 }
        : { reps: lastSet?.reps || 10, weightKg: lastSet?.weightKg ?? 0 };
    onChange(entryIndex, { ...entry, sets: [...sets, newSet] });
  };

  const handleRemoveSet = (setIdx) => {
    if (sets.length <= 1) return;
    const nextSets = sets.filter((_, idx) => idx !== setIdx);
    onChange(entryIndex, { ...entry, sets: nextSets });
  };

  return (
    <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3 border-b border-[#1E293B] pb-3">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-bold text-[#F9FAFB]">
              {exercise?.name || 'Exercise'}
            </h3>
            {exercise?.muscleGroup && (
              <Badge variant="indigo">{exercise.muscleGroup}</Badge>
            )}
            <Badge variant="default">
              {trackingType === 'time' ? 'Timed (sec)' : 'Reps & Weight'}
            </Badge>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onRemoveEntry(entryIndex)}
          aria-label={`Remove ${exercise?.name || 'exercise'}`}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#9CA3AF] hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-colors cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
          <span>Remove</span>
        </button>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-12 gap-2 sm:gap-3 text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] px-1">
        <div className="col-span-2 sm:col-span-1">Set</div>
        {trackingType === 'time' ? (
          <div className="col-span-8 sm:col-span-9">Duration (Seconds)</div>
        ) : (
          <>
            <div className="col-span-4 sm:col-span-5">Reps</div>
            <div className="col-span-4 sm:col-span-4">Weight (0 = Bodyweight)</div>
          </>
        )}
        <div className="col-span-2 text-right">Action</div>
      </div>

      {/* Set Rows */}
      <div className="divide-y divide-[#1E293B]/60">
        {sets.map((s, idx) => (
          <SetRow
            key={idx}
            setIndex={idx}
            setItem={s}
            trackingType={trackingType}
            onChange={handleSetChange}
            onRemove={handleRemoveSet}
            canRemove={sets.length > 1}
          />
        ))}
      </div>

      {/* Add Set + Entry Notes */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddSet}
            disabled={sets.length >= 20}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F2937] hover:bg-[#334155] px-3 py-2 text-xs font-semibold text-[#10B981] transition-colors cursor-pointer disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Set</span>
          </button>
          <button
            type="button"
            onClick={handleAddSet}
            disabled={sets.length >= 20}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F2937]/60 hover:bg-[#334155] px-3 py-2 text-xs font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors cursor-pointer disabled:opacity-40"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>Duplicate Last Set</span>
          </button>
        </div>

        <div className="flex-1 sm:max-w-xs">
          <label className="sr-only">Exercise notes</label>
          <input
            type="text"
            maxLength={200}
            value={notes || ''}
            onChange={(e) => onChange(entryIndex, { ...entry, notes: e.target.value })}
            placeholder="Optional exercise note..."
            className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-1.5 text-xs text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          />
        </div>
      </div>
    </div>
  );
}
