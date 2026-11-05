import React from 'react';

interface RHLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
}

export const RHLogo: React.FC<RHLogoProps> = ({
  className = '',
  size = 32,
  showText = true,
  textColor = '#0f172a',
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '9px',
        userSelect: 'none',
        lineHeight: 1,
        verticalAlign: 'middle',
      }}
    >
      {/* Sleek Geometric RH Monogram Emblem */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          flexShrink: 0,
          display: 'block',
        }}
      >
        <defs>
          <linearGradient id="rhGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0D9488" />
          </linearGradient>
          <linearGradient id="rhAccent" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="100%" stopColor="#2DD4BF" />
          </linearGradient>
        </defs>

        {/* Outer Rounded Hex/Diamond Retail Shield */}
        <rect
          x="3"
          y="3"
          width="42"
          height="42"
          rx="10"
          fill="url(#rhGrad)"
          stroke="#0F172A"
          strokeWidth="1.5"
        />

        {/* Inner Stylized 'R' Stem & Loop */}
        <path
          d="M13 14H21C23.7614 14 26 16.2386 26 19C26 21.7614 23.7614 24 21 24H13V14Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="13"
          y1="14"
          x2="13"
          y2="34"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M19 24L26 34"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Stylized 'H' Connected Right Bar & Crossbar */}
        <line
          x1="35"
          y1="14"
          x2="35"
          y2="34"
          stroke="url(#rhAccent)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <line
          x1="26"
          y1="24"
          x2="35"
          y2="24"
          stroke="url(#rhAccent)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Top Shopping Tag / Handle Notch */}
        <path
          d="M20 3C20 1.89543 20.8954 1 22 1H26C27.1046 1 28 1.89543 28 3V3.5H20V3Z"
          fill="#0D9488"
        />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            lineHeight: 1.05,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              letterSpacing: '0.04em',
              fontWeight: 700,
              fontSize: '1.2rem',
              color: textColor,
            }}
          >
            <span
              style={{
                fontFamily: '"Cormorant Garamond", Georgia, serif',
                fontWeight: 700,
                color: '#1e3a8a',
                fontSize: '1.35rem',
                letterSpacing: '0.06em',
              }}
            >
              RH
            </span>
            <span
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 600,
                color: '#0d9488',
                fontSize: '1.15rem',
                letterSpacing: '0.02em',
                marginLeft: '1px',
              }}
            >
              shop
            </span>
          </div>
          <span
            style={{
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#64748b',
              fontWeight: 500,
              marginTop: '1px',
              fontFamily: '"DM Sans", sans-serif',
            }}
          >
            Apparel & Lifestyle
          </span>
        </div>
      )}
    </div>
  );
};

export default RHLogo;
