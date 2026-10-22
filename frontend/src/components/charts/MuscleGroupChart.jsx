import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import Card from '../ui/Card.jsx';

export default function MuscleGroupChart({ data = [] }) {
  const formatted = data.map((d) => ({
    ...d,
    name: d.muscleGroup
      ? d.muscleGroup.charAt(0).toUpperCase() + d.muscleGroup.slice(1)
      : '',
  }));

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[#F9FAFB]">
          Muscle Group Distribution (Last 30 Days)
        </h3>
        <p className="text-xs text-[#9CA3AF]">
          Completed sets across all 7 major muscle groups
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formatted}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} width={75} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#1E293B',
                borderRadius: '12px',
                color: '#F9FAFB',
                fontSize: '12px',
              }}
              formatter={(value, _name, props) => [
                `${value} sets (${props.payload.percentage}%)`,
                'Volume Share',
              ]}
            />
            <Bar dataKey="sets" fill="#6366F1" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
