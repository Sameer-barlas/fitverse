import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({
  label,
  id,
  error,
  hint,
  className = '',
  ...props
}) {
  const [show, setShow] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-[#F9FAFB] mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={`w-full rounded-xl bg-[#1F2937] border px-3.5 py-2.5 pr-10 text-sm text-[#F9FAFB] placeholder-[#9CA3AF]/60 transition-colors focus:outline-none focus:ring-2 ${
            error
              ? 'border-[#EF4444] focus:ring-[#EF4444]'
              : 'border-[#1E293B] focus:border-[#10B981] focus:ring-[#10B981]/40'
          }`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#9CA3AF] hover:text-[#10B981] transition-colors cursor-pointer"
          tabIndex={-1}
        >
          {show ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {hint && !error && (
        <p className="mt-1 text-xs text-[#9CA3AF]">{hint}</p>
      )}
      {error && (
        <p className="mt-1 text-xs text-[#EF4444]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
