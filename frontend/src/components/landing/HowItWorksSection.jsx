import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    description:
      'Sign up in under 60 seconds — no credit card, no spam. Just your email and a password.',
    color: '#10B981',
  },
  {
    step: '02',
    title: 'Set Up Your Profile',
    description:
      'Enter your age, height, weight, and experience level. FitVerse computes your BMI and picks the perfect plan.',
    color: '#6366F1',
  },
  {
    step: '03',
    title: 'Get Your Plan',
    description:
      'Unlock a personalised 3-, 4-, or 5-day home workout programme built for your body and fitness level.',
    color: '#F59E0B',
  },
  {
    step: '04',
    title: 'Train & Track',
    description:
      'Log every session, monitor volume trends, spot muscle-group imbalances, and crush new personal records.',
    color: '#EC4899',
  },
];

export default function HowItWorksSection() {
  const [headingRef, headingVisible] = useScrollAnimation(0.1);

  return (
    <section className="bg-[#0D1117] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className={`text-center mb-20 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 px-4 py-1 text-xs font-semibold text-[#6366F1] uppercase tracking-widest mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F9FAFB]">
            From Sign-Up to Sweat in 4 Steps
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden lg:block absolute top-8 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#1E293B] to-transparent" />

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
      className={`flex flex-col items-center text-center transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-14'
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Number circle */}
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 text-xl font-black"
        style={{ borderColor: step.color, color: step.color, background: `${step.color}10` }}
      >
        {step.step}
      </div>
      <CheckCircle2 className="mb-3 h-5 w-5" style={{ color: step.color }} />
      <h3 className="text-base font-semibold text-[#F9FAFB] mb-2">{step.title}</h3>
      <p className="text-sm text-[#9CA3AF] leading-relaxed">{step.description}</p>
    </div>
  );
}
