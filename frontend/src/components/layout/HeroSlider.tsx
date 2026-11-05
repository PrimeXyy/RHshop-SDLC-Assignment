import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface Slide {
  id: number;
  label: string;
  headline: string;
  sub: string;
  cta: string;
  href: string;
  accent: string;
  bgGradient: string;
  image: string;
  badge: {
    tag: string;
    title: string;
    meta: string;
  };
}

const slides: Slide[] = [
  {
    id: 1,
    label: 'New Season Drop',
    headline: "Men's Collection",
    sub: 'Refined essentials, tailored silhouettes, and heavyweight organic cotton.',
    cta: 'Explore Men',
    href: '/shop/men',
    accent: '#38bdf8', // Sky Blue
    bgGradient: 'linear-gradient(90deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.82) 45%, rgba(15,23,42,0.3) 100%)',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1600&auto=format&fit=crop&q=85',
    badge: {
      tag: 'CRAFTED ESSENTIALS',
      title: 'Heavyweight Fleece & Oxford Weave',
      meta: '42 Styles Available',
    },
  },
  {
    id: 2,
    label: 'Exclusive Edit',
    headline: "Women's Edit",
    sub: 'Effortless tailoring, pure linen shirts, and relaxed high-rise cuts.',
    cta: 'Explore Women',
    href: '/shop/women',
    accent: '#f472b6', // Rose
    bgGradient: 'linear-gradient(90deg, rgba(26,18,30,0.95) 0%, rgba(26,18,30,0.82) 45%, rgba(26,18,30,0.3) 100%)',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85',
    badge: {
      tag: 'SPRING / SUMMER 2026',
      title: 'French Terry & Mulberry Silk',
      meta: 'New Drops This Week',
    },
  },
  {
    id: 3,
    label: 'Everyday Resilience',
    headline: 'Kids & Juniors',
    sub: 'Vibrant organic graphic tees, reinforced knee joggers, and cozy fleece.',
    cta: 'Explore Kids',
    href: '/shop/kids',
    accent: '#2dd4bf', // Teal
    bgGradient: 'linear-gradient(90deg, rgba(15,30,28,0.95) 0%, rgba(15,30,28,0.82) 45%, rgba(15,30,28,0.3) 100%)',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=1600&auto=format&fit=crop&q=85',
    badge: {
      tag: 'ORGANIC COTTON',
      title: 'Built For Play & Long Durability',
      meta: 'Sizes XS - XL',
    },
  },
];

const INTERVAL_MS = 5000;

export const HeroSlider = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = () => setActive((i) => (i + 1) % slides.length);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(advance, INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused]);

  const goTo = (idx: number) => {
    setActive(idx);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!paused) {
      intervalRef.current = setInterval(advance, INTERVAL_MS);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        transform: 'translateZ(0)',
        background: '#0f172a',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* slides track */}
      <div
        style={{
          display: 'flex',
          transition: 'transform 0.75s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: `translateX(-${active * 100}%)`,
          willChange: 'transform',
        }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            style={{
              minWidth: '100%',
              height: 'clamp(520px, 80vh, 760px)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box',
              overflow: 'hidden',
            }}
          >
            {/* Background Image */}
            <img
              src={slide.image}
              alt={slide.headline}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center 25%',
                transform: 'scale(1.02)',
                transition: 'transform 6s ease-out',
              }}
            />

            {/* Gradient Dark Overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: slide.bgGradient,
                zIndex: 1,
              }}
            />

            {/* Content Container */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                width: '100%',
                maxWidth: '1440px',
                margin: '0 auto',
                padding: '0 clamp(1.5rem, 6vw, 6rem)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem',
              }}
            >
              {/* Left Column: Headlines & CTA */}
              <div style={{ maxWidth: 620 }}>
                {/* Pill label */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${slide.accent}40`,
                    marginBottom: '1.25rem',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: slide.accent }} />
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: '"DM Sans", sans-serif',
                      fontWeight: 600,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: slide.accent,
                    }}
                  >
                    {slide.label}
                  </span>
                </div>

                {/* Main Headline */}
                <h1
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: 'clamp(2.75rem, 6vw, 4.8rem)',
                    fontWeight: 600,
                    lineHeight: 1.05,
                    color: '#f8fafc',
                    margin: '0 0 1.25rem',
                    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  }}
                >
                  {slide.headline}
                </h1>

                {/* Subtitle */}
                <p
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    fontSize: 'clamp(0.95rem, 1.5vw, 1.15rem)',
                    fontWeight: 300,
                    color: '#cbd5e1',
                    lineHeight: 1.6,
                    marginBottom: '2.25rem',
                    maxWidth: 480,
                  }}
                >
                  {slide.sub}
                </p>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link
                    to={slide.href}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: '#0f172a',
                      background: '#ffffff',
                      border: '1px solid #ffffff',
                      padding: '0.85rem 2.2rem',
                      textDecoration: 'none',
                      borderRadius: '2px',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = slide.accent;
                      e.currentTarget.style.borderColor = slide.accent;
                      e.currentTarget.style.color = '#0f172a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = '#ffffff';
                      e.currentTarget.style.color = '#0f172a';
                    }}
                  >
                    <span>{slide.cta}</span>
                    <span style={{ fontSize: '1.1rem' }}>&rarr;</span>
                  </Link>

                  <Link
                    to="/shop"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '0.82rem',
                      fontWeight: 500,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#e2e8f0',
                      border: '1px solid rgba(226,232,240,0.3)',
                      padding: '0.85rem 1.75rem',
                      textDecoration: 'none',
                      borderRadius: '2px',
                      backdropFilter: 'blur(6px)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ffffff';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(226,232,240,0.3)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    View All Catalog
                  </Link>
                </div>
              </div>

              {/* Right Column: Floating Editorial Card (Desktop) */}
              <div
                style={{
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'rgba(15,23,42,0.65)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  maxWidth: '320px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                }}
                className="hero-editorial-card"
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    letterSpacing: '0.14em',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: slide.accent,
                  }}
                >
                  {slide.badge.tag}
                </span>
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    color: '#f8fafc',
                    margin: 0,
                    lineHeight: 1.25,
                  }}
                >
                  {slide.badge.title}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '8px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                  }}
                >
                  <span>{slide.badge.meta}</span>
                  <span style={{ color: '#ffffff', fontWeight: 600 }}>RHshop Verified</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Indicators (Dots) */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: 'clamp(1.5rem, 6vw, 6rem)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          zIndex: 10,
        }}
      >
        {slides.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: idx === active ? '2.5rem' : '0.6rem',
              height: '0.45rem',
              borderRadius: '9999px',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              background: idx === active ? slides[active].accent : 'rgba(255,255,255,0.3)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: 'clamp(1.5rem, 6vw, 6rem)',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.6)',
          zIndex: 10,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(6px)',
          padding: '4px 12px',
          borderRadius: '9999px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </div>
  );
};

export default HeroSlider;
