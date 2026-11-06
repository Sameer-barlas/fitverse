import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    description:
      'Sign up in under 60 seconds — no credit card, no spam. Just your email and a password.',
    color: '#818cf8',
  },
  {
    step: '02',
    title: 'Set Up Your Profile',
    description:
      'Enter your age, height, weight, and experience level. FitVerse computes your BMI and matches your plan.',
    color: '#a78bfa',
  },
  {
    step: '03',
    title: 'Get Your AI Plan',
    description:
      'Unlock a personalised 3-, 4-, or 5-day home workout programme built for your exact fitness profile.',
    color: '#fb923c',
  },
  {
    step: '04',
    title: 'Train & Track',
    description:
      'Log every session, monitor volume trends, spot muscle imbalances, and crush new personal records.',
    color: '#34d399',
  },
];

export default function HowItWorksSection() {
  const [headingRef, headingVisible] = useScrollAnimation(0.1);

  return (
    <section className="relative py-28" style={{ background: 'linear-gradient(180deg, rgba(13,16,37,0.4) 0%, rgba(6,8,20,0.8) 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className={`text-center mb-20 transition-all duration-700 ${
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
            Simple Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            From Sign-Up to Sweat in 4 Steps
          </h2>
          <p className="mt-4 text-base max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Start your fitness transformation without the overwhelming complexity.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div
            className="hidden lg:block absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(167,139,250,0.4), transparent)' }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <StepCard key={s.step} step={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, index }) {
  const [ref, visible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`relative flex flex-col items-center text-center p-6 rounded-3xl transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-14'
      }`}
      style={{
        transitionDelay: `${index * 150}ms`,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Number circle */}
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-black transition-transform hover:scale-105"
        style={{
          border: `1px solid ${step.color}50`,
          color: step.color,
          background: `${step.color}15`,
          boxShadow: `0 0 20px ${step.color}25`,
        }}
      >
        {step.step}
      </div>
      <CheckCircle2 className="mb-3 h-5 w-5" style={{ color: step.color }} />
      <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{step.description}</p>
    </div>
  );
}
