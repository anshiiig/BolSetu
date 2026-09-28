import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Zap, Sparkles, Check, ChevronRight } from 'lucide-react';
import { sfx } from '../services/soundEffects';

/**
 * RewardModal: Interactive Celebration Modal for Level & Chest Milestones
 * Replaces alerts with a Duolingo-style celebration popup with counters, confetti, and badge.
 */
export function RewardModal({
  isOpen,
  reward,
  uiLang = 'en',
  onClaim,
}) {
  const [displayXp, setDisplayXp] = useState(0);
  const [displayGems, setDisplayGems] = useState(0);

  useEffect(() => {
    if (!isOpen || !reward) return;

    sfx.playLevelComplete();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    // Animate counter upwards
    let currentX = 0;
    let currentG = 0;
    const targetXp = reward.xp || 0;
    const targetGems = reward.gems || 0;

    const interval = setInterval(() => {
      currentX += Math.ceil(targetXp / 15);
      currentG += Math.ceil(targetGems / 15);

      if (currentX >= targetXp) currentX = targetXp;
      if (currentG >= targetGems) currentG = targetGems;

      setDisplayXp(currentX);
      setDisplayGems(currentG);

      if (currentX === targetXp && currentG === targetGems) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isOpen, reward]);

  if (!isOpen || !reward) return null;

  const titleText =
    typeof reward.title === 'object'
      ? reward.title[uiLang] || reward.title.en || 'Milestone Reached!'
      : reward.title || 'Milestone Reached!';

  const descText =
    typeof reward.desc === 'object'
      ? reward.desc[uiLang] || reward.desc.en || 'Great job progressing on your literacy journey!'
      : reward.desc || 'Great job progressing on your literacy journey!';

  return (
    <div
      className="modal-backdrop"
      style={{
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fade-in 0.2s ease',
      }}
      onClick={onClaim}
    >
      <div
        className="reward-celebration-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg-card)',
          border: '3px solid var(--border-subtle)',
          borderRadius: '28px',
          maxWidth: '440px',
          width: '100%',
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'pop-up 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        {/* Glowing Ambient Halo */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '240px',
            height: '140px',
            background: 'radial-gradient(circle, rgba(88, 204, 2, 0.3) 0%, transparent 70%)',
            filter: 'blur(20px)',
            pointerEvents: 'none',
          }}
        />

        {/* Big Bouncing Milestone Icon */}
        <div
          style={{
            fontSize: '4.5rem',
            lineHeight: 1,
            marginBottom: '16px',
            animation: 'gentle-bounce 1.5s infinite ease-in-out',
            filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.15))',
          }}
        >
          {reward.icon || '🎁'}
        </div>

        {/* Milestone Title */}
        <h2
          style={{
            fontSize: '1.65rem',
            fontWeight: 900,
            margin: '0 0 6px',
            color: 'var(--text-main)',
          }}
        >
          {titleText}
        </h2>

        {/* Badge Pill */}
        {reward.badge && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.25))',
              border: '1.5px solid #F59E0B',
              color: '#B45309',
              padding: '4px 14px',
              borderRadius: '999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              marginBottom: '14px',
            }}
          >
            <span>{reward.badge}</span>
          </div>
        )}

        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.92rem',
            margin: '0 0 24px',
            lineHeight: 1.4,
          }}
        >
          {descText}
        </p>

        {/* Rewards Counter Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '26px',
          }}
        >
          {/* XP Tile */}
          <div
            style={{
              background: 'var(--bg-main)',
              border: '2px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '14px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16A34A', fontSize: '1.6rem', fontWeight: 900 }}>
              <Zap size={22} fill="#16A34A" />
              <span>+{displayXp}</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>
              XP PROGRESS
            </span>
          </div>

          {/* Gems Tile */}
          <div
            style={{
              background: 'var(--bg-main)',
              border: '2px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '14px 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontSize: '1.6rem', fontWeight: 900 }}>
              <span style={{ fontSize: '1.4rem' }}>💎</span>
              <span>+{displayGems}</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '2px' }}>
              GEMS EARNED
            </span>
          </div>
        </div>

        {/* Claim Rewards Button */}
        <button
          className="btn-3d btn-primary"
          onClick={() => {
            sfx.playSuccess();
            onClaim();
          }}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1.1rem',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <span>{uiLang === 'en' ? 'Claim Rewards' : 'पुरस्कार स्वीकार करें'}</span>
          <ChevronRight size={22} />
        </button>
      </div>
    </div>
  );
}
