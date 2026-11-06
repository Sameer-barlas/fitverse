import { useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is FitVerse completely free?',
    a: 'Yes — FitVerse is 100% free. No subscription, no hidden paywalls, no credit card required. Create an account and start training in under a minute.',
  },
  {
    q: 'Do I need any gym equipment?',
    a: 'Most exercises use bodyweight only. Some plans include optional dumbbell or resistance-band movements, but every exercise has a bodyweight alternative.',
  },
  {
    q: 'How does FitVerse choose my plan?',
    a: 'We compute your BMI from your height and weight, combine it with your age and self-reported experience level, then match you to one of 36 deterministic training splits.',
  },
  {
    q: 'Can I change my plan later?',
    a: 'Absolutely. Update your profile at any time and your recommended plan will recalculate instantly to reflect any changes in your stats or goals.',
  },
  {
    q: 'What if I miss a workout day?',
    a: "Life happens. FitVerse tracks your 28-day consistency but doesn't penalise you. Just pick up where you left off — the plan will always be there.",
  },
  {
    q: 'Is this medical advice?',
    a: 'FitVerse provides general fitness information only. Consult a physician before starting any new exercise programme, especially if you have existing health conditions.',
  },
];

export default function FaqSection() {
  const [headingRef, headingVisible] = useScrollAnimation(0.1);

  return (
    <section className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-24">
      {/* Heading */}
      <div
        ref={headingRef}
        className={`text-center mb-14 transition-all duration-700 ${
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
          Frequently Asked Questions
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Got Questions? We’ve Got Answers
        </h2>
      </div>

      {/* Accordion */}
      <div className="flex flex-col gap-3.5">
        {faqs.map((faq, i) => (
          <FaqItem key={faq.q} faq={faq} index={i} />
        ))}
      </div>
    </section>
  );
}

function FaqItem({ faq, index }) {
  const [open, setOpen] = useState(false);
  const [ref, visible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`rounded-2xl overflow-hidden transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
      style={{
        transitionDelay: `${index * 70}ms`,
        background: open
          ? 'linear-gradient(145deg, rgba(99,102,241,0.1) 0%, rgba(255,255,255,0.02) 100%)'
          : 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: open ? '1px solid rgba(99,102,241,0.3)' : '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors cursor-pointer"
      >
        <span className={`text-sm sm:text-base font-semibold transition-colors ${open ? 'text-violet-300' : 'text-white'}`}>
          {faq.q}
        </span>
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-300"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180 text-violet-400' : 'text-white/40'}`}
          />
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {faq.a}
        </p>
      </div>
    </div>
  );
}
