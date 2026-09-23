import React, { useState } from 'react';
import { Volume2, Sparkles } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';

export function Mascot({ mood = 'happy', message, uiLang = 'hi', onAudioHelp }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    sfx.playPop();
    if (onAudioHelp) {
      onAudioHelp();
      return;
    }
    if (message) {
      setIsSpeaking(true);
      audioEngine.speak(message, uiLang).finally(() => setIsSpeaking(false));
    }
  };

  return (
    <div className="mascot-widget">
      {/* Playful Owl Mascot SVG */}
      <div className="mascot-avatar" onClick={handleSpeak} style={{ cursor: 'pointer' }} title="Akshi the Owl (अक्षी)">
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <defs>
            <linearGradient id="owlBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38BDF8" />
              <stop offset="100%" stop-color="#0284C7" />
            </linearGradient>
            <linearGradient id="owlBellyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FEF08A" />
              <stop offset="100%" stop-color="#FACC15" />
            </linearGradient>
          </defs>

          {/* Owl Ears / Tufts */}
          <polygon points="24,18 36,34 16,32" fill="#0369A1" />
          <polygon points="76,18 84,32 64,34" fill="#0369A1" />

          {/* Owl Body */}
          <ellipse cx="50" cy="56" rx="36" ry="38" fill="url(#owlBodyGrad)" />

          {/* Belly */}
          <ellipse cx="50" cy="64" rx="22" ry="24" fill="url(#owlBellyGrad)" />
          {/* Feather markings */}
          <path d="M42,56 Q50,60 58,56 M44,64 Q50,68 56,64 M45,72 Q50,75 55,72" stroke="#CA8A04" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Wings */}
          <ellipse cx="16" cy="58" rx="8" ry="20" fill="#0284C7" transform="rotate(10 16 58)" />
          <ellipse cx="84" cy="58" rx="8" ry="20" fill="#0284C7" transform="rotate(-10 84 58)" />

          {/* Big Cartoon Eyes */}
          <circle cx="37" cy="42" r="14" fill="#FFFFFF" stroke="#0369A1" strokeWidth="2" />
          <circle cx="63" cy="42" r="14" fill="#FFFFFF" stroke="#0369A1" strokeWidth="2" />

          {/* Pupils with playful expression */}
          {mood === 'cheer' ? (
            <>
              {/* Joyful arc eyes */}
              <path d="M28,42 Q37,34 46,42" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M54,42 Q63,34 72,42" stroke="#0F172A" strokeWidth="4" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="39" cy="42" r="7" fill="#0F172A" />
              <circle cx="41" cy="40" r="2.5" fill="#FFFFFF" />
              <circle cx="61" cy="42" r="7" fill="#0F172A" />
              <circle cx="63" cy="40" r="2.5" fill="#FFFFFF" />
            </>
          )}

          {/* Beak */}
          <polygon points="46,48 54,48 50,58" fill="#F97316" />

          {/* Cute Graduation / Scholar Cap */}
          <polygon points="50,10 78,19 50,26 22,19" fill="#4F46E5" />
          <rect x="40" y="24" width="20" height="6" rx="3" fill="#3730A3" />
          {/* Tassel */}
          <circle cx="50" cy="18" r="2.5" fill="#FBBF24" />
          <path d="M50,18 Q62,22 68,32" stroke="#FBBF24" strokeWidth="2" fill="none" />
          <circle cx="68" cy="33" r="3" fill="#FBBF24" />

          {/* Cute feet */}
          <ellipse cx="40" cy="93" rx="6" ry="3" fill="#EA580C" />
          <ellipse cx="60" cy="93" rx="6" ry="3" fill="#EA580C" />
        </svg>
      </div>

      {/* Speech Bubble */}
      <div className="mascot-bubble">
        <div>{message}</div>
        <button
          className="mascot-audio-btn"
          onClick={handleSpeak}
          title={uiLang === 'en' ? 'Listen Aloud' : 'आवाज़ सुनें'}
        >
          <Volume2 size={15} className={isSpeaking ? 'animate-pulse' : ''} />
          <span>
            {isSpeaking
              ? uiLang === 'en' ? 'Speaking...' : 'बोल रहे हैं...'
              : uiLang === 'en' ? 'Listen' : 'आवाज़ सुनें'}
          </span>
          <Sparkles size={13} color="#EAB308" />
        </button>
      </div>
    </div>
  );
}
