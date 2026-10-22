import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import QuoteLoader from '../QuoteLoader.jsx';

export default function ProtectedRoute({ requireProfile = true, children }) {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <QuoteLoader fullScreen statusText="Verifying session..." />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireProfile && !profile && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  return children ? children : <Outlet />;
}
