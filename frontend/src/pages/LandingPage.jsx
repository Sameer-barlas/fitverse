import { Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/ui/Button.jsx';

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
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-[#F9FAFB]">
      {/* ── Sticky Navbar ── */}
      <header className="border-b border-[#1E293B] bg-[#0B0F17]/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981] text-[#0B0F17]">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">FitVerse</span>
          </div>

          {/* Nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-[#9CA3AF]">
            <a href="#features" className="hover:text-[#F9FAFB] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#F9FAFB] transition-colors">How It Works</a>
            <a href="#faq" className="hover:text-[#F9FAFB] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Page Sections ── */}
      <main className="flex-1">
        {/* 1. Hero */}
        <HeroSection user={user} />

        {/* 2. Stats bar */}
        <StatsSection />

        {/* 3. Features grid */}
        <div id="features">
          <FeaturesSection />
        </div>

        {/* 4. How it works */}
        <div id="how-it-works">
          <HowItWorksSection />
        </div>

        {/* 5. Why FitVerse */}
        <WhyFitverseSection />

        {/* 6. Testimonials */}
        <TestimonialsSection />

        {/* 7. FAQ */}
        <div id="faq">
          <FaqSection />
        </div>

        {/* 8. Final CTA banner */}
        <CtaBannerSection user={user} />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-[#1E293B] bg-[#0D1117] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#10B981] text-[#0B0F17]">
                <Dumbbell className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold">FitVerse</span>
            </div>

            {/* Links */}
            <div className="flex gap-6 text-xs text-[#6B7280]">
              <a href="#features" className="hover:text-[#9CA3AF] transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-[#9CA3AF] transition-colors">How It Works</a>
              <a href="#faq" className="hover:text-[#9CA3AF] transition-colors">FAQ</a>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-[#6B7280] text-center sm:text-right max-w-xs">
              FitVerse provides general fitness information and is not medical advice.
              Consult a physician before starting a new exercise programme.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
