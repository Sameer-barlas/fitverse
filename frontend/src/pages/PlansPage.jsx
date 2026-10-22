import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, Play, Filter } from 'lucide-react';
import { getPlans, getRecommendedPlan } from '../api/planApi.js';
import PlanCard from '../components/plans/PlanCard.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import QuoteLoader from '../components/QuoteLoader.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';

const AGE_BAND_LABELS = {
  adult: 'Adult (18–39)',
  midlife: 'Midlife (40–54)',
  senior: 'Senior (55–80)',
};

export default function PlansPage() {
  const [recommended, setRecommended] = useState(null);
  const [why, setWhy] = useState(null);
  const [plans, setPlans] = useState([]);
  const [bmiFilter, setBmiFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [ageBandFilter, setAgeBandFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [recRes, plansRes] = await Promise.all([
        getRecommendedPlan().catch(() => null),
        getPlans({
          bmiCategory: bmiFilter,
          experienceLevel: levelFilter,
          ageBand: ageBandFilter,
        }),
      ]);

      if (recRes?.data) {
        setRecommended(recRes.data.plan);
        setWhy(recRes.data.why);
      }
      setPlans(plansRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load workout plans');
    } finally {
      setLoading(false);
    }
  }, [bmiFilter, levelFilter, ageBandFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const clearFilters = () => {
    setBmiFilter('');
    setLevelFilter('');
    setAgeBandFilter('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F9FAFB]">
          Workout Plans
        </h1>
        <p className="mt-1 text-sm text-[#9CA3AF]">
          36 deterministic programs tailored across BMI categories, experience levels, and age bands.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadData} />}

      {/* Recommended Hero */}
      {recommended && (
        <div className="rounded-2xl border border-[#10B981]/50 bg-gradient-to-br from-[#10B981]/15 via-[#111827] to-[#111827] p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/20 px-3 py-1 text-xs font-semibold text-[#10B981]">
              <Sparkles className="h-3.5 w-3.5" />
              Recommended For Your Profile
            </span>

            {why && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-[#9CA3AF] mr-1">Why this plan:</span>
                <Badge variant={why.bmiCategory}>
                  BMI {Number(why.bmi).toFixed(1)} ({why.bmiCategory})
                </Badge>
                <Badge variant="indigo">{AGE_BAND_LABELS[why.ageBand] || why.ageBand}</Badge>
                <Badge variant={why.experienceLevel}>{why.experienceLevel}</Badge>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-xl sm:text-2xl font-bold text-[#F9FAFB]">
                {recommended.name}
              </h2>
              <p className="text-sm font-medium text-[#10B981]">{recommended.goal}</p>
              <p className="text-sm text-[#9CA3AF]">{recommended.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link to={`/logs/new?planId=${recommended.id}&day=1`}>
                <Button>
                  <Play className="h-4 w-4" />
                  <span>Log Day 1</span>
                </Button>
              </Link>
              <Link to={`/plans/${recommended.id}`}>
                <Button variant="secondary">
                  <span>View Full Schedule</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar for All 36 Plans */}
      <div className="rounded-2xl border border-[#1E293B] bg-[#111827] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F9FAFB]">
            <Filter className="h-4 w-4 text-[#10B981]" />
            <span>Browse All 36 Plans</span>
          </div>
          {(bmiFilter || levelFilter || ageBandFilter) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-[#10B981] hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label htmlFor="plan-bmi-filter" className="block text-xs text-[#9CA3AF] mb-1">
              BMI Category
            </label>
            <select
              id="plan-bmi-filter"
              value={bmiFilter}
              onChange={(e) => setBmiFilter(e.target.value)}
              className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              <option value="">All BMI Categories</option>
              <option value="underweight">Underweight</option>
              <option value="normal">Normal</option>
              <option value="overweight">Overweight</option>
              <option value="obese">Obese</option>
            </select>
          </div>

          <div>
            <label htmlFor="plan-level-filter" className="block text-xs text-[#9CA3AF] mb-1">
              Experience Level
            </label>
            <select
              id="plan-level-filter"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label htmlFor="plan-age-filter" className="block text-xs text-[#9CA3AF] mb-1">
              Age Band
            </label>
            <select
              id="plan-age-filter"
              value={ageBandFilter}
              onChange={(e) => setAgeBandFilter(e.target.value)}
              className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            >
              <option value="">All Age Bands</option>
              <option value="adult">Adult (18–39)</option>
              <option value="midlife">Midlife (40–54)</option>
              <option value="senior">Senior (55–80)</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <QuoteLoader statusText="Finding workout plans..." />
      ) : plans.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No workout plans match those filters"
          description="Clear one or more filters to browse the 36 training plans."
          action={
            <Button variant="secondary" onClick={clearFilters}>
              Show All 36 Plans
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((p) => (
            <PlanCard
              key={p.id}
              plan={p}
              isRecommended={recommended && p.id === recommended.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
