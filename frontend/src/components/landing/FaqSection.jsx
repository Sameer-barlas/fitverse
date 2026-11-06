import { useState } from 'react';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Is FitVerse completely free?',
    a: 'Yes — FitVerse is 100% free. No subscription, no hidden fees, no credit card required. Create an account and start training in under a minute.',
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
    <section className="bg-[#0D1117] py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className={`text-center mb-14 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 px-4 py-1 text-xs font-semibold text-[#6366F1] uppercase tracking-widest mb-4">
            FAQs
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F9FAFB]">
            Frequently Asked Questions
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <FaqItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>
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
      className={`rounded-2xl border border-[#1E293B] bg-[#111827] overflow-hidden
        transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-[#1a2235] transition-colors cursor-pointer"
      >
        <span className="text-sm font-semibold text-[#F9FAFB]">{faq.q}</span>
        <ChevronDown
          className={`h-4 w-4 text-[#6B7280] shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-6 pb-5 text-sm text-[#9CA3AF] leading-relaxed">{faq.a}</p>
      </div>
    </div>
  );
}
