import { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { getExerciseProgressStats } from '../../api/statsApi.js';
import Card from '../ui/Card.jsx';
import Spinner from '../ui/Spinner.jsx';

export default function ExerciseProgressChart({ exercises = [] }) {
  const [selectedId, setSelectedId] = useState('');
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedId && exercises.length > 0) {
      setSelectedId(exercises[0].id);
    }
  }, [exercises, selectedId]);

  useEffect(() => {
    if (!selectedId) return;
    setLoading(true);
    getExerciseProgressStats(selectedId)
      .then((res) => setSeries(res.data))
      .catch(() => setSeries(null))
      .finally(() => setLoading(false));
  }, [selectedId]);

  const points = series?.points || [];
  const isTime = series?.exercise?.trackingType === 'time';

  return (
    <Card className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#F9FAFB]">
            Exercise Progression Curve
          </h3>
          <p className="text-xs text-[#9CA3AF]">
            Track top weight &amp; estimated 1RM (Epley) or hold duration over time
          </p>
        </div>

        <div className="sm:w-64">
          <label htmlFor="progress-exercise-select" className="sr-only">
            Select exercise
          </label>
          <select
            id="progress-exercise-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded-xl bg-[#1F2937] border border-[#334155] px-3 py-2 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner />
        </div>
      ) : points.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#334155] p-6 text-center">
          <p className="text-sm font-semibold text-[#F9FAFB]">
            No logged sessions for this exercise yet
          </p>
          <p className="mt-1 text-xs text-[#9CA3AF]">
            Log a workout containing this exercise to plot your progression curve.
          </p>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points} margin={{ top: 10, right: 15, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#F9FAFB',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {isTime ? (
                <>
                  <Line
                    type="monotone"
                    dataKey="bestDurationSec"
                    name="Best Hold (sec)"
                    stroke="#38BDF8"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="totalDurationSec"
                    name="Total Duration (sec)"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </>
              ) : (
                <>
                  <Line
                    type="monotone"
                    dataKey="bestWeightKg"
                    name="Top Weight (kg)"
                    stroke="#10B981"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bestEst1RM"
                    name="Est. 1RM (kg)"
                    stroke="#6366F1"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
