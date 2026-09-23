import React, { useState } from 'react';
import { Star, Lock, Check, Gift, Play, Sparkles, Trophy } from 'lucide-react';
import { CURRICULUM_STAGES, getCurriculumForLanguage } from '../data/curriculumData';
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

                {/* Milestone Chest between Stages */}
                <div style={{ margin: '14px 0' }}>
                  <div
                    className="milestone-chest"
                    onClick={() => {
                      sfx.playCoin();
                      if (onOpenChest) onOpenChest(stage.id);
                    }}
                    title="Milestone Reward Chest! Click for bonus Gems & XP"
                  >
                    🎁
                  </div>
                </div>
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

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                  marginBottom: '24px',
                  background: 'var(--bg-main)',
                  padding: '12px',
                  borderRadius: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {t.reward}
                  </span>
                  <strong style={{ color: '#15803D', fontSize: '1.1rem' }}>
                    +{selectedPreviewLevel.xpReward} XP
                  </strong>
                </div>
                <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                    {t.exercises}
                  </span>
                  <strong style={{ fontSize: '1.1rem' }}>
                    {selectedPreviewLevel.questions.length}
                  </strong>
                </div>
              </div>

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
