import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { logoutThunk, setUser, setAccessToken } from '../../redux/slices/authSlice';
import { useUI } from '../../context/UIContext';
import type { Currency } from '../../context/UIContext';
import { audioAlert } from '../../utils/audio';
import { apiClient } from '../../api/client';
import { RHLogo } from '../common/RHLogo';

const NAV_LINKS = [
  {
    label: 'Shop',
    href: '/shop',
    dropdown: [
      { label: 'All Products', href: '/shop' },
      { label: 'Men', href: '/shop/men' },
      { label: 'Women', href: '/shop/women' },
      { label: 'Kids', href: '/shop/kids' },
      { label: 'Shirts', href: '/shop/category/shirt' },
      { label: 'Hoodies & Sweats', href: '/shop/category/hoodie' },
      { label: 'Jackets & Outerwear', href: '/shop/category/jacket' },
      { label: 'Pants', href: '/shop/category/pant' },
      { label: 'Knitwear', href: '/shop/category/knitwear' },
      { label: 'Hats & Beanies', href: '/shop/category/hat' },
      { label: 'Accessories', href: '/shop/category/accessory' },
    ],
  },
  {
    label: 'Features',
    href: '#',
    dropdown: [
      { label: 'New Arrivals', href: '/shop?sort=newest' },
      { label: 'Best Sellers', href: '/shop?sort=popular' },
    ],
  },
  {
    label: 'Pages',
    href: '#',
    dropdown: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
];

const CURRENCIES = [
  { code: 'USD', label: 'US Dollar',       symbol: '$'  },
  { code: 'KHR', label: 'Cambodian Riel',  symbol: '៛'  },
] as const;

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 12px)',
  left: 0,
  background: '#ffffff',
  border: '1px solid #e8e2d9',
  boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
  minWidth: '200px',
  zIndex: 300,
  padding: '6px 0',
  animation: 'fadeIn 0.15s ease',
};

const iconBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: '#0f0f0f',
  padding: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.2s',
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  const { openCart, openSearch, currency, setCurrency, showToast } = useUI();
  const selectedCurrency = CURRENCIES.find(c => c.code === currency) ?? CURRENCIES[0];
  const { user } = useAppSelector((s) => s.auth);
  const cartItems = useAppSelector((s) => s.cart.items);
  const cartCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isMuted, setIsMuted] = useState(() => audioAlert.getMutedState());
  const [customerSession, setCustomerSession] = useState<string | null>(() => {
    if (typeof localStorage === 'undefined') return null;
    return localStorage.getItem('store_customer_token') ? 'Alice (Customer)' : null;
  });
  const [staffRole, setStaffRole] = useState<'WAREHOUSE' | 'ADMIN' | null>(() => {
    if (typeof localStorage === 'undefined') return null;
    const token = localStorage.getItem('store_staff_token');
    if (!token) return null;
    if (token.includes('admin') || token.includes('charlie')) return 'ADMIN';
    return 'WAREHOUSE';
  });

  const handlePersonaSwitch = async (role: 'CUSTOMER' | 'WAREHOUSE' | 'ADMIN') => {
    try {
      const res = await apiClient.post(`/auth/demo/${role}`);
      const { token, storageKey, user: demoUser } = res.data;
      localStorage.setItem(storageKey, token);

      if (role === 'CUSTOMER') {
        dispatch(setUser(demoUser));
        dispatch(setAccessToken(token));
        setCustomerSession(demoUser.name || 'Alice Customer');
        showToast(`Switched session to Customer: ${demoUser.name}`, 'success');
      } else {
        setStaffRole(demoUser.role);
        showToast(`Staff session activated: ${demoUser.name} (${demoUser.role})`, 'success');
      }
    } catch {
      // Offline fallback
      if (role === 'CUSTOMER') {
        const mockToken = 'jwt_demo_alice_customer';
        localStorage.setItem('store_customer_token', mockToken);
        const mockUser = { id: 'cust_001', name: 'Alice Customer', email: 'customer@shop.com', role: 'customer' };
        dispatch(setUser(mockUser));
        dispatch(setAccessToken(mockToken));
        setCustomerSession('Alice Customer');
        showToast('Active persona: Customer Alice', 'success');
      } else {
        const mockToken = role === 'WAREHOUSE' ? 'jwt_demo_bob_warehouse' : 'jwt_demo_charlie_admin';
        localStorage.setItem('store_staff_token', mockToken);
        setStaffRole(role);
        showToast(`Active staff persona: ${role}`, 'success');
      }
    }
  };

  const handleToggleMute = () => {
    const muted = audioAlert.toggleMute();
    setIsMuted(muted);
    showToast(muted ? 'Web Audio chime muted' : 'Web Audio chime enabled', 'info');
  };

  const handleTestChime = () => {
    audioAlert.playNewOrderChime();
    showToast('Synthesizing arrival chime (D5 -> A5)', 'info');
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setCurrencyOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const onEnter = (label: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpenDropdown(label);
  };
  const onLeave = () => {
    timerRef.current = setTimeout(() => setOpenDropdown(null), 120);
  };

  const handleLogout = () => {
    dispatch(logoutThunk());
    setCustomerSession(null);
    navigate('/auth/login');
    setUserMenuOpen(false);
  };

  const menuLink = (to: string, label: string, onClick?: () => void) => (
    <Link
      to={to}
      onClick={onClick}
      style={{ display: 'block', padding: '0.55rem 1.25rem', color: '#0f0f0f', textDecoration: 'none', fontSize: '0.8rem', transition: 'background 0.12s' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f8f5f1')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {label}
    </Link>
  );

  return (
    <>
      <header
        ref={navRef}
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 200,
          background: '#ffffff',
          borderBottom: `1px solid ${scrolled ? '#e8e2d9' : 'rgba(232,226,217,0.5)'}`,
          boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.05)' : 'none',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
          fontFamily: '"DM Sans", sans-serif',
        }}
      >
        {/* ── TOP DEMO CONTROL BAR (Multi-Role Isolated Persona Manager) ── */}
        <div
          style={{
            background: '#0f172a',
            color: '#e2e8f0',
            fontSize: '0.72rem',
            borderBottom: '1px solid #1e293b',
            padding: '0.4rem 1rem',
          }}
        >
          <div
            style={{
              maxWidth: '1440px',
              margin: '0 auto',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
            }}
          >
            {/* Left: Demo badge & Navigation Shortcuts */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a7f3d0' }} />
                DEMO BAR
              </span>

              <span style={{ color: '#475569' }}>|</span>

              <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                🛍️ Storefront
              </Link>
              <Link to="/fulfillment" style={{ color: '#93c5fd', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                📦 Warehouse Queue
              </Link>
              <Link to="/admin" style={{ color: '#fcd34d', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                📊 Admin Metrics
              </Link>
              <Link to="/track" style={{ color: '#86efac', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                📍 Live Tracker
              </Link>
            </div>

            {/* Right: 1-Click Persona Switcher & Session Status & Chime */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span style={{ color: '#94a3b8', fontSize: '0.7rem' }}>1-Click Persona:</span>

              {/* Customer Alice Button */}
              <button
                type="button"
                onClick={() => handlePersonaSwitch('CUSTOMER')}
                title="1-Click login as Customer Alice (sets store_customer_token)"
                style={{
                  background: customerSession ? '#065f46' : '#1e293b',
                  border: customerSession ? '1px solid #10b981' : '1px solid #334155',
                  color: '#ffffff',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>👤 Alice (Customer)</span>
                {customerSession && <span style={{ color: '#6ee7b7' }}>✓</span>}
              </button>

              {/* Warehouse Bob Button */}
              <button
                type="button"
                onClick={() => handlePersonaSwitch('WAREHOUSE')}
                title="1-Click login as Warehouse Bob (sets store_staff_token)"
                style={{
                  background: staffRole === 'WAREHOUSE' ? '#1e3a8a' : '#1e293b',
                  border: staffRole === 'WAREHOUSE' ? '1px solid #3b82f6' : '1px solid #334155',
                  color: '#ffffff',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>📦 Bob (Warehouse)</span>
                {staffRole === 'WAREHOUSE' && <span style={{ color: '#93c5fd' }}>✓</span>}
              </button>

              {/* Admin Charlie Button */}
              <button
                type="button"
                onClick={() => handlePersonaSwitch('ADMIN')}
                title="1-Click login as Admin Charlie (sets store_staff_token)"
                style={{
                  background: staffRole === 'ADMIN' ? '#78350f' : '#1e293b',
                  border: staffRole === 'ADMIN' ? '1px solid #f59e0b' : '1px solid #334155',
                  color: '#ffffff',
                  borderRadius: '4px',
                  padding: '2px 8px',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>🛡️ Charlie (Admin)</span>
                {staffRole === 'ADMIN' && <span style={{ color: '#fde68a' }}>✓</span>}
              </button>

              <span style={{ color: '#475569' }}>|</span>

              {/* Audio Chime Controls */}
              <button
                type="button"
                onClick={handleToggleMute}
                title="Toggle Web Audio arrival chimes on/off"
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: isMuted ? '#94a3b8' : '#38bdf8',
                  borderRadius: '4px',
                  padding: '2px 7px',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <span>{isMuted ? '🔈 Sound: OFF' : '🔊 Sound: ON'}</span>
              </button>

              <button
                type="button"
                onClick={handleTestChime}
                title="Test synthesized Web Audio dual-tone chime"
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  color: '#cbd5e1',
                  borderRadius: '4px',
                  padding: '2px 7px',
                  fontSize: '0.68rem',
                  cursor: 'pointer',
                }}
              >
                🔔 Test
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* LEFT — nav + mobile hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {/* Hamburger — mobile only */}
            {isMobile && (
              <button
                onClick={() => setMobileOpen(true)}
                style={{ ...iconBtn, gap: '6px', marginRight: '0.5rem', padding: '6px 8px' }}
                aria-label="Menu"
              >
                <svg width="20" height="15" viewBox="0 0 20 15" fill="none">
                  <path d="M0 1h20M0 7.5h20M0 14h20" stroke="#0f0f0f" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Menu</span>
              </button>
            )}

            {/* Desktop nav — hidden on mobile */}
            <nav style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center' }}>
              {NAV_LINKS.map((link) => (
                <div key={link.label} style={{ position: 'relative' }}>
                  {link.dropdown ? (
                    <>
                      <button
                        onMouseEnter={() => onEnter(link.label)}
                        onMouseLeave={onLeave}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#0f0f0f',
                          fontSize: '0.75rem',
                          letterSpacing: '0.09em',
                          textTransform: 'uppercase',
                          fontWeight: 500,
                          padding: '0 0.8rem',
                          height: '64px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontFamily: 'inherit',
                          whiteSpace: 'nowrap',
                          transition: 'opacity 0.2s',
                        }}
                        onMouseDown={() => navigate(link.href)}
                      >
                        {link.label}
                        <svg width="9" height="5" viewBox="0 0 9 5" fill="none" style={{ transition: 'transform 0.2s', transform: openDropdown === link.label ? 'rotate(180deg)' : 'none' }}>
                          <path d="M1 1l3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                        </svg>
                      </button>
                      {openDropdown === link.label && (
                        <div
                          onMouseEnter={() => onEnter(link.label)}
                          onMouseLeave={onLeave}
                          style={dropdownStyle}
                        >
                          {link.dropdown.map((item) => (
                            <Link
                              key={item.href}
                              to={item.href}
                              onClick={() => setOpenDropdown(null)}
                              style={{ display: 'block', padding: '0.6rem 1.25rem', color: '#0f0f0f', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '0.03em', transition: 'background 0.12s' }}
                              onMouseEnter={e => (e.currentTarget.style.background = '#f8f5f1')}
                              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={link.href}
                      style={{
                        textDecoration: 'none',
                        color: '#0f0f0f',
                        fontSize: '0.75rem',
                        letterSpacing: '0.09em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                        padding: '0 0.8rem',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'nowrap',
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* CENTER — RHshop Logo */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link
              to="/"
              style={{
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <RHLogo size={32} showText={true} />
            </Link>
          </div>

          {/* RIGHT — utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'flex-end' }}>
            {/* Currency — desktop only */}
            <div style={{ position: 'relative', display: isMobile ? 'none' : 'block' }}>
              <button
                onClick={() => { setCurrencyOpen(v => !v); setUserMenuOpen(false); }}
                style={{ ...iconBtn, fontSize: '0.7rem', letterSpacing: '0.06em', gap: '4px', padding: '6px 8px', fontFamily: 'inherit' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                <span>{selectedCurrency.code} {selectedCurrency.symbol}</span>
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none" style={{ transition: 'transform 0.2s', transform: currencyOpen ? 'rotate(180deg)' : 'none' }}>
                  <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </button>
              {currencyOpen && (
                <div style={{ ...dropdownStyle, left: 'auto', right: 0, minWidth: '180px' }}>
                  {CURRENCIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => { setCurrency(c.code as Currency); setCurrencyOpen(false); }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0.6rem 1.25rem', background: c.code === selectedCurrency.code ? '#f8f5f1' : 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: '#0f0f0f', fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.12s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f8f5f1')}
                      onMouseLeave={e => (e.currentTarget.style.background = c.code === selectedCurrency.code ? '#f8f5f1' : 'transparent')}
                    >
                      <span>{c.label}</span>
                      <span style={{ color: '#9a8f85' }}>{c.code} {c.symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>


            {/* Search */}
            <button onClick={openSearch} style={iconBtn} aria-label="Search" onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="7.5" cy="7.5" r="5.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="M11.5 11.5l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>

            {/* Account */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button onClick={() => { setUserMenuOpen(v => !v); setCurrencyOpen(false); }} style={iconBtn} aria-label="Account" onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')} onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M2 16c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div style={{ ...dropdownStyle, left: 'auto', right: 0, minWidth: '190px' }}>
                    <div style={{ padding: '0.75rem 1.25rem 0.6rem', borderBottom: '1px solid #e8e2d9', marginBottom: '4px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{user.name}</div>
                      <div style={{ fontSize: '0.72rem', color: '#9a8f85', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                    {menuLink('/profile', 'My Profile', () => setUserMenuOpen(false))}
                    {menuLink('/profile/orders', 'Order History', () => setUserMenuOpen(false))}
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} style={{ display: 'block', padding: '0.55rem 1.25rem', color: '#c4845e', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500, transition: 'background 0.12s' }} onMouseEnter={e => (e.currentTarget.style.background = '#f8f5f1')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Admin Panel</Link>
                    )}
                    <div style={{ borderTop: '1px solid #e8e2d9', marginTop: '4px' }}>
                      <button onClick={handleLogout} style={{ display: 'block', width: '100%', padding: '0.55rem 1.25rem', background: 'none', border: 'none', color: '#9a8f85', fontSize: '0.8rem', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s' }} onMouseEnter={e => (e.currentTarget.style.background = '#f8f5f1')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/auth/login" style={iconBtn as React.CSSProperties} aria-label="Sign in" onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.5')} onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="5.5" r="3.5" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M2 16c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={openCart}
              style={{ ...iconBtn, position: 'relative' }}
              aria-label="Cart"
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.5')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M1 1.5h2.2l2.4 9.6a1 1 0 001 .75h7.6a1 1 0 00.96-.73L17 5.5H4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="7" cy="15.5" r="1.2" fill="currentColor" />
                <circle cx="13.5" cy="15.5" r="1.2" fill="currentColor" />
              </svg>
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    background: '#0f0f0f',
                    color: '#ffffff',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 2px',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 400, display: 'flex' }}>
          <div
            style={{
              width: '320px',
              maxWidth: '88vw',
              background: '#ffffff',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              animation: 'slideInLeft 0.28s ease',
              boxShadow: '4px 0 40px rgba(0,0,0,0.1)',
              fontFamily: '"DM Sans", sans-serif',
              overflowY: 'auto',
            }}
          >
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e8e2d9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <RHLogo size={28} showText={true} />
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 1l14 14M15 1L1 15" stroke="#0f0f0f" strokeWidth="1.4" strokeLinecap="round" /></svg>
              </button>
            </div>

            <nav style={{ flex: 1 }}>
              {NAV_LINKS.map((link) => (
                <div key={link.label}>
                  <Link
                    to={link.href === '#' ? '/' : link.href}
                    onClick={() => setMobileOpen(false)}
                    style={{ display: 'block', padding: '0.9rem 1.5rem', color: '#0f0f0f', textDecoration: 'none', fontSize: '0.78rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500, borderBottom: '1px solid rgba(232,226,217,0.6)' }}
                  >
                    {link.label}
                  </Link>
                  {link.dropdown && (
                    <div style={{ background: '#f8f5f1' }}>
                      {link.dropdown.map((item) => (
                        <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '0.65rem 2rem', color: '#374151', textDecoration: 'none', fontSize: '0.78rem', borderBottom: '1px solid rgba(232,226,217,0.4)' }}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #e8e2d9' }}>
              {user ? (
                <>
                  <div style={{ fontSize: '0.78rem', color: '#9a8f85', marginBottom: '0.75rem' }}>Signed in as {user.name}</div>
                  <button onClick={handleLogout} style={{ background: 'none', border: '1px solid #e8e2d9', padding: '0.55rem 1rem', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'inherit', width: '100%', color: '#0f0f0f' }}>Sign Out</button>
                </>
              ) : (
                <Link to="/auth/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', textAlign: 'center', padding: '0.7rem', background: '#0f0f0f', color: '#ffffff', textDecoration: 'none', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}>Sign In</Link>
              )}
            </div>
          </div>
          <div onClick={() => setMobileOpen(false)} style={{ flex: 1, background: 'rgba(0,0,0,0.35)' }} />
        </div>
      )}
    </>
  );
};

export { Navbar };
export default Navbar;
