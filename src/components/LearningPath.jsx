import React, { useState } from 'react';
import { Star, Lock, Check, Gift, Play, Sparkles, Trophy } from 'lucide-react';
import { CURRICULUM_STAGES, getCurriculumForLanguage } from '../data/curriculumData';
import { LEVEL_REWARDS, STAGE_CHEST_REWARDS } from '../data/rewardsData';
import { UI_TRANSLATIONS } from '../data/uiTranslations';
import { sfx } from '../services/soundEffects';

export function LearningPath({
  targetLang = 'mr',
  uiLang = 'en',
  ageGroup = 'adult',
  userLevel = 1,
  completedLevels = [],
  levelScores = {},
  onStartLevel,
  onOpenChest,
}) {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;
  const curriculum = getCurriculumForLanguage(targetLang, uiLang, ageGroup);
  const [selectedPreviewLevel, setSelectedPreviewLevel] = useState(null);

  // Serpentine horizontal offsets for Duolingo-style curved path
  const xOffsets = [0, 45, 75, 45, 0, -45, -75, -45, 0, 45];

  const handleNodeClick = (level) => {
    const isUnlocked = level.levelId <= userLevel || completedLevels.includes(level.levelId);
    if (!isUnlocked) {
      sfx.playError();
      return;
    }
    sfx.playPop();
    setSelectedPreviewLevel(level);
  };

  return (
    <div className="learning-path-wrapper">
      {/* Serpentine Level Sequence */}
      <div className="path-canvas-container">
        {CURRICULUM_STAGES.map((stage) => {
          const stageLevels = curriculum.filter((l) => stage.levels.includes(l.levelId));

          return (
            <div key={stage.id} style={{ width: '100%', marginBottom: '32px' }}>
              {/* Stage Header Banner */}
              <div
                className="stage-header"
                style={{ '--stage-color': stage.themeColor }}
              >
                <div>
                  <div className="stage-title">{t[stage.titleKey] || stage.desc}</div>
                  <div className="stage-desc">{stage.desc}</div>
                </div>
                <span style={{ fontSize: '2rem' }}>{stage.icon}</span>
              </div>

              {/* Path Nodes for this Stage */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '36px' }}>
                {stageLevels.map((lvl) => {
                  const isCompleted = completedLevels.includes(lvl.levelId);
                  const isCurrent = lvl.levelId === userLevel && !isCompleted;
                  const isUnlocked = lvl.levelId <= userLevel || isCompleted;
                  const stars = levelScores[lvl.levelId]?.stars || 0;
                  const offset = xOffsets[(lvl.levelId - 1) % xOffsets.length];

                  return (
                    <div
                      key={lvl.levelId}
                      className="path-node-row"
                      style={{ transform: `translateX(${offset}px)` }}
                    >
                      <button
                        className={`node-btn ${
                          isCompleted
                            ? 'node-completed'
                            : isCurrent
                            ? 'node-active'
                            : isUnlocked
                            ? 'node-unlocked'
                            : 'node-locked'
                        }`}
                        onClick={() => handleNodeClick(lvl)}
                        disabled={!isUnlocked}
                        title={lvl.title}
                      >
                        {/* Stars Display on Top */}
                        {isCompleted && (
                          <div className="node-stars">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                size={14}
                                fill={s <= stars ? '#FBBF24' : '#D1D5DB'}
                                color={s <= stars ? '#F59E0B' : '#9CA3AF'}
                                className="star-icon"
                              />
                            ))}
                          </div>
                        )}

                        {/* Node Icon / Number */}
                        {isCompleted ? (
                          <Check size={36} strokeWidth={3} />
                        ) : isUnlocked ? (
                          <span style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                            {lvl.levelId}
                          </span>
                        ) : (
                          <Lock size={28} />
                        )}

                        {/* Level Label */}
                        <div className="node-label">{lvl.title}</div>
                      </button>
                    </div>
                  );
                })}

                {/* Milestone Chest between Stages with Progressive Rewards */}
                {STAGE_CHEST_REWARDS[stage.id] && (
                  <div
                    style={{
                      margin: '18px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <div
                      className="milestone-chest"
                      onClick={() => {
                        sfx.playCoin();
                        if (onOpenChest) onOpenChest(stage.id);
                      }}
                      title={`${STAGE_CHEST_REWARDS[stage.id].title} - Click to unlock +${STAGE_CHEST_REWARDS[stage.id].xp} XP & +${STAGE_CHEST_REWARDS[stage.id].gems} Gems!`}
                      style={{
                        position: 'relative',
                        cursor: 'pointer',
                        transform: 'scale(1.08)',
                      }}
                    >
                      <span style={{ fontSize: '2.4rem' }}>
                        {STAGE_CHEST_REWARDS[stage.id].icon || '🎁'}
                      </span>
                      <div
                        style={{
                          position: 'absolute',
                          top: '-6px',
                          right: '-6px',
                          background: '#58CC02',
                          color: '#000',
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          borderRadius: '999px',
                          padding: '2px 6px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        }}
                      >
                        +{STAGE_CHEST_REWARDS[stage.id].gems}💎
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        color: 'var(--text-muted)',
                        background: 'var(--bg-card)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      {STAGE_CHEST_REWARDS[stage.id].title}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Level Preview Popover Modal */}
      {selectedPreviewLevel && (
        <div className="modal-backdrop" onClick={() => setSelectedPreviewLevel(null)}>
          <div
            className="lesson-modal"
            style={{ maxWidth: '440px', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lesson-body" style={{ padding: '32px 24px' }}>
              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2rem',
                  fontWeight: 900,
                  margin: '0 auto 16px',
                  boxShadow: '0 6px 0 var(--primary-dark)',
                }}
              >
                {selectedPreviewLevel.levelId}
              </div>

              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px' }}>
                {selectedPreviewLevel.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '20px' }}>
                {selectedPreviewLevel.description}
              </p>

              {/* Progressive Rewards Preview Box */}
              {(() => {
                const lvlReward = LEVEL_REWARDS[selectedPreviewLevel.levelId] || { xp: 30, gems: 15, badge: '🌱 First Steps' };
                return (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      marginBottom: '24px',
                      background: 'var(--bg-main)',
                      padding: '12px 8px',
                      borderRadius: '16px',
                      border: '1.5px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
                        {t.reward || 'REWARD'}
                      </span>
                      <strong style={{ color: '#16A34A', fontSize: '1.05rem', fontWeight: 900 }}>
                        +{lvlReward.xp} XP
                      </strong>
                    </div>
                    <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
                        GEMS
                      </span>
                      <strong style={{ color: '#0284C7', fontSize: '1.05rem', fontWeight: 900 }}>
                        +{lvlReward.gems} 💎
                      </strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>
                        BADGE
                      </span>
                      <strong style={{ fontSize: '0.85rem', fontWeight: 800, whiteSpace: 'nowrap' }}>
                        {lvlReward.icon} {lvlReward.badge.split(' ')[1] || 'Badge'}
                      </strong>
                    </div>
                  </div>
                );
              })()}

              <button
                className="btn-3d btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
                onClick={() => {
                  const lvl = selectedPreviewLevel;
                  setSelectedPreviewLevel(null);
                  onStartLevel(lvl);
                }}
              >
                <Play size={20} fill="#fff" />
                {t.startLesson}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
