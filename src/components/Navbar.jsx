import React from 'react';
import {
  User,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/audioEngine';
import { UI_TRANSLATIONS, getLocalizedLanguageName } from '../data/uiTranslations';
import { sfx } from '../services/soundEffects';
import { BolSetuBrandLogo } from './BolSetuLogo';

export function Navbar({
  activeTab,
  setActiveTab,
  targetLang,
  uiLang,
  currentUser,
  onOpenProfile,
  theme = 'light',
  toggleTheme,
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
      {/* Brand Logo - Playful BolSetu Mascot & Typography */}
      <BolSetuBrandLogo
        subtitle={t.tagline}
        onClick={() => handleTabClick('path')}
      />

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

      {/* Sleek, Decluttered Right Actions: Theme Toggle, Learning Lang, Profile */}
      <div className="nav-stats">
        {/* Permanent Top Theme Toggle Button */}
        {toggleTheme && (
          <button
            className="theme-toggle-btn"
            onClick={() => {
              sfx.playPop();
              toggleTheme();
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '2px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)',
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
          >
            {theme === 'dark' ? (
              <Sun size={18} color="#FBBF24" />
            ) : (
              <Moon size={18} color="#6366F1" />
            )}
          </button>
        )}

        {/* Active Learning Language Badge (Clickable to change) */}
        <button
          className="nav-lang-badge"
          onClick={handleProfileClick}
          title={`Currently Learning: ${currentLangObj.name} (Click to change)`}
        >
          <span style={{ fontSize: '1.1rem' }}>{currentLangObj.flag || '🇮🇳'}</span>
          <span className="lang-code-tag">{getLocalizedLanguageName(targetLang, uiLang)}</span>
        </button>

        {/* Unified Profile Trigger Avatar Pill */}
        <button
          className="nav-profile-pill"
          onClick={handleProfileClick}
          title="Open Profile & Settings"
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
