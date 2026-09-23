import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, XCircle, Award, Sparkles, ArrowRight } from 'lucide-react';
import { getPlacementQuestions } from '../data/placementQuestions';
import { audioEngine } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';

export function PlacementTest({
  targetLang = 'mr',
  uiLang = 'en',
  ageGroup = 'adult',
  onComplete,
  onCancel,
}) {
  const questions = getPlacementQuestions(targetLang, uiLang, ageGroup);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [recommendedLevel, setRecommendedLevel] = useState(1);

  const currentQ = questions[currentIndex] || questions[0];

  useEffect(() => {
    if (currentQ && currentQ.audioPrompt) {
      audioEngine.speak(currentQ.audioPrompt, targetLang);
    }
  }, [currentIndex, currentQ, targetLang]);

  const handleSelectOption = (idx) => {
    sfx.playPop();
    setSelectedOption(idx);
  };

  const handleHearAudio = () => {
    sfx.playPop();
    if (currentQ?.audioPrompt) {
      audioEngine.speak(currentQ.audioPrompt, targetLang);
    }
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const isCorrect = currentQ.options[selectedOption].isCorrect;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (isCorrect) {
      sfx.playSuccess();
    } else {
      sfx.playError();
    }

    setAnswers([...answers, { questionId: currentQ.id, isCorrect }]);
    setSelectedOption(null);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      let unlockLevel = 1;
      const ratio = newScore / questions.length;
      if (ratio >= 0.8) {
        unlockLevel = 7;
      } else if (ratio >= 0.5) {
        unlockLevel = 4;
      } else if (ratio >= 0.3) {
        unlockLevel = 2;
      } else {
        unlockLevel = 1;
      }

      setRecommendedLevel(unlockLevel);
      setIsFinished(true);
      sfx.playLevelComplete();

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  };

  if (isFinished) {
    return (
      <div className="modal-backdrop">
        <div className="lesson-modal" style={{ maxWidth: '520px', textAlign: 'center' }}>
          <div className="lesson-body" style={{ padding: '36px 24px' }}>
            <div
              style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFC800, #F59E0B)',
                margin: '0 auto 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px rgba(245, 158, 11, 0.35)',
              }}
            >
              <Award size={46} color="#FFFFFF" />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>
              {uiLang === 'en' ? 'Placement Evaluation Complete!' : 'स्तर परीक्षण संपन्न!'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '20px' }}>
              {uiLang === 'en' ? 'Your Score: ' : 'आपके कुल अंक: '}
              <strong>{score} / {questions.length}</strong>
            </p>

            <div
              style={{
                background: 'var(--primary-light)',
                border: '2px solid #86EFAC',
                borderRadius: '16px',
                padding: '18px',
                marginBottom: '28px',
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803D' }}>
                {uiLang === 'en' ? 'Recommended Starting Node:' : 'अनुशंसित प्रारंभिक स्तर:'}
              </span>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#166534', marginTop: '4px' }}>
                Level {recommendedLevel} (स्तर {recommendedLevel})
              </div>
              <p style={{ fontSize: '0.85rem', color: '#14532D', marginTop: '6px' }}>
                {uiLang === 'en'
                  ? `We have automatically unlocked all lessons up to Level ${recommendedLevel} for you!`
                  : `हमने आपके लिए स्तर ${recommendedLevel} तक के सभी पूर्व पाठ पहले ही खोल दिए हैं!`}
              </p>
            </div>

            <button
              className="btn-3d btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}
              onClick={() => {
                sfx.playPop();
                onComplete({ recommendedLevel, score });
              }}
            >
              {uiLang === 'en' ? 'Continue to Learning Path' : 'पथ पर आगे बढ़ें'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="modal-backdrop">
      <div className="lesson-modal">
        {/* Header with Progress Bar */}
        <div className="lesson-header">
          <div className="lesson-progress-bar">
            <div className="lesson-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Body */}
        <div className="lesson-body">
          <div className="instruction-box">
            <button className="audio-prompt-btn" onClick={handleHearAudio} title="Play Sound">
              <Volume2 size={24} />
            </button>
            <div>
              <h4 className="instruction-title">{currentQ.instruction}</h4>
              {currentQ.imageHint && (
                <div style={{ fontSize: '3rem', marginTop: '8px' }}>{currentQ.imageHint}</div>
              )}
            </div>
          </div>

          {/* Options Grid */}
          <div className="mcq-grid">
            {currentQ.options.map((opt, idx) => (
              <div
                key={idx}
                className={`mcq-option ${selectedOption === idx ? 'selected' : ''}`}
                onClick={() => handleSelectOption(idx)}
              >
                {opt.text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="lesson-footer">
          <button className="btn-3d btn-outline" onClick={onCancel}>
            {uiLang === 'en' ? 'Skip' : 'छोड़ें'}
          </button>
          <button
            className="btn-3d btn-primary"
            onClick={handleNext}
            disabled={selectedOption === null}
          >
            {currentIndex + 1 === questions.length
              ? uiLang === 'en' ? 'Finish' : 'समाप्त करें'
              : uiLang === 'en' ? 'Next Question' : 'अगला प्रश्न'}
          </button>
        </div>
      </div>
    </div>
  );
}
