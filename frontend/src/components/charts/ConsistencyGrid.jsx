import Card from '../ui/Card.jsx';

export default function ConsistencyGrid({ data = [] }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#F9FAFB]">
            28-Day Consistency Heatmap
          </h3>
          <p className="text-xs text-[#9CA3AF]">
            Daily workout activity over the past 4 weeks
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
          <span>Rest</span>
          <span className="h-3 w-3 rounded bg-[#1F2937] inline-block" />
          <span className="h-3 w-3 rounded bg-[#10B981]/50 inline-block" />
          <span className="h-3 w-3 rounded bg-[#10B981] inline-block" />
          <span>Active</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {data.map((day) => {
          const count = day.count || 0;
          const bgClass =
            count === 0
              ? 'bg-[#1F2937] text-[#6B7280] border-[#1E293B]'
              : count === 1
                ? 'bg-[#10B981]/30 text-[#F9FAFB] border-[#10B981]/50'
                : 'bg-[#10B981] text-[#0B0F17] font-bold border-[#10B981]';

          return (
            <div
              key={day.date}
              title={`${day.date}: ${count} workout(s)`}
              className={`rounded-xl border p-2 text-center transition-colors ${bgClass}`}
            >
              <div className="text-[10px] font-mono-num opacity-80">
                {day.date.slice(5)}
              </div>
              <div className="text-xs font-mono-num mt-0.5">
                {count > 0 ? `${count}x` : '—'}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
