import React from 'react';

/**
 * BolSetu Official Mascot & Logo: "Akshi" the Wise Owl
 * Features the signature owl with purple graduation cap and friendly cartoon eyes,
 * symbolizing wisdom, guidance, and joyful multilingual literacy learning.
 */
export function BolSetuMascotIcon({ size = 44, animated = true }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        filter: 'drop-shadow(0 4px 10px rgba(2, 132, 199, 0.35))',
        flexShrink: 0,
      }}
      className={animated ? 'mascot-logo-bounce' : ''}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="owlLogoBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
          <linearGradient id="owlLogoBellyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>
        </defs>

        {/* Owl Ears / Tufts */}
        <polygon points="24,18 36,34 16,32" fill="#0369A1" />
        <polygon points="76,18 84,32 64,34" fill="#0369A1" />

        {/* Owl Body */}
        <ellipse cx="50" cy="56" rx="36" ry="38" fill="url(#owlLogoBodyGrad)" />

        {/* Belly */}
        <ellipse cx="50" cy="64" rx="22" ry="24" fill="url(#owlLogoBellyGrad)" />
        {/* Feather markings */}
        <path
          d="M42,56 Q50,60 58,56 M44,64 Q50,68 56,64 M45,72 Q50,75 55,72"
          stroke="#CA8A04"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Wings */}
        <ellipse cx="16" cy="58" rx="8" ry="20" fill="#0284C7" transform="rotate(10 16 58)" />
        <ellipse cx="84" cy="58" rx="8" ry="20" fill="#0284C7" transform="rotate(-10 84 58)" />

        {/* Big Cartoon Eyes */}
        <circle cx="37" cy="42" r="14" fill="#FFFFFF" stroke="#0369A1" strokeWidth="2" />
        <circle cx="63" cy="42" r="14" fill="#FFFFFF" stroke="#0369A1" strokeWidth="2" />

        {/* Pupils with bright sparkle reflections */}
        <circle cx="39" cy="42" r="7" fill="#0F172A" />
        <circle cx="41" cy="40" r="2.5" fill="#FFFFFF" />
        <circle cx="61" cy="42" r="7" fill="#0F172A" />
        <circle cx="63" cy="40" r="2.5" fill="#FFFFFF" />

        {/* Friendly Orange Beak */}
        <polygon points="46,48 54,48 50,58" fill="#F97316" />

        {/* Cute Graduation / Scholar Cap */}
        <polygon points="50,10 78,19 50,26 22,19" fill="#4F46E5" />
        <rect x="40" y="24" width="20" height="6" rx="3" fill="#3730A3" />
        {/* Tassel */}
        <circle cx="50" cy="18" r="2.5" fill="#FBBF24" />
        <path d="M50,18 Q62,22 68,32" stroke="#FBBF24" strokeWidth="2" fill="none" />
        <circle cx="68" cy="33" r="3" fill="#FBBF24" />

        {/* Cute feet */}
        <ellipse cx="40" cy="93" rx="6" ry="3" fill="#EA580C" />
        <ellipse cx="60" cy="93" rx="6" ry="3" fill="#EA580C" />
      </svg>
    </div>
  );
}

export function BolSetuBrandLogo({
  mascotSize = 42,
  showTagline = true,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        cursor: onClick ? 'pointer' : 'default',
        userSelect: 'none',
      }}
    >
      <BolSetuMascotIcon size={mascotSize} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span
            style={{
              fontSize: '1.45rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: 'linear-gradient(135deg, #0284C7 0%, #4F46E5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Outfit', 'Inter', sans-serif",
            }}
          >
            BolSetu
          </span>
          <span
            style={{
              fontSize: '0.95rem',
              fontWeight: 800,
              color: '#F59E0B',
              fontFamily: "'Baloo 2', 'Noto Sans Devanagari', sans-serif",
            }}
          >
            बोलसेतु
          </span>
        </div>
        {showTagline && (
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginTop: '-2px',
            }}
          >
            Voice-to-Literacy Bridge
          </span>
        )}
      </div>
    </div>
  );
}

export default BolSetuBrandLogo;
