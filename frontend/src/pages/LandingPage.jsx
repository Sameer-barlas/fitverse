import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

// Landing sections
import HeroSection from '../components/landing/HeroSection.jsx';
import FeaturesSection from '../components/landing/FeaturesSection.jsx';
import StatsSection from '../components/landing/StatsSection.jsx';
import HowItWorksSection from '../components/landing/HowItWorksSection.jsx';
import WhyFitverseSection from '../components/landing/WhyFitverseSection.jsx';
import TestimonialsSection from '../components/landing/TestimonialsSection.jsx';
import FaqSection from '../components/landing/FaqSection.jsx';
import CtaBannerSection from '../components/landing/CtaBannerSection.jsx';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div
      className="min-h-screen flex flex-col text-[#F9FAFB]"
      style={{ background: 'linear-gradient(135deg, #060814 0%, #0a0d1a 40%, #080c18 70%, #060812 100%)' }}
    >
      {/* ── Sticky Navbar ── */}
      <header
        className="sticky top-0 z-30"
        style={{
          background: 'rgba(6,8,20,0.85)',
          borderBottom: '1px solid rgba(99,102,241,0.12)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-2.5">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white"
              style={{
                background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              }}
            >
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">FitVerse</span>
            </div>
          </div>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {['#features', '#how-it-works', '#faq'].map((href, i) => (
              <a
                key={href}
                href={href}
                className="transition-colors hover:text-white"
              >
                {['Features', 'How It Works', 'FAQ'][i]}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <button
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all hover:scale-105 cursor-pointer"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                    boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                  }}
                >
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <button
                    className="rounded-xl px-4 py-2 text-sm font-medium transition-colors cursor-pointer hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    Log In
                  </button>
                </Link>
                <Link to="/register">
                  <button
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-white transition-all hover:scale-105 cursor-pointer"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1, #7c3aed)',
                      boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                    }}
                  >
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Page Sections ── */}
      <main className="flex-1">
        <HeroSection user={user} />
        <StatsSection />
        <div id="features"><FeaturesSection /></div>
        <div id="how-it-works"><HowItWorksSection /></div>
        <WhyFitverseSection />
        <TestimonialsSection />
        <div id="faq"><FaqSection /></div>
        <CtaBannerSection user={user} />
      </main>

      {/* ── Footer ── */}
      <footer
        className="py-10"
        style={{
          background: 'rgba(6,8,20,0.8)',
          borderTop: '1px solid rgba(99,102,241,0.1)',
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #7c3aed)' }}
              >
                <Dumbbell className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-white">FitVerse</span>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {['#features', '#how-it-works', '#faq'].map((href, i) => (
                <a key={href} href={href} className="hover:text-white/60 transition-colors">
                  {['Features', 'How It Works', 'FAQ'][i]}
                </a>
              ))}
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-center sm:text-right max-w-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              FitVerse provides general fitness information and is not medical advice.
              Consult a physician before starting a new exercise programme.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
