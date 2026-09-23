import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { getBaselineQuestions } from '../data/placementQuestions';
import { audioEngine } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';

export function BaselineModal({
  targetLang = 'mr',
  uiLang = 'en',
  ageGroup = 'adult',
  onComplete,
}) {
  const questions = getBaselineQuestions(targetLang, uiLang, ageGroup);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    if (currentQ?.audioPrompt) {
      audioEngine.speak(currentQ.audioPrompt, targetLang);
    }
  }, [currentIndex, currentQ, targetLang]);

  const handleHearAudio = () => {
    sfx.playPop();
    if (currentQ?.audioPrompt) {
      audioEngine.speak(currentQ.audioPrompt, targetLang);
    }
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    const isCorrect = currentQ.options[selectedOption].isCorrect;
    if (isCorrect) {
      sfx.playSuccess();
      setScore((s) => s + 1);
    } else {
      sfx.playPop();
    }

    setSelectedOption(null);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      sfx.playLevelComplete();
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      onComplete({ baselineScore: score + (isCorrect ? 1 : 0) });
    }
  };

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="modal-backdrop">
      <div className="lesson-modal" style={{ maxWidth: '520px' }}>
        <div className="lesson-header">
          <div className="lesson-progress-bar">
            <div className="lesson-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {uiLang === 'en' ? 'Baseline Assessment:' : 'प्रारंभिक जाँच:'} {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="lesson-body">
          <div className="instruction-box">
            <button className="audio-prompt-btn" onClick={handleHearAudio} title="Listen Again">
              <Volume2 size={24} />
            </button>
            <div>
              <h4 className="instruction-title">{currentQ.instruction}</h4>
              {currentQ.imageHint && (
                <div style={{ fontSize: '3rem', marginTop: '8px' }}>{currentQ.imageHint}</div>
              )}
            </div>
          </div>

          <div className="mcq-grid" style={{ gridTemplateColumns: '1fr' }}>
            {currentQ.options.map((opt, idx) => (
              <div
                key={idx}
                className={`mcq-option ${selectedOption === idx ? 'selected' : ''}`}
                onClick={() => {
                  sfx.playPop();
                  setSelectedOption(idx);
                }}
              >
                {opt.text}
              </div>
            ))}
          </div>
        </div>

        <div className="lesson-footer">
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {uiLang === 'en'
              ? 'Relax! This is just to calibrate your starting pace.'
              : 'चिंता न करें, यह केवल आपकी शुरुआत के लिए है!'}
          </div>
          <button
            className="btn-3d btn-primary"
            onClick={handleNext}
            disabled={selectedOption === null}
          >
            {currentIndex + 1 === questions.length
              ? uiLang === 'en' ? 'Start Learning' : 'सीखना शुरू करें'
              : uiLang === 'en' ? 'Continue' : 'आगे बढ़ें'}
          </button>
        </div>
      </div>
    </div>
  );
}
