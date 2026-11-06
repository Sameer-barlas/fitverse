import { Link } from 'react-router-dom';
import { Calendar, Dumbbell, ArrowRight, Layers } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

export default function LogCard({ log }) {
  const entries = log.entries || [];
  let totalSets = 0;
  let totalVolumeKg = 0;

  entries.forEach((entry) => {
    (entry.sets || []).forEach((s) => {
      totalSets += 1;
      if (s.reps && s.weightKg) {
        totalVolumeKg += s.reps * s.weightKg;
      }
    });
  });

  return (
    <Link
      to={`/logs/${log.id}`}
      className="block rounded-2xl border border-white/5 hover:border-[#10B981]/30 transition-all duration-200 hover:shadow-lg hover:shadow-[#10B981]/5 group overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0d2318 0%, #0a1612 100%)' }}
    >
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] font-mono-num">
                <Calendar className="h-3.5 w-3.5" />
                {log.date}
              </span>
              {log.planDay?.dayNumber && (
                <Badge variant="indigo">Plan Day {log.planDay.dayNumber}</Badge>
              )}
            </div>
            <h3 className="text-base font-bold text-[#F9FAFB] group-hover:text-[#10B981] transition-colors truncate">
              {log.title || 'Workout Session'}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs text-[#9CA3AF] font-mono-num shrink-0">
            <div className="flex items-center gap-1.5">
              <Dumbbell className="h-4 w-4 text-[#10B981]" />
              <span>{entries.length} exercises</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-[#6366F1]" />
              <span>{totalSets} sets</span>
            </div>
            {totalVolumeKg > 0 && (
              <div className="font-semibold text-[#F9FAFB]">
                {Math.round(totalVolumeKg).toLocaleString()} kg
              </div>
            )}
            <ArrowRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#10B981] transition-colors" />
          </div>
        </div>

        {entries.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
            {entries.map((entry, idx) => {
              const name =
                typeof entry.exercise === 'object' ? entry.exercise?.name : 'Exercise';
              return (
                <Badge key={idx} variant="default">
                  {name} ({entry.sets?.length || 0} sets)
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </Link>
  );
}
