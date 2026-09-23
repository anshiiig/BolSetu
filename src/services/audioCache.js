// Multi-Tier Persistent Audio Cache System
// Tier 1: In-Memory Map (0ms latency instant playback)
// Tier 2: IndexedDB (Persistent across reloads, unlimited audio clips)

const DB_NAME = 'aksharpath_audio_db';
const DB_VERSION = 2;
const STORE_NAME = 'audio_clips';

export function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function base64ToBlobUrl(base64, mimeType = 'audio/wav') {
  const buffer = base64ToArrayBuffer(base64);
  const blob = new Blob([buffer], { type: mimeType });
  return URL.createObjectURL(blob);
}

class AudioCache {
  constructor() {
    this.memoryCache = new Map(); // key -> { base64, blobUrl, audioBuffer }
    this.audioCtx = null;
    this.dbPromise = this.initIndexedDB();
  }

  getAudioContext() {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  initIndexedDB() {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return Promise.resolve(null);
    }

    return new Promise((resolve) => {
      try {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          }
        };

        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (err) => {
          console.warn('IndexedDB failed to open, relying on in-memory audio cache:', err);
          resolve(null);
        };
      } catch (err) {
        console.warn('IndexedDB initialization error:', err);
        resolve(null);
      }
    });
  }

  // Generate unique normalized cache key
  getKey(langCode, text, speaker = 'default') {
    const clean = (text || '').trim().toLowerCase();
    const lang = (langCode || 'hi').toLowerCase();
    return `${lang}_${speaker}_${clean}`;
  }

  // Retrieve audio from Memory or IndexedDB
  async get(key) {
    // 1. Check memory cache first (instant 0ms)
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }

    // 2. Check IndexedDB
    const db = await this.dbPromise;
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(key);

        request.onsuccess = () => {
          if (request.result && request.result.base64) {
            const entry = {
              base64: request.result.base64,
              blobUrl: request.result.blobUrl || base64ToBlobUrl(request.result.base64),
            };
            this.memoryCache.set(key, entry);
            resolve(entry);
          } else if (request.result && request.result.audioUrl) {
            // legacy migration
            const base64 = request.result.audioUrl.replace(/^data:audio\/\w+;base64,/, '');
            const entry = {
              base64,
              blobUrl: base64ToBlobUrl(base64),
            };
            this.memoryCache.set(key, entry);
            resolve(entry);
          } else {
            resolve(null);
          }
        };

        request.onerror = () => {
          resolve(null);
        };
      } catch (e) {
        console.warn('Error reading from audio IndexedDB:', e);
        resolve(null);
      }
    });
  }

  // Save audio base64 to both Memory and IndexedDB
  async set(key, base64) {
    if (!key || !base64) return null;
    const cleanBase64 = base64.replace(/^data:audio\/\w+;base64,/, '');
    const blobUrl = base64ToBlobUrl(cleanBase64);
    const entry = { base64: cleanBase64, blobUrl };

    // 1. Store in memory
    this.memoryCache.set(key, entry);

    // 2. Store in IndexedDB
    const db = await this.dbPromise;
    if (db) {
      try {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.put({
          id: key,
          base64: cleanBase64,
          timestamp: Date.now(),
        });
      } catch (e) {
        console.warn('Error persisting to audio IndexedDB:', e);
      }
    }

    return entry;
  }

  // Play audio buffer via Web Audio API or Blob URL
  async playAudioEntry(entry) {
    if (!entry) return;

    // Method 1: Web Audio API (Guaranteed unblocked by autoplay once context is running)
    const ctx = this.getAudioContext();
    if (ctx) {
      try {
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }

        if (!entry.audioBuffer && entry.base64) {
          const arrayBuffer = base64ToArrayBuffer(entry.base64);
          entry.audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        }

        if (entry.audioBuffer) {
          return new Promise((resolve) => {
            const source = ctx.createBufferSource();
            source.buffer = entry.audioBuffer;
            source.connect(ctx.destination);
            source.onended = () => resolve(true);
            source.start(0);
          });
        }
      } catch (err) {
        console.warn('Web Audio decode/play fallback to HTMLAudioElement:', err);
      }
    }

    // Method 2: HTMLAudioElement with Blob URL
    return new Promise((resolve, reject) => {
      try {
        const url = entry.blobUrl || (entry.base64 ? base64ToBlobUrl(entry.base64) : null);
        if (!url) return reject(new Error('No valid audio source'));
        const audio = new Audio(url);
        audio.onended = () => resolve(true);
        audio.onerror = (err) => reject(err);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(reject);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  playAudioUrl(audioUrl) {
    if (!audioUrl) return Promise.resolve();
    if (audioUrl.startsWith('data:audio/')) {
      const base64 = audioUrl.replace(/^data:audio\/\w+;base64,/, '');
      return this.playAudioEntry({ base64 });
    }
    return new Promise((resolve, reject) => {
      try {
        const audio = new Audio(audioUrl);
        audio.onended = () => resolve(true);
        audio.onerror = (err) => reject(err);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(reject);
        }
      } catch (err) {
        reject(err);
      }
    });
  }

  // Count total cached audio clips
  async count() {
    const memCount = this.memoryCache.size;
    const db = await this.dbPromise;
    if (!db) return memCount;

    return new Promise((resolve) => {
      try {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const countRequest = store.count();
        countRequest.onsuccess = () => resolve(Math.max(memCount, countRequest.result));
        countRequest.onerror = () => resolve(memCount);
      } catch {
        resolve(memCount);
      }
    });
  }

  // Clear all cached audio
  async clear() {
    this.memoryCache.clear();
    const db = await this.dbPromise;
    if (!db) return;

    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
    } catch (e) {
      console.warn('Error clearing audio cache:', e);
    }
  }
}

export const audioCache = new AudioCache();
