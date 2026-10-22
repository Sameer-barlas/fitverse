import { useState, useEffect } from 'react';
import { X, Search, Plus, Check } from 'lucide-react';
import { getExercises } from '../../api/exerciseApi.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import Badge from '../ui/Badge.jsx';
import Spinner from '../ui/Spinner.jsx';

export default function ExercisePickerModal({
  isOpen,
  onClose,
  onSelectExercise,
  selectedExerciseIds = [],
}) {
  const [search, setSearch] = useState('');
  const [muscleGroup, setMuscleGroup] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    getExercises({
      q: debouncedSearch,
      muscleGroup,
      limit: 76,
    })
      .then((res) => setExercises(res.data || []))
      .catch(() => setExercises([]))
      .finally(() => setLoading(false));
  }, [isOpen, debouncedSearch, muscleGroup]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pick an exercise"
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-[#1E293B] bg-[#111827] text-[#F9FAFB] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#1E293B]">
          <h2 className="text-lg font-bold">Add Exercise to Session</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-[#9CA3AF] hover:bg-[#1F2937] hover:text-[#F9FAFB] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-[#1E293B] grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="sm:col-span-2 relative">
            <Search className="h-4 w-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercise name..."
              className="w-full rounded-xl bg-[#1F2937] border border-[#334155] pl-9 pr-3 py-2 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            />
          </div>
          <div>
            <select
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
              aria-label="Filter by muscle group"
              className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              <option value="">All Muscles</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="shoulders">Shoulders</option>
              <option value="arms">Arms</option>
              <option value="legs">Legs</option>
              <option value="core">Core</option>
              <option value="cardio">Cardio</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#1E293B]">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Spinner />
            </div>
          ) : exercises.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#9CA3AF]">
              No matching exercises found.
            </div>
          ) : (
            exercises.map((ex) => {
              const alreadyAdded = selectedExerciseIds.includes(ex.id);
              return (
                <div
                  key={ex.id}
                  className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#1F2937]/50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#F9FAFB]">{ex.name}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge variant="indigo">{ex.muscleGroup}</Badge>
                      <Badge variant={ex.level}>{ex.level}</Badge>
                      <span className="text-xs text-[#9CA3AF]">
                        {ex.trackingType === 'time' ? 'Timed' : 'Reps'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={alreadyAdded}
                    onClick={() => {
                      onSelectExercise(ex);
                      onClose();
                    }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                      alreadyAdded
                        ? 'bg-[#1F2937] text-[#9CA3AF] opacity-60 cursor-not-allowed'
                        : 'bg-[#10B981] text-[#0B0F17] hover:bg-[#059669]'
                    }`}
                  >
                    {alreadyAdded ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
