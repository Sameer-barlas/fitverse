import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { Target, BarChart2, Calendar, Flame, Award, Users } from 'lucide-react';

const highlights = [
  {
    icon: Target,
    title: 'Goal-Oriented Structure',
    description: 'Every plan is split by goal — fat loss, muscle gain, or functional conditioning.',
    color: '#818cf8',
  },
  {
    icon: Calendar,
    title: 'Flexible Schedules',
    description: 'Train 3, 4, or 5 days per week. Life happens — your plan seamlessly adapts.',
    color: '#a78bfa',
  },
  {
    icon: Flame,
    title: 'Streak & Heatmap Tracking',
    description: 'Build long-term momentum with consistency tracking and weekly activity streaks.',
    color: '#fb923c',
  },
  {
    icon: BarChart2,
    title: 'Volume & Load Analytics',
    description: 'See total weight lifted, sets, and reps per week across all exercises at a glance.',
    color: '#34d399',
  },
  {
    icon: Award,
    title: 'Automated Personal Records',
    description: 'Every PR is detected and celebrated automatically — zero manual math required.',
    color: '#fbbf24',
  },
  {
    icon: Users,
    title: 'All Experience Levels & Ages',
    description: 'Beginner, intermediate, or advanced — from young adults to seniors, everyone thrives.',
    color: '#38bdf8',
  },
];

export default function WhyFitverseSection() {
  const [headingRef, headingVisible] = useScrollAnimation(0.1);

  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      {/* Heading */}
      <div
        ref={headingRef}
        className={`flex flex-col lg:flex-row gap-10 lg:gap-20 items-start mb-16 transition-all duration-700 ${
          headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="lg:w-1/3">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#a78bfa',
            }}
          >
            Why FitVerse
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            More Than Just a Workout App
          </h2>
        </div>
        <p className="lg:w-2/3 text-base sm:text-lg leading-relaxed self-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Most fitness apps give you generic cookie-cutter plans. FitVerse is different — every plan is
          computed directly from your body profile, so you're not following someone else's routine. You're
          following <span className="text-white font-semibold">your own</span>.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.map((item, i) => (
          <HighlightCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}

function HighlightCard({ item, index }) {
  const [ref, visible] = useScrollAnimation(0.1);
  const Icon = item.icon;

  return (
    <div
      ref={ref}
      className={`group flex gap-4 rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-xl
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
      style={{
        transitionDelay: `${index * 100}ms`,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      <div
        className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110"
        style={{
          backgroundColor: `${item.color}15`,
          border: `1px solid ${item.color}30`,
          boxShadow: `0 0 16px ${item.color}15`,
        }}
      >
        <Icon className="h-5 w-5" style={{ color: item.color }} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-white mb-1.5 group-hover:text-violet-200 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {item.description}
        </p>
      </div>
    </div>
  );
}
