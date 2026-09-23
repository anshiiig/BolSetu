import React, { useState, useEffect } from 'react';
import {
  User,
  Globe,
  Settings2,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  Check,
  Flame,
  Zap,
  Database,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../services/audioEngine';
import { UI_TRANSLATIONS, getLocalizedLanguageName } from '../data/uiTranslations';
import { sfx } from '../services/soundEffects';
import { sarvamService } from '../services/sarvamService';
import { audioCache } from '../services/audioCache';

export function ProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  targetLang,
  onChangeTargetLang,
  uiLang,
  setUiLang,
  theme,
  toggleTheme,
  onOpenVoiceSettings,
  onLogout,
  languageProgress = {},
  xp = 0,
  streak = 0,
}) {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;

  const [name, setName] = useState(currentUser?.name || t.learnerWord || 'Learner');
  const [age, setAge] = useState(currentUser?.age || 28);
  const [ageGroup, setAgeGroup] = useState(currentUser?.ageGroup || 'adult');
  const [cacheCount, setCacheCount] = useState(0);
  const [saveFeedback, setSaveFeedback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        setName(currentUser.name || '');
        setAge(currentUser.age || 28);
        setAgeGroup(currentUser.ageGroup || 'adult');
      }
      audioCache.count().then(setCacheCount).catch(() => {});
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSaveDetails = (e) => {
    e?.preventDefault();
    sfx.playSuccess();
    if (onUpdateProfile) {
      onUpdateProfile({
        ...currentUser,
        name: name.trim() || t.learnerWord || 'Learner',
        age: Number(age) || 25,
        ageGroup,
      });
    }
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const handleClearCache = async () => {
    sfx.playPop();
    await audioCache.clear();
    setCacheCount(0);
  };

  // UI Languages list with strict single language names
  const uiOptions = [
    { code: 'en', label: getLocalizedLanguageName('en', uiLang) },
    { code: 'hi', label: getLocalizedLanguageName('hi', uiLang) },
    { code: 'mr', label: getLocalizedLanguageName('mr', uiLang) },
    { code: 'te', label: getLocalizedLanguageName('te', uiLang) },
    { code: 'ta', label: getLocalizedLanguageName('ta', uiLang) },
    { code: 'bn', label: getLocalizedLanguageName('bn', uiLang) },
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="lesson-modal"
        style={{ maxWidth: '640px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="lesson-header" style={{ padding: '16px 24px', borderBottom: '2px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #5B42F3, #FF5376)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.2rem',
                boxShadow: '0 4px 10px rgba(91, 66, 243, 0.3)',
              }}
            >
              {name.charAt(0).toUpperCase() || 'L'}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0 }}>
                {currentUser?.name || name}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Flame size={13} fill="#F97316" color="#EA580C" /> {streak} {t.daysUnit || t.streak}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <Zap size={13} fill="#FF9F1C" color="#D97706" /> {xp} {t.xp}
                </span>
                <span>•</span>
                <span
                  style={{
                    background: 'var(--primary-light)',
                    color: '#4338CA',
                    padding: '1px 6px',
                    borderRadius: '6px',
                    fontWeight: 700,
                  }}
                >
                  {ageGroup === 'child' ? t.ageChildShort : ageGroup === 'senior' ? t.ageSeniorShort : t.ageAdultShort}
                </span>
              </div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ width: '34px', height: '34px' }}>
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          className="lesson-body"
          style={{
            padding: '20px 24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '22px',
          }}
        >
          {/* SECTION 1: LEARNING LANGUAGE (TARGET LANGUAGE) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '4px' }}>
              <label style={{ fontWeight: 900, fontSize: '0.98rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={18} color="var(--primary)" />
                <span>{t.learningLanguage}:</span>
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                {t.progressSavedPerLang}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '10px' }}>
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = targetLang === lang.code;
                const prog = languageProgress[lang.code] || {};
                const lvl = prog.userLevel || 1;
                const completedCount = prog.completedLevels?.length || 0;
                const isStarted = completedCount > 0 || lvl > 1;
                const localizedLangName = getLocalizedLanguageName(lang.code, uiLang);

                return (
                  <div
                    key={lang.code}
                    className={`mcq-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => {
                      sfx.playPop();
                      onChangeTargetLang(lang.code);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border-subtle)',
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-main)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '1rem', color: isSelected ? 'var(--primary-dark)' : 'var(--text-main)' }}>
                        {localizedLangName}
                      </strong>
                      {isSelected && <Check size={16} color="var(--primary)" strokeWidth={3} />}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {lang.flag} {lang.script}
                    </div>

                    {/* Progress Badge */}
                    <div style={{ marginTop: '4px' }}>
                      {isStarted ? (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '6px',
                            background: '#DCFCE7',
                            color: '#15803D',
                          }}
                        >
                          {t.levelWord} {lvl} ({completedCount} {t.completedWord})
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: '6px',
                            background: '#F1F5F9',
                            color: '#64748B',
                          }}
                        >
                          {t.beginnerLevel}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: UI / APP INTERFACE LANGUAGE */}
          <div>
            <label style={{ fontWeight: 900, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <span>🌐</span>
              <span>{t.appInterfaceLanguage}:</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {uiOptions.map((opt) => (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => {
                    sfx.playPop();
                    setUiLang(opt.code);
                  }}
                  className={`btn-3d ${uiLang === opt.code ? 'btn-primary' : 'btn-outline'}`}
                  style={{
                    padding: '10px 12px',
                    fontSize: '0.9rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: USER DETAILS & AGE TRACK */}
          <form
            onSubmit={handleSaveDetails}
            style={{
              background: 'var(--bg-main)',
              padding: '16px',
              borderRadius: '14px',
              border: '2px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={18} color="var(--secondary)" />
              <strong style={{ fontSize: '0.95rem' }}>{t.learnerProfile}</strong>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  {t.nameLabel}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t.namePlaceholder}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  {t.ageLabel}
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={age}
                  onChange={(e) => {
                    const a = Number(e.target.value);
                    setAge(a);
                    if (a < 15) setAgeGroup('child');
                    else if (a >= 50) setAgeGroup('senior');
                    else setAgeGroup('adult');
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '2px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>
            </div>

            {/* Age Group Buttons */}
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                {t.personalizedTrack}:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {[
                  { id: 'child', icon: '🧒', label: t.ageChildShort },
                  { id: 'adult', icon: '👨‍💼', label: t.ageAdultShort },
                  { id: 'senior', icon: '👵', label: t.ageSeniorShort },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      sfx.playPop();
                      setAgeGroup(item.id);
                    }}
                    className={`btn-3d ${ageGroup === item.id ? 'btn-secondary' : 'btn-outline'}`}
                    style={{ padding: '6px 10px', fontSize: '0.82rem', borderRadius: '8px' }}
                  >
                    {item.icon} {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button
                type="submit"
                className="btn-3d btn-primary"
                style={{ padding: '8px 18px', fontSize: '0.88rem' }}
              >
                {saveFeedback ? `✓ ${t.detailsSaved}` : t.saveDetails}
              </button>
            </div>
          </form>

          {/* SECTION 4: VOICE ENGINE & ACCESSIBILITY PREFERENCES */}
          <div
            style={{
              background: 'var(--bg-main)',
              padding: '16px',
              borderRadius: '14px',
              border: '2px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--primary)" />
                <strong style={{ fontSize: '0.95rem' }}>{t.voiceAndSoundSystem}</strong>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: '#DCFCE7',
                  color: '#15803D',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={13} />
                Bulbul v3 Connected
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                <Database size={16} color="var(--text-muted)" />
                <span>{cacheCount} {t.instantCachedClips}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {cacheCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearCache}
                    className="btn-3d"
                    style={{ padding: '6px 10px', fontSize: '0.78rem', background: '#FEE2E2', color: '#DC2626' }}
                  >
                    <Trash2 size={12} /> {t.clearCache}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    sfx.playPop();
                    if (onOpenVoiceSettings) onOpenVoiceSettings();
                  }}
                  className="btn-3d btn-secondary"
                  style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Settings2 size={14} /> {t.voiceSettings}
                </button>
              </div>
            </div>

            {/* Quick Display Preference (Theme) */}
            <div
              style={{
                marginTop: '4px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
              }}
            >
              <button
                type="button"
                className="btn-3d btn-outline"
                onClick={toggleTheme}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                {theme === 'dark' ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#4F46E5" />}
                <span style={{ fontWeight: 800 }}>{theme === 'dark' ? t.themeLight : t.themeDark}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer with Logout & Close */}
        <div
          className="lesson-footer"
          style={{
            padding: '14px 24px',
            borderTop: '2px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {onLogout ? (
            <button
              className="btn-3d"
              onClick={() => {
                onClose();
                onLogout();
              }}
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                background: '#FEE2E2',
                color: '#DC2626',
                boxShadow: '0 4px 0 #FCA5A5',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <LogOut size={15} />
              {t.logout}
            </button>
          ) : <div />}

          <button
            className="btn-3d btn-primary"
            onClick={onClose}
            style={{ padding: '10px 24px', fontSize: '0.95rem' }}
          >
            {t.done}
          </button>
        </div>
      </div>
    </div>
  );
}
