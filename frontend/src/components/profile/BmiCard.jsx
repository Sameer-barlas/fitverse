import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

const AGE_BAND_LABELS = {
  adult: 'Adult (18–39)',
  midlife: 'Midlife (40–54)',
  senior: 'Senior (55–80)',
};

export default function BmiCard({ profile }) {
  if (!profile) return null;

  const {
    bmi,
    bmiCategory,
    heightCm,
    weightKg,
    age,
    ageBand,
    experienceLevel,
    healthyWeightRangeKg,
  } = profile;

  const clampedBmi = Math.min(40, Math.max(15, Number(bmi) || 22));
  const markerLeftPct = ((clampedBmi - 15) / (40 - 15)) * 100;

  return (
    <Card className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
            Body Mass Index (BMI)
          </p>
          <div className="mt-1 flex items-baseline gap-3">
            <span className="text-4xl font-bold text-[#F9FAFB] font-mono-num">
              {Number(bmi).toFixed(1)}
            </span>
            <Badge variant={bmiCategory}>{bmiCategory}</Badge>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {ageBand && (
            <Badge variant="indigo">
              {AGE_BAND_LABELS[ageBand] || ageBand}
            </Badge>
          )}
          {experienceLevel && (
            <Badge variant={experienceLevel}>{experienceLevel}</Badge>
          )}
        </div>
      </div>

      {/* Horizontal BMI Scale Bar (15 to 40) */}
      <div className="space-y-2">
        <div className="relative h-3 w-full rounded-full overflow-hidden flex bg-[#1F2937]">
          {/* 15 to 18.5 = 3.5 / 25 = 14% */}
          <div className="h-full bg-[#38BDF8]" style={{ width: '14%' }} title="Underweight (<18.5)" />
          {/* 18.5 to 25 = 6.5 / 25 = 26% */}
          <div className="h-full bg-[#10B981]" style={{ width: '26%' }} title="Normal (18.5–24.9)" />
          {/* 25 to 30 = 5 / 25 = 20% */}
          <div className="h-full bg-[#F59E0B]" style={{ width: '20%' }} title="Overweight (25–29.9)" />
          {/* 30 to 40 = 10 / 25 = 40% */}
          <div className="h-full bg-[#EF4444]" style={{ width: '40%' }} title="Obese (30+)" />
        </div>

        {/* Marker indicator */}
        <div className="relative h-4 w-full">
          <div
            className="absolute -top-1 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
            style={{ left: `${markerLeftPct}%` }}
          >
            <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[6px] border-b-[#F9FAFB]" />
          </div>
        </div>

        <div className="flex justify-between text-[11px] text-[#9CA3AF] font-mono-num">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-[#1E293B]">
        <div className="rounded-xl bg-[#1F2937]/60 p-3">
          <p className="text-xs text-[#9CA3AF]">Height</p>
          <p className="mt-0.5 text-sm font-semibold text-[#F9FAFB] font-mono-num">
            {heightCm} cm
          </p>
        </div>
        <div className="rounded-xl bg-[#1F2937]/60 p-3">
          <p className="text-xs text-[#9CA3AF]">Weight</p>
          <p className="mt-0.5 text-sm font-semibold text-[#F9FAFB] font-mono-num">
            {weightKg} kg
          </p>
        </div>
        <div className="rounded-xl bg-[#1F2937]/60 p-3">
          <p className="text-xs text-[#9CA3AF]">Age</p>
          <p className="mt-0.5 text-sm font-semibold text-[#F9FAFB] font-mono-num">
            {age} yrs
          </p>
        </div>
        {healthyWeightRangeKg && (
          <div className="rounded-xl bg-[#1F2937]/60 p-3">
            <p className="text-xs text-[#9CA3AF]">Healthy Weight</p>
            <p className="mt-0.5 text-sm font-semibold text-[#10B981] font-mono-num">
              {healthyWeightRangeKg.min}–{healthyWeightRangeKg.max} kg
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
