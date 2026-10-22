import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Dumbbell,
  CalendarCheck,
  Trophy,
  Play,
  ArrowRight,
  Plus,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getRecommendedPlan } from '../api/planApi.js';
import { getSummaryStats } from '../api/statsApi.js';
import { getLogs } from '../api/logApi.js';
import BmiCard from '../components/profile/BmiCard.jsx';
import LogCard from '../components/logs/LogCard.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import QuoteLoader from '../components/QuoteLoader.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const [recommended, setRecommended] = useState(null);
  const [why, setWhy] = useState(null);
  const [summary, setSummary] = useState(null);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [recRes, sumRes, logsRes] = await Promise.all([
        getRecommendedPlan().catch(() => null),
        getSummaryStats(),
        getLogs({ page: 1, limit: 3 }),
      ]);

      if (recRes?.data) {
        setRecommended(recRes.data.plan);
        setWhy(recRes.data.why);
      }
      setSummary(sumRes.data);
      setRecentLogs(logsRes.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Compute Next Plan Day per PLAN.md §7.5
  let nextDayNumber = 1;
  if (recommended && summary?.lastPlanDay) {
    if (
      summary.lastPlanDay.planId === recommended.id ||
      summary.lastPlanDay.slug === recommended.slug
    ) {
      const totalDays = recommended.daysPerWeek || recommended.days?.length || 3;
      nextDayNumber = (summary.lastPlanDay.dayNumber % totalDays) + 1;
    }
  }

  const nextDayObj =
    recommended?.days?.find((d) => d.dayNumber === nextDayNumber) ||
    recommended?.days?.[0] ||
    null;

  if (loading) {
    return <QuoteLoader statusText="Loading dashboard & daily metrics..." />;
  }

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F9FAFB]">
            Welcome back, {user?.name || 'Athlete'}
          </h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            Here is your daily body metrics snapshot, recommended training day, and weekly progress.
          </p>
        </div>

        <Link to="/logs/new">
          <Button>
            <Plus className="h-4 w-4" />
            <span>Log Custom Workout</span>
          </Button>
        </Link>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadDashboard} />}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>This Week</span>
            <CalendarCheck className="h-4 w-4 text-[#10B981]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] font-mono-num">
            {summary?.sessionsThisWeek ?? 0}
            {recommended?.daysPerWeek ? (
              <span className="text-base font-normal text-[#9CA3AF]">
                {' '}
                / {recommended.daysPerWeek}
              </span>
            ) : null}
          </p>
          <p className="text-xs text-[#9CA3AF]">Weekly target progress</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Weekly Streak</span>
            <Flame className="h-4 w-4 text-[#EF4444]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] font-mono-num">
            {summary?.weeklyStreak ?? 0}{' '}
            <span className="text-sm font-normal text-[#9CA3AF]">wks</span>
          </p>
          <p className="text-xs text-[#9CA3AF]">Consecutive active weeks</p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Total Sessions</span>
            <Dumbbell className="h-4 w-4 text-[#6366F1]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] font-mono-num">
            {summary?.totalSessions ?? 0}
          </p>
          <p className="text-xs text-[#9CA3AF]">
            Last: {summary?.lastWorkoutDate || 'No workouts yet'}
          </p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Total Volume</span>
            <Trophy className="h-4 w-4 text-[#F59E0B]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] font-mono-num">
            {Number(summary?.totalVolumeKg || 0).toLocaleString()}{' '}
            <span className="text-sm font-normal text-[#9CA3AF]">kg</span>
          </p>
          <p className="text-xs text-[#9CA3AF]">Cumulative weight lifted</p>
        </Card>
      </div>

      {/* Main Two-Column Section: Recommended Plan + Next Day on Left, BMI Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {recommended && (
            <Card className="space-y-4 border-[#10B981]/40">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981]">
                  <Sparkles className="h-4 w-4" />
                  Your Recommended Plan
                </span>
                {why && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={why.bmiCategory}>{why.bmiCategory}</Badge>
                    <Badge variant="indigo">{why.ageBand}</Badge>
                    <Badge variant={why.experienceLevel}>{why.experienceLevel}</Badge>
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#F9FAFB]">{recommended.name}</h2>
                <p className="mt-1 text-xs font-medium text-[#10B981]">{recommended.goal}</p>
                <p className="mt-1.5 text-xs sm:text-sm text-[#9CA3AF]">
                  {recommended.description}
                </p>
              </div>

              {nextDayObj && (
                <div className="rounded-xl border border-[#1E293B] bg-[#1F2937]/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#10B981]">
                      Up Next: Day {nextDayObj.dayNumber} of {recommended.daysPerWeek}
                    </p>
                    <p className="mt-0.5 text-base font-bold text-[#F9FAFB]">
                      {nextDayObj.title}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      {nextDayObj.exercises?.length || 0} prescribed exercises · Focus:{' '}
                      <span className="capitalize">{nextDayObj.focus}</span>
                    </p>
                  </div>

                  <Link
                    to={`/logs/new?planId=${recommended.id}&day=${nextDayObj.dayNumber}`}
                  >
                    <Button size="sm">
                      <Play className="h-4 w-4" />
                      <span>Log Day {nextDayObj.dayNumber}</span>
                    </Button>
                  </Link>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
                <Link
                  to={`/plans/${recommended.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] hover:underline"
                >
                  <span>View Full Plan Details</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/plans"
                  className="text-xs text-[#9CA3AF] hover:text-[#F9FAFB]"
                >
                  Browse all 36 plans
                </Link>
              </div>
            </Card>
          )}
        </div>

        <div className="lg:col-span-5">
          <BmiCard profile={profile} />
        </div>
      </div>

      {/* Recent Workouts Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F9FAFB]">Recent Workouts</h2>
          <Link
            to="/logs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#10B981] hover:underline"
          >
            <span>View All History</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <Card className="p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-[#F9FAFB]">
              You haven&apos;t logged any workouts yet
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Start with Day 1 of your recommended workout plan or log a custom session.
            </p>
            <div>
              <Link
                to={
                  recommended
                    ? `/logs/new?planId=${recommended.id}&day=1`
                    : '/logs/new'
                }
              >
                <Button size="sm">
                  <Play className="h-4 w-4" />
                  <span>Start First Workout</span>
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentLogs.map((log) => (
              <LogCard key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
