import { useState, useEffect, useCallback } from 'react';
import { Flame, Dumbbell, CalendarCheck, Trophy } from 'lucide-react';
import {
  getSummaryStats,
  getVolumeStats,
  getFrequencyStats,
  getMuscleStats,
  getPersonalRecordsStats,
} from '../api/statsApi.js';
import { getExercises } from '../api/exerciseApi.js';
import VolumeBarChart from '../components/charts/VolumeBarChart.jsx';
import ConsistencyGrid from '../components/charts/ConsistencyGrid.jsx';
import MuscleGroupChart from '../components/charts/MuscleGroupChart.jsx';
import ExerciseProgressChart from '../components/charts/ExerciseProgressChart.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import QuoteLoader from '../components/QuoteLoader.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

export default function ProgressPage() {
  const [summary, setSummary] = useState(null);
  const [volume, setVolume] = useState([]);
  const [frequency, setFrequency] = useState([]);
  const [muscles, setMuscles] = useState([]);
  const [records, setRecords] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [sumRes, volRes, freqRes, musRes, prRes, exRes] = await Promise.all([
        getSummaryStats(),
        getVolumeStats(8),
        getFrequencyStats(28),
        getMuscleStats(30),
        getPersonalRecordsStats(),
        getExercises({ limit: 76 }),
      ]);

      setSummary(sumRes.data);
      setVolume(volRes.data || []);
      setFrequency(freqRes.data || []);
      setMuscles(musRes.data || []);
      setRecords(prRes.data || []);

      // Prioritize exercises that the user has logged at least once
      const allExercises = exRes.data || [];
      const loggedIds = new Set((prRes.data || []).map((r) => r.exercise?.id));
      const sortedExercises = [
        ...allExercises.filter((e) => loggedIds.has(e.id)),
        ...allExercises.filter((e) => !loggedIds.has(e.id)),
      ];
      setExercises(sortedExercises);
    } catch (err) {
      setError(err.message || 'Failed to load progress analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return <QuoteLoader statusText="Analyzing workout progress..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F9FAFB]">
          Progress &amp; Analytics
        </h1>
        <p className="mt-1 text-sm text-[#9CA3AF]">
          Training volume, consistency streaks, muscle balance, and personal records.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadStats} />}

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>Total Sessions</span>
            <CalendarCheck className="h-4 w-4 text-[#10B981]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] font-mono-num">
            {summary?.totalSessions ?? 0}
          </p>
          <p className="text-xs text-[#9CA3AF]">
            Last: {summary?.lastWorkoutDate || 'None yet'}
          </p>
        </Card>

        <Card className="space-y-1">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span>This Week</span>
            <Dumbbell className="h-4 w-4 text-[#6366F1]" />
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#F9FAFB] font-mono-num">
            {summary?.sessionsThisWeek ?? 0}
          </p>
          <p className="text-xs text-[#9CA3AF]">Sessions logged since Monday</p>
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
          <p className="text-xs text-[#9CA3AF]">Lifetime weight lifted</p>
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
          <p className="text-xs text-[#9CA3AF]">
            Active day streak: {summary?.currentStreakDays ?? 0}d
          </p>
        </Card>
      </div>

      {/* Charts Grid Row 1: Weekly Volume + 28-Day Consistency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VolumeBarChart data={volume} />
        <ConsistencyGrid data={frequency} />
      </div>

      {/* Charts Grid Row 2: Muscle Group Distribution + Per-Exercise Line Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MuscleGroupChart data={muscles} />
        <ExerciseProgressChart exercises={exercises} />
      </div>

      {/* Personal Records Table */}
      <Card className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#F9FAFB]">
            Personal Records (PRs)
          </h3>
          <p className="text-xs text-[#9CA3AF]">
            Best weight, estimated 1RM (Epley formula), or longest duration per logged exercise
          </p>
        </div>

        {records.length === 0 ? (
          <p className="text-sm text-[#9CA3AF] py-4">
            No personal records yet. Log your first workout session to populate this table.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1E293B] text-xs uppercase text-[#9CA3AF]">
                  <th className="py-2.5 pr-4">Exercise</th>
                  <th className="py-2.5 px-3">Muscle</th>
                  <th className="py-2.5 px-3">Best Weight</th>
                  <th className="py-2.5 px-3">Est. 1RM</th>
                  <th className="py-2.5 px-3">Total Reps / Best Hold</th>
                  <th className="py-2.5 pl-3 text-right">Last Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {records.map((rec) => (
                  <tr key={rec.exercise?.id} className="hover:bg-[#1F2937]/40">
                    <td className="py-3 pr-4 font-semibold text-[#F9FAFB]">
                      {rec.exercise?.name}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="indigo">{rec.exercise?.muscleGroup}</Badge>
                    </td>
                    <td className="py-3 px-3 font-mono-num">
                      {rec.exercise?.trackingType === 'time'
                        ? '—'
                        : `${rec.bestWeightKg ?? 0} kg`}
                    </td>
                    <td className="py-3 px-3 font-mono-num text-[#10B981]">
                      {rec.bestEst1RM ? `${rec.bestEst1RM} kg` : '—'}
                    </td>
                    <td className="py-3 px-3 font-mono-num">
                      {rec.exercise?.trackingType === 'time'
                        ? `${rec.bestDurationSec ?? 0} sec`
                        : `${rec.totalReps ?? 0} reps`}
                    </td>
                    <td className="py-3 pl-3 text-right font-mono-num text-xs text-[#9CA3AF]">
                      {rec.lastDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
