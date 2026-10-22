export default function Input({
  label,
  id,
  error,
  hint,
  className = '',
  ...props
}) {
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
      <input
        id={id}
        className={`w-full rounded-xl bg-[#1F2937] border px-3.5 py-2.5 text-sm text-[#F9FAFB] placeholder-[#9CA3AF]/60 transition-colors focus:outline-none focus:ring-2 ${
          error
            ? 'border-[#EF4444] focus:ring-[#EF4444]'
            : 'border-[#1E293B] focus:border-[#10B981] focus:ring-[#10B981]/40'
        }`}
        {...props}
      />
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
