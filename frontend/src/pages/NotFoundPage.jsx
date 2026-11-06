import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Button from '../components/ui/Button.jsx';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0d14] px-4 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111827] border border-[#1E293B] text-[#10B981]">
        <Compass className="h-7 w-7" />
      </div>
      <h1 className="text-3xl font-bold text-[#F9FAFB] font-mono-num">404</h1>
      <p className="mt-2 max-w-sm text-sm text-[#9CA3AF]">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button variant="primary">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
