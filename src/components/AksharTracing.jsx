import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Volume2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  Palette,
  Eye,
  Layers,
  ChevronRight,
  Trophy,
  PenTool,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ALPHABET_DATA } from '../data/alphabetData';
import { audioEngine } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';
import { UI_TRANSLATIONS } from '../data/uiTranslations';
import { DuolingoTracer } from './DuolingoTracer';

export function AksharTracing({
  targetLang = 'mr',
  uiLang = 'en',
  onRewardXp,
  initialChar = null,
}) {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;
  const langData = ALPHABET_DATA[targetLang] || ALPHABET_DATA.hi;

  // Tabs: 'letters' | 'forge'
  const [activeStudioTab, setActiveStudioTab] = useState('letters');
  const [category, setCategory] = useState('vowels'); // 'vowels' | 'consonants'

  // Items for current category (vowels or consonants)
  const items = category === 'vowels' ? (langData.vowels || []) : (langData.consonants || []);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // If initialChar passed from soundboard, select it
  useEffect(() => {
    if (initialChar) {
      const vIdx = (langData.vowels || []).findIndex((v) => v.char === initialChar || v.word === initialChar);
      if (vIdx !== -1) {
        setCategory('vowels');
        setSelectedIndex(vIdx);
        return;
      }
      const cIdx = (langData.consonants || []).findIndex((c) => c.char === initialChar || c.word === initialChar);
      if (cIdx !== -1) {
        setCategory('consonants');
        setSelectedIndex(cIdx);
        return;
      }
    }
  }, [initialChar, langData]);

  const activeItem = items[selectedIndex] || items[0] || { char: 'अ', translit: 'a' };
  const targetChar = activeItem.char || activeItem.word || 'अ';

  // Audio Playback
  const handleSpeak = (text) => {
    sfx.playPop();
    audioEngine.speak(text || targetChar, targetLang);
  };

  // Next Letter Handler
  const handleNextLetter = () => {
    sfx.playPop();
    if (selectedIndex < items.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    } else {
      setSelectedIndex(0);
    }
  };

  // Syllable Forge State
  const forgeWords = (langData.everydayWords || []).slice(0, 6);
  const [forgeWordIndex, setForgeWordIndex] = useState(0);
  const currentForgeWord = forgeWords[forgeWordIndex] || { word: 'कमल', translit: 'Kamal', meaning: 'Lotus', icon: '🪷' };
  const syllables = currentForgeWord.word.split('');
  const [userAssembled, setUserAssembled] = useState([]);
  const [forgeSuccess, setForgeSuccess] = useState(false);

  // Syllable Forge Assembly
  const handleAddSyllable = (syl) => {
    sfx.playPop();
    const nextAssembled = [...userAssembled, syl];
    setUserAssembled(nextAssembled);

    // Check if word matched
    if (nextAssembled.join('') === currentForgeWord.word) {
      sfx.playLevelComplete();
      setForgeSuccess(true);
      try { confetti({ particleCount: 60, spread: 70, origin: { y: 0.5 } }); } catch {}
      audioEngine.speak(currentForgeWord.word, targetLang);
      if (onRewardXp) onRewardXp(25);
    } else if (nextAssembled.length >= syllables.length) {
      sfx.playError();
      setTimeout(() => setUserAssembled([]), 600);
    }
  };

  const handleNextForgeWord = () => {
    sfx.playPop();
    setForgeWordIndex((prev) => (prev + 1) % forgeWords.length);
    setUserAssembled([]);
    setForgeSuccess(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Studio Mode Selector Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #5B42F3, #8B5CF6, #FF5376)',
          color: '#FFFFFF',
          borderRadius: '20px',
          padding: '24px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.8rem',
            }}
          >
            ✍️
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: 0 }}>
              {uiLang === 'en' ? 'Akshar Tracing Studio' : uiLang === 'mr' ? 'अक्षर आलेखन व लेखन' : uiLang === 'te' ? 'అక్షర రచన స్టూడియో' : 'अक्षर लेखन व आलेखन'}
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
              {uiLang === 'en'
                ? 'Follow the animated guide arrows to master writing letters & words!'
                : 'एनिमेटेड तीरों के निर्देशों का पालन करते हुए सुंदर अक्षर लिखना सीखें!'}
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.15)', padding: '4px', borderRadius: '12px' }}>
          <button
            className={`tab-btn ${activeStudioTab === 'letters' ? 'active' : ''}`}
            onClick={() => {
              sfx.playPop();
              setActiveStudioTab('letters');
            }}
            style={{ color: activeStudioTab === 'letters' ? 'var(--primary)' : '#fff', fontWeight: 800 }}
          >
            <PenTool size={16} />
            <span>{uiLang === 'en' ? 'Letter Tracing' : 'अक्षर आलेखन'}</span>
          </button>

          <button
            className={`tab-btn ${activeStudioTab === 'forge' ? 'active' : ''}`}
            onClick={() => {
              sfx.playPop();
              setActiveStudioTab('forge');
            }}
            style={{ color: activeStudioTab === 'forge' ? 'var(--primary)' : '#fff', fontWeight: 800 }}
          >
            <Layers size={16} />
            <span>{uiLang === 'en' ? 'Syllable Forge' : 'शब्द शिल्पी'}</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          MODE 1: INTERACTIVE CHARACTER TRACING CANVAS WITH ANIMATED ARROWS
         ===================================================================== */}
      {activeStudioTab === 'letters' && (
        <div className="tracing-layout-grid">
          {/* Left Column: Character List & Categories */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--border-subtle)',
              borderRadius: '20px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {/* Category Selector (Vowels & Consonants) */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'vowels', label: t.catVowels || 'स्वर', icon: '🍎' },
                { id: 'consonants', label: t.catConsonants || 'व्यंजन', icon: '🪷' },
              ].map((c) => (
                <button
                  key={c.id}
                  className={`btn-3d ${category === c.id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => {
                    sfx.playPop();
                    setCategory(c.id);
                    setSelectedIndex(0);
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 4px',
                    fontSize: '0.8rem',
                    borderRadius: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            {/* Scrollable Letter Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                maxHeight: '420px',
                overflowY: 'auto',
                padding: '4px',
              }}
            >
              {items.map((item, idx) => {
                const charText = item.char || item.word;
                const isSelected = selectedIndex === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      sfx.playPop();
                      setSelectedIndex(idx);
                      audioEngine.speak(charText, targetLang);
                    }}
                    className={`mcq-option ${isSelected ? 'selected' : ''}`}
                    style={{
                      height: '62px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid var(--primary)' : '2px solid var(--border-subtle)',
                      background: isSelected ? 'var(--primary-light)' : 'var(--bg-main)',
                      padding: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '1.4rem', fontWeight: 900, color: isSelected ? 'var(--primary-dark)' : 'var(--text-main)' }}>
                      {charText}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      {item.translit || ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Duolingo-Style Arrow Slidable Character Tracing Stage */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
            }}
          >
            {/* Stage Title & Controls Bar */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className="icon-btn"
                  onClick={() => handleSpeak()}
                  title="Hear pronunciation with Sarvam AI"
                  style={{ width: '44px', height: '44px', background: 'var(--primary-light)', borderColor: 'var(--primary)' }}
                >
                  <Volume2 size={22} color="var(--primary)" />
                </button>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                    {targetChar} {activeItem.translit ? `(${activeItem.translit})` : ''}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {activeItem.example || activeItem.meaning || (uiLang === 'en' ? 'Slide the arrow along the path to trace' : 'तीर को रेखा पर आगे खिसकाएँ')}
                  </span>
                </div>
              </div>

              <button
                className="btn-3d btn-secondary"
                onClick={handleNextLetter}
                title="Next Character"
                style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>{uiLang === 'en' ? 'Next' : 'अगला'}</span>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Duolingo Arrow-Slide Tracer Engine */}
            <DuolingoTracer
              key={`${targetChar}_${selectedIndex}`}
              character={targetChar}
              phonetic={activeItem.translit || activeItem.meaning || ''}
              targetLang={targetLang}
              uiLang={uiLang}
              onComplete={() => {
                if (onRewardXp) onRewardXp(20);
                setTimeout(() => {
                  handleNextLetter();
                }, 1400);
              }}
            />
          </div>
        </div>
      )}

      {/* =====================================================================
          MODE 2: INTERACTIVE SYLLABLE FORGE / WORD BUILDER
         ===================================================================== */}
      {activeStudioTab === 'forge' && (
        <div
          style={{
            background: 'var(--bg-card)',
            border: '2px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '32px 24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: 'var(--shadow-sm)',
            maxWidth: '680px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '3rem', marginBottom: '8px', display: 'block' }}>
              {currentForgeWord.icon || '✨'}
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0 }}>
              {uiLang === 'en' ? 'Word Alchemy: Forge the Word' : 'शब्द शिल्पी: अक्षरों से शब्द बनाएं'}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
              {currentForgeWord.meaning} • {currentForgeWord.translit}
            </p>
          </div>

          {/* Assembly Slots */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              padding: '16px 24px',
              background: 'var(--bg-main)',
              borderRadius: '16px',
              border: '2px solid var(--border-subtle)',
              marginBottom: '28px',
              minHeight: '84px',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            {syllables.map((_, idx) => {
              const placed = userAssembled[idx];
              return (
                <div
                  key={idx}
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    border: placed ? '2px solid var(--primary)' : '2px dashed #94A3B8',
                    background: placed ? 'var(--primary-light)' : '#FFFFFF',
                    color: 'var(--primary-dark)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    boxShadow: placed ? '0 4px 10px rgba(91, 66, 243, 0.2)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  {placed || ''}
                </div>
              );
            })}
          </div>

          {/* Available Syllable / Letter Chips to Click */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            {[...syllables].sort().map((syl, i) => (
              <button
                key={i}
                className="btn-3d btn-outline"
                onClick={() => handleAddSyllable(syl)}
                style={{
                  width: '64px',
                  height: '64px',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  borderRadius: '14px',
                }}
              >
                {syl}
              </button>
            ))}
          </div>

          {/* Result or Next Button */}
          {forgeSuccess ? (
            <div style={{ textAlign: 'center', animation: 'pop-in 0.3s ease' }}>
              <div style={{ color: '#15803D', fontWeight: 900, fontSize: '1.2rem', marginBottom: '12px' }}>
                🎉 {currentForgeWord.word} ({currentForgeWord.meaning}) - पूर्ण!
              </div>
              <button
                className="btn-3d btn-primary"
                onClick={handleNextForgeWord}
                style={{ padding: '12px 28px', fontSize: '1rem' }}
              >
                {uiLang === 'en' ? 'Next Word' : 'अगला शब्द'} ➔
              </button>
            </div>
          ) : (
            <button
              className="btn-3d btn-outline"
              onClick={() => {
                sfx.playPop();
                setUserAssembled([]);
              }}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              <RotateCcw size={15} />
              <span>{uiLang === 'en' ? 'Reset Tiles' : 'पुनः प्रयास करें'}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
