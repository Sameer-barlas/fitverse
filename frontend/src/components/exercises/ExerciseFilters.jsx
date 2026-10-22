import { Search, X } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function ExerciseFilters({
  searchQuery,
  onSearchChange,
  muscleGroup,
  onMuscleGroupChange,
  category,
  onCategoryChange,
  equipment,
  onEquipmentChange,
  level,
  onLevelChange,
  filterOptions,
  onClear,
  hasActiveFilters,
}) {
  const muscleGroups = filterOptions?.muscleGroups || [
    'chest',
    'back',
    'shoulders',
    'arms',
    'legs',
    'core',
    'cardio',
  ];
  const categories = filterOptions?.categories || [];
  const equipments = filterOptions?.equipments || [];
  const levels = filterOptions?.levels || ['beginner', 'intermediate', 'advanced'];

  return (
    <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Search Input */}
        <div className="sm:col-span-2 relative">
          <label htmlFor="exercise-search" className="sr-only">
            Search exercises
          </label>
          <Search className="h-4 w-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="exercise-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search 76 exercises (e.g. Squat, Plank, Pushup)..."
            className="w-full rounded-xl bg-[#1F2937] border border-[#334155] pl-10 pr-3.5 py-2.5 text-sm text-[#F9FAFB] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          />
        </div>

        {/* Muscle Group */}
        <div>
          <label htmlFor="filter-muscle" className="sr-only">
            Muscle Group
          </label>
          <select
            id="filter-muscle"
            value={muscleGroup}
            onChange={(e) => onMuscleGroupChange(e.target.value)}
            className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          >
            <option value="">All Muscles</option>
            {muscleGroups.map((m) => (
              <option key={m} value={m}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment */}
        <div>
          <label htmlFor="filter-equipment" className="sr-only">
            Equipment
          </label>
          <select
            id="filter-equipment"
            value={equipment}
            onChange={(e) => onEquipmentChange(e.target.value)}
            className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          >
            <option value="">All Equipment</option>
            {equipments.map((eq) => (
              <option key={eq} value={eq}>
                {eq.charAt(0).toUpperCase() + eq.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Level */}
        <div>
          <label htmlFor="filter-level" className="sr-only">
            Difficulty Level
          </label>
          <select
            id="filter-level"
            value={level}
            onChange={(e) => onLevelChange(e.target.value)}
            className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          >
            <option value="">All Levels</option>
            {levels.map((lv) => (
              <option key={lv} value={lv}>
                {lv.charAt(0).toUpperCase() + lv.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="filter-category" className="sr-only">
            Category
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2.5 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-end pt-1">
          <Button variant="ghost" size="sm" onClick={onClear}>
            <X className="h-4 w-4" />
            <span>Clear Filters</span>
          </Button>
        </div>
      )}
    </div>
  );
}
