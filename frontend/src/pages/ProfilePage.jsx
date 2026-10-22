import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarRange } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth.js';
import { saveProfile } from '../api/profileApi.js';
import Card from '../components/ui/Card.jsx';
import Input from '../components/ui/Input.jsx';
import Select from '../components/ui/Select.jsx';
import Button from '../components/ui/Button.jsx';
import ErrorBanner from '../components/ui/ErrorBanner.jsx';
import BmiCard from '../components/profile/BmiCard.jsx';

export default function ProfilePage() {
  const { user, profile, setProfile } = useAuth();

  const [heightCm, setHeightCm] = useState(profile?.heightCm ? String(profile.heightCm) : '175');
  const [weightKg, setWeightKg] = useState(profile?.weightKg ? String(profile.weightKg) : '70');
  const [age, setAge] = useState(profile?.age ? String(profile.age) : '28');
  const [gender, setGender] = useState(profile?.gender || 'male');
  const [experienceLevel, setExperienceLevel] = useState(profile?.experienceLevel || 'beginner');

  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setHeightCm(String(profile.heightCm));
      setWeightKg(String(profile.weightKg));
      setAge(String(profile.age));
      setGender(profile.gender);
      setExperienceLevel(profile.experienceLevel);
    }
  }, [profile]);

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
      toast.success('Profile updated!');
    } catch (err) {
      if (err.details) {
        setFieldErrors(err.details);
      } else {
        setBannerError(err.message || 'Failed to update profile');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Your Profile &amp; Body Stats</h1>
          <p className="mt-1 text-sm text-[#9CA3AF]">
            Updating your height, weight, age, or experience level automatically updates your
            recommended workout plan.
          </p>
        </div>
        <Link to="/plans">
          <Button variant="secondary" size="sm">
            <CalendarRange className="h-4 w-4" />
            View Recommended Plan
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-5">
          <BmiCard profile={profile} />

          {user && (
            <Card className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-[#9CA3AF]">
                Account Details
              </p>
              <p className="text-base font-semibold text-[#F9FAFB]">{user.name}</p>
              <p className="text-sm text-[#9CA3AF]">{user.email}</p>
            </Card>
          )}
        </div>

        <div className="lg:col-span-7">
          <Card>
            <h2 className="text-lg font-semibold text-[#F9FAFB] mb-4">Edit Body Metrics</h2>

            {bannerError && (
              <div className="mb-4">
                <ErrorBanner message={bannerError} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  id="profile-height"
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
                  id="profile-weight"
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
                  id="profile-age"
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
                  id="profile-gender"
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
                  id="profile-experience"
                  label="Experience Level"
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  error={fieldErrors.experienceLevel}
                  options={[
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                  ]}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" loading={submitting}>
                  Save Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
