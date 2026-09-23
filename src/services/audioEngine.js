// Multi-Tier Indic Voice Audio Engine
// Provides audio playback across:
// Hindi (hi), English (en), Tamil (ta), Telugu (te), Bengali (bn), Marathi (mr)
// Tier 1: Instant Persistent Audio Cache (Memory + IndexedDB, 0ms latency)
// Tier 2: Sarvam AI Bulbul v3 Neural Voice (Studio-grade Indic speech)
// Tier 3: Browser SpeechSynthesis (Chrome GC bug protected)
// Tier 4: Sound effect fallback

import { sarvamService } from './sarvamService';
import { audioCache } from './audioCache';
import { sfx } from './soundEffects';

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'हिंदी (Hindi)', script: 'Devanagari', bcp47: 'hi-IN', ttsCode: 'hi', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी (Marathi)', script: 'Devanagari', bcp47: 'mr-IN', ttsCode: 'mr', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు (Telugu)', script: 'Telugu', bcp47: 'te-IN', ttsCode: 'te', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ் (Tamil)', script: 'Tamil', bcp47: 'ta-IN', ttsCode: 'ta', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা (Bengali)', script: 'Bengali', bcp47: 'bn-IN', ttsCode: 'bn', flag: '🇮🇳' },
  { code: 'en', name: 'English', script: 'Latin', bcp47: 'en-IN', ttsCode: 'en', flag: '🇮🇳' },
];

class AudioEngine {
  constructor() {
    this.currentAudio = null;
    this.isSpeaking = false;
    this.browserVoices = [];
    this.currentVoiceMode = 'auto'; // 'auto' | 'sarvam' | 'browser'
    this.initBrowserVoices();
    this.setupGlobalUnlock();
  }

  setupGlobalUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      this.unlockAudio();
    };
    ['click', 'touchstart', 'keydown'].forEach((evt) => {
      document.addEventListener(evt, unlock, { capture: true, once: true });
    });
  }

  unlockAudio() {
    try {
      // 1. Unlock AudioCache Web Audio Context
      const ctx = audioCache.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      // 2. Unlock SFX Context
      sfx.init();

      // 3. Unlock SpeechSynthesis
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      }
    } catch (e) {
      console.warn('Audio unlock warning:', e);
    }
  }

  initBrowserVoices() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        try {
          this.browserVoices = window.speechSynthesis.getVoices() || [];
        } catch {
          this.browserVoices = [];
        }
      };

      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    }
  }

  setVoiceMode(mode) {
    this.currentVoiceMode = mode;
  }

  getVoiceMode() {
    return this.currentVoiceMode;
  }

  // Find best matching voice for the language in Web Speech API
  getMatchingBrowserVoice(langCode) {
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    const targetBcp = langObj ? langObj.bcp47.toLowerCase() : 'hi-in';
    const shortCode = (langCode || 'hi').toLowerCase();

    if (!this.browserVoices.length && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        this.browserVoices = window.speechSynthesis.getVoices() || [];
      } catch {}
    }

    // 1. Exact BCP-47 match
    let match = this.browserVoices.find(
      (v) => v.lang.toLowerCase() === targetBcp || v.lang.toLowerCase().replace('_', '-') === targetBcp
    );

    // 2. Prefix match
    if (!match) {
      match = this.browserVoices.find((v) => v.lang.toLowerCase().startsWith(shortCode));
    }

    // 3. Name match
    if (!match && langObj) {
      match = this.browserVoices.find((v) =>
        v.name.toLowerCase().includes(langObj.name.toLowerCase().split(' ')[0])
      );
    }

    return match;
  }

  // Speak using Browser Web Speech API with Chrome GC bug workaround
  playBrowserSpeech(text, langCode = 'hi') {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return reject(new Error('SpeechSynthesis not supported'));
      }

      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
        utterance.lang = langObj ? langObj.bcp47 : 'hi-IN';

        const voice = this.getMatchingBrowserVoice(langCode);
        if (voice) {
          utterance.voice = voice;
        }

        utterance.rate = 0.88;
        utterance.pitch = 1.0;

        // Keep reference in window to prevent Chromium garbage collection pause bug
        window.__currentUtterance = utterance;

        utterance.onend = () => {
          this.isSpeaking = false;
          window.__currentUtterance = null;
          resolve(true);
        };

        utterance.onerror = (e) => {
          this.isSpeaking = false;
          window.__currentUtterance = null;
          reject(e);
        };

        this.isSpeaking = true;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        this.isSpeaking = false;
        reject(err);
      }
    });
  }

  // Unified Multi-Tier Voice Playback
  async speak(text, langCode = 'hi') {
    if (!text || !text.trim()) return;
    this.unlockAudio();

    // Stop currently running playback
    this.stop();

    const cleanText = text.trim();
    const speaker = sarvamService.getSpeakerForLang(langCode);
    const cacheKey = audioCache.getKey(langCode, cleanText, speaker);

    // =========================================================================
    // TIER 1: Check Instant Audio Cache (Memory or IndexedDB)
    // Plays with zero delay!
    // =========================================================================
    try {
      const cachedEntry = await audioCache.get(cacheKey);
      if (cachedEntry) {
        this.isSpeaking = true;
        await audioCache.playAudioEntry(cachedEntry);
        this.isSpeaking = false;
        return;
      }
    } catch (e) {
      console.warn('Cache playback warning:', e);
    }

    // =========================================================================
    // TIER 2: Sarvam AI Bulbul v3 Neural Voice
    // =========================================================================
    if (sarvamService.hasApiKey() && this.currentVoiceMode !== 'browser') {
      try {
        this.isSpeaking = true;
        await sarvamService.speak(cleanText, langCode);
        this.isSpeaking = false;
        return;
      } catch (err) {
        console.warn('Sarvam AI voice failed, trying browser synthesis:', err);
      }
    }

    // =========================================================================
    // TIER 3: Browser Web Speech API
    // =========================================================================
    try {
      await this.playBrowserSpeech(cleanText, langCode);
      return;
    } catch (err) {
      console.warn('Browser speech failed, falling back to acoustic confirmation:', err);
    }

    // =========================================================================
    // TIER 4: Acoustic Sound Effect Fallback
    // =========================================================================
    try {
      sfx.playSuccess();
    } catch {}
    this.isSpeaking = false;
  }

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isSpeaking = false;
  }
}

export const audioEngine = new AudioEngine();
