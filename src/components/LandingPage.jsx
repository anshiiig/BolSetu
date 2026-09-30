import React, { useState } from 'react';
import {
  Sparkles,
  Volume2,
  Play,
  Award,
  Users,
  Sun,
  Moon,
  ArrowRight,
  CheckCircle2,
  Gamepad2,
  Compass,
  Mic,
  BookOpen,
  Star,
  Gift,
  ChevronRight,
  Shuffle,
  Heart,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SUPPORTED_LANGUAGES, audioEngine } from '../services/audioEngine';
import { UI_TRANSLATIONS } from '../data/uiTranslations';
import { ALPHABET_DATA } from '../data/alphabetData';
import { sfx } from '../services/soundEffects';
import { BolSetuBrandLogo } from './BolSetuLogo';

export function LandingPage({
  uiLang = 'en',
  setUiLang,
  theme = 'light',
  toggleTheme,
  onOpenLogin,
  onOpenRegister,
  onDirectGuestStart,
}) {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;
  const [previewPlaying, setPreviewPlaying] = useState(null);

  // Age Morph Simulator State ('child' | 'adult' | 'senior')
  const [selectedAgeMorph, setSelectedAgeMorph] = useState('adult');

  // Active Soundpad Pad
  const [activePad, setActivePad] = useState(null);

  // Daily Word Index
  const [dailyWordIdx, setDailyWordIdx] = useState(0);

  // Mini Path Teaser Active Node
  const [activeTeaserNode, setActiveTeaserNode] = useState(1);
  const [teaserMascotMsg, setTeaserMascotMsg] = useState(null);

  const voiceDemos = [
    { code: 'hi', name: 'हिंदी (Hindi)', sample: 'बोलसेतु में आपका स्वागत है!', icon: 'अ' },
    { code: 'mr', name: 'मराठी (Marathi)', sample: 'बोलसेतू मध्ये आपले स्वागत आहे!', icon: 'म' },
    { code: 'ta', name: 'தமிழ் (Tamil)', sample: 'போல்சேதுவிற்கு உங்களை வரவேற்கிறோம்!', icon: 'அ' },
    { code: 'te', name: 'తెలుగు (Telugu)', sample: 'బోల్ సేతుకు స్వాగతం!', icon: 'అ' },
    { code: 'bn', name: 'বাংলা (Bengali)', sample: 'বোলসেতুতে আপনাকে স্বাগতম!', icon: 'অ' },
    { code: 'en', name: 'English', sample: 'Welcome to BolSetu AI Literacy Platform!', icon: 'A' },
  ];

  const handlePlayVoice = (demo) => {
    sfx.playPop();
    setPreviewPlaying(demo.code);
    audioEngine.speak(demo.sample, demo.code).finally(() => setPreviewPlaying(null));
  };

  // Soundpad samples for current UI/Target lang
  const targetData = ALPHABET_DATA[uiLang === 'en' ? 'hi' : uiLang] || ALPHABET_DATA.hi;
  const soundpadItems = [
    ...(targetData.vowels || []).slice(0, 4).map((v) => ({ ...v, type: 'vowel' })),
    ...(targetData.consonants || []).slice(0, 2).map((c) => ({ ...c, type: 'consonant' })),
    ...(targetData.everydayWords || []).slice(0, 2).map((w) => ({ char: w.word, translit: w.translit, icon: w.icon, type: 'word' })),
  ].slice(0, 8);

  const handleSoundpadTap = (item, idx) => {
    sfx.playPop();
    setActivePad(idx);
    const textToSpeak = item.char || item.word;
    audioEngine.speak(textToSpeak, uiLang === 'en' ? 'hi' : uiLang);
    setTimeout(() => setActivePad(null), 500);
  };

  // Words for Daily Word Widget
  const everydayList = (targetData.everydayWords && targetData.everydayWords.length > 0)
    ? targetData.everydayWords
    : [
        { word: 'पानी', translit: 'Paani', meaning: 'Water', icon: '💧' },
        { word: 'बस', translit: 'Bus', meaning: 'Bus', icon: '🚌' },
        { word: 'बैंक', translit: 'Bank', meaning: 'Bank', icon: '🏦' },
      ];
  const currentDailyWord = everydayList[dailyWordIdx % everydayList.length];

  const handleNextDailyWord = () => {
    sfx.playPop();
    setDailyWordIdx((prev) => (prev + 1) % everydayList.length);
  };

  const handlePlayDailyWord = () => {
    sfx.playPop();
    audioEngine.speak(currentDailyWord.word, uiLang === 'en' ? 'hi' : uiLang);
  };

  // Teaser node click
  const handleTeaserNodeClick = (nodeNum) => {
    sfx.playPop();
    setActiveTeaserNode(nodeNum);
    if (nodeNum === 1) {
      audioEngine.speak('अ', 'hi');
      setTeaserMascotMsg('🦉 Bolu: "Level 1 starts with foundational vowels & letter sounds!"');
    } else if (nodeNum === 2) {
      audioEngine.speak('कमल', 'hi');
      setTeaserMascotMsg('🦉 Bolu: "Level 2 unlocks everyday vocabulary & picture matching!"');
    } else if (nodeNum === 3) {
      sfx.playLevelComplete();
      try { confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } }); } catch (e) {}
      setTeaserMascotMsg('🎁 Bonus Milestone Chest: Contains 50 Gems & Streak Freeze!');
    } else {
      setTeaserMascotMsg('⭐ Register or Continue as Guest to unlock all 10 Levels!');
    }
  };

  // Age Morph Data
  const ageMorphScenarios = {
    child: {
      title: '🧒 Child Track (Ages 8-14)',
      badge: 'Visual & Playful',
      focus: 'Foundational Phonics, Cartoons & Animal Sounds',
      sampleWord: 'हाथी',
      sampleTranslit: 'Haathi (Elephant)',
      sampleIcon: '🐘',
      sampleTask: 'Listen to the trumpet sound and match the elephant with the letter ह!',
      bgGradient: 'linear-gradient(135deg, rgba(255, 159, 28, 0.12), rgba(255, 83, 118, 0.12))',
      color: '#FF9F1C',
    },
    adult: {
      title: '👨‍💼 Adult Track (Ages 15-50)',
      badge: 'Functional & Workplace Literacy',
      focus: 'Market Bills, Bank Deposit Slips & Bus Route Boards',
      sampleWord: 'बैंक पर्ची',
      sampleTranslit: 'Bank Parchi (Deposit Slip)',
      sampleIcon: '🏦',
      sampleTask: 'Practice signing your name and reading amount boxes on a bank deposit slip.',
      bgGradient: 'linear-gradient(135deg, rgba(91, 66, 243, 0.12), rgba(0, 196, 204, 0.12))',
      color: '#5B42F3',
    },
    senior: {
      title: '👵 Senior Track (Ages 50+)',
      badge: 'Audio-First & Easy-Read',
      focus: 'Large 24px+ Touch Buttons, Doctor Prescriptions & Family',
      sampleWord: 'दवाई',
      sampleTranslit: 'Dawai (Medicine)',
      sampleIcon: '💊',
      sampleTask: 'Audio-assisted reading of morning & evening medicine labels and emergency contacts.',
      bgGradient: 'linear-gradient(135deg, rgba(255, 83, 118, 0.12), rgba(91, 66, 243, 0.12))',
      color: '#FF5376',
    },
  };

  const currentMorph = ageMorphScenarios[selectedAgeMorph];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* Sticky Top Navigation */}
      <header className="landing-navbar">
        {/* Brand Logo with Owl Mascot */}
        <BolSetuBrandLogo
          showTagline={false}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        />

        {/* Right Header Navigation Controls */}
        <div className="landing-header-actions">
          {/* Interface Language Selector */}
          <select
            value={uiLang}
            onChange={(e) => {
              sfx.playPop();
              setUiLang(e.target.value);
            }}
            title="Select Interface Language"
            className="landing-lang-select"
          >
            {SUPPORTED_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                🌐 {l.name}
              </option>
            ))}
          </select>

          {/* Theme Switcher */}
          <button
            className="icon-btn landing-theme-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? t.themeLight : t.themeDark}
          >
            {theme === 'dark' ? <Sun size={18} color="#FF9F1C" /> : <Moon size={18} color="#5B42F3" />}
          </button>

          {/* Log In */}
          <button
            className="btn-3d btn-outline landing-auth-btn"
            onClick={() => {
              sfx.playPop();
              onOpenLogin();
            }}
          >
            {t.login}
          </button>

          {/* Register */}
          <button
            className="btn-3d btn-primary landing-auth-btn"
            onClick={() => {
              sfx.playPop();
              onOpenRegister();
            }}
          >
            {t.register}
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* HERO SECTION */}
      {/* ========================================================= */}
      <section
        style={{
          background: 'linear-gradient(180deg, var(--bg-card) 0%, var(--bg-main) 100%)',
          padding: '64px 20px 48px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          {/* Mission Tag */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(91, 66, 243, 0.1)',
              color: '#5B42F3',
              padding: '6px 18px',
              borderRadius: '100px',
              fontWeight: 800,
              fontSize: '0.88rem',
              marginBottom: '20px',
              border: '1px solid rgba(91, 66, 243, 0.2)',
            }}
          >
            <Sparkles size={16} />
            <span>{t.nationalMission}</span>
          </div>

          {/* Hero Headline */}
          <h2
            style={{
              fontSize: '3rem',
              fontWeight: 900,
              lineHeight: 1.18,
              marginBottom: '18px',
              color: 'var(--text-main)',
              letterSpacing: '-0.02em',
            }}
          >
            {t.heroTitle}
          </h2>

          {/* Hero Subtitle */}
          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 36px',
            }}
          >
            {t.heroSubtitle}
          </p>

          {/* Call to Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button
              className="btn-3d btn-primary"
              style={{ padding: '16px 36px', fontSize: '1.15rem', borderRadius: '14px' }}
              onClick={() => {
                sfx.playPop();
                onOpenRegister();
              }}
            >
              <Sparkles size={20} />
              {t.startFree}
            </button>

            <button
              className="btn-3d btn-secondary"
              style={{ padding: '16px 30px', fontSize: '1.1rem', borderRadius: '14px' }}
              onClick={() => {
                sfx.playPop();
                onDirectGuestStart();
              }}
            >
              <Play size={18} fill="#fff" />
              {t.tryAsGuest}
            </button>
          </div>
        </div>

        {/* 6-Language Voice AI Quick Preview Bar */}
        <div
          style={{
            maxWidth: '920px',
            margin: '48px auto 0',
            background: 'var(--bg-card)',
            border: '2px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '14px' }}>
            🔊 {t.voicePreviewPrompt}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px' }}>
            {voiceDemos.map((d) => (
              <button
                key={d.code}
                onClick={() => handlePlayVoice(d)}
                className="category-chip"
                style={{
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: '12px',
                  borderColor: previewPlaying === d.code ? '#5B42F3' : undefined,
                  background: previewPlaying === d.code ? 'rgba(91, 66, 243, 0.12)' : undefined,
                }}
              >
                <Volume2 size={16} color="#5B42F3" />
                <span style={{ fontWeight: 800 }}>{d.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INTERACTIVE FEATURE 1: LIVE AGE-MORPH SIMULATOR */}
      {/* ========================================================= */}
      <section style={{ padding: '60px 20px', maxWidth: '1040px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '100px', background: 'rgba(255, 83, 118, 0.1)', color: '#FF5376', fontWeight: 800, fontSize: '0.82rem', marginBottom: '8px' }}>
            <Zap size={14} /> {t.heroAgeMorphTag}
          </div>
          <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>
            {t.heroAgeMorphTitle}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
            {t.heroAgeMorphDesc}
          </p>
        </div>

        {/* Morph Switcher Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[
            { key: 'child', label: t.ageChildShort, icon: '🧒' },
            { key: 'adult', label: t.ageAdultShort, icon: '👨‍💼' },
            { key: 'senior', label: t.ageSeniorShort, icon: '👵' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => {
                sfx.playPop();
                setSelectedAgeMorph(item.key);
              }}
              style={{
                padding: '12px 24px',
                borderRadius: '14px',
                fontWeight: 800,
                fontSize: '1rem',
                border: selectedAgeMorph === item.key ? '2px solid #5B42F3' : '2px solid var(--border-subtle)',
                background: selectedAgeMorph === item.key ? '#5B42F3' : 'var(--bg-card)',
                color: selectedAgeMorph === item.key ? '#fff' : 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: selectedAgeMorph === item.key ? '0 6px 16px rgba(91, 66, 243, 0.3)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Simulator Display Card */}
        <div
          style={{
            background: currentMorph.bgGradient,
            border: `2px solid ${currentMorph.color}`,
            borderRadius: '24px',
            padding: '36px 28px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  background: currentMorph.color,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  marginBottom: '10px',
                }}
              >
                {currentMorph.badge}
              </span>
              <h4 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                {currentMorph.title}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>
                {currentMorph.focus}
              </p>
            </div>

            {/* Audio Button */}
            <button
              className="btn-3d btn-primary"
              style={{ padding: '10px 20px', borderRadius: '12px', background: currentMorph.color }}
              onClick={() => {
                sfx.playPop();
                audioEngine.speak(currentMorph.sampleWord, 'hi');
              }}
            >
              <Volume2 size={18} />
              Hear Sample Audio
            </button>
          </div>

          {/* Interactive Preview Canvas */}
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: '18px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ fontSize: '3.5rem' }}>{currentMorph.sampleIcon}</div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-indic)', color: 'var(--text-main)' }}>
                  {currentMorph.sampleWord}
                </div>
                <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {currentMorph.sampleTranslit}
                </div>
              </div>
            </div>

            <div style={{ maxWidth: '420px', fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <strong>Adaptive Scenario:</strong> {currentMorph.sampleTask}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INTERACTIVE FEATURE 2: LIVE 8-PAD PHONICS SOUNDPAD */}
      {/* ========================================================= */}
      <section style={{ background: 'var(--bg-card)', padding: '60px 20px', borderTop: '2px solid var(--border-subtle)', borderBottom: '2px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 14px', borderRadius: '100px', background: 'rgba(0, 196, 204, 0.1)', color: '#00C4CC', fontWeight: 800, fontSize: '0.82rem', marginBottom: '8px' }}>
              <Volume2 size={14} /> {t.soundpadTitle}
            </div>
            <h3 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>
              {t.soundpadTitle}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
              {t.soundpadDesc}
            </p>
          </div>

          {/* 8-Pad Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '14px' }}>
            {soundpadItems.map((pad, idx) => (
              <button
                key={idx}
                onClick={() => handleSoundpadTap(pad, idx)}
                style={{
                  background: activePad === idx ? 'linear-gradient(135deg, #5B42F3, #FF5376)' : 'var(--bg-card-subtle)',
                  color: activePad === idx ? '#fff' : 'var(--text-main)',
                  border: activePad === idx ? '2px solid #5B42F3' : '2px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '20px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transform: activePad === idx ? 'scale(0.96)' : 'scale(1)',
                  boxShadow: activePad === idx ? '0 8px 24px rgba(91, 66, 243, 0.4)' : 'var(--shadow-sm)',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>{pad.icon || '🔊'}</div>
                <div style={{ fontSize: '2rem', fontWeight: 900, fontFamily: 'var(--font-indic)' }}>
                  {pad.char || pad.word}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8 }}>
                  {pad.translit}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* INTERACTIVE FEATURE 3: DAILY WORD & MINI-MAZE TEASER */}
      {/* ========================================================= */}
      <section style={{ padding: '60px 20px', maxWidth: '1040px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '28px' }}>
          {/* Widget 1: Daily Word Builder */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.4rem' }}>📖</span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                  {t.dailyWordTitle}
                </h4>
              </div>
              <button
                className="btn-3d btn-outline"
                style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '10px' }}
                onClick={handleNextDailyWord}
              >
                <Shuffle size={14} /> Next
              </button>
            </div>

            {/* Word Display */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(91, 66, 243, 0.05), rgba(255, 83, 118, 0.05))',
                borderRadius: '18px',
                padding: '28px 20px',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)',
                marginBottom: '18px',
              }}
            >
              <div style={{ fontSize: '3.5rem', marginBottom: '10px' }}>{currentDailyWord.icon || '⭐'}</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-indic)', color: 'var(--brand-primary)', marginBottom: '4px' }}>
                {currentDailyWord.word}
              </div>
              <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                {currentDailyWord.translit} • {currentDailyWord.meaning}
              </div>
            </div>

            <button
              className="btn-3d btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              onClick={handlePlayDailyWord}
            >
              <Volume2 size={18} />
              Hear Pronunciation
            </button>
          </div>

          {/* Widget 2: Interactive Path Mini-Teaser */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <span style={{ fontSize: '1.4rem' }}>🗺️</span>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                {t.mazeTeaserTitle}
              </h4>
            </div>

            {/* Mini Serpentine 4 Nodes */}
            <div
              style={{
                background: 'radial-gradient(ellipse at center, rgba(91, 66, 243, 0.06), rgba(0, 196, 204, 0.04))',
                borderRadius: '18px',
                padding: '24px 16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              {[
                { num: 1, label: 'L1: स्वर', icon: 'अ', active: true },
                { num: 2, label: 'L2: व्यंजन', icon: 'क', active: activeTeaserNode >= 2 },
                { num: 3, label: 'Chest', icon: '🎁', active: activeTeaserNode >= 3 },
                { num: 4, label: 'L3: शब्द', icon: '⭐', active: activeTeaserNode >= 4 },
              ].map((node) => (
                <button
                  key={node.num}
                  onClick={() => handleTeaserNodeClick(node.num)}
                  style={{
                    width: '58px',
                    height: '58px',
                    borderRadius: '50%',
                    background: node.active ? 'linear-gradient(135deg, #5B42F3, #FF5376)' : 'var(--bg-card-subtle)',
                    color: node.active ? '#fff' : 'var(--text-muted)',
                    border: activeTeaserNode === node.num ? '3px solid #00C4CC' : '2px solid var(--border-subtle)',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: activeTeaserNode === node.num ? '0 6px 18px rgba(0, 196, 204, 0.4)' : 'var(--shadow-sm)',
                    transform: activeTeaserNode === node.num ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s ease',
                  }}
                  title={node.label}
                >
                  {node.icon}
                </button>
              ))}
            </div>

            {/* Mascot speech hint */}
            <div
              style={{
                background: 'var(--bg-card-subtle)',
                borderRadius: '14px',
                padding: '12px 16px',
                fontSize: '0.88rem',
                color: 'var(--text-main)',
                border: '1px solid var(--border-subtle)',
                minHeight: '48px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {teaserMascotMsg || '🦉 Bolu: "Click any node to preview level challenges and milestones!"'}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5 GAMES SHOWCASE BANNER */}
      {/* ========================================================= */}
      <section style={{ background: 'linear-gradient(135deg, rgba(91, 66, 243, 0.08), rgba(255, 83, 118, 0.08))', padding: '48px 20px', borderTop: '2px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: '1040px', margin: '0 auto', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>
            🎮 {t.exploreAllGames}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 28px' }}>
            5 custom interactive literacy games engineered for neo-learners: Balloon Pop, Memory Flip, Akshar Catch, Shabad Express, and Speed Strike.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            {[
              { icon: '🎈', title: t.balloonTab, desc: 'Audio phonics popping' },
              { icon: '🃏', title: t.memoryTab, desc: 'Card pair recognition' },
              { icon: '🧺', title: t.catchTab, desc: 'Falling letter basket' },
              { icon: '🚂', title: t.trainTab, desc: 'Train word builder' },
              { icon: '⚡', title: t.strikeTab, desc: 'Rapid speed match' },
            ].map((game, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  padding: '20px 14px',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{game.icon}</div>
                <h5 style={{ fontWeight: 800, fontSize: '1rem', margin: '0 0 4px', color: 'var(--text-main)' }}>{game.title}</h5>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{game.desc}</span>
              </div>
            ))}
          </div>

          <button
            className="btn-3d btn-primary"
            style={{ padding: '14px 32px', fontSize: '1.05rem', borderRadius: '14px' }}
            onClick={() => {
              sfx.playPop();
              onDirectGuestStart();
            }}
          >
            <Play size={18} fill="#fff" />
            Play Games as Guest
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          background: 'var(--bg-card)',
          borderTop: '2px solid var(--border-subtle)',
          padding: '32px 24px',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px', fontWeight: 800, color: 'var(--text-main)' }}>
          {t.footerMission}
        </div>
        <div>{t.footerSupported}</div>
      </footer>
    </div>
  );
}
