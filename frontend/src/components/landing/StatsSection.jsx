import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';

const stats = [
  { value: '76', suffix: '+', label: 'Home Exercises', color: '#818cf8', glow: 'rgba(99,102,241,0.2)' },
  { value: '36', suffix: '', label: 'Training Splits', color: '#a78bfa', glow: 'rgba(167,139,250,0.2)' },
  { value: '5', suffix: 'x', label: 'Days / Week Max', color: '#fb923c', glow: 'rgba(251,146,60,0.2)' },
  { value: '100', suffix: '%', label: 'Free to Use', color: '#34d399', glow: 'rgba(52,211,153,0.2)' },
];

export default function StatsSection() {
  const [ref, visible] = useScrollAnimation(0.1);

  return (
    <section className="relative overflow-hidden py-16">
      {/* Subtle divider & gradient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(99,102,241,0.04) 0%, rgba(6,8,20,0) 100%)',
          borderTop: '1px solid rgba(99,102,241,0.1)',
          borderBottom: '1px solid rgba(99,102,241,0.1)',
        }}
      />

      <div
        ref={ref}
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`relative text-center p-6 rounded-2xl transition-all duration-700 ${
                visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{
                transitionDelay: `${i * 100}ms`,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
              }}
            >
              <p
                className="text-4xl sm:text-5xl font-black tracking-tight"
                style={{
                  color: stat.color,
                  textShadow: `0 0 24px ${stat.glow}`,
                }}
              >
                {stat.value}
                <span className="text-2xl sm:text-3xl ml-0.5">{stat.suffix}</span>
              </p>
              <p className="mt-2 text-xs sm:text-sm font-medium tracking-wide" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
