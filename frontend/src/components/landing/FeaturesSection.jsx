import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { Activity, Dumbbell, ClipboardList, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'BMI & Age-Aware Plans',
    description:
      '36 deterministic training splits tailored to your BMI category, experience level, and age band (18–80).',
    color: '#10B981',
    bg: '#10B98115',
  },
  {
    icon: Dumbbell,
    title: '76 Verified Exercises',
    description:
      'Curated movements using dumbbells, bands, and bodyweight — with step-by-step instructions and dual-frame photos.',
    color: '#6366F1',
    bg: '#6366F115',
  },
  {
    icon: ClipboardList,
    title: 'Structured Session Logger',
    description:
      'Pre-fill workouts from your plan day or log custom rep and timed sets in seconds.',
    color: '#F59E0B',
    bg: '#F59E0B15',
  },
  {
    icon: TrendingUp,
    title: 'Real Progress Analytics',
    description:
      'Track weekly volume, 28-day consistency, muscle-group balance, and per-exercise personal records.',
    color: '#EC4899',
    bg: '#EC489915',
  },
];

export default function FeaturesSection() {
  const [headingRef, headingVisible] = useScrollAnimation(0.1);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      {/* Section heading */}
      <div
        ref={headingRef}
        className={`text-center mb-16 transition-all duration-700 ${
          headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <span className="inline-block rounded-full bg-[#10B981]/10 border border-[#10B981]/30 px-4 py-1 text-xs font-semibold text-[#10B981] uppercase tracking-widest mb-4">
          Everything You Need
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#F9FAFB] leading-tight">
          Built for Real Results
        </h2>
        <p className="mt-4 text-[#9CA3AF] max-w-xl mx-auto text-base">
          Every feature in FitVerse is designed around one goal — helping you train consistently and
          progress measurably.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feat, i) => (
          <FeatureCard key={feat.title} feat={feat} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({ feat, index }) {
  const [ref, visible] = useScrollAnimation(0.1);
  const Icon = feat.icon;

  return (
    <div
      ref={ref}
      className={`group rounded-2xl border border-[#1E293B] bg-[#111827] p-6 flex flex-col gap-4
        hover:border-[#374151] hover:bg-[#1a2235] hover:shadow-lg hover:shadow-black/30
        transition-all duration-500 cursor-default
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-xl"
        style={{ backgroundColor: feat.bg }}
      >
        <Icon className="h-6 w-6" style={{ color: feat.color }} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-[#F9FAFB] mb-2">{feat.title}</h3>
        <p className="text-sm text-[#9CA3AF] leading-relaxed">{feat.description}</p>
      </div>
      {/* Animated bottom accent bar */}
      <div
        className="mt-auto h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
        style={{ backgroundColor: feat.color }}
      />
    </div>
  );
}
