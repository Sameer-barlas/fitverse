import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';

const stats = [
  { value: '76', suffix: '+', label: 'Home Exercises', color: '#10B981' },
  { value: '36', suffix: '', label: 'Training Splits', color: '#6366F1' },
  { value: '5', suffix: 'x', label: 'Days / Week Max', color: '#F59E0B' },
  { value: '100', suffix: '%', label: 'Free to Use', color: '#EC4899' },
];

export default function StatsSection() {
  const [ref, visible] = useScrollAnimation(0.1);

  return (
    <section className="relative overflow-hidden py-20">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/5 via-[#0B0F17] to-[#6366F1]/5 pointer-events-none" />

      <div
        ref={ref}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <p className="text-5xl sm:text-6xl font-black" style={{ color: stat.color }}>
                {stat.value}
                <span className="text-3xl">{stat.suffix}</span>
              </p>
              <p className="mt-2 text-sm text-[#9CA3AF] font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
