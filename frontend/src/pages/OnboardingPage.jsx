import { useState, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import { saveProfile } from '../api/profileApi.js';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';
import BmiCard from '../components/profile/BmiCard.jsx';

function computePreviewProfile(heightCm, weightKg, age, gender, experienceLevel) {
  const h = Number(heightCm);
  const w = Number(weightKg);
  const a = Number(age);
  if (!h || h < 100 || h > 250 || !w || w < 30 || w > 300 || !a || a < 18 || a > 80) {
    return null;
  }
  const hm = h / 100;
  const bmi = Number((w / (hm * hm)).toFixed(1));
  let bmiCategory = 'obese';
  if (bmi < 18.5) bmiCategory = 'underweight';
  else if (bmi <= 24.9) bmiCategory = 'normal';
  else if (bmi <= 29.9) bmiCategory = 'overweight';

  let ageBand = 'senior';
  if (a <= 39) ageBand = 'adult';
  else if (a <= 54) ageBand = 'midlife';

  const min = Number((18.5 * hm * hm).toFixed(1));
  const max = Number((24.9 * hm * hm).toFixed(1));

  return {
    heightCm: h,
    weightKg: w,
    age: a,
    gender,
    experienceLevel,
    bmi,
    bmiCategory,
    ageBand,
    healthyWeightRangeKg: { min, max },
  };
}

export default function OnboardingPage() {
  const { user, profile, setProfile } = useAuth();
  const navigate = useNavigate();

  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');
  const [age, setAge] = useState('28');
  const [gender, setGender] = useState('male');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const previewProfile = useMemo(
    () => computePreviewProfile(heightCm, weightKg, age, gender, experienceLevel),
    [heightCm, weightKg, age, gender, experienceLevel],
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (profile) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setBannerError('');
    setSubmitting(true);

    try {
      const data = await saveProfile({
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        age: Number(age),
        gender,
        experienceLevel,
      });
      setProfile(data.profile);
      toast.success('Profile saved! Your workout plan is ready.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.details) {
        setFieldErrors(err.details);
      } else {
        setBannerError(err.message || 'Could not save profile');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0d14] px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[#10B981] text-[#0B0F17]">
            <Dumbbell className="h-6 w-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#F9FAFB]">
            Complete Your Fitness Profile
          </h1>
          <p className="mt-1.5 text-sm text-[#9CA3AF]">
            We use your stats to calculate your BMI, healthy weight range, and match you to the
            ideal training split.
          </p>
        </div>

        <Card>
          {bannerError && (
            <div className="mb-4">
              <ErrorBanner message={bannerError} />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                id="onboard-height"
                label="Height (cm)"
                type="number"
                step="0.1"
                min="100"
                max="250"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                error={fieldErrors.heightCm}
                hint="100–250 cm"
                required
              />
              <Input
                id="onboard-weight"
                label="Weight (kg)"
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                error={fieldErrors.weightKg}
                hint="30–300 kg"
                required
              />
              <Input
                id="onboard-age"
                label="Age (years)"
                type="number"
                min="18"
                max="80"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                error={fieldErrors.age}
                hint="18–80 years"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="onboard-gender"
                label="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                error={fieldErrors.gender}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                  { value: 'other', label: 'Other' },
                ]}
              />

              <Select
                id="onboard-experience"
                label="Experience Level"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                error={fieldErrors.experienceLevel}
                options={[
                  { value: 'beginner', label: 'Beginner (New or returning)' },
                  { value: 'intermediate', label: 'Intermediate (6+ months consistent)' },
                  { value: 'advanced', label: 'Advanced (2+ years consistent)' },
                ]}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full"
            >
              Save Profile &amp; View My Plan
            </Button>
          </form>
        </Card>

        {previewProfile && (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
              Live BMI &amp; Category Preview
            </p>
            <BmiCard profile={previewProfile} />
          </div>
        )}
      </div>
    </div>
  );
}
