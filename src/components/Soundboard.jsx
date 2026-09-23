import React, { useState } from 'react';
import { Volume2, Sparkles, Search } from 'lucide-react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { audioEngine } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';
import { UI_TRANSLATIONS } from '../data/uiTranslations';

export function Soundboard({ targetLang = 'mr', uiLang = 'en', onWordLearned, onOpenTracing }) {
  const [activeCategory, setActiveCategory] = useState('vowels'); // 'vowels' | 'consonants' | 'numbers' | 'everyday'
  const [playingItem, setPlayingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;
  const langData = ALPHABET_DATA[targetLang] || ALPHABET_DATA.hi;

  const categories = [
    { id: 'vowels', label: t.catVowels, icon: '🍎' },
    { id: 'consonants', label: t.catConsonants, icon: '🪷' },
    { id: 'numbers', label: t.catNumbers, icon: '🔢' },
    { id: 'everyday', label: t.catEveryday, icon: '🏥' },
  ];

  let currentItems = [];
  if (activeCategory === 'vowels') currentItems = langData.vowels || [];
  else if (activeCategory === 'consonants') currentItems = langData.consonants || [];
  else if (activeCategory === 'numbers') currentItems = langData.numbers || [];
  else if (activeCategory === 'everyday') currentItems = langData.everydayWords || [];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    currentItems = currentItems.filter(
      (item) =>
        (item.char && item.char.toLowerCase().includes(q)) ||
        (item.word && item.word.toLowerCase().includes(q)) ||
        (item.translit && item.translit.toLowerCase().includes(q)) ||
        (item.meaning && item.meaning.toLowerCase().includes(q)) ||
        (item.example && item.example.toLowerCase().includes(q))
    );
  }

  const handlePlaySound = (item) => {
    sfx.playPop();
    const textToSpeak = item.word || item.char;
    setPlayingItem(textToSpeak);

    if (onWordLearned) {
      onWordLearned(textToSpeak);
    }

    audioEngine
      .speak(textToSpeak, targetLang)
      .finally(() => {
        setPlayingItem(null);
      });
  };

  return (
    <div className="soundboard-container">
      {/* Soundboard Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '6px' }}>
          🔊 {t.soundboardTitle}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
          {t.soundboardSubtitle}
        </p>
      </div>

      {/* Category Chips & Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <div className="soundboard-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => {
                sfx.playPop();
                setActiveCategory(cat.id);
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 12px 8px 34px',
              borderRadius: '20px',
              border: '2px solid var(--border-subtle)',
              fontSize: '0.85rem',
              width: '100%',
              outline: 'none',
              background: 'var(--bg-main)',
              color: 'var(--text-main)',
            }}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="soundboard-grid">
        {currentItems.map((item, idx) => {
          const mainText = item.char || item.word;
          const isPlaying = playingItem === mainText;

          return (
            <div
              key={idx}
              className="sound-card"
              onClick={() => handlePlaySound(item)}
              style={{
                borderColor: isPlaying ? 'var(--secondary)' : undefined,
                transform: isPlaying ? 'scale(1.05)' : undefined,
              }}
            >
              <div className="sound-speaker-badge">
                <Volume2 size={16} className={isPlaying ? 'animate-bounce' : ''} />
              </div>

              {/* Big Character or Icon */}
              <div className="sound-char">
                {item.icon && <span style={{ fontSize: '1.4rem', marginRight: '4px' }}>{item.icon}</span>}
                {mainText}
              </div>

              {/* Transliteration */}
              <div className="sound-translit">{item.translit}</div>

              {/* Example / Meaning */}
              {(item.example || item.meaning) && (
                <div className="sound-example">
                  {item.example || item.meaning}
                </div>
              )}

              {/* Quick Tracing Practice Button */}
              {onOpenTracing && item.char && (
                <button
                  className="btn-3d btn-outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    sfx.playPop();
                    onOpenTracing(item.char);
                  }}
                  style={{
                    marginTop: '8px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    borderRadius: '8px',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                  title="Practice tracing this letter"
                >
                  <span>✍️</span>
                  <span>{uiLang === 'en' ? 'Trace' : 'लिखें'}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
