import { getCurriculumForLanguage } from '../src/data/curriculumData.js';

const langs = ['mr', 'hi', 'te', 'ta', 'bn', 'en'];

for (const lang of langs) {
  const curr = getCurriculumForLanguage(lang, 'en');
  console.log(`\n=== Checking Language: ${lang} ===`);
  const levelWords = new Map(); // level -> Set of words

  curr.forEach((lvl) => {
    const wordsInLevel = new Set();
    lvl.questions.forEach((q) => {
      if (q.targetWord) wordsInLevel.add(q.targetWord);
      if (q.letter) wordsInLevel.add(q.letter);
      if (q.audioPrompt) wordsInLevel.add(q.audioPrompt);
      if (q.word) wordsInLevel.add(q.word);
    });
    levelWords.set(lvl.levelId, wordsInLevel);
  });

  // Check overlap between different levels
  let overlapFound = false;
  for (let i = 1; i <= 10; i++) {
    for (let j = i + 1; j <= 10; j++) {
      const setA = levelWords.get(i);
      const setB = levelWords.get(j);
      const overlap = [...setA].filter(x => setB.has(x) && x.length > 0);
      if (overlap.length > 0) {
        console.warn(`⚠️ Warning: Overlap between Level ${i} and Level ${j}:`, overlap);
        overlapFound = true;
      }
    }
  }
  if (!overlapFound) {
    console.log(`✅ Zero cross-level word overlap in ${lang}! All levels have completely distinct words and concepts.`);
  }
}
