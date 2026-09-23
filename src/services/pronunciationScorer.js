// Pronunciation Scorer & Phonetic Similarity Analyzer
// Designed for Indian Languages & Neo-Learners

export function cleanText(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'।]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Compute Levenshtein distance between two strings
export function levenshteinDistance(s1, s2) {
  const a = cleanText(s1);
  const b = cleanText(s2);
  const m = a.length;
  const n = b.length;

  if (m === 0) return n;
  if (n === 0) return m;

  const matrix = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) matrix[i][0] = i;
  for (let j = 0; j <= n; j++) matrix[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[m][n];
}

// Compute phonetic similarity score between 0 and 100
export function evaluatePronunciation(spokenText, expectedText, targetLang = 'hi') {
  const spoken = cleanText(spokenText);
  const expected = cleanText(expectedText);

  if (!spoken) {
    return {
      score: 0,
      grade: 'retry',
      feedback: 'No voice detected. Please speak clearly into the microphone.',
      spokenText: '',
      isPass: false,
    };
  }

  // Exact match
  if (spoken === expected) {
    return {
      score: 100,
      grade: 'perfect',
      feedback: 'वाह! अद्भुत उच्चारण! (Perfect Pronunciation!)',
      spokenText,
      isPass: true,
    };
  }

  // Check if expected is included in spoken or vice-versa
  if (spoken.includes(expected) || expected.includes(spoken)) {
    const lenRatio = Math.min(spoken.length, expected.length) / Math.max(spoken.length, expected.length);
    const score = Math.round(85 + 15 * lenRatio);
    return {
      score: Math.min(100, score),
      grade: score >= 90 ? 'perfect' : 'great',
      feedback: score >= 90 ? 'शानदार उच्चारण! (Excellent clarity!)' : 'बहुत अच्छा प्रयास! (Great job!)',
      spokenText,
      isPass: true,
    };
  }

  const distance = levenshteinDistance(spoken, expected);
  const maxLength = Math.max(spoken.length, expected.length);
  const rawSimilarity = 1 - distance / maxLength;
  let score = Math.round(Math.max(0, rawSimilarity * 100));

  // Grant small tolerance for minor dialect / vowel duration differences in Indic scripts
  if (score >= 60) {
    score = Math.min(95, score + 10);
  }

  let grade = 'retry';
  let feedback = 'एक बार और बोलकर देखें (Try once more with confidence)';
  let isPass = false;

  if (score >= 85) {
    grade = 'perfect';
    feedback = 'उत्कृष्ट! आपका उच्चारण बहुत साफ़ है। (Superb! Very clear)';
    isPass = true;
  } else if (score >= 65) {
    grade = 'great';
    feedback = 'शाबाश! लगभग सही बोला। (Good effort! Almost there)';
    isPass = true;
  } else if (score >= 45) {
    grade = 'close';
    feedback = 'आवाज़ सुनी गई, थोड़ा और धीरे और साफ़ बोलें (Heard your voice! Speak slightly slower)';
    isPass = false;
  }

  return {
    score,
    grade,
    feedback,
    spokenText,
    isPass,
  };
}
