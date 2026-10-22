export default function Badge({ children, variant = 'neutral', className = '' }) {
  const variants = {
    neutral: 'bg-[#1F2937] text-[#9CA3AF] border border-[#1E293B]',
    emerald: 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30',
    indigo: 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30',
    underweight: 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30',
    normal: 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30',
    overweight: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
    obese: 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
    beginner: 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30',
    intermediate: 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30',
    advanced: 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium capitalize ${variants[variant] || variants.neutral} ${className}`}
    >
      {children}
    </span>
  );
}
