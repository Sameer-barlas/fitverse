import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, CheckCircle2, Info } from 'lucide-react';
import { getPlanById } from '../api/planApi.js';
import PlanDayAccordion from '../components/plans/PlanDayAccordion.jsx';
import ExerciseDetailModal from '../components/exercises/ExerciseDetailModal.jsx';
import Badge from '../components/ui/Badge.jsx';
import Card from '../components/ui/Card.jsx';
import QuoteLoader from '../components/QuoteLoader.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

const AGE_BAND_LABELS = {
  adult: 'Ages 18–39',
  midlife: 'Ages 40–54',
  senior: 'Ages 55–80',
};

export default function PlanDetailPage() {
  const { id } = useParams();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);

  const fetchPlan = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getPlanById(id);
      setPlan(res.data.plan);
    } catch (err) {
      setError(err.message || 'Failed to load workout plan');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPlan();
  }, [fetchPlan]);

  if (loading) {
    return <QuoteLoader statusText="Loading workout plan..." />;
  }

  if (error || !plan) {
    return (
      <div className="space-y-4">
        <Link
          to="/plans"
          className="inline-flex items-center gap-1.5 text-sm text-[#9CA3AF] hover:text-[#F9FAFB]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Plans</span>
        </Link>
        <ErrorBanner message={error || 'Plan not found'} onRetry={fetchPlan} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/plans"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>All Workout Plans</span>
      </Link>

      {/* Plan Header Card */}
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={plan.bmiCategory}>{plan.bmiCategory}</Badge>
          <Badge variant={plan.experienceLevel}>{plan.experienceLevel}</Badge>
          <Badge variant="indigo">{AGE_BAND_LABELS[plan.ageBand] || plan.ageBand}</Badge>
          <span className="inline-flex items-center gap-1 text-xs font-mono-num text-[#9CA3AF] ml-auto">
            <Calendar className="h-4 w-4 text-[#10B981]" />
            {plan.daysPerWeek} Days / Week
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB]">{plan.name}</h1>
          <p className="mt-1 text-sm font-semibold text-[#10B981]">{plan.goal}</p>
          <p className="mt-2 text-sm text-[#9CA3AF]">{plan.description}</p>
        </div>

        {/* Coaching Guidelines Box */}
        {plan.guidelines?.length > 0 && (
          <div className="rounded-xl border border-[#1E293B] bg-[#1F2937]/50 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#10B981]">
              <Info className="h-4 w-4" />
              <span>Training & Progression Guidelines</span>
            </div>
            <ul className="space-y-1.5">
              {plan.guidelines.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#F9FAFB]">
                  <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Days Accordion List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#F9FAFB]">
          Weekly Schedule ({plan.days?.length || 0} Training Days)
        </h2>
        <p className="text-xs text-[#9CA3AF]">
          Click any exercise row to view form instructions and target muscles, or click &ldquo;Log
          This Day&rdquo; to pre-fill your workout session.
        </p>

        <div className="space-y-3">
          {(plan.days || []).map((day, idx) => (
            <PlanDayAccordion
              key={day.dayNumber}
              day={day}
              planId={plan.id}
              defaultOpen={idx === 0}
              onSelectExercise={(ex) => setSelectedExercise(ex)}
            />
          ))}
        </div>
      </div>

      {/* Health Disclaimer */}
      <div className="rounded-xl border border-[#1E293B] bg-[#111827]/60 p-4 text-xs text-[#9CA3AF]">
        <strong className="text-[#F9FAFB]">BMI is a rough guide, not medical advice.</strong> It
        doesn&apos;t account for muscle mass, age or body composition. The workout plans here are
        general fitness suggestions that adjust for your BMI, age and experience, not a substitute
        for professional guidance. Check with a doctor before starting a new exercise program
        (especially if you are over 55 or have a health condition), and stop if you feel pain,
        dizziness or unusual shortness of breath.
      </div>

      <ExerciseDetailModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
}
