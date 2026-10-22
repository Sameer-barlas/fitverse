import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Dumbbell, ChevronLeft, ChevronRight } from 'lucide-react';
import { getExercises, getExerciseFilters } from '../api/exerciseApi.js';
import { useDebounce } from '../hooks/useDebounce.js';
import ExerciseFilters from '../components/exercises/ExerciseFilters.jsx';
import ExerciseCard from '../components/exercises/ExerciseCard.jsx';
import ExerciseDetailModal from '../components/exercises/ExerciseDetailModal.jsx';
import QuoteLoader from '../components/QuoteLoader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';
import Button from '../components/ui/Button.jsx';

export default function ExercisesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchInput, 300);

  const muscleGroup = searchParams.get('muscleGroup') || '';
  const category = searchParams.get('category') || '';
  const equipment = searchParams.get('equipment') || '';
  const level = searchParams.get('level') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = 12;

  const [filterOptions, setFilterOptions] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 12, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const updateParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);
      if (value) {
        next.set(key, String(value));
      } else {
        next.delete(key);
      }
      if (key !== 'page') {
        next.set('page', '1');
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (debouncedSearch !== currentQ) {
      updateParam('q', debouncedSearch);
    }
  }, [debouncedSearch, searchParams, updateParam]);

  useEffect(() => {
    getExerciseFilters()
      .then((res) => setFilterOptions(res.data))
      .catch(() => {
        // Non-fatal fallback handled in ExerciseFilters
      });
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getExercises({
        q: debouncedSearch,
        muscleGroup,
        category,
        equipment,
        level,
        page,
        limit,
      });
      setExercises(res.data || []);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err) {
      setError(err.message || 'Failed to load exercises');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, muscleGroup, category, equipment, level, page, limit]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({}, { replace: true });
  };

  const hasActiveFilters = Boolean(
    searchInput || muscleGroup || category || equipment || level,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F9FAFB]">
            Exercise Library
          </h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            Browse all 76 curated home-friendly exercises with step-by-step form guides.
          </p>
        </div>
        <div className="text-xs font-mono-num text-[#9CA3AF]">
          Showing <span className="text-[#F9FAFB] font-semibold">{exercises.length}</span> of{' '}
          <span className="text-[#F9FAFB] font-semibold">{meta.total}</span> exercises
        </div>
      </div>

      <ExerciseFilters
        searchQuery={searchInput}
        onSearchChange={setSearchInput}
        muscleGroup={muscleGroup}
        onMuscleGroupChange={(v) => updateParam('muscleGroup', v)}
        category={category}
        onCategoryChange={(v) => updateParam('category', v)}
        equipment={equipment}
        onEquipmentChange={(v) => updateParam('equipment', v)}
        level={level}
        onLevelChange={(v) => updateParam('level', v)}
        filterOptions={filterOptions}
        onClear={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {error && <ErrorBanner message={error} onRetry={fetchList} />}

      {loading ? (
        <QuoteLoader statusText="Loading exercise library..." />
      ) : exercises.length === 0 ? (
        <EmptyState
          icon={Dumbbell}
          title="No exercises match your filters"
          description="Try adjusting your search query or clearing the active muscle, equipment, or difficulty filters."
          action={
            hasActiveFilters ? (
              <Button variant="secondary" onClick={handleClearFilters}>
                Reset All Filters
              </Button>
            ) : null
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {exercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onSelect={(item) => setSelectedExercise(item)}
              />
            ))}
          </div>

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
                  onClick={() => updateParam('page', meta.page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => updateParam('page', meta.page + 1)}
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ExerciseDetailModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
}
