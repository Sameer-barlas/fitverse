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
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#10B981] via-[#059669] to-[#047857] p-10 sm:p-16 text-center
            transition-all duration-700 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="relative">
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: ShieldCheck, label: 'Free Forever' },
                { icon: Zap, label: 'Instant Setup' },
                { icon: Heart, label: 'No Equipment Needed' },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1 text-xs font-medium text-white backdrop-blur-sm"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                </span>
              ))}
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-4">
              Your Strongest Self
              <br />
              Starts Today.
            </h2>
            <p className="text-green-100 max-w-xl mx-auto text-base sm:text-lg mb-10">
              Join thousands of members who train smarter with personalised plans, structured
              logging, and real analytics — completely free.
            </p>

            {user ? (
              <Link to="/dashboard">
                <button className="inline-flex items-center gap-2 rounded-xl bg-[#0B0F17] text-[#10B981] font-bold px-8 py-4 text-base hover:bg-[#1a2235] transition-colors cursor-pointer">
                  Open Dashboard
                  <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-[#0B0F17] text-[#10B981] font-bold px-8 py-4 text-base hover:bg-[#1a2235] transition-colors cursor-pointer">
                    Start Free Account
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="inline-flex items-center gap-2 rounded-xl bg-white/15 text-white font-semibold px-8 py-4 text-base hover:bg-white/25 transition-colors backdrop-blur-sm cursor-pointer">
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
