import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Sparkles } from 'lucide-react';
import Badge from '../ui/Badge.jsx';

const AGE_BAND_LABELS = {
  adult: 'Ages 18–39',
  midlife: 'Ages 40–54',
  senior: 'Ages 55–80',
};

export default function PlanCard({ plan, isRecommended = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
        isRecommended
          ? 'border-[#10B981] bg-[#10B981]/5 shadow-lg shadow-[#10B981]/5'
          : 'border-[#1E293B] bg-[#111827] hover:border-[#334155]'
      }`}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={plan.bmiCategory}>{plan.bmiCategory}</Badge>
            <Badge variant={plan.experienceLevel}>{plan.experienceLevel}</Badge>
            <Badge variant="indigo">{AGE_BAND_LABELS[plan.ageBand] || plan.ageBand}</Badge>
          </div>
          {isRecommended && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#10B981]">
              <Sparkles className="h-3.5 w-3.5" />
              Matched for You
            </span>
          )}
        </div>

        <div>
          <h3 className="text-base font-bold text-[#F9FAFB]">{plan.name}</h3>
          <p className="mt-1 text-xs font-medium text-[#10B981]">{plan.goal}</p>
        </div>

        <p className="text-xs text-[#9CA3AF] line-clamp-2">{plan.description}</p>
      </div>

      <div className="mt-5 pt-3 border-t border-[#1E293B] flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9CA3AF]">
          <Calendar className="h-4 w-4 text-[#6366F1]" />
          <span className="font-mono-num">{plan.daysPerWeek} days / week</span>
        </div>

        <Link
          to={`/plans/${plan.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] hover:text-[#059669] transition-colors"
        >
          <span>View Plan</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
