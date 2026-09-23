import React from 'react';
import {
  Flame,
  Zap,
  Heart,
  User,
  ChevronDown,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/audioEngine';
import { UI_TRANSLATIONS, getLocalizedLanguageName } from '../data/uiTranslations';
import { sfx } from '../services/soundEffects';

export function Navbar({
  activeTab,
  setActiveTab,
  targetLang,
  uiLang,
  streak,
  xp,
  hearts,
  maxHearts = 5,
  onRefillHearts,
  currentUser,
  onOpenProfile,
}) {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  // Tracing is conditionally shown only for Hindi and Marathi
  const showTracing = ['hi', 'mr'].includes(targetLang);

  const handleTabClick = (tab) => {
    sfx.playPop();
    setActiveTab(tab);
  };

  const handleProfileClick = () => {
    sfx.playPop();
    if (onOpenProfile) onOpenProfile();
  };

  return (
    <header className="navbar">
      {/* Brand Logo - Crisp BolSetu */}
      <div className="nav-brand" onClick={() => handleTabClick('path')} title="BolSetu">
        <div className="brand-icon">बो</div>
        <div className="brand-text">
          <h1>BolSetu</h1>
          <span>{t.tagline}</span>
        </div>
      </div>

      {/* Center Navigation Tabs (Horizontally sliding on mobile devices) */}
      <nav className="nav-tabs" aria-label="Main Navigation">
        <button
          className={`tab-btn ${activeTab === 'path' ? 'active' : ''}`}
          onClick={() => handleTabClick('path')}
        >
          <span>🗺️</span>
          <span>{t.navPath}</span>
        </button>

        {showTracing && (
          <button
            className={`tab-btn ${activeTab === 'tracing' ? 'active' : ''}`}
            onClick={() => handleTabClick('tracing')}
          >
            <span>✍️</span>
            <span>{t.navTracing || 'Tracing'}</span>
          </button>
        )}

        <button
          className={`tab-btn ${activeTab === 'soundboard' ? 'active' : ''}`}
          onClick={() => handleTabClick('soundboard')}
        >
          <span>🔊</span>
          <span>{t.navSoundboard}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'games' ? 'active' : ''}`}
          onClick={() => handleTabClick('games')}
        >
          <span>🎮</span>
          <span>{t.navGames}</span>
        </button>

        <button
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleTabClick('dashboard')}
        >
          <span>📊</span>
          <span>{t.navDashboard}</span>
        </button>
      </nav>

      {/* Clean Right Side Stats & Profile Button */}
      <div className="nav-stats">
        {/* Streak Pill */}
        <div className="stat-pill stat-streak" title={`${streak} ${t.streak}`}>
          <Flame size={18} fill="#F97316" color="#EA580C" />
          <span>{streak}</span>
        </div>

        {/* XP Pill */}
        <div className="stat-pill stat-xp" title={`${xp} ${t.xp}`}>
          <Zap size={18} fill="#FF9F1C" color="#D97706" />
          <span>{xp}</span>
        </div>

        {/* Hearts Energy Pill */}
        <div
          className="stat-pill stat-hearts"
          title={`${hearts}/${maxHearts} ${t.hearts} (Click to refill)`}
          onClick={onRefillHearts}
        >
          <Heart size={18} fill="#EF4444" color="#DC2626" />
          <span>{hearts}</span>
          {hearts < maxHearts && <span style={{ fontSize: '0.75rem', opacity: 0.8, marginLeft: '2px' }}>+</span>}
        </div>

        {/* Active Learning Language Badge (Clickable to change) */}
        <button
          className="nav-lang-badge"
          onClick={handleProfileClick}
          title={`Currently Learning: ${currentLangObj.name} (Click to change)`}
        >
          <span style={{ fontSize: '1rem' }}>{currentLangObj.flag || '🇮🇳'}</span>
          <span className="lang-code-tag">{getLocalizedLanguageName(targetLang, uiLang)}</span>
        </button>

        {/* Unified Profile Trigger Avatar Pill */}
        <button
          className="nav-profile-pill"
          onClick={handleProfileClick}
          title="Open Profile & Settings (Change language, UI, personal details)"
        >
          <div className="nav-avatar">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User size={16} />}
          </div>
          <span className="nav-profile-name">
            {currentUser?.name || (uiLang === 'en' ? 'Profile' : 'प्रोफ़ाइल')}
          </span>
          <ChevronDown size={14} color="var(--text-muted)" className="nav-chevron" />
        </button>
      </div>
    </header>
  );
}
