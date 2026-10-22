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

export default function VolumeBarChart({ data = [] }) {
  const formatted = data.map((d) => ({
    ...d,
    label: d.weekStart ? d.weekStart.slice(5) : '',
  }));

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[#F9FAFB]">
          Weekly Training Volume (Last 8 Weeks)
        </h3>
        <p className="text-xs text-[#9CA3AF]">
          Total weight lifted (reps × kg) per Monday-start week
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatted} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="label" stroke="#9CA3AF" fontSize={12} />
            <YAxis stroke="#9CA3AF" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#1E293B',
                borderRadius: '12px',
                color: '#F9FAFB',
                fontSize: '12px',
              }}
              formatter={(value) => [`${Number(value).toLocaleString()} kg`, 'Volume']}
              labelFormatter={(label) => `Week of ${label}`}
            />
            <Bar dataKey="volumeKg" fill="#10B981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
