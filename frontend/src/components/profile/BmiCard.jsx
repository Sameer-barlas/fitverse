import Badge from '../ui/Badge.jsx';

const AGE_BAND_LABELS = {
  adult: 'Adult (18–39)',
  midlife: 'Midlife (40–54)',
  senior: 'Senior (55–80)',
};

const BMI_COLOR = {
  underweight: '#38BDF8',
  normal: '#10B981',
  overweight: '#F59E0B',
  obese: '#EF4444',
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
  const bmiColor = BMI_COLOR[bmiCategory] || '#10B981';

  return (
    <div
      className="rounded-2xl border border-white/5 shadow-lg overflow-hidden h-full"
      style={{
        background: 'linear-gradient(135deg, #0d2318 0%, #0a1612 100%)',
      }}
    >
      <div className="p-5 sm:p-6 space-y-5 h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF]/70">
              Body Mass Index
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span
                className="text-4xl font-bold font-mono-num"
                style={{ color: bmiColor }}
              >
                {Number(bmi).toFixed(1)}
              </span>
              <Badge variant={bmiCategory}>{bmiCategory}</Badge>
            </div>
          </div>

          <div className="flex flex-col gap-2">
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

        {/* BMI Scale */}
        <div className="space-y-1.5">
          <p className="text-xs text-[#9CA3AF]/60 font-medium">BMI Scale (15 – 40)</p>
          <div className="relative h-4 w-full rounded-full overflow-hidden flex shadow-inner">
            {/* 15 to 18.5 = 14% */}
            <div className="h-full" style={{ width: '14%', background: 'linear-gradient(90deg,#0ea5e9,#38BDF8)' }} title="Underweight (<18.5)" />
            {/* 18.5 to 25 = 26% */}
            <div className="h-full" style={{ width: '26%', background: 'linear-gradient(90deg,#059669,#10B981)' }} title="Normal (18.5–24.9)" />
            {/* 25 to 30 = 20% */}
            <div className="h-full" style={{ width: '20%', background: 'linear-gradient(90deg,#d97706,#F59E0B)' }} title="Overweight (25–29.9)" />
            {/* 30 to 40 = 40% */}
            <div className="h-full" style={{ width: '40%', background: 'linear-gradient(90deg,#dc2626,#EF4444)' }} title="Obese (30+)" />

            {/* Marker */}
            <div
              className="absolute top-0 bottom-0 w-1 rounded-full shadow-lg -translate-x-1/2 transition-all duration-500"
              style={{
                left: `${markerLeftPct}%`,
                background: '#F9FAFB',
                boxShadow: `0 0 6px ${bmiColor}`,
              }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-[#9CA3AF]/50 font-mono-num pt-0.5">
            <span>15</span>
            <span>18.5</span>
            <span>25</span>
            <span>30</span>
            <span>40</span>
          </div>
        </div>

        {/* Body stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-white/5 mt-auto">
          {[
            { label: 'Height', value: `${heightCm} cm`, color: '#9CA3AF' },
            { label: 'Weight', value: `${weightKg} kg`, color: '#9CA3AF' },
            { label: 'Age', value: `${age} yrs`, color: '#9CA3AF' },
            healthyWeightRangeKg
              ? { label: 'Ideal Weight', value: `${healthyWeightRangeKg.min}–${healthyWeightRangeKg.max} kg`, color: '#10B981' }
              : null,
          ]
            .filter(Boolean)
            .map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/5 p-3"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <p className="text-xs text-[#9CA3AF]/60">{stat.label}</p>
                <p
                  className="mt-0.5 text-sm font-bold font-mono-num"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
