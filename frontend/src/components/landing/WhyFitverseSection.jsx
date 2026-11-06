import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { Target, BarChart2, Calendar, Flame, Award, Users } from 'lucide-react';

const highlights = [
  {
    icon: Target,
    title: 'Goal-Oriented Structure',
    description: 'Every plan is split by goal — fat loss, muscle gain, or general conditioning.',
    color: '#10B981',
  },
  {
    icon: Calendar,
    title: 'Flexible Schedules',
    description: 'Train 3, 4, or 5 days per week. Life happens — your plan adapts.',
    color: '#6366F1',
  },
  {
    icon: Flame,
    title: 'Streak Tracking',
    description: 'Build momentum with 28-day consistency tracking and visual heat maps.',
    color: '#F59E0B',
  },
  {
    icon: BarChart2,
    title: 'Volume Analytics',
    description: 'See total reps & sets per week across all sessions at a glance.',
    color: '#EC4899',
  },
  {
    icon: Award,
    title: 'Personal Records',
    description: 'Every PR is captured automatically — no manual tracking required.',
    color: '#10B981',
  },
  {
    icon: Users,
    title: 'All Experience Levels',
    description: 'Beginner, intermediate, or advanced — there\'s a plan built just for you.',
    color: '#6366F1',
  },
];

export default function WhyFitverseSection() {
  const [headingRef, headingVisible] = useScrollAnimation(0.1);

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
      {/* Heading */}
      <div
        ref={headingRef}
        className={`flex flex-col lg:flex-row gap-10 lg:gap-20 items-start mb-16 transition-all duration-700 ${
          headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="lg:w-1/3">
          <span className="inline-block rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-4 py-1 text-xs font-semibold text-[#F59E0B] uppercase tracking-widest mb-4">
            Why FitVerse
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F9FAFB] leading-tight">
            More Than Just a Workout App
          </h2>
        </div>
        <p className="lg:w-2/3 text-[#9CA3AF] text-base leading-relaxed self-center">
          Most fitness apps give you generic plans. FitVerse is different — every plan is
          computed from your personal data, so you're not following someone else's routine. You're
          following <em className="text-[#F9FAFB]">your own</em>.
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
      className={`flex gap-4 rounded-2xl border border-[#1E293B] bg-[#111827] p-6
        hover:border-[#374151] hover:bg-[#1a2235] transition-all duration-500
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div
        className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${item.color}18` }}
      >
        <Icon className="h-5 w-5" style={{ color: item.color }} />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[#F9FAFB] mb-1">{item.title}</h3>
        <p className="text-sm text-[#9CA3AF] leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
}
