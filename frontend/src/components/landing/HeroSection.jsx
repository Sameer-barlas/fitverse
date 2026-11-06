import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Dumbbell, Activity, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const floatingCards = [
  { icon: Activity, label: 'BMI-Aware Plan', sub: 'Computed for your body', color: '#a78bfa', pos: 'top-10 -left-6 sm:left-0' },
  { icon: TrendingUp, label: 'Weekly Volume', sub: '+12% this week', color: '#34d399', pos: 'bottom-20 -left-4 sm:-left-8' },
  { icon: Dumbbell, label: 'Session Logged', sub: '45 min · 8 exercises', color: '#fbbf24', pos: 'top-16 -right-4 sm:-right-10' },
];

export default function HeroSection({ user }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setTimeout(() => setMounted(true), 100); }, []);

  return (
    <section className="relative overflow-hidden mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-32">
      {/* Background gradient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full blur-3xl"
          style={{ background: 'rgba(99,102,241,0.12)' }} />
        <div className="absolute top-20 right-10 h-56 w-56 rounded-full blur-3xl"
          style={{ background: 'rgba(167,139,250,0.08)' }} />
        <div className="absolute bottom-10 left-10 h-48 w-48 rounded-full blur-3xl"
          style={{ background: 'rgba(124,58,237,0.07)' }} />
      </div>

      <div className="relative grid lg:grid-cols-2 gap-16 items-center">
        {/* Left: Text */}
        <div
          className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium mb-7"
            style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#a78bfa',
            }}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Science-backed home strength &amp; conditioning</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.08] mb-6">
            Train Smarter.
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #818cf8, #a78bfa, #c4b5fd)' }}
            >
              Track Every Rep.
            </span>
            <br />
            Own Your Gains.
          </h1>

          <p className="text-base sm:text-lg leading-relaxed mb-9 max-w-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Compute your BMI, unlock a personalised 3-, 4-, or 5-day home workout plan, and track
            every rep and second of real progress — completely free.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4 mb-10">
            {user ? (
              <Link to="/dashboard">
                <button
                  className="inline-flex items-center gap-2 rounded-2xl font-bold px-7 py-3.5 text-base text-white transition-all hover:scale-105 hover:shadow-2xl active:scale-95 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                    boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                  }}
                >
                  Open Dashboard <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl font-bold px-7 py-3.5 text-base text-white transition-all hover:scale-105 hover:shadow-2xl active:scale-95 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                      boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
                    }}
                  >
                    Start Free Account <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link to="/login">
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl font-semibold px-7 py-3.5 text-base text-white/70 transition-all hover:text-white hover:scale-105 active:scale-95 cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-5 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {['No credit card', 'No equipment required', 'Free forever'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#a78bfa' }} />
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
          <div
            className="relative w-80 rounded-3xl p-6 shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(99,102,241,0.2)',
              boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1)',
            }}
          >
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)' }} />

            {/* Top bar */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>Today's Workout</p>
                <p className="text-sm font-semibold text-white mt-0.5">Upper Body A</p>
              </div>
              <div
                className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
              >
                <Dumbbell className="h-4 w-4" style={{ color: '#a78bfa' }} />
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
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>{ex.name}</span>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{ex.sets}</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: mounted ? `${ex.bar}%` : '0%',
                      transitionDelay: '600ms',
                      background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Stats row */}
            <div
              className="mt-5 grid grid-cols-3 gap-2 pt-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {[
                { label: 'Sets', value: '13' },
                { label: 'Reps', value: '168' },
                { label: 'PRs', value: '2 🏆' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-sm font-bold text-white">{s.value}</p>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
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
      className={`absolute ${card.pos} rounded-2xl px-3.5 py-2.5 shadow-xl
        transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{
        transitionDelay: `${700 + index * 150}ms`,
        background: 'rgba(10,13,30,0.9)',
        border: '1px solid rgba(99,102,241,0.2)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${card.color}20` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: card.color }} />
        </div>
        <div>
          <p className="text-xs font-semibold text-white leading-tight">{card.label}</p>
          <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{card.sub}</p>
        </div>
      </div>
    </div>
  );
}
