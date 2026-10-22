export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-2xl bg-[#111827] border border-[#1E293B] p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
