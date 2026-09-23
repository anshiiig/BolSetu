import { getCurriculumForUser } from '../src/data/curriculumData.js';

const langs = ['hi', 'en', 'mr', 'ta', 'te', 'bn'];
let totalPassed = 0;

for (const targetLang of langs) {
  for (const uiLang of langs) {
    const curr = getCurriculumForUser(targetLang, 'adult', uiLang);
    if (curr.length !== 10) {
      console.error(`Expected 10 levels for ${targetLang}/${uiLang}, got ${curr.length}`);
      process.exit(1);
    }
    for (const lvl of curr) {
      if (!lvl.questions || lvl.questions.length < 10) {
        console.error(`Level ${lvl.levelId} for ${targetLang}/${uiLang} has only ${lvl.questions?.length} questions!`);
        process.exit(1);
      }
    }
    totalPassed++;
  }
}

console.log(`ALL TESTS PASSED! Checked ${totalPassed} combinations of target and UI languages. Every level has >= 10 questions!`);
