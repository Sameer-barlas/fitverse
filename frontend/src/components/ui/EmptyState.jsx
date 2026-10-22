export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-[#111827] border border-[#1E293B] p-10 text-center">
      {Icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1F2937] text-[#10B981]">
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-base font-semibold text-[#F9FAFB]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-md text-sm text-[#9CA3AF]">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
