export default function Select({
  label,
  id,
  options = [],
  error,
  placeholder,
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
      <select
        id={id}
        className={`w-full rounded-xl bg-[#1F2937] border px-3.5 py-2.5 text-sm text-[#F9FAFB] transition-colors focus:outline-none focus:ring-2 ${
          error
            ? 'border-[#EF4444] focus:ring-[#EF4444]'
            : 'border-[#1E293B] focus:border-[#10B981] focus:ring-[#10B981]/40'
        }`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const lbl = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val} className="bg-[#111827] text-[#F9FAFB]">
              {lbl}
            </option>
          );
        })}
      </select>
      {error && (
        <p className="mt-1 text-xs text-[#EF4444]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
