import { Dumbbell, Clock, Repeat } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export default function ExerciseCard({ exercise, onSelect }) {
  const thumbUrl =
    exercise.imageUrls?.[0] ||
    (exercise.images?.[0] ? `/exercise-images/${exercise.images[0]}` : null);

  return (
    <button
      type="button"
      onClick={() => onSelect(exercise)}
      className="group text-left rounded-2xl border border-[#1E293B] bg-[#111827] hover:border-[#10B981]/50 overflow-hidden transition-all flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#10B981]"
    >
      <div className="relative h-44 w-full bg-[#1F2937] overflow-hidden">
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={exercise.name}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[#9CA3AF]">
            <Dumbbell className="h-8 w-8" />
          </div>
        )}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          {exercise.lowImpact && <Badge variant="emerald">Low Impact</Badge>}
          <Badge variant={exercise.level}>{exercise.level}</Badge>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="text-base font-semibold text-[#F9FAFB] group-hover:text-[#10B981] transition-colors line-clamp-1">
            {exercise.name}
          </h3>
          <p className="mt-1 text-xs text-[#9CA3AF] capitalize">
            {exercise.muscleGroup} · {exercise.equipment || 'body only'}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#1E293B] text-xs text-[#9CA3AF]">
          <span className="capitalize">{exercise.category}</span>
          <span className="inline-flex items-center gap-1 font-medium text-[#F9FAFB]">
            {exercise.trackingType === 'time' ? (
              <>
                <Clock className="h-3.5 w-3.5 text-[#38BDF8]" />
                <span>Timed</span>
              </>
            ) : (
              <>
                <Repeat className="h-3.5 w-3.5 text-[#10B981]" />
                <span>Reps</span>
              </>
            )}
          </span>
        </div>
      </div>
    </button>
  );
}
