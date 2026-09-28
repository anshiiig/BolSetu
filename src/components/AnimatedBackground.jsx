import React, { useMemo } from 'react';

/**
 * AnimatedBackground: Ambient Literacy Wallpaper
 * Renders floating, glowing Indic literacy characters and glowing bokeh orbs
 * that gently float and drift, creating an alive, magical literacy atmosphere.
 */
export function AnimatedBackground({ theme = 'light' }) {
  // Pre-configured floating symbols with varying speeds, positions, and sizes
  const floatingGlyphs = useMemo(
    () => [
      { char: 'अ', left: '8%', top: '15%', size: '3.2rem', delay: '0s', duration: '18s', color: '#10B981' },
      { char: 'क', left: '88%', top: '22%', size: '3.6rem', delay: '2s', duration: '22s', color: '#6366F1' },
      { char: 'ఆ', left: '15%', top: '75%', size: '2.8rem', delay: '4s', duration: '20s', color: '#EC4899' },
      { char: 'அ', left: '82%', top: '68%', size: '3.0rem', delay: '1s', duration: '24s', color: '#F59E0B' },
      { char: 'ব', left: '4%', top: '45%', size: '2.6rem', delay: '3s', duration: '19s', color: '#06B6D4' },
      { char: 'म', left: '92%', top: '48%', size: '3.4rem', delay: '5s', duration: '21s', color: '#8B5CF6' },
      { char: 'A', left: '25%', top: '88%', size: '2.5rem', delay: '2.5s', duration: '25s', color: '#10B981' },
      { char: '✨', left: '50%', top: '10%', size: '1.8rem', delay: '0.5s', duration: '14s', color: '#FBBF24' },
      { char: 'ई', left: '72%', top: '12%', size: '3.0rem', delay: '3.5s', duration: '23s', color: '#3B82F6' },
      { char: '🌟', left: '35%', top: '65%', size: '1.6rem', delay: '1.5s', duration: '16s', color: '#F59E0B' },
      { char: 'ल', left: '68%', top: '85%', size: '2.9rem', delay: '4.5s', duration: '20s', color: '#14B8A6' },
    ],
    []
  );

  const isDark = theme === 'dark';

  return (
    <div
      className="animated-literacy-background"
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Ambient Gradient Glow Orbs */}
      <div
        className="ambient-glow-orb orb-top-left"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          maxWidth: '650px',
          maxHeight: '650px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(88, 204, 2, 0.12) 0%, rgba(28, 176, 246, 0.08) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'ambient-pulse 12s infinite alternate ease-in-out',
        }}
      />

      <div
        className="ambient-glow-orb orb-bottom-right"
        style={{
          position: 'absolute',
          bottom: '-15%',
          right: '-10%',
          width: '55vw',
          height: '55vw',
          maxWidth: '650px',
          maxHeight: '650px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, rgba(139, 92, 246, 0.06) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 159, 28, 0.10) 0%, rgba(236, 72, 153, 0.06) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'ambient-pulse 15s infinite alternate-reverse ease-in-out',
        }}
      />

      {/* Floating Indic Literacy Glyph Symbols */}
      {floatingGlyphs.map((g, idx) => (
        <span
          key={idx}
          className="floating-glyph"
          style={{
            position: 'absolute',
            left: g.left,
            top: g.top,
            fontSize: g.size,
            fontWeight: 900,
            fontFamily: "'Baloo 2', 'Noto Sans Devanagari', sans-serif",
            color: g.color,
            opacity: isDark ? 0.09 : 0.065,
            animation: `float-drift ${g.duration} infinite ease-in-out`,
            animationDelay: g.delay,
            transform: 'translate3d(0,0,0)',
            textShadow: isDark ? `0 0 20px ${g.color}` : 'none',
            userSelect: 'none',
          }}
        >
          {g.char}
        </span>
      ))}
    </div>
  );
}
