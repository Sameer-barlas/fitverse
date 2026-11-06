import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';
import { ArrowRight, ShieldCheck, Zap, Heart } from 'lucide-react';

export default function CtaBannerSection({ user }) {
  const [ref, visible] = useScrollAnimation(0.1);

  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className={`relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center
            transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
          style={{
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 70%, #1e1b4b 100%)',
            border: '1px solid rgba(167,139,250,0.3)',
            boxShadow: '0 24px 64px rgba(99,102,241,0.25), 0 0 0 1px rgba(99,102,241,0.2)',
          }}
        >
          {/* Decorative glowing blobs */}
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          {/* Top shimmer line */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.7), transparent)' }}
          />

          <div className="relative z-10">
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: ShieldCheck, label: 'Free Forever' },
                { icon: Zap, label: 'Instant Setup' },
                { icon: Heart, label: 'No Equipment Needed' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold text-white backdrop-blur-sm"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Icon className="h-3.5 w-3.5 text-violet-300" />
                  {label}
                </span>
              ))}
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
              Your Strongest Self
              <br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(135deg, #c4b5fd, #e0e7ff, #ffffff)' }}
              >
                Starts Today.
              </span>
            </h2>
            <p className="max-w-xl mx-auto text-base sm:text-lg mb-10 text-indigo-100/70">
              Join thousands of athletes who train smarter with personalised plans, structured
              logging, and real analytics — completely free.
            </p>

            {user ? (
              <Link to="/dashboard">
                <button
                  className="inline-flex items-center gap-2.5 rounded-2xl bg-white text-indigo-950 font-bold px-8 py-4 text-base transition-all hover:scale-105 hover:bg-indigo-50 hover:shadow-2xl active:scale-95 cursor-pointer shadow-xl"
                >
                  Open Dashboard
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <button
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-white text-indigo-950 font-bold px-8 py-4 text-base transition-all hover:scale-105 hover:bg-indigo-50 hover:shadow-2xl active:scale-95 cursor-pointer shadow-xl"
                  >
                    Start Free Account
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
                <Link to="/login">
                  <button
                    className="inline-flex items-center gap-2 rounded-2xl text-white font-semibold px-8 py-4 text-base transition-all hover:bg-white/15 backdrop-blur-sm cursor-pointer"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.15)',
                    }}
                  >
                    Sign In
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
