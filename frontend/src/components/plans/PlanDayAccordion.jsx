import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Play, Dumbbell, Clock, Repeat } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { getExerciseImageUrl } from '../../utils/imageUrl.js';

function formatPrescription(item) {
  if (item.durationSec) {
    if (item.durationSec >= 60 && item.durationSec % 60 === 0) {
      return `${item.sets} × ${item.durationSec / 60} min`;
    }
    return `${item.sets} × ${item.durationSec}s`;
  }
  if (item.repsMin && item.repsMax && item.repsMin !== item.repsMax) {
    return `${item.sets} × ${item.repsMin}–${item.repsMax} reps`;
  }
  const reps = item.repsMax || item.repsMin || 10;
  return `${item.sets} × ${reps} reps`;
}

export default function PlanDayAccordion({
  day,
  planId,
  defaultOpen = false,
  onSelectExercise,
}) {
  const [open, setOpen] = useState(defaultOpen);
  const navigate = useNavigate();

  const handleLogDay = (e) => {
    e.stopPropagation();
    navigate(`/logs/new?planId=${planId}&day=${day.dayNumber}`);
  };

  return (
    <div className="rounded-2xl border border-[#1E293B] bg-[#111827] overflow-hidden">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((prev) => !prev);
          }
        }}
        className="w-full p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 hover:bg-[#1F2937]/40 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981] font-bold font-mono-num">
            D{day.dayNumber}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F9FAFB]">{day.title}</h3>
            <p className="text-xs text-[#9CA3AF]">
              Focus: <span className="text-[#F9FAFB] capitalize">{day.focus}</span> ·{' '}
              <span className="font-mono-num">{day.exercises?.length || 0} exercises</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleLogDay}>
            <Play className="h-3.5 w-3.5" />
            <span>Log This Day</span>
          </Button>
          {open ? (
            <ChevronUp className="h-5 w-5 text-[#9CA3AF]" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#9CA3AF]" />
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-[#1E293B] divide-y divide-[#1E293B]">
          {(day.exercises || []).map((item) => {
            const ex = item.exercise && typeof item.exercise === 'object' ? item.exercise : null;
            const rawThumb =
              ex?.imageUrls?.[0] ||
              (ex?.images?.[0] ? `/exercise-images/${ex.images[0]}` : null);
            const thumb = getExerciseImageUrl(rawThumb);

            return (
              <div
                key={item.order}
                onClick={() => ex && onSelectExercise && onSelectExercise(ex)}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#1F2937]/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-mono-num text-[#9CA3AF] w-5 text-center">
                    #{item.order}
                  </span>
                  <div className="h-14 w-16 rounded-xl bg-[#1F2937] overflow-hidden shrink-0 flex items-center justify-center">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={ex?.name || 'Exercise'}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Dumbbell className="h-5 w-5 text-[#9CA3AF]" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#F9FAFB] hover:text-[#10B981] transition-colors">
                      {ex?.name || 'Exercise'}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {ex?.muscleGroup && <Badge variant="indigo">{ex.muscleGroup}</Badge>}
                      {ex?.level && <Badge variant={ex.level}>{ex.level}</Badge>}
                      {ex?.lowImpact && <Badge variant="emerald">Low Impact</Badge>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pl-8 sm:pl-0">
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#F9FAFB] font-mono-num">
                      {item.durationSec ? (
                        <Clock className="h-4 w-4 text-[#38BDF8]" />
                      ) : (
                        <Repeat className="h-4 w-4 text-[#10B981]" />
                      )}
                      <span>{formatPrescription(item)}</span>
                    </div>
                    <p className="text-xs text-[#9CA3AF] font-mono-num">
                      Rest: {item.restSec}s
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
