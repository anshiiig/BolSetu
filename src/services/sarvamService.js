// Sarvam AI Text-to-Speech Service Integration
// Supports Indic neural speech synthesis for Hindi, Tamil, Telugu, Bengali, Marathi, English
// Powered by Sarvam AI Bulbul v3 with multi-layer persistent audio caching

import { audioCache } from './audioCache';

const DEFAULT_SARVAM_KEY = 'sk_qkx76qdz_xn8XH22i1J27UMaQmEtN9zn4';
const SARVAM_STORAGE_KEY = 'aksharpath_sarvam_key';
const SARVAM_SPEAKER_KEY = 'aksharpath_sarvam_speaker';

// Language code mapping for Sarvam AI Bulbul v3
export const SARVAM_LANG_MAP = {
  hi: 'hi-IN',
  en: 'en-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  mr: 'mr-IN',
};

// Recommended high-clarity speakers per language for Bulbul v3
export const SARVAM_DEFAULT_SPEAKERS = {
  hi: 'priya',
  en: 'aditya',
  mr: 'rupali',
  te: 'kavitha',
  ta: 'vijay',
  bn: 'roopa',
};

// Valid bulbul:v3 speakers
export const SARVAM_SPEAKERS = [
  { id: 'auto', name: 'Automatic (Best for Language)', gender: 'neutral' },
  { id: 'priya', name: 'Priya (Warm Female - Hindi/English)', gender: 'female' },
  { id: 'rupali', name: 'Rupali (Clear Female - Marathi)', gender: 'female' },
  { id: 'kavitha', name: 'Kavitha (Melodious Female - Telugu)', gender: 'female' },
  { id: 'vijay', name: 'Vijay (Expressive Male - Tamil)', gender: 'male' },
  { id: 'roopa', name: 'Roopa (Gentle Female - Bengali)', gender: 'female' },
  { id: 'aditya', name: 'Aditya (Articulate Male - Multi-Indic)', gender: 'male' },
  { id: 'rahul', name: 'Rahul (Friendly Male - Hindi)', gender: 'male' },
  { id: 'neha', name: 'Neha (Conversational Female)', gender: 'female' },
  { id: 'pooja', name: 'Pooja (Clear Female)', gender: 'female' },
  { id: 'rohan', name: 'Rohan (Youthful Male)', gender: 'male' },
  { id: 'simran', name: 'Simran (Expressive Female)', gender: 'female' },
  { id: 'soham', name: 'Soham (Energetic Male)', gender: 'male' },
];

class SarvamService {
  constructor() {
    // Check localStorage, fall back to default working key
    const storedKey = typeof window !== 'undefined' ? localStorage.getItem(SARVAM_STORAGE_KEY) : null;
    this.apiKey = (storedKey && storedKey.trim().length > 10) ? storedKey.trim() : DEFAULT_SARVAM_KEY;

    if (typeof window !== 'undefined' && !storedKey) {
      localStorage.setItem(SARVAM_STORAGE_KEY, DEFAULT_SARVAM_KEY);
    }

    this.selectedSpeaker = (typeof window !== 'undefined' && localStorage.getItem(SARVAM_SPEAKER_KEY)) || 'auto';
  }

  setApiKey(key) {
    this.apiKey = key ? key.trim() : DEFAULT_SARVAM_KEY;
    if (typeof window !== 'undefined') {
      localStorage.setItem(SARVAM_STORAGE_KEY, this.apiKey);
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  setSpeaker(speakerId) {
    this.selectedSpeaker = speakerId || 'auto';
    if (typeof window !== 'undefined') {
      localStorage.setItem(SARVAM_SPEAKER_KEY, this.selectedSpeaker);
    }
  }

  getSpeaker() {
    return this.selectedSpeaker;
  }

  // Get optimal speaker for the given language
  getSpeakerForLang(langCode = 'hi') {
    if (this.selectedSpeaker && this.selectedSpeaker !== 'auto') {
      return this.selectedSpeaker;
    }
    return SARVAM_DEFAULT_SPEAKERS[langCode] || 'priya';
  }

  // Synthesize text using Sarvam AI Bulbul v3 TTS API with persistent caching
  async synthesize(text, langCode = 'hi') {
    if (!this.hasApiKey()) {
      throw new Error('Sarvam API key not configured');
    }

    const cleanText = (text || '').trim();
    if (!cleanText) {
      throw new Error('Empty text for synthesis');
    }

    const targetLang = SARVAM_LANG_MAP[langCode] || 'hi-IN';
    const speaker = this.getSpeakerForLang(langCode);
    const cacheKey = audioCache.getKey(langCode, cleanText, speaker);

    // 1. Check instant cache (memory or IndexedDB)
    const cachedAudio = await audioCache.get(cacheKey);
    if (cachedAudio) {
      return cachedAudio;
    }

    // 2. Try Backend TTS Proxy endpoint first (/api/tts)
    try {
      const proxyResponse = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: cleanText,
          langCode: targetLang,
          speaker: speaker,
        }),
      });

      if (proxyResponse.ok) {
        const proxyData = await proxyResponse.json();
        if (proxyData && proxyData.audios && proxyData.audios[0]) {
          const base64Wav = proxyData.audios[0];
          const entry = await audioCache.set(cacheKey, base64Wav);
          return entry;
        }
      }
    } catch (proxyErr) {
      console.warn('/api/tts proxy unreachable, falling back to direct cloud API:', proxyErr);
    }

    // 3. Fallback: Direct call to Sarvam Bulbul:v3 API with client API key
    const response = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': this.apiKey,
      },
      body: JSON.stringify({
        inputs: [cleanText],
        target_language_code: targetLang,
        speaker: speaker,
        pitch: 0,
        pace: 0.92, // Comfortable, clear pace for literacy learners
        loudness: 1.4,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: 'bulbul:v3',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Sarvam API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    if (data && data.audios && data.audios[0]) {
      const base64Wav = data.audios[0];
      // Persist to cache (memory + IndexedDB) for instant repeat play
      const entry = await audioCache.set(cacheKey, base64Wav);
      return entry;
    }

    throw new Error('No audio returned by Sarvam AI');
  }

  // Play audio directly
  async speak(text, langCode = 'hi') {
    const entry = await this.synthesize(text, langCode);
    return audioCache.playAudioEntry(entry);
  }
}

export const sarvamService = new SarvamService();
