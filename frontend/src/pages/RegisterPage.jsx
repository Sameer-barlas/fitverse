import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import PasswordInput from '../components/ui/PasswordInput.jsx';
import Button from '../components/ui/Button.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

export default function RegisterPage() {
  const { user, profile, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={profile ? '/dashboard' : '/onboarding'} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setBannerError('');
    setSubmitting(true);

    try {
      await register({ name, email, password });
      toast.success('Account created! Let\'s set up your profile.');
      navigate('/onboarding', { replace: true });
    } catch (err) {
      if (err.details) {
        setFieldErrors(err.details);
      } else {
        setBannerError(err.message || 'Could not create account');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0a1a14 0%, #0d2318 25%, #0f2d1e 50%, #0a1f16 75%, #071410 100%)',
      }}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-[#10B981]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#059669]/10 blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] text-white shadow-lg shadow-[#10B981]/30">
              <Dumbbell className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold text-[#F9FAFB]">FitVerse</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Create your account</h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            Get a personalized workout plan tailored to your stats
          </p>
        </div>

        <div className="rounded-2xl border border-[#10B981]/20 bg-[#0d1f17]/80 backdrop-blur-md p-6 shadow-xl shadow-black/40">
          {bannerError && (
            <div className="mb-4">
              <ErrorBanner message={bannerError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="register-name"
              label="Full name"
              type="text"
              autoComplete="name"
              placeholder="Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldErrors.name}
              required
            />

            <Input
              id="register-email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              required
            />

            <PasswordInput
              id="register-password"
              label="Password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              hint="Must be 8–72 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full mt-2"
            >
              Create Account
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#9CA3AF]">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#10B981] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
