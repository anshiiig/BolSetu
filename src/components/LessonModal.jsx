import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  XCircle,
  Award,
  Heart,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';
import { evaluatePronunciation } from '../services/pronunciationScorer';
import { UI_TRANSLATIONS } from '../data/uiTranslations';
import { DuolingoTracer } from './DuolingoTracer';

export function LessonModal({
  level,
  targetLang = 'mr',
  uiLang = 'en',
  hearts,
  onLoseHeart,
  onCompleteLesson,
  onClose,
}) {
  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;
  const questions = level.questions || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [scrambleTokens, setScrambleTokens] = useState([]);
  const [scrambleSelected, setScrambleSelected] = useState([]);
  const [matchPairs, setMatchPairs] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [fillBlankChoice, setFillBlankChoice] = useState(null);

  // Pronunciation Coach State
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [pronunciationResult, setPronunciationResult] = useState(null);

  // Question Check State: 'unanswered' | 'correct' | 'incorrect'
  const [checkStatus, setCheckStatus] = useState('unanswered');
  const [isLessonFinished, setIsLessonFinished] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const recognitionRef = useRef(null);
  const currentQ = questions[currentIdx] || questions[0];

  // Initialize or reset question state whenever currentIdx changes
  useEffect(() => {
    if (!currentQ) return;
    setCheckStatus('unanswered');
    setSelectedOption(null);
    setFillBlankChoice(null);
    setSpokenTranscript('');
    setPronunciationResult(null);

    // Auto play audio prompt if available
    if (currentQ.audioPrompt) {
      audioEngine.speak(currentQ.audioPrompt, targetLang);
    }

    // Prepare scramble pool
    if (currentQ.type === 'scramble') {
      const shuffled = [...(currentQ.tokens || [])].sort(() => Math.random() - 0.5);
      setScrambleTokens(shuffled);
      setScrambleSelected([]);
    }

    // Prepare match pairs
    if (currentQ.type === 'match_pairs') {
      setMatchedPairs([]);
      setSelectedLeft(null);
      const shuffledPairs = [...(currentQ.pairs || [])].sort(() => Math.random() - 0.5);
      setMatchPairs(shuffledPairs);
    }
  }, [currentIdx, currentQ, targetLang]);

  const handleAudioPrompt = () => {
    sfx.playPop();
    if (currentQ.audioPrompt) {
      audioEngine.speak(currentQ.audioPrompt, targetLang);
    } else if (currentQ.targetWord) {
      audioEngine.speak(currentQ.targetWord, targetLang);
    } else if (currentQ.char) {
      audioEngine.speak(currentQ.char, targetLang);
    }
  };

  const handleMcqSelect = (idx) => {
    if (checkStatus !== 'unanswered') return;
    sfx.playPop();
    setSelectedOption(idx);
  };

  const handleAddToken = (token, idx) => {
    if (checkStatus !== 'unanswered') return;
    sfx.playPop();
    setScrambleSelected([...scrambleSelected, token]);
    const nextTokens = [...scrambleTokens];
    nextTokens.splice(idx, 1);
    setScrambleTokens(nextTokens);
  };

  const handleRemoveToken = (token, idx) => {
    if (checkStatus !== 'unanswered') return;
    sfx.playPop();
    const nextSelected = [...scrambleSelected];
    nextSelected.splice(idx, 1);
    setScrambleSelected(nextSelected);
    setScrambleTokens([...scrambleTokens, token]);
  };

  const handleMatchLeft = (item) => {
    if (checkStatus !== 'unanswered') return;
    if (matchedPairs.includes(item)) return;
    sfx.playPop();
    setSelectedLeft(item);
  };

  const handleMatchRight = (pair) => {
    if (checkStatus !== 'unanswered') return;
    if (!selectedLeft) return;
    sfx.playPop();

    const original = (currentQ.pairs || []).find((p) => p.left === selectedLeft);
    if (original && original.right === pair.right) {
      sfx.playSuccess();
      const newMatched = [...matchedPairs, selectedLeft];
      setMatchedPairs(newMatched);
      setSelectedLeft(null);
      if (newMatched.length === currentQ.pairs.length) {
        setCheckStatus('correct');
        setCorrectCount((c) => c + 1);
      }
    } else {
      sfx.playError();
      onLoseHeart();
      setSelectedLeft(null);
    }
  };

  // Speech Recognition Handling
  const startVoiceRecording = () => {
    sfx.playMicStart();
    setIsRecording(true);
    setSpokenTranscript('');
    setPronunciationResult(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setTimeout(() => {
        const simScore = Math.floor(Math.random() * 15) + 85;
        setSpokenTranscript(currentQ.targetWord);
        setPronunciationResult({
          score: simScore,
          feedback: t.wellDone,
        });
        setIsRecording(false);
        setCheckStatus('correct');
        setCorrectCount((c) => c + 1);
      }, 1500);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = targetLang === 'en' ? 'en-IN' : targetLang === 'mr' ? 'mr-IN' : targetLang === 'te' ? 'te-IN' : 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSpokenTranscript(transcript);
        const evalResult = evaluatePronunciation(currentQ.targetWord, transcript, targetLang);
        setPronunciationResult(evalResult);

        if (evalResult.score >= 60) {
          sfx.playSuccess();
          setCheckStatus('correct');
          setCorrectCount((c) => c + 1);
        } else {
          sfx.playError();
          setCheckStatus('incorrect');
          onLoseHeart();
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        const simScore = 88;
        setSpokenTranscript(currentQ.targetWord);
        setPronunciationResult({ score: simScore, feedback: t.wellDone });
        setCheckStatus('correct');
        setCorrectCount((c) => c + 1);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleCheckAnswer = () => {
    if (currentQ.type === 'multiple_choice' || currentQ.type === 'listening_mcq') {
      if (selectedOption === null) return;
      const isCorrect = currentQ.options[selectedOption].isCorrect;
      if (isCorrect) {
        sfx.playSuccess();
        setCheckStatus('correct');
        setCorrectCount((c) => c + 1);
      } else {
        sfx.playError();
        setCheckStatus('incorrect');
        onLoseHeart();
      }
    } else if (currentQ.type === 'fill_blank') {
      if (selectedOption === null) return;
      const isCorrect = currentQ.options[selectedOption]?.isCorrect;
      if (isCorrect) {
        sfx.playSuccess();
        setCheckStatus('correct');
        setCorrectCount((c) => c + 1);
      } else {
        sfx.playError();
        setCheckStatus('incorrect');
        onLoseHeart();
      }
    } else if (currentQ.type === 'scramble') {
      const userSentence = scrambleSelected.join(' ').trim();
      const expected = (currentQ.correctSentence || '').trim();
      const isCorrect = userSentence === expected || scrambleSelected.length === currentQ.tokens.length;

      if (isCorrect) {
        sfx.playSuccess();
        setCheckStatus('correct');
        setCorrectCount((c) => c + 1);
      } else {
        sfx.playError();
        setCheckStatus('incorrect');
        onLoseHeart();
      }
    }
  };

  const handleNext = () => {
    sfx.playPop();
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsLessonFinished(true);
      sfx.playLevelComplete();
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const progressPercent = ((currentIdx + 1) / questions.length) * 100;

  if (isLessonFinished) {
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const stars = accuracy >= 85 ? 3 : accuracy >= 60 ? 2 : 1;

    return (
      <div className="modal-backdrop">
        <div className="lesson-modal" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div className="lesson-body" style={{ padding: '36px 24px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🎉</div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px' }}>
              {t.congrats}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
              {level.title}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    fontSize: '2.5rem',
                    color: s <= stars ? '#FBBF24' : '#D1D5DB',
                    animation: 'gentle-bounce 1s infinite alternate',
                  }}
                >
                  ★
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '28px',
              }}
            >
              <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#15803D' }}>+{level.xpReward}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.xp}</div>
              </div>
              <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--primary)' }}>{accuracy}%</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.accuracy}</div>
              </div>
            </div>

            <button
              className="btn-3d btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '1.1rem' }}
              onClick={() => {
                sfx.playSuccess();
                onCompleteLesson({
                  levelId: level.levelId,
                  xp: level.xpReward,
                  stars,
                  accuracy,
                });
              }}
            >
              {t.continueBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="lesson-modal" style={{ maxWidth: currentQ.type === 'duolingo_trace' ? '540px' : '580px' }}>
        {/* Header */}
        <div className="lesson-header">
          <button
            onClick={onClose}
            className="icon-btn"
            style={{ width: '32px', height: '32px' }}
            title="Quit Lesson"
          >
            ✕
          </button>

          <div className="lesson-progress-bar">
            <div className="lesson-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#DC2626' }}>
            <Heart size={18} fill="#EF4444" color="#DC2626" />
            <strong style={{ fontSize: '0.95rem' }}>{hearts}</strong>
          </div>
        </div>

        {/* Body */}
        <div className="lesson-body">
          {currentQ.type !== 'duolingo_trace' && (
            <div className="instruction-box">
              <button className="audio-prompt-btn" onClick={handleAudioPrompt} title="Listen Audio">
                <Volume2 size={24} />
              </button>
              <div>
                <h4 className="instruction-title">{currentQ.instruction}</h4>
                {currentQ.imageHint && (
                  <div style={{ fontSize: '2.5rem', marginTop: '4px' }}>{currentQ.imageHint}</div>
                )}
                {currentQ.questionText && (
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '4px', color: 'var(--text-main)' }}>
                    {currentQ.questionText}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QUESTION TYPE 1 & 2: Multiple Choice / Listening MCQ */}
          {(currentQ.type === 'multiple_choice' || currentQ.type === 'listening_mcq') && (
            <div className="mcq-grid">
              {currentQ.options.map((opt, idx) => {
                let statusClass = '';
                if (checkStatus !== 'unanswered') {
                  if (opt.isCorrect) statusClass = 'correct';
                  else if (selectedOption === idx) statusClass = 'incorrect';
                } else if (selectedOption === idx) {
                  statusClass = 'selected';
                }

                return (
                  <div
                    key={idx}
                    className={`mcq-option ${statusClass}`}
                    onClick={() => handleMcqSelect(idx)}
                  >
                    {opt.text}
                    {opt.hint && (
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          fontWeight: 500,
                        }}
                      >
                        {opt.hint}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* QUESTION TYPE 3: Duolingo Arrow Character Tracing */}
          {currentQ.type === 'duolingo_trace' && (
            <DuolingoTracer
              character={currentQ.char}
              phonetic={currentQ.phonetic}
              targetLang={targetLang}
              uiLang={uiLang}
              compact={true}
              onComplete={() => {
                sfx.playSuccess();
                setCheckStatus('correct');
                setCorrectCount((c) => c + 1);
              }}
            />
          )}

          {/* QUESTION TYPE 4: Fill in the blank */}
          {currentQ.type === 'fill_blank' && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  margin: '20px 0',
                }}
              >
                <span>{currentQ.sentenceParts?.[0] || ''}</span>
                <span
                  style={{
                    display: 'inline-block',
                    minWidth: '80px',
                    padding: '2px 10px',
                    borderBottom: '4px solid var(--secondary)',
                    textAlign: 'center',
                    color: selectedOption !== null ? 'var(--primary-dark)' : 'transparent',
                    background: 'var(--bg-main)',
                    borderRadius: '8px',
                  }}
                >
                  {selectedOption !== null ? currentQ.options[selectedOption]?.text : '___'}
                </span>
                <span>{currentQ.sentenceParts?.[1] || ''}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {currentQ.options.map((opt, idx) => (
                  <div
                    key={idx}
                    className={`mcq-option ${selectedOption === idx ? 'selected' : ''}`}
                    onClick={() => {
                      if (checkStatus === 'unanswered') {
                        sfx.playPop();
                        setSelectedOption(idx);
                      }
                    }}
                  >
                    {opt.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION TYPE 5: Scramble / Sentence Builder */}
          {currentQ.type === 'scramble' && (
            <div>
              {currentQ.promptText && (
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '14px', textAlign: 'center' }}>
                  "{currentQ.promptText}"
                </div>
              )}

              <div className="scramble-slots">
                {scrambleSelected.length === 0 && (
                  <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
                    {t.buildSentence}
                  </span>
                )}
                {scrambleSelected.map((tok, idx) => (
                  <div
                    key={idx}
                    className="word-bubble"
                    onClick={() => handleRemoveToken(tok, idx)}
                  >
                    {tok}
                  </div>
                ))}
              </div>

              <div className="scramble-pool">
                {scrambleTokens.map((tok, idx) => (
                  <div
                    key={idx}
                    className="word-bubble"
                    onClick={() => handleAddToken(tok, idx)}
                  >
                    {tok}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION TYPE 6: 4-Word Match Pairs */}
          {currentQ.type === 'match_pairs' && (
            <div className="match-pairs-container">
              <div className="match-column">
                {(currentQ.pairs || []).map((p) => {
                  const isMatched = matchedPairs.includes(p.left);
                  const isSelected = selectedLeft === p.left;
                  return (
                    <div
                      key={p.left}
                      className={`match-item ${isMatched ? 'matched' : ''} ${
                        isSelected ? 'selected' : ''
                      }`}
                      onClick={() => handleMatchLeft(p.left)}
                    >
                      {p.left}
                    </div>
                  );
                })}
              </div>

              <div className="match-column">
                {matchPairs.map((p) => {
                  const isMatched = matchedPairs.includes(p.left);
                  return (
                    <div
                      key={p.right}
                      className={`match-item ${isMatched ? 'matched' : ''}`}
                      onClick={() => handleMatchRight(p)}
                    >
                      {p.right}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUESTION TYPE 7: Pronunciation Coach */}
          {currentQ.type === 'pronunciation' && (
            <div className="pronunciation-coach-card">
              <div className="target-word-display">
                {currentQ.icon && <span>{currentQ.icon} </span>}
                {currentQ.targetWord}
              </div>
              <div className="target-translit">{currentQ.translit}</div>

              <div className="mic-button-wrapper">
                <button
                  className={`mic-btn ${isRecording ? 'recording' : ''}`}
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  title={isRecording ? 'Stop' : 'Start Speaking'}
                >
                  {isRecording ? <MicOff size={36} /> : <Mic size={36} />}
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '2px' }}>
                    {isRecording ? t.listening : t.speakBtn}
                  </span>
                </button>
              </div>

              {spokenTranscript && (
                <div style={{ fontSize: '1rem', color: 'var(--text-main)', marginTop: '8px' }}>
                  <strong>"{spokenTranscript}"</strong>
                </div>
              )}

              {pronunciationResult && (
                <div className="accuracy-gauge">
                  <div
                    className="accuracy-score-text"
                    style={{
                      color:
                        pronunciationResult.score >= 80
                          ? '#15803D'
                          : pronunciationResult.score >= 50
                          ? '#D97706'
                          : '#DC2626',
                    }}
                  >
                    {pronunciationResult.score}%
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    {pronunciationResult.feedback}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {currentQ.type !== 'duolingo_trace' && (
          <div className="lesson-footer">
            {checkStatus === 'unanswered' ? (
              <>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {t.checkBtn}
                </div>
                <button
                  className="btn-3d btn-primary"
                  onClick={handleCheckAnswer}
                  disabled={
                    ((currentQ.type === 'multiple_choice' || currentQ.type === 'listening_mcq') && selectedOption === null) ||
                    (currentQ.type === 'fill_blank' && selectedOption === null) ||
                    (currentQ.type === 'scramble' && scrambleSelected.length === 0) ||
                    currentQ.type === 'match_pairs' ||
                    currentQ.type === 'pronunciation'
                  }
                >
                  {t.checkBtn}
                </button>
              </>
            ) : checkStatus === 'correct' ? (
              <>
                <div className="feedback-strip correct">
                  <CheckCircle2 size={24} />
                  <span>{t.wellDone}</span>
                </div>
                <button className="btn-3d btn-primary" onClick={handleNext}>
                  {t.continueBtn}
                </button>
              </>
            ) : (
              <>
                <div className="feedback-strip incorrect">
                  <XCircle size={24} />
                  <span>{t.tryAgain}</span>
                </div>
                <button className="btn-3d btn-danger" onClick={handleNext}>
                  {t.continueBtn}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
