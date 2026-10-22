import { Link } from 'react-router-dom';
import { Dumbbell, Activity, ClipboardList, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';

export default function LandingPage() {
  const { user } = useAuth();

  const features = [
    {
      icon: Activity,
      title: 'BMI & Age-Aware Plans',
      description:
        '36 deterministic training splits tailored to your BMI category, experience level, and age band (18–80).',
    },
    {
      icon: Dumbbell,
      title: '76 Verified Home Exercises',
      description:
        'Curated movements using dumbbells, bands, and bodyweight — complete with step-by-step instructions and dual-frame photos.',
    },
    {
      icon: ClipboardList,
      title: 'Structured Session Logger',
      description:
        'Pre-fill workouts directly from your recommended plan day or log custom rep and timed sets in seconds.',
    },
    {
      icon: TrendingUp,
      title: 'Real Progress Analytics',
      description:
        'Track weekly volume, 28-day workout consistency, muscle group balance, and per-exercise personal records.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-[#F9FAFB]">
      <header className="border-b border-[#1E293B] bg-[#0B0F17]/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#10B981] text-[#0B0F17]">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">FitVerse</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 px-3.5 py-1 text-xs font-medium text-[#10B981] mb-6">
            <ShieldCheck className="h-4 w-4" />
            <span>Science-backed home strength & conditioning</span>
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl sm:text-5xl font-bold tracking-tight text-[#F9FAFB] leading-tight">
            Train Smarter With Plans Built for Your Body & Experience
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg text-[#9CA3AF]">
            Compute your BMI and healthy weight range, unlock a personalized 3-, 4-, or 5-day home
            workout plan, and track every rep and second of progress.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="lg">
                  Open Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="primary" size="lg">
                    Start Free Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <Card key={feat.title} className="flex flex-col justify-between">
                  <div>
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2937] text-[#10B981]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="text-base font-semibold text-[#F9FAFB]">{feat.title}</h2>
                    <p className="mt-2 text-sm text-[#9CA3AF] leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#1E293B] bg-[#111827]/60 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-xs text-[#9CA3AF]">
          FitVerse provides general fitness information and is not medical advice. Consult a
          physician before starting a new exercise program.
        </div>
      </footer>
    </div>
  );
}
