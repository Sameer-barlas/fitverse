import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Button from '../components/ui/Button.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';

export default function LoginPage() {
  const { user, profile, login } = useAuth();
  const navigate = useNavigate();

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
      const data = await login({ email, password });
      toast.success('Welcome back!');
      navigate(data?.profile ? '/dashboard' : '/onboarding', { replace: true });
    } catch (err) {
      if (err.details) {
        setFieldErrors(err.details);
      } else {
        setBannerError(err.message || 'Invalid email or password');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0F17] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <Link to="/" className="flex items-center gap-2.5 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981] text-[#0B0F17]">
              <Dumbbell className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-[#F9FAFB]">FitVerse</span>
          </Link>
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Sign in to your account</h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            Continue tracking your workouts and progress
          </p>
        </div>

        <Card>
          {bannerError && (
            <div className="mb-4">
              <ErrorBanner message={bannerError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="login-email"
              label="Email address"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              required
            />

            <Input
              id="login-password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
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
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#9CA3AF]">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-[#10B981] hover:underline">
              Create one
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
