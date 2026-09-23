import React, { useState, useEffect } from 'react';
import { Settings2, Volume2, CheckCircle2, AlertCircle, Sparkles, Database, Trash2 } from 'lucide-react';
import { sarvamService, SARVAM_SPEAKERS } from '../services/sarvamService';
import { audioEngine, SUPPORTED_LANGUAGES } from '../services/audioEngine';
import { audioCache } from '../services/audioCache';
import { sfx } from '../services/soundEffects';

export function SarvamSettingsModal({ isOpen, onClose, targetLang = 'hi' }) {
  const [apiKey, setApiKey] = useState(sarvamService.getApiKey());
  const [speaker, setSpeaker] = useState(sarvamService.getSpeaker());
  const [voiceMode, setVoiceMode] = useState(audioEngine.getVoiceMode());
  const [testText, setTestText] = useState('नमस्ते! बोलसेतु में आपका स्वागत है।');
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [cacheCount, setCacheCount] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setApiKey(sarvamService.getApiKey());
      setSpeaker(sarvamService.getSpeaker());
      setVoiceMode(audioEngine.getVoiceMode());
      audioCache.count().then(setCacheCount).catch(() => {});

      // Set sample test sentence based on active language
      const samples = {
        hi: 'नमस्ते! बोलसेतु में आपका स्वागत है।',
        mr: 'नमस्कार! बोलसेतू मध्ये आपले स्वागत आहे.',
        te: 'నమస్కారం! బోల్‌సేతుకి స్వాగతం.',
        ta: 'வணக்கம்! போல்சேதுவுக்கு நல்வரவு.',
        bn: 'নমস্কার! বোলসেতুতে আপনাকে স্বাগতম।',
        en: 'Welcome to BolSetu! Enjoy learning regional languages.',
      };
      setTestText(samples[targetLang] || samples.hi);
    }
  }, [isOpen, targetLang]);

  if (!isOpen) return null;

  const handleSave = () => {
    sfx.playPop();
    sarvamService.setApiKey(apiKey);
    sarvamService.setSpeaker(speaker);
    audioEngine.setVoiceMode(voiceMode);
    onClose();
  };

  const handleTestVoice = async () => {
    sfx.playPop();
    setIsTesting(true);
    setTestStatus(null);
    try {
      sarvamService.setApiKey(apiKey);
      sarvamService.setSpeaker(speaker);
      audioEngine.setVoiceMode(voiceMode);
      await audioEngine.speak(testText, targetLang);
      const count = await audioCache.count();
      setCacheCount(count);
      setTestStatus({ type: 'success', msg: 'आवाज़ सफलतापूर्वक बजाई गई और सहेजी गई! (Audio played & cached instantly)' });
    } catch (e) {
      console.error(e);
      setTestStatus({ type: 'error', msg: `Voice error: ${e.message}` });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearCache = async () => {
    sfx.playPop();
    await audioCache.clear();
    setCacheCount(0);
    setTestStatus({ type: 'success', msg: 'ऑडियो कैश खाली कर दिया गया! (Audio cache cleared)' });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="lesson-modal"
        style={{ maxWidth: '560px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lesson-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings2 size={22} color="var(--secondary)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              आवाज़ व AI सेटिंग्स (Voice & Speech AI Settings)
            </h3>
          </div>
          <button className="icon-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            ✕
          </button>
        </div>

        <div className="lesson-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Engine Selector */}
          <div>
            <label style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '6px', display: 'block' }}>
              आवाज़ प्रणाली (Voice Engine Mode):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { id: 'auto', label: 'Auto (Recommended)', desc: 'Smart instant cache + Sarvam Bulbul v3' },
                { id: 'sarvam', label: 'Sarvam AI Neural', desc: 'Studio-grade Indian neural voices' },
                { id: 'browser', label: 'Browser Speech', desc: 'Native OS speech synthesis' },
              ].map((mode) => (
                <div
                  key={mode.id}
                  className={`mcq-option ${voiceMode === mode.id ? 'selected' : ''}`}
                  onClick={() => {
                    sfx.playPop();
                    setVoiceMode(mode.id);
                  }}
                  style={{ padding: '12px', textAlign: 'left', fontSize: '0.9rem' }}
                >
                  <div style={{ fontWeight: 800 }}>{mode.label}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{mode.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sarvam AI API Key Configuration */}
          <div
            style={{
              background: 'var(--bg-main)',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Sparkles size={18} color="var(--primary)" />
              <strong style={{ fontSize: '0.95rem' }}>Sarvam AI Bulbul v3 Key</strong>
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: sarvamService.hasApiKey() ? '#DCFCE7' : '#FEE2E2',
                  color: sarvamService.hasApiKey() ? '#15803D' : '#DC2626',
                  fontWeight: 700,
                  marginLeft: 'auto',
                }}
              >
                {sarvamService.hasApiKey() ? '● सक्रिय (Active)' : '○ अनुपस्थित'}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
              सक्रिय API कुंजी से सभी 6 भाषाओं में स्पष्ट भारतीय उच्चारण प्राप्त होता है।
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk_..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '2px solid var(--border-subtle)',
                fontFamily: 'monospace',
                fontSize: '0.88rem',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
              }}
            />
          </div>

          {/* Speaker Selector */}
          <div>
            <label style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '6px', display: 'block' }}>
              पसंदीदा वक्ता (Voice Speaker):
            </label>
            <select
              value={speaker}
              onChange={(e) => setSpeaker(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '2px solid var(--border-subtle)',
                fontWeight: 700,
                fontSize: '0.9rem',
                background: 'var(--bg-card)',
                color: 'var(--text-main)',
              }}
            >
              {SARVAM_SPEAKERS.map((spk) => (
                <option key={spk.id} value={spk.id}>
                  {spk.name}
                </option>
              ))}
            </select>
          </div>

          {/* Audio Cache Statistics */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-main)',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '2px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="var(--primary)" />
              <div>
                <strong style={{ fontSize: '0.88rem' }}>ऑफलाइन ऑडियो कैश (Instant Cache)</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {cacheCount} ऑडियो क्लिप सहेजे गए (अगली बार तुरंत 0ms में बजेंगे)
                </div>
              </div>
            </div>
            {cacheCount > 0 && (
              <button
                className="btn-3d"
                onClick={handleClearCache}
                style={{
                  padding: '6px 10px',
                  fontSize: '0.78rem',
                  background: '#FEE2E2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  boxShadow: '0 3px 0 #FCA5A5',
                }}
              >
                <Trash2 size={13} />
                कैश साफ़ करें
              </button>
            )}
          </div>

          {/* Live Voice Test Section */}
          <div
            style={{
              background: 'var(--bg-main)',
              padding: '16px',
              borderRadius: '12px',
              border: '2px solid var(--border-subtle)',
            }}
          >
            <label style={{ fontWeight: 800, fontSize: '0.88rem', marginBottom: '6px', display: 'block' }}>
              परीक्षण वाक्य (Test Voice for {SUPPORTED_LANGUAGES.find((l) => l.code === targetLang)?.name}):
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '2px solid var(--border-subtle)',
                  fontSize: '0.9rem',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                }}
              />
              <button
                className="btn-3d btn-secondary"
                onClick={handleTestVoice}
                disabled={isTesting}
                style={{ padding: '8px 16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Volume2 size={16} />
                {isTesting ? 'बोल रहे हैं...' : 'सुने'}
              </button>
            </div>

            {testStatus && (
              <div
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: testStatus.type === 'success' ? '#DCFCE7' : '#FEE2E2',
                  color: testStatus.type === 'success' ? '#15803D' : '#DC2626',
                }}
              >
                {testStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {testStatus.msg}
              </div>
            )}
          </div>
        </div>

        <div className="lesson-footer">
          <button className="btn-3d btn-outline" onClick={onClose} style={{ padding: '10px 20px' }}>
            रद्द करें (Cancel)
          </button>
          <button className="btn-3d btn-primary" onClick={handleSave} style={{ padding: '10px 24px' }}>
            सहेजें (Save Settings)
          </button>
        </div>
      </div>
    </div>
  );
}
