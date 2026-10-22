import Spinner from './Spinner.jsx';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const variants = {
    primary:
      'bg-[#10B981] text-[#0B0F17] font-semibold hover:bg-[#059669] hover:text-white focus:ring-[#10B981]',
    secondary:
      'bg-[#1F2937] text-[#F9FAFB] border border-[#1E293B] hover:bg-[#374151] focus:ring-[#6366F1]',
    indigo:
      'bg-[#6366F1] text-white font-semibold hover:bg-[#4F46E5] focus:ring-[#6366F1]',
    danger:
      'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 hover:bg-[#EF4444] hover:text-white focus:ring-[#EF4444]',
    ghost:
      'bg-transparent text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1F2937]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0F17] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
