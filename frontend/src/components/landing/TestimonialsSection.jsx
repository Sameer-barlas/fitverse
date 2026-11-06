import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';

const testimonials = [
  {
    name: 'Aisha Rahman',
    role: 'Beginner · Age 24',
    avatar: 'AR',
    color: '#10B981',
    text: 'I had zero gym experience. FitVerse gave me a 3-day home plan that actually matched my fitness level — no guesswork, just results.',
  },
  {
    name: 'James Okoye',
    role: 'Intermediate · Age 31',
    avatar: 'JO',
    color: '#6366F1',
    text: 'The progress analytics are incredible. Seeing my weekly volume trend upward keeps me motivated every single session.',
  },
  {
    name: 'Priya Kapoor',
    role: 'Advanced · Age 28',
    avatar: 'PK',
    color: '#F59E0B',
    text: 'I love that it adapts to my BMI and age. The 5-day split is challenging enough but not impossible — perfect balance.',
  },
  {
    name: 'Carlos Mendez',
    role: 'Beginner · Age 42',
    avatar: 'CM',
    color: '#EC4899',
    text: 'At 42 I thought fitness apps weren\'t for me. FitVerse is different — it actually knows I\'m not 25 and plans accordingly.',
  },
  {
    name: 'Sophie Turner',
    role: 'Intermediate · Age 26',
    avatar: 'ST',
    color: '#10B981',
    text: 'Logging workouts used to feel tedious. FitVerse pre-fills my plan day and I\'m done in 30 seconds. Game changer.',
  },
  {
    name: 'Liam Chen',
    role: 'Advanced · Age 35',
    avatar: 'LC',
    color: '#6366F1',
    text: 'Personal records per exercise is a feature I didn\'t know I needed. It instantly shows me where I\'ve improved.',
  },
];

export default function TestimonialsSection() {
  const [headingRef, headingVisible] = useScrollAnimation(0.1);

  return (
    <section className="bg-[#0D1117] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block rounded-full bg-[#EC4899]/10 border border-[#EC4899]/30 px-4 py-1 text-xs font-semibold text-[#EC4899] uppercase tracking-widest mb-4">
            Real Members
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#F9FAFB]">
            Loved by Fitverse Members
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }) {
  const [ref, visible] = useScrollAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-[#1E293B] bg-[#111827] p-6 flex flex-col gap-4
        hover:border-[#374151] transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="h-4 w-4 fill-[#F59E0B]" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="text-sm text-[#D1D5DB] leading-relaxed flex-1">"{testimonial.text}"</p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-[#0B0F17]"
          style={{ backgroundColor: testimonial.color }}
        >
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#F9FAFB]">{testimonial.name}</p>
          <p className="text-xs text-[#6B7280]">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
