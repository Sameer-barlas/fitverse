import { AlertCircle } from 'lucide-react';
import Button from './Button.jsx';

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 px-4 py-3 text-sm text-[#EF4444]"
    >
      <div className="flex items-center gap-2.5">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span>{message}</span>
      </div>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
