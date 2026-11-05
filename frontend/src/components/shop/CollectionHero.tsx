import { Link } from 'react-router-dom';

const CATEGORY_TABS = [
  { label: 'All', href: '/shop', category: '' },
  { label: 'Shirts', href: '/shop/category/shirt', category: 'shirt' },
  { label: 'Pants', href: '/shop/category/pant', category: 'pant' },
  { label: 'Hoodies', href: '/shop/category/hoodie', category: 'hoodie' },
  { label: 'Jackets', href: '/shop/category/jacket', category: 'jacket' },
  { label: 'Knitwear', href: '/shop/category/knitwear', category: 'knitwear' },
  { label: 'Accessories', href: '/shop/category/accessory', category: 'accessory' },
  { label: 'Hats', href: '/shop/category/hat', category: 'hat' },
];

interface CollectionHeroProps {
  title?: string;
  breadcrumbs?: { label: string; href?: string }[];
  activeCategory?: string;
  backgroundImage?: string;
}

const CollectionHero = ({
  title = 'Products',
  breadcrumbs = [{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, { label: 'Products' }],
  activeCategory,
  backgroundImage,
}: CollectionHeroProps) => {
  const getHeroBackground = () => {
    if (backgroundImage) return `url(${backgroundImage}) center/cover no-repeat`;
    const cat = activeCategory?.toLowerCase() || '';
    if (cat.includes('shirt')) return `url('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1600&auto=format&fit=crop&q=85') center/cover no-repeat`;
    if (cat.includes('jacket') || cat.includes('outerwear')) return `url('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1600&auto=format&fit=crop&q=85') center/cover no-repeat`;
    if (cat.includes('pant')) return `url('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1600&auto=format&fit=crop&q=85') center/cover no-repeat`;
    if (cat.includes('hoodie')) return `url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=1600&auto=format&fit=crop&q=85') center/cover no-repeat`;
    return `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=85') center/cover no-repeat`;
  };

  return (
    <section
      style={{
        position: 'relative',
        height: '420px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      {/* Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: getHeroBackground(),
          zIndex: 0,
        }}
      />
      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(15,23,42,0.65) 0%, rgba(15,23,42,0.85) 100%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          padding: '0 1.5rem',
          width: '100%',
          animation: 'fadeUp 0.4s ease',
        }}
      >
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol
            style={{
              display: 'flex',
              gap: '0.5rem',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              alignItems: 'center',
            }}
          >
            {breadcrumbs.map((crumb, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {i > 0 && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ opacity: 0.5 }}>
                    <path d="M4 2l4 4-4 4" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    style={{
                      color: 'rgba(255,255,255,0.75)',
                      textDecoration: 'none',
                      fontSize: '0.72rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 400,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'white')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.75)')}
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span
                    style={{
                      color: 'rgba(255,255,255,0.9)',
                      fontSize: '0.72rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: 400,
                    }}
                  >
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Title */}
        <h1
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: 500,
            color: '#ffffff',
            letterSpacing: '0.06em',
            margin: 0,
            textAlign: 'center',
            lineHeight: 1.1,
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
          }}
        >
          {title}
        </h1>

        {/* Category tabs */}
        <nav style={{ marginTop: '0.5rem' }} aria-label="Category filter">
          <ul
            style={{
              display: 'flex',
              gap: '0',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = !activeCategory
                ? !tab.category
                : tab.category.toLowerCase() === activeCategory.toLowerCase();
              return (
                <li key={tab.label}>
                  <Link
                    to={tab.href}
                    style={{
                      display: 'block',
                      padding: '0.4rem 1rem',
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.65)',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontWeight: isActive ? 600 : 400,
                      borderBottom: isActive ? '2px solid rgba(255,255,255,0.9)' : '2px solid transparent',
                      paddingBottom: '0.4rem',
                      transition: 'color 0.2s, border-color 0.2s',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)'; }}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default CollectionHero;
