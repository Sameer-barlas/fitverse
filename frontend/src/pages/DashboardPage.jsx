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
  TrendingUp,
  Activity,
  Target,
  ChevronRight,
  Zap,
  Clock,
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
function StatCard({ label, value, sub, icon: Icon, accent, bgGlow }) {
  return (
    <div className="stat-card group relative rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Glow blob */}
      <div
        className="pointer-events-none absolute -top-8 -right-8 h-28 w-28 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ background: bgGlow || accent }}
      />
      {/* Top accent line */}
      <div className="absolute top-0 left-5 right-5 h-px rounded-full opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl mb-4"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
            boxShadow: `0 0 16px ${accent}20`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>

        <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: `${accent}99` }}>
          {label}
        </p>
        <p className="text-2xl font-bold text-white font-mono-num leading-none tracking-tight">
          {value}
        </p>
        {sub && (
          <p className="mt-1.5 text-xs text-white/35 truncate">{sub}</p>
        )}
      </div>
    </div>
  );
}

/* ───── Quick action pill ───── */
function QuickAction({ to, icon: Icon, label, sub, accent }) {
  return (
    <Link to={to} className="block group">
      <div
        className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all group-hover:scale-110"
          style={{ background: `${accent}18`, border: `1px solid ${accent}25` }}
        >
          <Icon className="h-4 w-4" style={{ color: accent }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white/90 group-hover:text-white transition-colors truncate">{label}</p>
          <p className="text-xs text-white/35 truncate">{sub}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
      </div>
    </Link>
  );
}

/* ───── Greeting time ───── */
function getGreeting(name) {
  const hour = new Date().getHours();
  const prefix = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const emoji = hour < 12 ? '☀️' : hour < 17 ? '👋' : '🌙';
  return { text: `${prefix}, ${name || 'Athlete'}`, emoji };
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

  // Compute Next Plan Day
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
  const greeting = getGreeting(user?.name);

  return (
    <div className="space-y-7 pb-6">

      {/* ── Hero Greeting Banner ── */}
      <div
        className="relative rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 70%, #0f172a 100%)',
          border: '1px solid rgba(99,102,241,0.25)',
          boxShadow: '0 20px 60px rgba(99,102,241,0.15), 0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), rgba(167,139,250,0.4), transparent)' }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 sm:p-8">
          <div className="flex-1">
            {/* Label chip */}
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4"
              style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
            >
              <Activity className="h-3.5 w-3.5 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Your Dashboard</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
                {greeting.text}
              </h1>
              <span className="text-2xl sm:text-3xl">{greeting.emoji}</span>
            </div>
            <p className="mt-1.5 text-sm text-indigo-200/60">
              Here's your fitness snapshot for today
            </p>

            {/* Weekly progress bar */}
            {summary && (
              <div className="mt-5 max-w-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-white/50">Weekly goal progress</span>
                  <span className="text-xs font-bold" style={{ color: '#a78bfa' }}>
                    {sessionsThisWeek} / {daysTarget} sessions
                  </span>
                </div>
                <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${weeklyProgressPct}%`,
                      background: 'linear-gradient(90deg, #6366f1, #a78bfa, #c4b5fd)',
                      boxShadow: '0 0 12px rgba(167,139,250,0.5)',
                    }}
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-white/30">
                  {weeklyProgressPct === 0
                    ? 'Start your first session!'
                    : weeklyProgressPct >= 100
                    ? '🎉 Goal achieved this week!'
                    : `${weeklyProgressPct}% of weekly target completed`}
                </p>
              </div>
            )}
          </div>

          <Link to="/logs/new" className="shrink-0">
            <button
              className="inline-flex items-center gap-2.5 rounded-2xl px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                boxShadow: '0 8px 32px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <Plus className="h-4 w-4" />
              Log Workout
            </button>
          </Link>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadDashboard} />}

      {/* ── 4 KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="This Week"
          value={`${sessionsThisWeek}${recommended?.daysPerWeek ? ` / ${recommended.daysPerWeek}` : ''}`}
          sub="Sessions completed"
          icon={CalendarCheck}
          accent="#818cf8"
          bgGlow="#6366f1"
        />
        <StatCard
          label="Streak"
          value={`${summary?.weeklyStreak ?? 0} wks`}
          sub="Consecutive active weeks"
          icon={Flame}
          accent="#fb923c"
          bgGlow="#f97316"
        />
        <StatCard
          label="Total Sessions"
          value={summary?.totalSessions ?? 0}
          sub={`Last: ${summary?.lastWorkoutDate || 'No workouts yet'}`}
          icon={Dumbbell}
          accent="#34d399"
          bgGlow="#10b981"
        />
        <StatCard
          label="Total Volume"
          value={`${Number(summary?.totalVolumeKg || 0).toLocaleString()} kg`}
          sub="Cumulative weight lifted"
          icon={Trophy}
          accent="#fbbf24"
          bgGlow="#f59e0b"
        />
      </div>

      {/* ── Main Two-Column: Plan + BMI ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        {/* Left: Recommended Plan */}
        <div className="lg:col-span-7 space-y-4">
          {recommended ? (
            <div
              className="rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
              }}
            >
              {/* Card header stripe */}
              <div className="relative px-6 pt-6 pb-5">
                <div className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)' }}
                />

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
                    style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.2)' }}
                  >
                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                    <span className="text-xs font-bold uppercase tracking-widest text-violet-300">AI-Recommended Plan</span>
                  </div>
                  {why && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant={why.bmiCategory}>{why.bmiCategory}</Badge>
                      <Badge variant="indigo">{why.ageBand}</Badge>
                      <Badge variant={why.experienceLevel}>{why.experienceLevel}</Badge>
                    </div>
                  )}
                </div>

                {/* Plan name + description */}
                <div className="mt-4">
                  <h2 className="text-xl font-bold text-white leading-tight">{recommended.name}</h2>
                  <p className="mt-1 text-xs font-semibold text-violet-400/80 uppercase tracking-wide">{recommended.goal}</p>
                  <p className="mt-2.5 text-sm text-white/50 leading-relaxed">{recommended.description}</p>
                </div>
              </div>

              {/* Next day card */}
              {nextDayObj && (
                <div className="mx-5 mb-5 rounded-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
                    border: '1px solid rgba(99,102,241,0.2)',
                  }}
                >
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
                      >
                        <Target className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-0.5">
                          Up Next — Day {nextDayObj.dayNumber} of {recommended.daysPerWeek}
                        </p>
                        <p className="text-sm font-bold text-white">{nextDayObj.title}</p>
                        <p className="text-xs text-white/40 mt-0.5">
                          {nextDayObj.exercises?.length || 0} exercises · Focus:{' '}
                          <span className="text-indigo-400/80 capitalize">{nextDayObj.focus}</span>
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/logs/new?planId=${recommended.id}&day=${nextDayObj.dayNumber}`}
                      className="shrink-0"
                    >
                      <button
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all hover:scale-105 active:scale-95 cursor-pointer w-full sm:w-auto justify-center"
                        style={{
                          background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                          boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                        }}
                      >
                        <Play className="h-3.5 w-3.5" />
                        Start Day {nextDayObj.dayNumber}
                      </button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                <Link
                  to={`/plans/${recommended.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                >
                  View Full Plan <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  to="/plans"
                  className="text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  Browse all 36 plans →
                </Link>
              </div>
            </div>
          ) : (
            /* No plan yet */
            <div
              className="rounded-3xl p-10 text-center"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1.5px dashed rgba(99,102,241,0.3)',
              }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl mx-auto mb-4"
                style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
              >
                <Sparkles className="h-6 w-6 text-indigo-400" />
              </div>
              <p className="text-base font-semibold text-white/80 mb-1">No plan recommended yet</p>
              <p className="text-sm text-white/35 mb-5">Complete your profile to get a personalised AI plan.</p>
              <Link to="/profile">
                <Button size="sm" variant="indigo">Set Up Profile</Button>
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <QuickAction
              to="/exercises"
              icon={Dumbbell}
              label="Browse Exercises"
              sub="Explore library"
              accent="#34d399"
            />
            <QuickAction
              to="/progress"
              icon={TrendingUp}
              label="View Progress"
              sub="Charts & trends"
              accent="#818cf8"
            />
            <QuickAction
              to="/logs"
              icon={Clock}
              label="Workout History"
              sub="Past sessions"
              accent="#fb923c"
            />
            <QuickAction
              to="/plans"
              icon={Zap}
              label="All Plans"
              sub="36 curated plans"
              accent="#fbbf24"
            />
          </div>
        </div>

        {/* Right: BMI Card */}
        <div className="lg:col-span-5">
          <BmiCard profile={profile} />
        </div>
      </div>

      {/* ── Recent Workouts ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl"
              style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)' }}
            >
              <Activity className="h-4 w-4 text-indigo-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Recent Workouts</h2>
          </div>
          <Link
            to="/logs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <div
            className="rounded-3xl p-10 text-center"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1.5px dashed rgba(255,255,255,0.08)',
            }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl mx-auto mb-4"
              style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
            >
              <Dumbbell className="h-6 w-6 text-white/25" />
            </div>
            <p className="text-base font-semibold text-white/60 mb-1">No workouts logged yet</p>
            <p className="text-sm text-white/30 mb-5">
              Start with Day 1 of your recommended plan or log a custom session.
            </p>
            <Link to={recommended ? `/logs/new?planId=${recommended.id}&day=1` : '/logs/new'}>
              <Button size="sm" variant="indigo">
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
