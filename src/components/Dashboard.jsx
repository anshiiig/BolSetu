import React from 'react';
import {
  Award,
  BookOpen,
  Zap,
  Flame,
  Volume2,
  CheckCircle2,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { CURRICULUM_STAGES } from '../data/curriculumData';
import { UI_TRANSLATIONS, getLocalizedLanguageName } from '../data/uiTranslations';
import { ALPHABET_DATA } from '../data/alphabetData';
import { audioEngine } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';

export function Dashboard({
  targetLang = 'mr',
  uiLang = 'en',
  xp = 120,
  streak = 4,
  completedLevels = [1, 2],
  wordsMasteredList = [],
  pronunciationScores = [85, 92, 88],
  onOpenCertificate,
  currentUser,
}) {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;
  const langData = ALPHABET_DATA[targetLang] || ALPHABET_DATA.hi;
  const sampleWords = (langData.everydayWords || []).map((w) => w.word);

  const totalWords = Math.max(wordsMasteredList.length, completedLevels.length * 5 + 6);
  const avgPronunciation =
    pronunciationScores.length > 0
      ? Math.round(pronunciationScores.reduce((a, b) => a + b, 0) / pronunciationScores.length)
      : 88;

  const handleHearWord = (word) => {
    sfx.playPop();
    audioEngine.speak(word, targetLang);
  };

  const vocabDisplay = wordsMasteredList.length > 0 ? wordsMasteredList : sampleWords;
  const greeting = t.welcomeGreeting || 'Welcome back';
  const displayTitle = currentUser?.name ? `${greeting}, ${currentUser.name}!` : t.dashboardProfile;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Learner Profile Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED, #EC4899)',
          color: '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.25)',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div
            style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '3px solid rgba(255, 255, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
            }}
          >
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : '🦉'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.7rem', fontWeight: 900, marginBottom: '2px' }}>
              {displayTitle}
            </h2>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
              {currentUser?.email && <span style={{ opacity: 0.85 }}>{currentUser.email} • </span>}
              {t.targetLanguageLabel} <strong>{getLocalizedLanguageName(targetLang, uiLang)}</strong> • {t.activeLevelLabel}{' '}
              <strong>{completedLevels.length + 1}</strong>
            </div>
          </div>
        </div>

        <button
          className="btn-3d"
          style={{
            background: '#FFFFFF',
            color: '#4F46E5',
            boxShadow: '0 5px 0 #CBD5E1',
            padding: '12px 20px',
          }}
          onClick={() => {
            sfx.playPop();
            onOpenCertificate();
          }}
        >
          <Award size={20} color="#4F46E5" />
          <span>{t.viewCertificate}</span>
        </button>
      </div>

      {/* Daily Literacy Goal Progress Card */}
      <div
        style={{
          background: 'var(--bg-card)',
          border: '2px solid var(--border-subtle)',
          borderRadius: '18px',
          padding: '20px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Trophy size={22} color="#F59E0B" />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>{t.dailyGoal}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.dailyXp}</span>
            </div>
          </div>
          <strong style={{ fontSize: '1.1rem', color: 'var(--primary)' }}>
            {Math.min(xp, 100)} / 100 XP
          </strong>
        </div>

        <div style={{ height: '10px', background: 'var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min(100, (xp / 100) * 100)}%`,
              background: 'linear-gradient(90deg, #5B42F3, #F59E0B)',
              borderRadius: '10px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* 4 Key Metrics Cards */}
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'rgba(91, 66, 243, 0.1)', color: '#5B42F3' }}>
            <BookOpen size={28} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{totalWords}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t.wordsMastered}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'var(--secondary-light)', color: '#0284C7' }}>
            <CheckCircle2 size={28} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{completedLevels.length} / 10</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t.lessonsCompleted}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'var(--accent-gold-light)', color: '#D97706' }}>
            <TrendingUp size={28} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>{avgPronunciation}%</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t.pronunciationAvg}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: 'var(--danger-light)', color: '#DC2626' }}>
            <Flame size={28} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>
              {streak} {t.daysUnit || 'days'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {t.streakDays}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Mastery Breakdown */}
      <div className="soundboard-container">
        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '16px' }}>
          {t.stageProgress}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {CURRICULUM_STAGES.map((stage) => {
            const stageCompleted = stage.levels.filter((l) => completedLevels.includes(l)).length;
            const percent = Math.round((stageCompleted / stage.levels.length) * 100);

            return (
              <div key={stage.id} style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                    {stage.icon} {t[stage.titleKey] || stage.desc}
                  </div>
                  <strong style={{ color: stage.themeColor }}>{percent}%</strong>
                </div>

                <div style={{ height: '10px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${percent}%`,
                      background: stage.themeColor,
                      borderRadius: '10px',
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vocabulary Bank */}
      <div className="soundboard-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>
            📚 {t.vocabularyBank}
          </h3>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {t.tapToHear}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {vocabDisplay.map((word, idx) => (
            <div
              key={idx}
              className="word-bubble"
              onClick={() => handleHearWord(word)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px' }}
            >
              <Volume2 size={16} color="var(--secondary)" />
              <span>{word}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
