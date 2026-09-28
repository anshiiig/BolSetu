import React from 'react';

/**
 * BolSetu Official Playful Mascot & Logo: "Setu" (The Wise Literacy Parakeet)
 * Features an adorable, bright parakeet wearing studio headphones,
 * symbolizing "Bol" (Voice) bridging to "Setu" (Literacy Bridge).
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
        filter: 'drop-shadow(0 4px 10px rgba(88, 204, 2, 0.4))',
        flexShrink: 0,
      }}
      className={animated ? 'mascot-logo-bounce' : ''}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Soft Outer Aura */}
        <circle cx="50" cy="50" r="46" fill="url(#bgGrad)" />

        {/* Headphone Band */}
        <path
          d="M 22 45 C 22 24 78 24 78 45"
          stroke="#3B82F6"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 28 42 C 28 27 72 27 72 42"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Mascot Body & Face (Plump, Cute Green Bird) */}
        <ellipse cx="50" cy="55" rx="32" ry="34" fill="url(#bodyGrad)" />
        {/* Lighter Belly Patch */}
        <ellipse cx="50" cy="62" rx="22" ry="22" fill="#86EFAC" opacity="0.6" />

        {/* Feather Tufts (Cheeks) */}
        <path d="M 18 56 Q 14 62 20 66" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />
        <path d="M 82 56 Q 86 62 80 66" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" />

        {/* Left Eye */}
        <ellipse cx="38" cy="48" rx="8" ry="10" fill="#FFFFFF" />
        <circle cx="39" cy="48" r="5" fill="#1E293B" />
        <circle cx="41" cy="45" r="2.2" fill="#FFFFFF" />
        <circle cx="37" cy="50" r="1.2" fill="#FFFFFF" />

        {/* Right Eye (Playful Big Eye) */}
        <ellipse cx="62" cy="48" rx="8" ry="10" fill="#FFFFFF" />
        <circle cx="61" cy="48" r="5" fill="#1E293B" />
        <circle cx="63" cy="45" r="2.2" fill="#FFFFFF" />
        <circle cx="59" cy="50" r="1.2" fill="#FFFFFF" />

        {/* Rosy Cheeks */}
        <circle cx="28" cy="56" r="4.5" fill="#F472B6" opacity="0.6" />
        <circle cx="72" cy="56" r="4.5" fill="#F472B6" opacity="0.6" />

        {/* Friendly Orange Beak */}
        <path
          d="M 43 54 Q 50 63 57 54 Z"
          fill="#F97316"
          stroke="#EA580C"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <ellipse cx="50" cy="55" rx="2" ry="1" fill="#FDBA74" />

        {/* Left Headphone Ear Cup */}
        <rect
          x="12"
          y="42"
          width="12"
          height="22"
          rx="6"
          fill="url(#headphoneGrad)"
          stroke="#1D4ED8"
          strokeWidth="2"
        />
        {/* Headphone Accent Ring */}
        <circle cx="18" cy="53" r="3.5" fill="#FBBF24" />

        {/* Right Headphone Ear Cup */}
        <rect
          x="76"
          y="42"
          width="12"
          height="22"
          rx="6"
          fill="url(#headphoneGrad)"
          stroke="#1D4ED8"
          strokeWidth="2"
        />
        <circle cx="82" cy="53" r="3.5" fill="#FBBF24" />

        {/* Tiny Sparkle above forehead */}
        <path d="M 50 22 L 52 28 L 48 28 Z" fill="#F59E0B" />
        <circle cx="50" cy="20" r="2.5" fill="#FBBF24" />

        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="bgGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#58CC02" stopOpacity="0.2" />
            <stop offset="1" stopColor="#1CB0F6" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="bodyGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#64DE04" />
            <stop offset="0.5" stopColor="#58CC02" />
            <stop offset="1" stopColor="#22C55E" />
          </linearGradient>
          <linearGradient id="headphoneGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Full BolSetu Brand Header with Logo & Typography
 */
export function BolSetuBrandLogo({ subtitle, size = 44, onClick }) {
  return (
    <div
      className="bolsetu-brand-container"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: onClick ? 'pointer' : 'default',
        textDecoration: 'none',
        userSelect: 'none',
      }}
      title="BolSetu: AI-Powered Literacy Bridge"
    >
      <BolSetuMascotIcon size={size} animated={true} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <h1
            style={{
              fontSize: size > 40 ? '1.55rem' : '1.3rem',
              fontWeight: 900,
              margin: 0,
              background: 'linear-gradient(135deg, #10B981, #059669, #0284C7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
              lineHeight: 1.1,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            BolSetu
          </h1>
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 900,
              background: 'linear-gradient(135deg, #FFC800, #F59E0B)',
              color: '#451A03',
              padding: '2px 6px',
              borderRadius: '6px',
              lineHeight: 1,
              letterSpacing: '0.4px',
              boxShadow: '0 1px 3px rgba(245, 158, 11, 0.4)',
            }}
          >
            बोलसेतु
          </span>
        </div>
        {subtitle && (
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              marginTop: '1px',
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
}
