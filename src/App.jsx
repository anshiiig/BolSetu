import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Mascot } from './components/Mascot';
import { LearningPath } from './components/LearningPath';
import { AksharTracing } from './components/AksharTracing';
import { Soundboard } from './components/Soundboard';
import { MiniGames } from './components/MiniGames';
import { Dashboard } from './components/Dashboard';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { PlacementTest } from './components/PlacementTest';
import { BaselineModal } from './components/BaselineModal';
import { LessonModal } from './components/LessonModal';
import { SarvamSettingsModal } from './components/SarvamSettingsModal';
import { CertificateModal } from './components/CertificateModal';
import { ProfileModal } from './components/ProfileModal';
import { AdminDashboard } from './components/AdminDashboard';
import { UI_TRANSLATIONS, getLocalizedLanguageName } from './data/uiTranslations';
import { SUPPORTED_LANGUAGES } from './services/audioEngine';
import { sfx } from './services/soundEffects';
import confetti from 'canvas-confetti';
import { Trophy, Sun, Moon, Sparkles, BookOpen, ChevronRight, User } from 'lucide-react';

export function App() {
  // Theme State: 'light' | 'dark'
  const [theme, setTheme] = useState(() => localStorage.getItem('akshar_theme') || 'light');

  // Authentication & User Profile State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('akshar_user_profile');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isAdminView, setIsAdminView] = useState(() => currentUser?.role === 'admin' || currentUser?.role === 'super_admin');
  const [authModalConfig, setAuthModalConfig] = useState({ isOpen: false, mode: 'register' });

  // Sync admin state when currentUser changes
  useEffect(() => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'super_admin') {
      setIsAdminView(true);
    }
  }, [currentUser]);

  // Navigation & Language State
  const [activeTab, setActiveTab] = useState('path'); // 'path' | 'tracing' | 'soundboard' | 'games' | 'dashboard'
  const [targetLang, setTargetLang] = useState(() => currentUser?.targetLang || localStorage.getItem('akshar_target_lang') || 'mr');
  const [uiLang, setUiLang] = useState(() => currentUser?.uiLang || localStorage.getItem('akshar_ui_lang') || 'en');
  const [ageGroup, setAgeGroup] = useState(() => currentUser?.ageGroup || 'adult'); // 'child' | 'adult' | 'senior'
  const [tracingChar, setTracingChar] = useState(null);

  // =========================================================================
  // ISOLATED PER-LANGUAGE LEARNING PROGRESS STATE
  // Each target language maintains its own userLevel, completedLevels, levelScores, and wordsMastered
  // =========================================================================
  const [languageProgress, setLanguageProgress] = useState(() => {
    try {
      const stored = localStorage.getItem('akshar_language_progress');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}

    // Fallback migration from legacy flat keys
    const legacyLevel = Number(localStorage.getItem('akshar_user_level')) || 1;
    let legacyCompleted = [];
    try {
      legacyCompleted = JSON.parse(localStorage.getItem('akshar_completed_levels')) || [];
    } catch {}
    let legacyScores = {};
    try {
      legacyScores = JSON.parse(localStorage.getItem('akshar_level_scores')) || {};
    } catch {}

    const initLang = localStorage.getItem('akshar_target_lang') || 'mr';
    return {
      [initLang]: {
        userLevel: legacyLevel,
        completedLevels: legacyCompleted,
        levelScores: legacyScores,
        wordsMasteredList: [],
      },
    };
  });

  // Current active language progress values
  const currentLangProg = languageProgress[targetLang] || {
    userLevel: 1,
    completedLevels: [],
    levelScores: {},
    wordsMasteredList: [],
  };

  const [userLevel, setUserLevel] = useState(currentLangProg.userLevel || 1);
  const [completedLevels, setCompletedLevels] = useState(currentLangProg.completedLevels || []);
  const [levelScores, setLevelScores] = useState(currentLangProg.levelScores || {});
  const [wordsMasteredList, setWordsMasteredList] = useState(currentLangProg.wordsMasteredList || []);

  const [xp, setXp] = useState(() => Number(localStorage.getItem('akshar_xp')) || 40);
  const [streak, setStreak] = useState(() => Number(localStorage.getItem('akshar_streak')) || 3);
  const [hearts, setHearts] = useState(5);
  const [gems, setGems] = useState(120);

  // Flow Modals
  const [showPlacementTest, setShowPlacementTest] = useState(false);
  const [showBaselineModal, setShowBaselineModal] = useState(false);
  const [activeLessonLevel, setActiveLessonLevel] = useState(null);
  const [showSarvamSettings, setShowSarvamSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showHeartRefillModal, setShowHeartRefillModal] = useState(false);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('akshar_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    sfx.playPop();
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Sync Language & Profile
  useEffect(() => {
    localStorage.setItem('akshar_target_lang', targetLang);
    localStorage.setItem('akshar_ui_lang', uiLang);
    localStorage.setItem('akshar_xp', xp);
    localStorage.setItem('akshar_streak', streak);
    if (currentUser) {
      localStorage.setItem('akshar_user_profile', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('akshar_user_profile');
    }
  }, [targetLang, uiLang, xp, streak, currentUser]);

  // Persist languageProgress whenever active language values change
  useEffect(() => {
    setLanguageProgress((prev) => {
      const updated = {
        ...prev,
        [targetLang]: {
          userLevel,
          completedLevels,
          levelScores,
          wordsMasteredList,
        },
      };
      localStorage.setItem('akshar_language_progress', JSON.stringify(updated));
      return updated;
    });
  }, [targetLang, userLevel, completedLevels, levelScores, wordsMasteredList]);

  // Handle switching learning language: saves current progress, loads or starts fresh for the new language
  const handleSwitchTargetLanguage = (newLang) => {
    if (newLang === targetLang) return;
    sfx.playPop();

    // Guard: Tracing tab only available for Hindi and Marathi
    if (activeTab === 'tracing' && !['hi', 'mr'].includes(newLang)) {
      setActiveTab('path');
    }

    // 1. Save current progress to languageProgress
    const updatedProg = {
      ...languageProgress,
      [targetLang]: {
        userLevel,
        completedLevels,
        levelScores,
        wordsMasteredList,
      },
    };

    // 2. Determine target language's progress or start fresh at level 1
    const targetProg = updatedProg[newLang] || {
      userLevel: 1,
      completedLevels: [],
      levelScores: {},
      wordsMasteredList: [],
    };

    updatedProg[newLang] = targetProg;
    setLanguageProgress(updatedProg);
    localStorage.setItem('akshar_language_progress', JSON.stringify(updatedProg));

    // 3. Switch active states
    setTargetLang(newLang);
    setUserLevel(targetProg.userLevel || 1);
    setCompletedLevels(targetProg.completedLevels || []);
    setLevelScores(targetProg.levelScores || {});
    setWordsMasteredList(targetProg.wordsMasteredList || []);

    // Update currentUser if present
    if (currentUser) {
      setCurrentUser((prev) => ({ ...prev, targetLang: newLang }));
    }
  };

  const handleUpdateProfile = (updatedProfile) => {
    setCurrentUser(updatedProfile);
    if (updatedProfile.ageGroup) {
      setAgeGroup(updatedProfile.ageGroup);
    }
    localStorage.setItem('akshar_user_profile', JSON.stringify(updatedProfile));
  };

  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;
  const currentLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  // Mascot Messages
  const getMascotMessage = () => {
    if (activeTab === 'path') return t.mascotPathHint;
    if (activeTab === 'tracing') {
      return uiLang === 'en'
        ? 'Trace letters with guided arrows to master natural handwriting!'
        : 'तीर के निशानों पर चलकर अक्षरों को सुंदर रूप से लिखना सीखें!';
    }
    if (activeTab === 'soundboard') return t.mascotSoundboardHint;
    if (activeTab === 'games') return t.mascotGamesHint;
    const dashMsgs = {
      en: 'Here you can view your personal literacy stats, accuracy and certificates!',
      hi: 'यहाँ आप अपनी साक्षरता प्रगति और अर्जित उपलब्धियाँ देख सकते हैं!',
      mr: 'येथे तुम्ही तुमची साक्षरता प्रगती आणि प्रमाणपत्रे पाहू शकता!',
      ta: 'இங்கே உங்கள் எழுத்தறிவு முன்னேற்றம் மற்றும் சான்றிதழ்களைக் காணலாம்!',
      te: 'ఇక్కడ మీరు మీ అక్షరాస్యత పురోగతి మరియు ధృవీకరణ పత్రాలను చూడవచ్చు!',
      bn: 'এখানে আপনি আপনার সাক্ষরতার অগ্রগতি এবং সার্টিফিকেট দেখতে পারেন!',
    };
    return dashMsgs[uiLang] || dashMsgs.en;
  };

  // Auth Handlers
  const handleAuthSuccess = (userData) => {
    setCurrentUser(userData);
    setUiLang(userData.uiLang);
    handleSwitchTargetLanguage(userData.targetLang);
    setAgeGroup(userData.ageGroup || 'adult');
    setAuthModalConfig({ isOpen: false, mode: 'login' });
    setIsGuestMode(false);

    // If user has already taken the test, NEVER pop it up again!
    if (userData.testCompleted) {
      setActiveTab('path');
    } else if (userData.startPath === 'placement') {
      setShowPlacementTest(true);
    } else {
      setShowBaselineModal(true);
    }
  };

  const handleLogout = () => {
    sfx.playPop();
    setCurrentUser(null);
    setIsGuestMode(false);
    setActiveTab('path');
  };

  const markInitialTestCompleted = () => {
    setCurrentUser((prev) => {
      const updated = { ...(prev || {}), testCompleted: true };
      localStorage.setItem('akshar_user_profile', JSON.stringify(updated));
      try {
        const stored = localStorage.getItem('akshar_registered_users');
        if (stored) {
          const users = JSON.parse(stored);
          const idx = users.findIndex((u) => u.email === updated.email);
          if (idx !== -1) {
            users[idx].testCompleted = true;
            localStorage.setItem('akshar_registered_users', JSON.stringify(users));
          }
        }
      } catch (e) {}
      return updated;
    });
  };

  const handlePlacementComplete = ({ recommendedLevel, score }) => {
    setShowPlacementTest(false);
    markInitialTestCompleted();
    const newLevel = Math.max(userLevel, recommendedLevel);
    setUserLevel(newLevel);
    const previous = [];
    for (let i = 1; i < recommendedLevel; i++) {
      previous.push(i);
    }
    const newCompleted = Array.from(new Set([...completedLevels, ...previous]));
    setCompletedLevels(newCompleted);
    setXp((x) => x + score * 15);
    setActiveTab('path');
  };

  const handleBaselineComplete = () => {
    setShowBaselineModal(false);
    markInitialTestCompleted();
    setXp((x) => x + 25);
    setActiveTab('path');
  };

  const handleCompleteLesson = ({ levelId, xp: earnedXp, stars, accuracy }) => {
    setActiveLessonLevel(null);
    setXp((prev) => prev + earnedXp);
    const nextCompleted = Array.from(new Set([...completedLevels, levelId]));
    const nextScores = {
      ...levelScores,
      [levelId]: { stars, accuracy },
    };
    setCompletedLevels(nextCompleted);
    setLevelScores(nextScores);

    if (levelId >= userLevel && userLevel < 10) {
      setUserLevel(levelId + 1);
    }
  };

  const handleLoseHeart = () => {
    setHearts((h) => {
      const next = Math.max(0, h - 1);
      if (next === 0) {
        setShowHeartRefillModal(true);
      }
      return next;
    });
  };

  const confirmRefillHearts = () => {
    sfx.playSuccess();
    setHearts(5);
    setShowHeartRefillModal(false);
  };

  const handleOpenChest = () => {
    sfx.playLevelComplete();
    setGems((g) => g + 25);
    setXp((x) => x + 30);
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.5 } });
    } catch (e) {}
    alert(
      uiLang === 'en'
        ? '🎁 Congratulations! You unlocked +25 Gems and +30 XP!'
        : '🎁 बधाई! आपको मिले +25 रत्न और +30 XP अंक!'
    );
  };

  // =========================================================================
  // VIEW ROUTING: If not logged in and not in guest mode, render Landing Page!
  // =========================================================================
  if (!currentUser && !isGuestMode) {
    return (
      <div data-theme={theme} style={{ minHeight: '100vh' }}>
        <LandingPage
          uiLang={uiLang}
          setUiLang={setUiLang}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenLogin={() => setAuthModalConfig({ isOpen: true, mode: 'login' })}
          onOpenRegister={() => setAuthModalConfig({ isOpen: true, mode: 'register' })}
          onDirectGuestStart={() => {
            setIsGuestMode(true);
            setActiveTab('path');
          }}
        />

        {/* Login / Registration Modal */}
        <AuthModal
          isOpen={authModalConfig.isOpen}
          initialMode={authModalConfig.mode}
          onClose={() => setAuthModalConfig({ isOpen: false, mode: 'login' })}
          onAuthSuccess={handleAuthSuccess}
          uiLang={uiLang}
          setUiLang={setUiLang}
        />
      </div>
    );
  }

  // =========================================================================
  // ADMIN DASHBOARD VIEW (When Admin is logged in and isAdminView is active)
  // =========================================================================
  if (currentUser?.role === 'admin' && isAdminView) {
    return (
      <div data-theme={theme} style={{ minHeight: '100vh' }}>
        <AdminDashboard
          currentUser={currentUser}
          theme={theme}
          toggleTheme={toggleTheme}
          onLogout={() => {
            localStorage.removeItem('akshar_user_profile');
            setCurrentUser(null);
            setIsAdminView(false);
            sfx.playPop();
          }}
          onSwitchToLearnerView={() => {
            sfx.playPop();
            setIsAdminView(false);
          }}
          onUpdateCurrentUser={(updated) => {
            setCurrentUser(updated);
            localStorage.setItem('akshar_user_profile', JSON.stringify(updated));
          }}
        />
      </div>
    );
  }

  // =========================================================================
  // LOGGED-IN LEARNER APPLICATION VIEW
  // =========================================================================
  return (
    <div data-theme={theme} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Admin Mode Quick Switch Banner */}
      {(currentUser?.role === 'admin' || currentUser?.role === 'super_admin') && (
        <div
          style={{
            background: 'linear-gradient(90deg, #1E1B4B, #312E81)',
            color: '#FFFFFF',
            padding: '8px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            fontWeight: 800,
            borderBottom: '2px solid #58CC02',
            zIndex: 100,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🛡️</span>
            <span>Administrator Preview Mode (Viewing as Learner)</span>
          </div>
          <button
            className="btn-3d"
            onClick={() => {
              sfx.playPop();
              setIsAdminView(true);
            }}
            style={{
              background: '#58CC02',
              color: '#000',
              padding: '4px 14px',
              fontSize: '0.8rem',
              fontWeight: 900,
              borderRadius: '8px',
              boxShadow: '0 2px 0 #46A302',
            }}
          >
            Return to Admin Dashboard ➔
          </button>
        </div>
      )}

      {/* Clean Decluttered Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        targetLang={targetLang}
        uiLang={uiLang}
        streak={streak}
        xp={xp}
        hearts={hearts}
        onRefillHearts={() => setShowHeartRefillModal(true)}
        currentUser={currentUser}
        onOpenProfile={() => setShowProfileModal(true)}
      />

      {/* Main Learning Application Container */}
      <main className="app-container">
        <section className="main-content">
          {/* TAB 1: Serpentine Path */}
          {activeTab === 'path' && (
            <LearningPath
              targetLang={targetLang}
              uiLang={uiLang}
              ageGroup={ageGroup}
              userLevel={userLevel}
              completedLevels={completedLevels}
              levelScores={levelScores}
              onStartLevel={(lvl) => {
                if (hearts <= 0) {
                  setShowHeartRefillModal(true);
                  return;
                }
                setActiveLessonLevel(lvl);
              }}
              onOpenChest={handleOpenChest}
            />
          )}

          {/* TAB 2: Duolingo-Style Akshar Tracing & Drawing Studio */}
          {activeTab === 'tracing' && ['hi', 'mr'].includes(targetLang) && (
            <AksharTracing
              targetLang={targetLang}
              uiLang={uiLang}
              initialChar={tracingChar}
              onRewardXp={(bonusXp) => setXp((x) => x + bonusXp)}
            />
          )}

          {/* TAB 3: Soundboard */}
          {activeTab === 'soundboard' && (
            <Soundboard
              targetLang={targetLang}
              uiLang={uiLang}
              onWordLearned={(word) => {
                setWordsMasteredList((prev) => Array.from(new Set([...prev, word])));
              }}
              onOpenTracing={(char) => {
                setTracingChar(char);
                setActiveTab('tracing');
              }}
            />
          )}

          {/* TAB 4: Literacy Mini-Games */}
          {activeTab === 'games' && (
            <MiniGames
              targetLang={targetLang}
              uiLang={uiLang}
              onRewardXp={(bonusXp) => setXp((x) => x + bonusXp)}
            />
          )}

          {/* TAB 5: Learner Dashboard */}
          {activeTab === 'dashboard' && (
            <Dashboard
              targetLang={targetLang}
              uiLang={uiLang}
              xp={xp}
              streak={streak}
              completedLevels={completedLevels}
              wordsMasteredList={wordsMasteredList}
              onOpenCertificate={() => setShowCertificate(true)}
              currentUser={currentUser}
            />
          )}
        </section>

        {/* Right Companion Panel: Shifted Context Widgets */}
        <aside className="side-panel">
          {/* 1. ACTIVE LEARNING COURSE CARD */}
          <div className="course-side-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>{currentLangObj.flag || '🇮🇳'}</span>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0 }}>
                    {getLocalizedLanguageName(targetLang, uiLang)}
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {currentLangObj.script}
                  </span>
                </div>
              </div>

              <button
                className="btn-3d btn-outline"
                onClick={() => {
                  sfx.playPop();
                  setShowProfileModal(true);
                }}
                style={{ padding: '4px 10px', fontSize: '0.78rem', borderRadius: '8px' }}
                title={t.switchLang}
              >
                {t.switchLang}
              </button>
            </div>

            {/* Course Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  {t.levelWord} {userLevel} / 10
                </span>
                <strong style={{ color: 'var(--primary)' }}>
                  {completedLevels.length} {t.completedWord}
                </strong>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-main)', borderRadius: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (completedLevels.length / 10) * 100)}%`,
                    background: 'linear-gradient(90deg, #5B42F3, #00C4CC)',
                    borderRadius: '8px',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 2. AKSHI THE OWL MASCOT */}
          <Mascot
            mood="happy"
            message={getMascotMessage()}
            uiLang={uiLang}
          />

          {/* 3. PERSONALIZED TRACK CARD */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--secondary)' }}>
                {t.personalizedTrack}
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: 900, marginTop: '2px' }}>
                {ageGroup === 'child'
                  ? `🧒 ${t.ageChildShort}`
                  : ageGroup === 'senior'
                  ? `👵 ${t.ageSeniorShort}`
                  : `👨‍💼 ${t.ageAdultShort}`}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                {currentUser?.name ? `${currentUser.name} (${currentUser.age || 25}y)` : (t.learnerWord || 'Learner')}
              </p>
            </div>
            <button
              className="btn-3d btn-outline"
              onClick={() => {
                sfx.playPop();
                setShowProfileModal(true);
              }}
              style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '8px' }}
            >
              {t.edit}
            </button>
          </div>

          {/* 4. DAILY GOAL CARD */}
          <div className="soundboard-container" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <Trophy size={22} color="#F59E0B" />
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                {t.dailyGoal}
              </h4>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>
                  {t.dailyXp}
                </span>
                <strong>{Math.min(xp, 100)} / 100 XP</strong>
              </div>
              <div style={{ height: '10px', background: '#E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (xp / 100) * 100)}%`,
                    background: 'var(--primary)',
                    borderRadius: '10px',
                  }}
                />
              </div>
            </div>

            <button
              className="btn-3d btn-secondary"
              style={{ width: '100%', padding: '10px', fontSize: '0.9rem' }}
              onClick={() => setActiveTab('games')}
            >
              🎮 {t.playGamesToEarnXp}
            </button>
          </div>

          {/* 5. QUICK PREFERENCES & SYSTEM STATUS BAR */}
          <div className="side-status-bar">
            {/* Voice Status Pill */}
            <div
              onClick={() => {
                sfx.playPop();
                setShowSarvamSettings(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                color: '#15803D',
              }}
              title="Sarvam AI Neural Speech Active (Click to configure)"
            >
              <Sparkles size={15} color="#15803D" />
              <span style={{ fontSize: '0.78rem' }}>Sarvam Bulbul v3</span>
            </div>

            {/* Quick Theme Toggle */}
            <button
              className="icon-btn"
              onClick={toggleTheme}
              style={{ width: '32px', height: '32px' }}
              title={theme === 'dark' ? t.themeLight : t.themeDark}
            >
              {theme === 'dark' ? <Sun size={15} color="#FBBF24" /> : <Moon size={15} color="#4F46E5" />}
            </button>
          </div>
        </aside>
      </main>

      {/* MODALS */}
      {/* Profile & Personalization Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        targetLang={targetLang}
        onChangeTargetLang={handleSwitchTargetLanguage}
        uiLang={uiLang}
        setUiLang={setUiLang}
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenVoiceSettings={() => {
          setShowProfileModal(false);
          setShowSarvamSettings(true);
        }}
        onLogout={handleLogout}
        languageProgress={languageProgress}
        xp={xp}
        streak={streak}
      />

      {/* Placement Test Modal */}
      {showPlacementTest && (
        <PlacementTest
          targetLang={targetLang}
          uiLang={uiLang}
          ageGroup={ageGroup}
          onComplete={handlePlacementComplete}
          onCancel={() => {
            setShowPlacementTest(false);
            markInitialTestCompleted();
          }}
        />
      )}

      {/* Baseline Check Modal */}
      {showBaselineModal && (
        <BaselineModal
          targetLang={targetLang}
          uiLang={uiLang}
          ageGroup={ageGroup}
          onComplete={handleBaselineComplete}
        />
      )}

      {/* Active Lesson Modal */}
      {activeLessonLevel && (
        <LessonModal
          level={activeLessonLevel}
          targetLang={targetLang}
          uiLang={uiLang}
          hearts={hearts}
          onLoseHeart={handleLoseHeart}
          onCompleteLesson={handleCompleteLesson}
          onClose={() => setActiveLessonLevel(null)}
        />
      )}

      {/* Sarvam AI & Voice Settings Modal */}
      <SarvamSettingsModal
        isOpen={showSarvamSettings}
        onClose={() => setShowSarvamSettings(false)}
        targetLang={targetLang}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        userName={currentUser?.name || 'शिक्षार्थी (Learner)'}
        targetLangName={currentLangObj.name}
        lessonsCompleted={completedLevels.length}
        wordsMastered={Math.max(wordsMasteredList.length, completedLevels.length * 4 + 8)}
      />

      {/* Heart Refill Modal */}
      {showHeartRefillModal && (
        <div className="modal-backdrop" onClick={() => setShowHeartRefillModal(false)}>
          <div
            className="lesson-modal"
            style={{ maxWidth: '420px', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lesson-body" style={{ padding: '32px 20px' }}>
              <div style={{ fontSize: '3.5rem', color: '#DC2626', marginBottom: '12px' }}>❤️</div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '8px' }}>
                {uiLang === 'en' ? 'Refill Hearts' : 'ऊर्जा भरें (Refill Hearts)'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                {uiLang === 'en'
                  ? 'Mistakes are part of learning! Refill your hearts for free to keep practicing.'
                  : 'गलतियों से घबराएं नहीं! सीखना लगातार प्रयास करने का नाम है। अभी निःशुल्क ऊर्जा पूरी भरें।'}
              </p>
              <button
                className="btn-3d btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
                onClick={confirmRefillHearts}
              >
                {uiLang === 'en' ? 'Refill to 5 ❤️' : 'ऊर्जा पूरी करें (Refill to 5 ❤️)'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
