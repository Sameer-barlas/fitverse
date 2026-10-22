import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';
import AppShell from './components/layout/AppShell.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ExercisesPage from './pages/ExercisesPage.jsx';
import PlansPage from './pages/PlansPage.jsx';
import PlanDetailPage from './pages/PlanDetailPage.jsx';
import WorkoutLoggerPage from './pages/WorkoutLoggerPage.jsx';
import WorkoutHistoryPage from './pages/WorkoutHistoryPage.jsx';
import WorkoutDetailPage from './pages/WorkoutDetailPage.jsx';
import ProgressPage from './pages/ProgressPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/onboarding"
        element={
          <ProtectedRoute requireProfile={false}>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/plan" element={<Navigate to="/plans" replace />} />
          <Route path="/plans/:id" element={<PlanDetailPage />} />
          <Route path="/exercises" element={<ExercisesPage />} />
          <Route path="/logs" element={<WorkoutHistoryPage />} />
          <Route path="/history" element={<Navigate to="/logs" replace />} />
          <Route path="/logs/new" element={<WorkoutLoggerPage />} />
          <Route path="/log/new" element={<Navigate to="/logs/new" replace />} />
          <Route path="/logs/:id" element={<WorkoutDetailPage />} />
          <Route path="/logs/:id/edit" element={<WorkoutLoggerPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
