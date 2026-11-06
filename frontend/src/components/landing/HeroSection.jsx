import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Dumbbell, Activity, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const floatingCards = [
  { icon: Activity, label: 'BMI-Aware Plan', sub: 'Computed for your body', color: '#10B981', pos: 'top-10 -left-6 sm:left-0' },
  { icon: TrendingUp, label: 'Weekly Volume', sub: '+12% this week', color: '#6366F1', pos: 'bottom-20 -left-4 sm:-left-8' },
  { icon: Dumbbell, label: 'Session Logged', sub: '45 min · 8 exercises', color: '#F59E0B', pos: 'top-16 -right-4 sm:-right-10' },
];

export default function HeroSection({ user }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <section className="relative overflow-hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28">
      {/* Background gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-[#10B981]/10 blur-3xl" />
        <div className="absolute top-20 right-10 h-48 w-48 rounded-full bg-[#6366F1]/8 blur-3xl" />
      </div>

      <div className="relative grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div
          className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 px-3.5 py-1.5 text-xs font-medium text-[#10B981] mb-7">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Science-backed home strength &amp; conditioning</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#F9FAFB] leading-[1.1] mb-6">
            Train Smarter.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#34D399]">
              Track Every Rep.
            </span>
            <br />
            Own Your Gains.
          </h1>

          <p className="text-[#9CA3AF] text-base sm:text-lg leading-relaxed mb-9 max-w-lg">
            Compute your BMI, unlock a personalised 3-, 4-, or 5-day home workout plan, and track
            every rep and second of real progress — completely free.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            {user ? (
              <Link to="/dashboard">
                <button className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] text-[#0B0F17] font-bold px-7 py-3.5 text-base hover:bg-[#059669] transition-colors cursor-pointer">
                  Open Dashboard <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-[#10B981] text-[#0B0F17] font-bold px-7 py-3.5 text-base hover:bg-[#059669] transition-colors cursor-pointer">
                    Start Free Account <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-[#1F2937] text-[#F9FAFB] font-semibold px-7 py-3.5 text-base border border-[#374151] hover:bg-[#374151] transition-colors cursor-pointer">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-5 text-xs text-[#6B7280]">
            {['No credit card', 'No equipment required', 'Free forever'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Visual card */}
        <div
          className={`relative hidden lg:flex items-center justify-center transition-all duration-1000 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {/* Main dashboard mockup card */}
          <div className="relative w-80 rounded-3xl border border-[#1E293B] bg-[#111827] p-6 shadow-2xl shadow-black/50">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs text-[#6B7280]">Today's Workout</p>
                <p className="text-sm font-semibold text-[#F9FAFB] mt-0.5">Upper Body A</p>
              </div>
              <div className="h-9 w-9 rounded-xl bg-[#10B981]/15 flex items-center justify-center">
                <Dumbbell className="h-4 w-4 text-[#10B981]" />
              </div>
            </div>

            {/* Exercise list mockup */}
            {[
              { name: 'Push-Up', sets: '4×12', bar: 85 },
              { name: 'Dumbbell Row', sets: '3×10', bar: 70 },
              { name: 'Shoulder Press', sets: '3×8', bar: 60 },
              { name: 'Tricep Dip', sets: '3×15', bar: 90 },
            ].map((ex) => (
              <div key={ex.name} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-[#D1D5DB]">{ex.name}</span>
                  <span className="text-xs text-[#6B7280]">{ex.sets}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#1E293B]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] transition-all duration-1000"
                    style={{ width: mounted ? `${ex.bar}%` : '0%', transitionDelay: '600ms' }}
                  />
                </div>
              </div>
            ))}

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-[#1E293B]">
              {[
                { label: 'Sets', value: '13' },
                { label: 'Reps', value: '168' },
                { label: 'PRs', value: '2 🏆' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-sm font-bold text-[#F9FAFB]">{s.value}</p>
                  <p className="text-xs text-[#6B7280]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating mini cards */}
          {floatingCards.map((card, i) => (
            <FloatingCard key={card.label} card={card} index={i} mounted={mounted} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FloatingCard({ card, index, mounted }) {
  const Icon = card.icon;
  return (
    <div
      className={`absolute ${card.pos} rounded-2xl border border-[#1E293B] bg-[#0D1117]/90 backdrop-blur px-3.5 py-2.5 shadow-xl
        transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${700 + index * 150}ms` }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${card.color}20` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: card.color }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-[#F9FAFB] leading-tight">{card.label}</p>
          <p className="text-[10px] text-[#6B7280]">{card.sub}</p>
        </div>
      </div>
    </div>
  );
}
