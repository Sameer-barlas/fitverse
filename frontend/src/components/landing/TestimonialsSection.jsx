import { useScrollAnimation } from '../../hooks/useScrollAnimation.js';

const testimonials = [
  {
    name: 'Aisha Rahman',
    role: 'Beginner · Age 24',
    avatar: 'AR',
    color: '#818cf8',
    text: 'I had zero gym experience. FitVerse gave me a 3-day home plan that actually matched my fitness level — no guesswork, just real results.',
  },
  {
    name: 'James Okoye',
    role: 'Intermediate · Age 31',
    avatar: 'JO',
    color: '#a78bfa',
    text: 'The progress analytics are incredible. Seeing my weekly volume trend upward keeps me motivated every single session.',
  },
  {
    name: 'Priya Kapoor',
    role: 'Advanced · Age 28',
    avatar: 'PK',
    color: '#fbbf24',
    text: 'I love that it adapts to my BMI and age. The 5-day split is challenging enough but not impossible — perfect balance.',
  },
  {
    name: 'Carlos Mendez',
    role: 'Beginner · Age 42',
    avatar: 'CM',
    color: '#34d399',
    text: "At 42 I thought fitness apps weren't for me. FitVerse is different — it actually knows I'm not 25 and plans accordingly.",
  },
  {
    name: 'Sophie Turner',
    role: 'Intermediate · Age 26',
    avatar: 'ST',
    color: '#38bdf8',
    text: "Logging workouts used to feel tedious. FitVerse pre-fills my plan day and I'm done in 30 seconds. Complete game changer.",
  },
  {
    name: 'Liam Chen',
    role: 'Advanced · Age 35',
    avatar: 'LC',
    color: '#fb923c',
    text: "Personal records per exercise is a feature I didn't know I needed. It instantly shows me where I've improved over time.",
  },
];

export default function TestimonialsSection() {
  const [headingRef, headingVisible] = useScrollAnimation(0.1);

  return (
    <section className="relative py-28" style={{ background: 'linear-gradient(180deg, rgba(13,16,37,0.4) 0%, rgba(6,8,20,0.8) 100%)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div
          ref={headingRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headingVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest mb-4"
            style={{
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#a78bfa',
            }}
          >
            Real Members
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Loved by FitVerse Athletes
          </h2>
          <p className="mt-4 text-base max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Real reviews from real people transforming their health at home.
          </p>
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
      className={`group rounded-3xl p-6 flex flex-col gap-4 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{
        transitionDelay: `${index * 100}ms`,
        background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      }}
    >
      {/* Stars */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="h-4 w-4 fill-[#fbbf24]" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="text-sm leading-relaxed flex-1 italic" style={{ color: 'rgba(255,255,255,0.7)' }}>
        "{testimonial.text}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 mt-2 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold text-white shadow-md"
          style={{
            background: `linear-gradient(135deg, ${testimonial.color}, #7c3aed)`,
            boxShadow: `0 4px 12px ${testimonial.color}40`,
          }}
        >
          {testimonial.avatar}
        </div>
        <div>
          <p className="text-sm font-bold text-white">{testimonial.name}</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}
