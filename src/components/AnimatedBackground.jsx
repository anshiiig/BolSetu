import React, { useMemo } from 'react';

/**
 * AnimatedBackground: Ambient Literacy Wallpaper
 * Renders floating, glowing Indic literacy characters and radiant bokeh orbs
 * adjusted for clear, beautiful visibility in both light mode and dark mode.
 */
export function AnimatedBackground({ theme = 'light' }) {
  // Pre-configured floating symbols across Indic scripts
  const floatingGlyphs = useMemo(
    () => [
      { char: 'अ', left: '7%', top: '14%', size: '3.4rem', delay: '0s', duration: '18s', lightColor: '#059669', darkColor: '#34D399' },
      { char: 'क', left: '87%', top: '20%', size: '3.8rem', delay: '2s', duration: '22s', lightColor: '#4F46E5', darkColor: '#818CF8' },
      { char: 'ఆ', left: '14%', top: '72%', size: '3.0rem', delay: '4s', duration: '20s', lightColor: '#DB2777', darkColor: '#F472B6' },
      { char: 'அ', left: '83%', top: '65%', size: '3.2rem', delay: '1s', duration: '24s', lightColor: '#D97706', darkColor: '#FBBF24' },
      { char: 'ব', left: '5%', top: '44%', size: '2.8rem', delay: '3s', duration: '19s', lightColor: '#0891B2', darkColor: '#22D3EE' },
      { char: 'म', left: '91%', top: '46%', size: '3.6rem', delay: '5s', duration: '21s', lightColor: '#7C3AED', darkColor: '#A78BFA' },
      { char: 'A', left: '26%', top: '85%', size: '2.8rem', delay: '2.5s', duration: '25s', lightColor: '#059669', darkColor: '#4ADE80' },
      { char: '✨', left: '48%', top: '8%', size: '2.0rem', delay: '0.5s', duration: '14s', lightColor: '#EAB308', darkColor: '#FDE047' },
      { char: 'ई', left: '70%', top: '10%', size: '3.2rem', delay: '3.5s', duration: '23s', lightColor: '#2563EB', darkColor: '#60A5FA' },
      { char: '🌟', left: '34%', top: '62%', size: '1.8rem', delay: '1.5s', duration: '16s', lightColor: '#D97706', darkColor: '#FCD34D' },
      { char: 'ल', left: '66%', top: '82%', size: '3.1rem', delay: '4.5s', duration: '20s', lightColor: '#0D9488', darkColor: '#2DD4BF' },
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
      {/* Ambient Gradient Glow Orbs - Tuned for Vibrant Presence */}
      <div
        className="ambient-glow-orb orb-top-left"
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '55vw',
          height: '55vw',
          maxWidth: '650px',
          maxHeight: '650px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, rgba(16, 185, 129, 0.12) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(88, 204, 2, 0.22) 0%, rgba(28, 176, 246, 0.14) 50%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'ambient-pulse 12s infinite alternate ease-in-out',
        }}
      />

      <div
        className="ambient-glow-orb orb-bottom-right"
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '55vw',
          height: '55vw',
          maxWidth: '650px',
          maxHeight: '650px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle, rgba(236, 72, 153, 0.24) 0%, rgba(139, 92, 246, 0.14) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(255, 159, 28, 0.20) 0%, rgba(236, 72, 153, 0.12) 50%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'ambient-pulse 15s infinite alternate-reverse ease-in-out',
        }}
      />

      {/* Floating Indic Literacy Glyph Symbols */}
      {floatingGlyphs.map((g, idx) => {
        const glyphColor = isDark ? g.darkColor : g.lightColor;
        return (
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
              color: glyphColor,
              opacity: isDark ? 0.22 : 0.16,
              animation: `float-drift ${g.duration} infinite ease-in-out`,
              animationDelay: g.delay,
              transform: 'translate3d(0,0,0)',
              textShadow: isDark
                ? `0 0 18px ${glyphColor}99, 0 0 35px ${glyphColor}44`
                : `0 2px 8px ${glyphColor}44`,
              userSelect: 'none',
              filter: isDark ? 'brightness(1.2)' : 'none',
            }}
          >
            {g.char}
          </span>
        );
      })}
    </div>
  );
}

export default AnimatedBackground;
