import React, { useState } from 'react';
import { SUPPORTED_LANGUAGES } from '../services/audioEngine';
import { UI_TRANSLATIONS } from '../data/uiTranslations';
import { sfx } from '../services/soundEffects';
import { Sparkles, CheckCircle2, Award, Compass, Volume2 } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export function OnboardingModal({
  isOpen,
  onComplete,
  initialTargetLang = 'hi',
  initialUiLang = 'hi',
}) {
  const [step, setStep] = useState(1);
  const [selectedTargetLang, setSelectedTargetLang] = useState(initialTargetLang);
  const [selectedUiLang, setSelectedUiLang] = useState(initialUiLang);
  const [proficiency, setProficiency] = useState('beginner'); // 'beginner' | 'letters' | 'words' | 'conversational'
  const [chosenPath, setChosenPath] = useState(null); // 'basics' | 'placement'

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[selectedUiLang] || UI_TRANSLATIONS.hi;

  const speakHelper = (text) => {
    sfx.playPop();
    audioEngine.speak(text, selectedUiLang);
  };

  const handleNext = () => {
    sfx.playPop();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3 && chosenPath) {
      onComplete({
        targetLang: selectedTargetLang,
        uiLang: selectedUiLang,
        proficiency,
        path: chosenPath,
      });
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="lesson-modal" style={{ maxWidth: '580px' }}>
        {/* Header */}
        <div className="lesson-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #4F46E5, #EC4899)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
              }}
            >
              अ
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {step === 1 && 'चरण १/३: भाषा चुनें (Select Language)'}
                {step === 2 && 'चरण २/३: आपका अनुभव (Proficiency)'}
                {step === 3 && 'चरण ३/३: शुरुआत कैसे करें? (Choose Path)'}
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="lesson-body">
          {/* STEP 1: Select Learning Language & UI Language */}
          {step === 1 && (
            <div>
              <div className="instruction-box">
                <button
                  className="audio-prompt-btn"
                  onClick={() => speakHelper('आप कौन सी भाषा सीखना चाहते हैं और ऐप की भाषा क्या रखना चाहते हैं?')}
                  title="निर्देश सुनें"
                >
                  <Volume2 size={24} />
                </button>
                <div>
                  <h4 className="instruction-title">{t.selectTargetLang}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Language you wish to learn to read and speak:
                  </p>
                </div>
              </div>

              {/* Target Language Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '24px' }}>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <div
                    key={lang.code}
                    className={`mcq-option ${selectedTargetLang === lang.code ? 'selected' : ''}`}
                    onClick={() => {
                      sfx.playPop();
                      setSelectedTargetLang(lang.code);
                    }}
                    style={{ fontSize: '1.05rem', padding: '14px 10px' }}
                  >
                    <div>{lang.name}</div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                      Script: {lang.script}
                    </span>
                  </div>
                ))}
              </div>

              {/* UI Preferred Language */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                <h5 style={{ fontWeight: 800, marginBottom: '8px', fontSize: '0.95rem' }}>
                  {t.selectUiLang}
                </h5>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      className={`btn-outline ${selectedUiLang === lang.code ? 'btn-primary' : ''}`}
                      onClick={() => {
                        sfx.playPop();
                        setSelectedUiLang(lang.code);
                      }}
                      style={{ padding: '8px 6px', fontSize: '0.85rem', fontWeight: 700 }}
                    >
                      {lang.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Ask Current Proficiency */}
          {step === 2 && (
            <div>
              <div className="instruction-box">
                <button
                  className="audio-prompt-btn"
                  onClick={() => speakHelper('अपनी वर्तमान समझ चुनें, ताकि हम आपकी यात्रा सही तरह से बना सकें।')}
                >
                  <Volume2 size={24} />
                </button>
                <div>
                  <h4 className="instruction-title">{t.selectProficiency}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Select your familiarity with the language:
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { id: 'beginner', title: t.profBeginner, icon: '🌱', levelDesc: 'Start with vowel & consonant sounds' },
                  { id: 'letters', title: t.profSomeLetters, icon: '🔤', levelDesc: 'Know a few letters, want to build words' },
                  { id: 'words', title: t.profSimpleWords, icon: '📖', levelDesc: 'Can read 2-letter words, want sentences' },
                  { id: 'conversational', title: t.profConversational, icon: '💬', levelDesc: 'Can speak fluently, want reading & signs' },
                ].map((item) => (
                  <div
                    key={item.id}
                    className={`mcq-option ${proficiency === item.id ? 'selected' : ''}`}
                    onClick={() => {
                      sfx.playPop();
                      setProficiency(item.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      textAlign: 'left',
                      padding: '16px',
                      fontSize: '1rem',
                    }}
                  >
                    <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800 }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                        {item.levelDesc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Where to Start: Basics vs Placement Test */}
          {step === 3 && (
            <div>
              <div className="instruction-box">
                <button
                  className="audio-prompt-btn"
                  onClick={() => speakHelper('आप शुरुआत से पढ़ना चाहते हैं या स्तर परीक्षा देकर आगे के स्तर खोलना चाहते हैं?')}
                >
                  <Volume2 size={24} />
                </button>
                <div>
                  <h4 className="instruction-title">सीखने की राह चुनें (Choose Starting Path)</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    How would you like to begin your learning adventure?
                  </p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                {/* Option A: Start from Basics */}
                <div
                  className={`mcq-option ${chosenPath === 'basics' ? 'selected' : ''}`}
                  onClick={() => {
                    sfx.playPop();
                    setChosenPath('basics');
                  }}
                  style={{
                    padding: '24px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ fontSize: '2.5rem' }}>🌱</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t.startFromBasics}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    {t.basicsDesc}
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      background: 'var(--primary-light)',
                      color: '#15803D',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontWeight: 700,
                    }}
                  >
                    +3 Baseline Questions
                  </span>
                </div>

                {/* Option B: Placement Diagnostic Test */}
                <div
                  className={`mcq-option ${chosenPath === 'placement' ? 'selected' : ''}`}
                  onClick={() => {
                    sfx.playPop();
                    setChosenPath('placement');
                  }}
                  style={{
                    padding: '24px 16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ fontSize: '2.5rem' }}>🎯</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t.testLevel}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    {t.diagnosticDesc}
                  </div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      background: 'var(--secondary-light)',
                      color: '#0284C7',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      fontWeight: 700,
                    }}
                  >
                    Fast Track & Unlock Nodes
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="lesson-footer">
          {step > 1 ? (
            <button
              className="btn-3d btn-outline"
              onClick={() => {
                sfx.playPop();
                setStep(step - 1);
              }}
            >
              वापस (Back)
            </button>
          ) : (
            <div />
          )}

          <button
            className="btn-3d btn-primary"
            onClick={handleNext}
            disabled={step === 3 && !chosenPath}
          >
            {step === 3
              ? chosenPath === 'placement'
                ? t.startPlacementTest
                : t.startBasicsJourney
              : t.continueBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
