import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Play, RotateCcw, Trophy, Zap, Heart, ArrowLeft, ArrowRight, Check, X, Sparkles } from 'lucide-react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { getCurriculumForLanguage } from '../data/curriculumData';
import { audioEngine } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';
import { UI_TRANSLATIONS } from '../data/uiTranslations';

// Helper: Fisher-Yates shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Extract rich multi-level vocabulary dynamically for the target language
function getDynamicVocabulary(targetLang) {
  const langData = ALPHABET_DATA[targetLang] || ALPHABET_DATA.hi;
  const wordMap = new Map();

  // 1. Add everyday words from alphabetData
  (langData.everydayWords || []).forEach((w) => {
    if (w && w.word) {
      wordMap.set(w.word, {
        word: w.word,
        translit: w.translit || w.meaning || '',
        meaning: w.meaning || w.translit || '',
        icon: w.icon || '⭐',
      });
    }
  });

  // 2. Extract words from all 10 curriculum levels
  try {
    const levels = getCurriculumForLanguage(targetLang, 'en');
    levels.forEach((lvl) => {
      (lvl.questions || []).forEach((q) => {
        if (q.targetWord && q.targetWord.length >= 2) {
          if (!wordMap.has(q.targetWord)) {
            wordMap.set(q.targetWord, {
              word: q.targetWord,
              translit: q.translit || '',
              meaning: q.hint || q.translit || '',
              icon: q.icon || '⭐',
            });
          }
        }
        if (q.word && q.word.length >= 2) {
          if (!wordMap.has(q.word)) {
            wordMap.set(q.word, {
              word: q.word,
              translit: q.translit || '',
              meaning: q.meaning || '',
              icon: q.icon || '⭐',
            });
          }
        }
      });
    });
  } catch (e) {
    console.warn('Failed to extract curriculum words for games:', e);
  }

  const result = Array.from(wordMap.values());
  return result.length > 0
    ? result
    : [{ word: 'पाणी', translit: 'Pani', meaning: 'Water', icon: '💧' }, { word: 'बस', translit: 'Bus', meaning: 'Bus', icon: '🚌' }];
}

// Extract all characters (vowels + consonants + numbers)
function getDynamicLetterPool(targetLang) {
  const langData = ALPHABET_DATA[targetLang] || ALPHABET_DATA.hi;
  return [
    ...(langData.vowels || []),
    ...(langData.consonants || []),
    ...(langData.numbers || []),
  ];
}

export function MiniGames({ targetLang = 'mr', uiLang = 'en', onRewardXp }) {
  // 5 Games: 'balloon' | 'memory' | 'catch' | 'train' | 'strike'
  const [activeGame, setActiveGame] = useState('balloon');

  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;

  // Dynamic pools based on target language
  const [dynamicWords, setDynamicWords] = useState(() => getDynamicVocabulary(targetLang));
  const [dynamicLetters, setDynamicLetters] = useState(() => getDynamicLetterPool(targetLang));

  useEffect(() => {
    const w = getDynamicVocabulary(targetLang);
    const l = getDynamicLetterPool(targetLang);
    setDynamicWords(w);
    setDynamicLetters(l);
  }, [targetLang]);

  // Dynamic Queues for zero-repetition within sessions
  const balloonQueueRef = useRef([]);
  const catchQueueRef = useRef([]);
  const trainQueueRef = useRef([]);
  const strikeQueueRef = useRef([]);

  // ----------------------------------------------------
  // GAME 1: BALLOON POP (Dynamic Shuffled Phonics)
  // ----------------------------------------------------
  const [isPlayingBalloon, setIsPlayingBalloon] = useState(false);
  const [balloonTarget, setBalloonTarget] = useState(null);
  const [balloons, setBalloons] = useState([]);
  const [balloonScore, setBalloonScore] = useState(0);
  const [balloonTime, setBalloonTime] = useState(30);

  const startBalloonGame = () => {
    sfx.playPop();
    setBalloonScore(0);
    setBalloonTime(30);
    setIsPlayingBalloon(true);
    balloonQueueRef.current = shuffleArray(dynamicLetters);
    spawnBalloonRound();
  };

  const spawnBalloonRound = () => {
    if (!balloonQueueRef.current || balloonQueueRef.current.length === 0) {
      balloonQueueRef.current = shuffleArray(dynamicLetters);
    }
    const chosen = balloonQueueRef.current.pop() || dynamicLetters[0];
    setBalloonTarget(chosen);
    audioEngine.speak(chosen.char, targetLang);

    // Pick 3 random distractor letters distinct from target
    const poolWithoutChosen = dynamicLetters.filter((l) => l.char !== chosen.char);
    const shuffledPool = shuffleArray(poolWithoutChosen);
    const options = [chosen, ...shuffledPool.slice(0, 3)];

    const shuffled = shuffleArray(options);
    const colors = ['#FF5376', '#5B42F3', '#00C4CC', '#FF9F1C', '#8B5CF6'];

    const newBalloons = shuffled.map((item, idx) => ({
      id: Math.random(),
      item,
      color: colors[idx % colors.length],
      left: 12 + idx * 23,
      speed: 10 + Math.random() * 4,
      isCorrect: item.char === chosen.char,
    }));

    setBalloons(newBalloons);
  };

  useEffect(() => {
    if (!isPlayingBalloon) return;
    if (balloonTime <= 0) {
      setIsPlayingBalloon(false);
      sfx.playLevelComplete();
      if (balloonScore > 0 && onRewardXp) {
        onRewardXp(balloonScore * 2);
      }
      return;
    }

    const timer = setInterval(() => {
      setBalloonTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlayingBalloon, balloonTime, balloonScore, onRewardXp]);

  const handleBalloonClick = (balloon) => {
    if (balloon.isCorrect) {
      sfx.playPop();
      sfx.playSuccess();
      setBalloonScore((s) => s + 10);
      try {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
      } catch (e) {}
      spawnBalloonRound();
    } else {
      sfx.playError();
      setBalloonScore((s) => Math.max(0, s - 5));
    }
  };

  // ----------------------------------------------------
  // GAME 2: MEMORY FLIP (Dynamic 4-Item Sets)
  // ----------------------------------------------------
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [memoryScore, setMemoryScore] = useState(0);

  const startMemoryGame = () => {
    sfx.playPop();
    setMatchedIds([]);
    setFlippedIndices([]);
    setMemoryScore(0);

    // Dynamic pool: pick 4 random distinct items from combined letters and vocabulary
    const combined = [
      ...shuffleArray(dynamicLetters).slice(0, 10),
      ...shuffleArray(dynamicWords).slice(0, 10).map((w) => ({ char: w.word, translit: w.translit, icon: w.icon }))
    ];
    const shuffledCombined = shuffleArray(combined);
    const sample = shuffledCombined.slice(0, 4);

    const cards = [];
    sample.forEach((item, idx) => {
      cards.push({ id: `char_${idx}_${Math.random()}`, pairId: idx, text: item.char, translit: item.translit, type: 'char' });
      cards.push({ id: `ex_${idx}_${Math.random()}`, pairId: idx, text: item.icon || item.char, translit: item.example || item.meaning || item.translit, type: 'icon' });
    });

    setMemoryCards(shuffleArray(cards));
  };

  useEffect(() => {
    startMemoryGame();
  }, [targetLang]);

  const handleCardClick = (idx) => {
    if (flippedIndices.length === 2) return;
    if (flippedIndices.includes(idx)) return;
    if (matchedIds.includes(memoryCards[idx].pairId)) return;

    sfx.playPop();
    const nextFlipped = [...flippedIndices, idx];
    setFlippedIndices(nextFlipped);

    audioEngine.speak(memoryCards[idx].text, targetLang);

    if (nextFlipped.length === 2) {
      const first = memoryCards[nextFlipped[0]];
      const second = memoryCards[nextFlipped[1]];

      if (first.pairId === second.pairId) {
        sfx.playSuccess();
        setMatchedIds((m) => [...m, first.pairId]);
        setMemoryScore((s) => s + 20);
        setFlippedIndices([]);
        if (matchedIds.length + 1 === 4) {
          sfx.playLevelComplete();
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch (e) {}
          if (onRewardXp) onRewardXp(50);
        }
      } else {
        sfx.playError();
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // ----------------------------------------------------
  // GAME 3: AKSHAR CATCH (Falling Letter Basket)
  // ----------------------------------------------------
  const [isPlayingCatch, setIsPlayingCatch] = useState(false);
  const [basketLane, setBasketLane] = useState(1); // 0, 1, 2, 3
  const [fallingLetters, setFallingLetters] = useState([]);
  const [catchTarget, setCatchTarget] = useState(null);
  const [catchScore, setCatchScore] = useState(0);
  const [catchLives, setCatchLives] = useState(3);
  const catchLoopRef = useRef(null);

  const startCatchGame = () => {
    sfx.playPop();
    setCatchScore(0);
    setCatchLives(3);
    setBasketLane(1);
    setFallingLetters([]);
    setIsPlayingCatch(true);
    catchQueueRef.current = shuffleArray(dynamicLetters);
    spawnCatchRound();
  };

  const spawnCatchRound = () => {
    if (!catchQueueRef.current || catchQueueRef.current.length === 0) {
      catchQueueRef.current = shuffleArray(dynamicLetters);
    }
    const target = catchQueueRef.current.pop() || dynamicLetters[0];
    setCatchTarget(target);
    audioEngine.speak(target.char, targetLang);

    // Pick 3 distractor letters
    const distractors = shuffleArray(dynamicLetters.filter((l) => l.char !== target.char)).slice(0, 3);
    const roundItems = shuffleArray([target, ...distractors]);

    const initialDrops = roundItems.map((item, idx) => ({
      id: Math.random(),
      item,
      lane: idx, // lanes 0, 1, 2, 3
      top: 0,
      speed: 1.5 + Math.random() * 1.0,
      isCorrect: item.char === target.char,
    }));

    setFallingLetters(initialDrops);
  };

  // Game loop for falling letters
  useEffect(() => {
    if (!isPlayingCatch) return;

    catchLoopRef.current = setInterval(() => {
      setFallingLetters((prevDrops) => {
        let hitTarget = false;
        let missedTarget = false;
        let hitWrong = false;

        const updated = prevDrops.map((d) => ({
          ...d,
          top: d.top + d.speed,
        }));

        // Check catches at bottom (top >= 75%)
        updated.forEach((drop) => {
          if (drop.top >= 75 && drop.top <= 85) {
            if (drop.lane === basketLane) {
              if (drop.isCorrect) hitTarget = true;
              else hitWrong = true;
            }
          }
        });

        // Filter out drops that went past bottom (> 88%)
        const remaining = updated.filter((d) => {
          if (d.top > 88) {
            if (d.isCorrect) missedTarget = true;
            return false;
          }
          return true;
        });

        if (hitTarget) {
          sfx.playSuccess();
          setCatchScore((s) => s + 20);
          try {
            confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
          } catch (e) {}
          setTimeout(() => spawnCatchRound(), 200);
          return [];
        }

        if (hitWrong || missedTarget) {
          sfx.playError();
          setCatchLives((lives) => {
            const next = lives - 1;
            if (next <= 0) {
              setIsPlayingCatch(false);
              sfx.playLevelComplete();
              if (onRewardXp) onRewardXp(catchScore);
            }
            return Math.max(0, next);
          });
          setTimeout(() => spawnCatchRound(), 300);
          return [];
        }

        return remaining;
      });
    }, 50);

    return () => clearInterval(catchLoopRef.current);
  }, [isPlayingCatch, basketLane, catchScore, onRewardXp]);

  // Keyboard navigation for basket
  useEffect(() => {
    if (!isPlayingCatch) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setBasketLane((l) => Math.max(0, l - 1));
      } else if (e.key === 'ArrowRight') {
        setBasketLane((l) => Math.min(3, l + 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayingCatch]);

  // ----------------------------------------------------
  // GAME 4: SHABAD EXPRESS (Train Word Builder)
  // ----------------------------------------------------
  const [trainTargetWord, setTrainTargetWord] = useState(null);
  const [trainAvailableLetters, setTrainAvailableLetters] = useState([]);
  const [trainAttachedLetters, setTrainAttachedLetters] = useState([]);
  const [trainScore, setTrainScore] = useState(0);
  const [trainStreak, setTrainStreak] = useState(0);
  const [trainSuccessAnim, setTrainSuccessAnim] = useState(false);

  const startTrainGame = () => {
    sfx.playPop();
    setTrainScore(0);
    setTrainStreak(0);
    trainQueueRef.current = shuffleArray(dynamicWords);
    spawnTrainRound();
  };

  const spawnTrainRound = () => {
    setTrainSuccessAnim(false);
    setTrainAttachedLetters([]);

    if (!trainQueueRef.current || trainQueueRef.current.length === 0) {
      trainQueueRef.current = shuffleArray(dynamicWords);
    }
    const chosenWordObj = trainQueueRef.current.pop() || dynamicWords[0];
    setTrainTargetWord(chosenWordObj);

    // Break word into individual characters
    const chars = chosenWordObj.word.split('').filter((c) => c.trim().length > 0);

    // Add 1 or 2 distractor characters
    const distractors = shuffleArray(dynamicLetters.filter((l) => !chars.includes(l.char)))
      .slice(0, 2)
      .map((l) => l.char);

    const allOptions = shuffleArray([...chars, ...distractors]).map((char, idx) => ({
      id: `char_${idx}_${Math.random()}`,
      char,
    }));

    setTrainAvailableLetters(allOptions);
    audioEngine.speak(chosenWordObj.word, targetLang);
  };

  useEffect(() => {
    if (activeGame === 'train') {
      startTrainGame();
    }
  }, [activeGame, targetLang]);

  const attachLetterToTrain = (letterObj) => {
    sfx.playPop();
    setTrainAvailableLetters((prev) => prev.filter((item) => item.id !== letterObj.id));
    const nextAttached = [...trainAttachedLetters, letterObj];
    setTrainAttachedLetters(nextAttached);
    audioEngine.speak(letterObj.char, targetLang);

    // Auto-verify when all characters are attached
    const targetClean = trainTargetWord.word.split('').filter((c) => c.trim().length > 0).join('');
    const currentWord = nextAttached.map((o) => o.char).join('');

    if (currentWord === targetClean) {
      sfx.playSuccess();
      setTrainSuccessAnim(true);
      setTrainScore((s) => s + 30);
      setTrainStreak((st) => st + 1);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      if (onRewardXp) onRewardXp(30);
      setTimeout(() => spawnTrainRound(), 1800);
    } else if (currentWord.length >= targetClean.length) {
      sfx.playError();
    }
  };

  const clearTrain = () => {
    sfx.playPop();
    // Return all attached letters back to available pool
    setTrainAvailableLetters((prev) => shuffleArray([...prev, ...trainAttachedLetters]));
    setTrainAttachedLetters([]);
  };

  // ----------------------------------------------------
  // GAME 5: SPEED WORD STRIKE (Rapid Match)
  // ----------------------------------------------------
  const [isPlayingStrike, setIsPlayingStrike] = useState(false);
  const [strikeScore, setStrikeScore] = useState(0);
  const [strikeStreak, setStrikeStreak] = useState(0);
  const [strikeTime, setStrikeTime] = useState(30);
  const [strikeCard, setStrikeCard] = useState(null);

  const startStrikeGame = () => {
    sfx.playPop();
    setStrikeScore(0);
    setStrikeStreak(0);
    setStrikeTime(30);
    setIsPlayingStrike(true);
    strikeQueueRef.current = shuffleArray(dynamicWords);
    spawnStrikeCard();
  };

  const spawnStrikeCard = () => {
    if (!strikeQueueRef.current || strikeQueueRef.current.length === 0) {
      strikeQueueRef.current = shuffleArray(dynamicWords);
    }
    const wordObj = strikeQueueRef.current.pop() || dynamicWords[0];
    const isMatching = Math.random() > 0.5;

    let displayIcon = wordObj.icon || '⭐';
    if (!isMatching && dynamicWords.length > 1) {
      const otherWords = dynamicWords.filter((w) => w.word !== wordObj.word);
      const randOther = otherWords[Math.floor(Math.random() * otherWords.length)];
      displayIcon = randOther.icon || '📦';
    }

    setStrikeCard({
      word: wordObj.word,
      translit: wordObj.translit || wordObj.meaning,
      icon: displayIcon,
      isMatching,
    });

    audioEngine.speak(wordObj.word, targetLang);
  };

  useEffect(() => {
    if (!isPlayingStrike) return;
    if (strikeTime <= 0) {
      setIsPlayingStrike(false);
      sfx.playLevelComplete();
      if (strikeScore > 0 && onRewardXp) {
        onRewardXp(strikeScore);
      }
      return;
    }

    const timer = setInterval(() => {
      setStrikeTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlayingStrike, strikeTime, strikeScore, onRewardXp]);

  const handleStrikeAnswer = (userAnswerIsMatch) => {
    if (!strikeCard) return;

    if (userAnswerIsMatch === strikeCard.isMatching) {
      sfx.playSuccess();
      const bonus = 10 + Math.min(30, strikeStreak * 5);
      setStrikeScore((s) => s + bonus);
      setStrikeStreak((st) => st + 1);
      try {
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 } });
      } catch (e) {}
    } else {
      sfx.playError();
      setStrikeStreak(0);
    }
    spawnStrikeCard();
  };

  return (
    <div className="games-container" style={{ padding: '24px', maxWidth: '980px', margin: '0 auto' }}>
      {/* Game Center Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '100px', background: 'rgba(91, 66, 243, 0.1)', color: '#5B42F3', fontWeight: 800, fontSize: '0.8rem', marginBottom: '8px' }}>
            <Sparkles size={14} /> {t.gamesTitle}
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, letterSpacing: '-0.02em', margin: 0, color: 'var(--text-main)' }}>
            🎮 {t.gamesTitle}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '4px 0 0' }}>
            {t.gamesSubtitle}
          </p>
        </div>

        {/* 5 Game Navigation Tabs */}
        <div className="nav-tabs" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`tab-btn ${activeGame === 'balloon' ? 'active' : ''}`}
            onClick={() => { sfx.playPop(); setActiveGame('balloon'); }}
            style={{ padding: '8px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem' }}
          >
            🎈 {t.balloonTab}
          </button>
          <button
            className={`tab-btn ${activeGame === 'memory' ? 'active' : ''}`}
            onClick={() => { sfx.playPop(); setActiveGame('memory'); }}
            style={{ padding: '8px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem' }}
          >
            🃏 {t.memoryTab}
          </button>
          <button
            className={`tab-btn ${activeGame === 'catch' ? 'active' : ''}`}
            onClick={() => { sfx.playPop(); setActiveGame('catch'); }}
            style={{ padding: '8px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem' }}
          >
            🧺 {t.catchTab}
          </button>
          <button
            className={`tab-btn ${activeGame === 'train' ? 'active' : ''}`}
            onClick={() => { sfx.playPop(); setActiveGame('train'); }}
            style={{ padding: '8px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem' }}
          >
            🚂 {t.trainTab}
          </button>
          <button
            className={`tab-btn ${activeGame === 'strike' ? 'active' : ''}`}
            onClick={() => { sfx.playPop(); setActiveGame('strike'); }}
            style={{ padding: '8px 16px', borderRadius: '12px', fontWeight: 700, fontSize: '0.9rem' }}
          >
            ⚡ {t.strikeTab}
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* GAME 1: BALLOON POP */}
      {/* ==================================================== */}
      {activeGame === 'balloon' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
          {!isPlayingBalloon ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(91, 66, 243, 0.08), rgba(255, 83, 118, 0.08))',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '2px dashed var(--brand-primary)',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🎈</div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#5B42F3', marginBottom: '8px' }}>
                {t.balloonHeading}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 24px' }}>
                {t.balloonPrompt}
              </p>
              <button
                className="btn-3d btn-primary"
                style={{ padding: '14px 36px', fontSize: '1.1rem' }}
                onClick={startBalloonGame}
              >
                <Play size={20} fill="#fff" />
                {t.startGameBtn}
              </button>
            </div>
          ) : (
            <div>
              {/* Score & Prompt Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-card-subtle)',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  marginBottom: '16px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    className="audio-prompt-btn"
                    style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#5B42F3', color: '#fff' }}
                    onClick={() => {
                      if (balloonTarget) audioEngine.speak(balloonTarget.char, targetLang);
                    }}
                    title="Play Sound"
                  >
                    <Volume2 size={22} />
                  </button>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {t.findThisSound}
                    </span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-indic)' }}>
                      "{balloonTarget?.char}" ({balloonTarget?.translit})
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '24px', fontWeight: 900 }}>
                  <div style={{ color: '#5B42F3', fontSize: '1.1rem' }}>{t.scoreLabel} {balloonScore}</div>
                  <div style={{ color: balloonTime < 10 ? '#FF5376' : 'var(--text-main)', fontSize: '1.1rem' }}>
                    ⏳ {balloonTime}s
                  </div>
                </div>
              </div>

              {/* Game Canvas */}
              <div className="game-canvas" style={{ height: '360px', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
                {balloons.map((b) => (
                  <div
                    key={b.id}
                    className="balloon"
                    onClick={() => handleBalloonClick(b)}
                    style={{
                      left: `${b.left}%`,
                      backgroundColor: b.color,
                      animationDuration: `${b.speed}s`,
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-indic)' }}>{b.item.char}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* GAME 2: MEMORY FLIP */}
      {/* ==================================================== */}
      {activeGame === 'memory' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                {t.memoryMatchHeading}
              </span>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {t.scoreLabel} <strong>{memoryScore} XP</strong>
              </div>
            </div>
            <button className="btn-3d btn-outline" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={startMemoryGame}>
              <RotateCcw size={16} /> {t.resetBtn}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {memoryCards.map((card, idx) => {
              const isFlipped = flippedIndices.includes(idx) || matchedIds.includes(card.pairId);

              return (
                <div
                  key={card.id}
                  onClick={() => handleCardClick(idx)}
                  className="sound-card"
                  style={{
                    height: '120px',
                    borderRadius: '16px',
                    background: isFlipped ? 'var(--bg-card)' : 'linear-gradient(135deg, #5B42F3, #FF5376)',
                    color: isFlipped ? 'var(--text-main)' : '#fff',
                    borderColor: matchedIds.includes(card.pairId) ? '#00C4CC' : undefined,
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  {isFlipped ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <span style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: 'var(--font-indic)' }}>
                        {card.text}
                      </span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                        {card.translit}
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '2.2rem', fontWeight: 900 }}>
                      ✨
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {matchedIds.length === 4 && (
            <div
              style={{
                marginTop: '20px',
                padding: '20px',
                background: 'linear-gradient(135deg, rgba(88, 204, 2, 0.12), rgba(28, 176, 246, 0.12))',
                borderRadius: '16px',
                border: '2px solid #58CC02',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                animation: 'pop-in 0.3s ease-out',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '2.5rem' }}>🎉</div>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#15803D' }}>
                    {uiLang === 'en' ? 'All Pairs Matched! +50 XP' : uiLang === 'mr' ? 'सर्व जोड्या जुळल्या! +५० XP' : 'सभी जोड़ियाँ मिलीं! +50 XP'}
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {uiLang === 'en' ? 'Ready for new words & letters?' : uiLang === 'mr' ? 'नवीन शब्द आणि अक्षरांसाठी तयार आहात?' : 'नए शब्द और अक्षरों के लिए तैयार हैं?'}
                  </p>
                </div>
              </div>

              <button
                className="btn-3d btn-primary"
                onClick={startMemoryGame}
                style={{
                  padding: '12px 24px',
                  fontSize: '0.95rem',
                  fontWeight: 900,
                  borderRadius: '12px',
                  background: '#58CC02',
                  boxShadow: '0 4px 0 #46A302',
                }}
              >
                🔄 {uiLang === 'en' ? 'Play Next Set (New Words!)' : uiLang === 'mr' ? 'पुढील संच खेळा (नवीन शब्द!)' : 'अगला सेट खेलें (नए शब्द!)'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* GAME 3: AKSHAR CATCH (Falling Letter Basket) */}
      {/* ==================================================== */}
      {activeGame === 'catch' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
          {!isPlayingCatch ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(0, 196, 204, 0.08), rgba(91, 66, 243, 0.08))',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '2px dashed #00C4CC',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '12px' }}>🧺</div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#00C4CC', marginBottom: '8px' }}>
                {t.catchHeading}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 24px' }}>
                {t.catchPrompt}
              </p>
              <button
                className="btn-3d btn-primary"
                style={{ padding: '14px 36px', fontSize: '1.1rem', background: '#00C4CC' }}
                onClick={startCatchGame}
              >
                <Play size={20} fill="#fff" />
                {t.startGameBtn}
              </button>
            </div>
          ) : (
            <div>
              {/* Header Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-card-subtle)',
                  padding: '12px 20px',
                  borderRadius: '16px',
                  marginBottom: '16px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    className="audio-prompt-btn"
                    style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#00C4CC', color: '#fff' }}
                    onClick={() => {
                      if (catchTarget) audioEngine.speak(catchTarget.char, targetLang);
                    }}
                  >
                    <Volume2 size={20} />
                  </button>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                      {t.findThisSound}
                    </span>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-indic)', color: 'var(--text-main)' }}>
                      "{catchTarget?.char}" ({catchTarget?.translit})
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontWeight: 800 }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[...Array(3)].map((_, idx) => (
                      <Heart
                        key={idx}
                        size={20}
                        color={idx < catchLives ? '#FF5376' : 'var(--border-subtle)'}
                        fill={idx < catchLives ? '#FF5376' : 'transparent'}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: '1.1rem', color: '#5B42F3' }}>
                    {t.scoreLabel} {catchScore}
                  </div>
                </div>
              </div>

              {/* Falling Arena */}
              <div
                style={{
                  position: 'relative',
                  height: '380px',
                  background: 'radial-gradient(ellipse at top, rgba(91, 66, 243, 0.06), rgba(0, 196, 204, 0.03))',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {/* 4 Lanes */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', height: '100%', position: 'absolute', width: '100%', top: 0, left: 0 }}>
                  {[0, 1, 2, 3].map((laneIdx) => (
                    <div
                      key={laneIdx}
                      onClick={() => setBasketLane(laneIdx)}
                      style={{
                        borderRight: laneIdx < 3 ? '1px dashed rgba(255,255,255,0.08)' : 'none',
                        height: '100%',
                        cursor: 'pointer',
                      }}
                    />
                  ))}
                </div>

                {/* Falling Letters */}
                {fallingLetters.map((drop) => (
                  <div
                    key={drop.id}
                    style={{
                      position: 'absolute',
                      left: `${drop.lane * 25 + 6.5}%`,
                      top: `${drop.top}%`,
                      width: '54px',
                      height: '54px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #5B42F3, #8B5CF6)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      boxShadow: '0 6px 14px rgba(91, 66, 243, 0.35)',
                      fontFamily: 'var(--font-indic)',
                      transition: 'top 0.05s linear',
                    }}
                  >
                    {drop.item.char}
                  </div>
                ))}

                {/* Basket Player */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: `${basketLane * 25 + 5}%`,
                    width: '64px',
                    height: '46px',
                    background: 'linear-gradient(135deg, #FF9F1C, #FF5376)',
                    borderRadius: '12px 12px 18px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    boxShadow: '0 8px 20px rgba(255, 159, 28, 0.4)',
                    transition: 'left 0.15s ease-out',
                  }}
                >
                  🧺
                </div>
              </div>

              {/* Basket Touch Controls */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
                <button
                  className="btn-3d btn-outline"
                  style={{ padding: '10px 24px', borderRadius: '12px', fontWeight: 800 }}
                  onClick={() => setBasketLane((l) => Math.max(0, l - 1))}
                >
                  <ArrowLeft size={20} /> Left
                </button>
                <button
                  className="btn-3d btn-outline"
                  style={{ padding: '10px 24px', borderRadius: '12px', fontWeight: 800 }}
                  onClick={() => setBasketLane((l) => Math.min(3, l + 1))}
                >
                  Right <ArrowRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* GAME 4: SHABAD EXPRESS (Train Word Builder) */}
      {/* ==================================================== */}
      {activeGame === 'train' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
          {/* Target Word Clue Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'var(--bg-card-subtle)',
              padding: '16px 20px',
              borderRadius: '16px',
              marginBottom: '24px',
              border: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ fontSize: '2.5rem' }}>{trainTargetWord?.icon || '🚂'}</div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                  {t.trainTargetWord}
                </span>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--brand-primary)', fontFamily: 'var(--font-indic)' }}>
                  {trainTargetWord?.word} ({trainTargetWord?.translit || trainTargetWord?.meaning})
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <button
                className="audio-prompt-btn"
                style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#5B42F3', color: '#fff' }}
                onClick={() => {
                  if (trainTargetWord) audioEngine.speak(trainTargetWord.word, targetLang);
                }}
              >
                <Volume2 size={20} />
              </button>
              <div style={{ fontWeight: 900, color: '#FF9F1C', fontSize: '1.1rem' }}>
                ⭐ {t.scoreLabel} {trainScore}
              </div>
            </div>
          </div>

          {/* The Train Railway Track & Assembly */}
          <div
            style={{
              padding: '24px 16px',
              background: 'linear-gradient(180deg, rgba(91, 66, 243, 0.04) 0%, rgba(255, 159, 28, 0.06) 100%)',
              borderRadius: '18px',
              border: '2px dashed var(--border-subtle)',
              marginBottom: '24px',
              minHeight: '140px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflowX: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transform: trainSuccessAnim ? 'translateX(20px) scale(1.03)' : 'none',
                transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              {/* Engine */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #5B42F3, #3B82F6)',
                  color: '#fff',
                  padding: '14px 20px',
                  borderRadius: '16px 6px 6px 16px',
                  boxShadow: '0 6px 16px rgba(91, 66, 243, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                }}
              >
                <span>🚂</span>
                <span style={{ fontSize: '0.85rem', letterSpacing: '0.05em' }}>EXPRESS</span>
              </div>

              {/* Attached Letter Coaches */}
              {trainAttachedLetters.map((coach, idx) => (
                <div
                  key={coach.id}
                  style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, #FF9F1C, #FF5376)',
                    color: '#fff',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    boxShadow: '0 6px 14px rgba(255, 83, 118, 0.3)',
                    fontFamily: 'var(--font-indic)',
                    animation: 'scalePop 0.25s ease',
                  }}
                >
                  {coach.char}
                </div>
              ))}

              {/* Empty placeholder coach */}
              {trainAttachedLetters.length === 0 && (
                <div
                  style={{
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: '2px dashed var(--text-muted)',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  {t.trainPrompt}
                </div>
              )}
            </div>
          </div>

          {/* Letter Bank to Pick From */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Tap letters to attach to train:
            </span>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '12px' }}>
              {trainAvailableLetters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => attachLetterToTrain(item)}
                  className="sound-card"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '14px',
                    fontSize: '1.8rem',
                    fontWeight: 900,
                    fontFamily: 'var(--font-indic)',
                    background: 'var(--bg-card-subtle)',
                    border: '2px solid var(--brand-primary)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {item.char}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
            <button
              className="btn-3d btn-outline"
              style={{ padding: '10px 20px', borderRadius: '12px', fontWeight: 800 }}
              onClick={clearTrain}
            >
              <RotateCcw size={16} /> {t.trainClear}
            </button>
            <button
              className="btn-3d btn-secondary"
              style={{ padding: '10px 24px', borderRadius: '12px', fontWeight: 800 }}
              onClick={spawnTrainRound}
            >
              Next Word ⏭️
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* GAME 5: SPEED WORD STRIKE (Rapid Match) */}
      {/* ==================================================== */}
      {activeGame === 'strike' && (
        <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-md)' }}>
          {!isPlayingStrike ? (
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(255, 83, 118, 0.08), rgba(255, 159, 28, 0.08))',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '2px dashed #FF5376',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '12px' }}>⚡</div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FF5376', marginBottom: '8px' }}>
                {t.strikeHeading}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '460px', margin: '0 auto 24px' }}>
                {t.strikePrompt}
              </p>
              <button
                className="btn-3d btn-primary"
                style={{ padding: '14px 36px', fontSize: '1.1rem', background: '#FF5376' }}
                onClick={startStrikeGame}
              >
                <Play size={20} fill="#fff" />
                {t.startGameBtn}
              </button>
            </div>
          ) : (
            <div>
              {/* Score Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-card-subtle)',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  marginBottom: '20px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Zap size={22} color="#FF9F1C" fill="#FF9F1C" />
                  <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#FF9F1C' }}>
                    Streak: {strikeStreak}x
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '20px', fontWeight: 900 }}>
                  <div style={{ color: '#5B42F3', fontSize: '1.1rem' }}>{t.scoreLabel} {strikeScore}</div>
                  <div style={{ color: strikeTime < 10 ? '#FF5376' : 'var(--text-main)', fontSize: '1.1rem' }}>
                    ⏳ {strikeTime}s
                  </div>
                </div>
              </div>

              {/* Flash Card Question */}
              {strikeCard && (
                <div
                  style={{
                    background: 'var(--bg-card)',
                    border: '2px solid var(--border-subtle)',
                    borderRadius: '20px',
                    padding: '36px 20px',
                    textAlign: 'center',
                    marginBottom: '24px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ fontSize: '5rem', marginBottom: '16px' }}>{strikeCard.icon}</div>
                  <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-main)', fontFamily: 'var(--font-indic)', marginBottom: '4px' }}>
                    {strikeCard.word}
                  </div>
                  <div style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {strikeCard.translit}
                  </div>
                </div>
              )}

              {/* Rapid Action Buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <button
                  className="btn-3d"
                  style={{
                    background: '#00C4CC',
                    color: '#fff',
                    padding: '16px 20px',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                  onClick={() => handleStrikeAnswer(true)}
                >
                  <Check size={24} />
                  {t.matchYes}
                </button>

                <button
                  className="btn-3d"
                  style={{
                    background: '#FF5376',
                    color: '#fff',
                    padding: '16px 20px',
                    fontSize: '1.1rem',
                    fontWeight: 900,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                  onClick={() => handleStrikeAnswer(false)}
                >
                  <X size={24} />
                  {t.matchNo}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
