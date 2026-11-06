import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { Activity, Dumbbell, ClipboardList, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'BMI & Age-Aware Plans',
    description:
      '36 deterministic training splits tailored to your BMI category, experience level, and age band (18–80).',
    color: '#818cf8',
    bg: 'rgba(99,102,241,0.15)',
  },
  {
    icon: Dumbbell,
    title: '76 Verified Exercises',
    description:
      'Curated movements using dumbbells, bands, and bodyweight — with step-by-step instructions and dual-frame photos.',
    color: '#a78bfa',
    bg: 'rgba(167,139,250,0.15)',
  },
  {
    icon: ClipboardList,
    title: 'Structured Session Logger',
    description:
      'Pre-fill workouts from your plan day or log custom rep and timed sets in seconds with zero friction.',
    color: '#fb923c',
    bg: 'rgba(251,146,60,0.15)',
  },
  {
    icon: TrendingUp,
    title: 'Real Progress Analytics',
    description:
      'Track weekly volume, 28-day consistency, muscle-group balance, and per-exercise personal records.',
    color: '#34d399',
    bg: 'rgba(52,211,153,0.15)',
  },
];

export default function FeaturesSection() {
  const [headingRef, headingVisible] = useScrollAnimation(0.1);

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }} />

      {/* Section heading */}
      <div
        ref={headingRef}
        className={`text-center mb-16 transition-all duration-700 ${
          headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest mb-4"
          style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a78bfa',
          }}
        >
          Everything You Need
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
          Built for Real Results
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Every feature in FitVerse is designed around one goal — helping you train consistently and
          progress measurably with zero clutter.
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
      className={`group relative rounded-3xl p-6 flex flex-col gap-4 overflow-hidden
        transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl cursor-default
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
      style={{
        transitionDelay: `${index * 120}ms`,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      }}
    >
      {/* Top accent glow line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${feat.color}, transparent)` }}
      />

      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: feat.bg,
          border: `1px solid ${feat.color}30`,
          boxShadow: `0 0 16px ${feat.color}15`,
        }}
      >
        <Icon className="h-6 w-6" style={{ color: feat.color }} />
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-200 transition-colors">
          {feat.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {feat.description}
        </p>
      </div>

      {/* Animated bottom accent bar */}
      <div
        className="mt-2 h-0.5 w-0 group-hover:w-full transition-all duration-500 rounded-full"
        style={{ backgroundColor: feat.color }}
      />
    </div>
  );
}
