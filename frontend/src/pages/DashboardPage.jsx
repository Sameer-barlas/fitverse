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
  Zap,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { getRecommendedPlan } from '../api/planApi.js';
import { getSummaryStats } from '../api/statsApi.js';
import { getLogs } from '../api/logApi.js';
import BmiCard from '../components/profile/BmiCard.jsx';
import LogCard from '../components/logs/LogCard.jsx';
import Badge from '../components/ui/Badge.jsx';
import Button from '../components/ui/Button.jsx';
import QuoteLoader from '../components/QuoteLoader.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

/* ───── KPI stat card ───── */
function StatCard({ label, value, sub, icon: Icon, iconColor, gradientFrom, gradientTo, accent }) {
  return (
    <div
      className="relative rounded-2xl p-5 overflow-hidden border border-white/5 shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`,
      }}
    >
      {/* Background glow */}
      <div
        className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full blur-2xl opacity-30"
        style={{ background: accent }}
      />
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">{label}</p>
          <p className="text-3xl font-bold text-white font-mono-num leading-none">{value}</p>
          {sub && <p className="mt-1.5 text-xs text-white/50 truncate">{sub}</p>}
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ml-3"
          style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

/* ───── Greeting time ───── */
function getGreeting(name) {
  const hour = new Date().getHours();
  const prefix = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  return `${prefix}, ${name || 'Athlete'} 👋`;
}

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

  const sessionsThisWeek = summary?.sessionsThisWeek ?? 0;
  const daysTarget = recommended?.daysPerWeek || 5;
  const weeklyProgressPct = Math.min(100, Math.round((sessionsThisWeek / daysTarget) * 100));

  return (
    <div className="space-y-6 pb-4">
      {/* ── Greeting Header ── */}
      <div className="relative rounded-2xl overflow-hidden border border-[#10B981]/20 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #0d2318 0%, #0f2d1e 60%, #10B98115 100%)',
        }}
      >
        {/* Decorative circle */}
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#10B981]/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/4 h-24 w-24 rounded-full bg-[#059669]/10 blur-2xl" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-[#10B981]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#10B981]">Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F9FAFB]">
              {getGreeting(user?.name)}
            </h1>
            <p className="mt-1 text-sm text-[#9CA3AF]">
              Here&apos;s your fitness snapshot for today
            </p>

            {/* Weekly progress bar */}
            {summary && (
              <div className="mt-3 max-w-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-[#9CA3AF]">Weekly goal</span>
                  <span className="text-xs font-semibold text-[#10B981]">
                    {sessionsThisWeek}/{daysTarget} sessions
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${weeklyProgressPct}%`,
                      background: 'linear-gradient(90deg, #059669, #10B981)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <Link to="/logs/new" className="shrink-0">
            <Button className="gap-2 shadow-lg shadow-[#10B981]/20">
              <Plus className="h-4 w-4" />
              <span>Log Workout</span>
            </Button>
          </Link>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadDashboard} />}

      {/* ── 4 KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="This Week"
          value={`${sessionsThisWeek}${recommended?.daysPerWeek ? ` / ${recommended.daysPerWeek}` : ''}`}
          sub="Weekly target progress"
          icon={CalendarCheck}
          iconColor="#10B981"
          gradientFrom="#0d2318"
          gradientTo="#0a1a12"
          accent="#10B981"
        />
        <StatCard
          label="Streak"
          value={`${summary?.weeklyStreak ?? 0} wks`}
          sub="Consecutive active weeks"
          icon={Flame}
          iconColor="#F97316"
          gradientFrom="#1a1208"
          gradientTo="#120d05"
          accent="#F97316"
        />
        <StatCard
          label="Total Sessions"
          value={summary?.totalSessions ?? 0}
          sub={`Last: ${summary?.lastWorkoutDate || 'No workouts yet'}`}
          icon={Dumbbell}
          iconColor="#6366F1"
          gradientFrom="#0e0d1a"
          gradientTo="#0a0912"
          accent="#6366F1"
        />
        <StatCard
          label="Total Volume"
          value={`${Number(summary?.totalVolumeKg || 0).toLocaleString()} kg`}
          sub="Cumulative weight lifted"
          icon={Trophy}
          iconColor="#F59E0B"
          gradientFrom="#1a1408"
          gradientTo="#120f05"
          accent="#F59E0B"
        />
      </div>

      {/* ── Main Two-Column: Plan + BMI ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Recommended Plan */}
        <div className="lg:col-span-7 space-y-5">
          {recommended ? (
            <div
              className="rounded-2xl border border-[#10B981]/25 shadow-lg overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #0d2318 0%, #0a1a12 100%)',
              }}
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#10B981]">
                    <Sparkles className="h-4 w-4" />
                    Your AI-Recommended Plan
                  </span>
                  {why && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={why.bmiCategory}>{why.bmiCategory}</Badge>
                      <Badge variant="indigo">{why.ageBand}</Badge>
                      <Badge variant={why.experienceLevel}>{why.experienceLevel}</Badge>
                    </div>
                  )}
                </div>

                {/* Plan name + description */}
                <div>
                  <h2 className="text-xl font-bold text-[#F9FAFB]">{recommended.name}</h2>
                  <p className="mt-0.5 text-xs font-semibold text-[#10B981]">{recommended.goal}</p>
                  <p className="mt-2 text-sm text-[#9CA3AF] leading-relaxed">
                    {recommended.description}
                  </p>
                </div>

                {/* Next day card */}
                {nextDayObj && (
                  <div
                    className="rounded-xl border border-[#10B981]/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    style={{ background: 'rgba(16,185,129,0.06)' }}
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">
                        ▶ Up Next — Day {nextDayObj.dayNumber} of {recommended.daysPerWeek}
                      </p>
                      <p className="mt-1 text-base font-bold text-[#F9FAFB]">
                        {nextDayObj.title}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {nextDayObj.exercises?.length || 0} exercises · Focus:{' '}
                        <span className="capitalize text-[#10B981]/80">{nextDayObj.focus}</span>
                      </p>
                    </div>
                    <Link
                      to={`/logs/new?planId=${recommended.id}&day=${nextDayObj.dayNumber}`}
                      className="shrink-0"
                    >
                      <Button size="sm" className="gap-1.5 shadow-md shadow-[#10B981]/20 w-full sm:w-auto">
                        <Play className="h-4 w-4" />
                        Start Day {nextDayObj.dayNumber}
                      </Button>
                    </Link>
                  </div>
                )}

                {/* Footer links */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <Link
                    to={`/plans/${recommended.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] hover:underline"
                  >
                    <span>View Full Plan</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to="/plans"
                    className="text-xs text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
                  >
                    Browse all 36 plans →
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* No plan yet */
            <div
              className="rounded-2xl border border-dashed border-[#10B981]/30 p-8 text-center space-y-3"
              style={{ background: 'linear-gradient(135deg, #0d2318 0%, #0a1a12 100%)' }}
            >
              <Sparkles className="h-8 w-8 text-[#10B981]/50 mx-auto" />
              <p className="text-sm font-semibold text-[#F9FAFB]">No plan recommended yet</p>
              <p className="text-xs text-[#9CA3AF]">Complete your profile to get a personalised plan.</p>
              <Link to="/profile">
                <Button size="sm">Set Up Profile</Button>
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link to="/exercises" className="block">
              <div className="rounded-xl border border-white/5 p-4 flex items-center gap-3 hover:border-[#10B981]/30 transition-colors cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #111827 0%, #0d1f17 100%)' }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#10B981]/10">
                  <Dumbbell className="h-4 w-4 text-[#10B981]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F9FAFB]">Browse Exercises</p>
                  <p className="text-xs text-[#9CA3AF]">Explore library</p>
                </div>
              </div>
            </Link>
            <Link to="/progress" className="block">
              <div className="rounded-xl border border-white/5 p-4 flex items-center gap-3 hover:border-[#6366F1]/30 transition-colors cursor-pointer"
                style={{ background: 'linear-gradient(135deg, #111827 0%, #0e0d1a 100%)' }}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6366F1]/10">
                  <TrendingUp className="h-4 w-4 text-[#6366F1]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#F9FAFB]">View Progress</p>
                  <p className="text-xs text-[#9CA3AF]">Charts & trends</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Right: BMI Card */}
        <div className="lg:col-span-5">
          <BmiCard profile={profile} />
        </div>
      </div>

      {/* ── Recent Workouts ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-gradient-to-b from-[#10B981] to-[#059669]" />
            <h2 className="text-lg font-bold text-[#F9FAFB]">Recent Workouts</h2>
          </div>
          <Link
            to="/logs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#10B981] hover:underline"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-white/10 p-8 text-center space-y-3"
            style={{ background: 'linear-gradient(135deg, #0d2318 0%, #0a1a12 100%)' }}
          >
            <Dumbbell className="h-8 w-8 text-[#10B981]/40 mx-auto" />
            <p className="text-sm font-semibold text-[#F9FAFB]">
              No workouts logged yet
            </p>
            <p className="text-xs text-[#9CA3AF]">
              Start with Day 1 of your recommended plan or log a custom session.
            </p>
            <Link
              to={
                recommended
                  ? `/logs/new?planId=${recommended.id}&day=1`
                  : '/logs/new'
              }
            >
              <Button size="sm">
                <Play className="h-4 w-4" />
                Start First Workout
              </Button>
            </Link>
          </div>
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
