// Dynamic Multilingual Diagnostic Placement Test & Baseline Assessment Generator
// Decouples UI Language (for question instructions & explanations) from Target Language (content to learn)
// Also personalizes content based on Learner Age Group ('child', 'adult', 'senior')

import { ALPHABET_DATA } from './alphabetData';

// Templates for question instructions in all 6 UI languages
const INSTRUCTION_TEMPLATES = {
  soundIdentify: {
    hi: 'इस ध्वनि को सुनकर सही अक्षर चुनें:',
    en: 'Listen to the sound and choose the correct letter:',
    ta: 'இந்த ஒலியைக் கேட்டு சரியான எழுத்தைத் தேர்ந்தெடுக்கவும்:',
    te: 'ఈ ధ్వనిని విని సరైన అక్షరాన్ని ఎంచుకోండి:',
    bn: 'এই ধ্বনি শুনে সঠিক বর্ণটি নির্বাচন করুন:',
    mr: 'हा आवाज ऐकून योग्य अक्षर निवडा:',
  },
  imageIdentify: {
    hi: 'चित्र देखकर सही शब्द पहचानें:',
    en: 'Look at the picture and identify the correct word:',
    ta: 'படத்தைப் பார்த்து சரியான சொல்லை அடையாளம் காணவும்:',
    te: 'చిత్రాన్ని చూసి సరైన పదాన్ని గుర్తించండి:',
    bn: 'ছবিটি দেখে সঠিক শব্দটি শনাক্ত করুন:',
    mr: 'चित्र पाहून योग्य शब्द ओळखा:',
  },
  waterMeaning: {
    hi: 'दैनिक जीवन में "पीने का पानी" के लिए सही शब्द कौन सा है?',
    en: 'Which is the correct word for "Drinking Water"?',
    ta: '"குடிநீர்" என்பதற்கான சரியான சொல் எது?',
    te: '"త్రాగే నీరు" కోసం సరైన పదం ఏది?',
    bn: '"পানীয় জল"-এর জন্য সঠিক শব্দটি কোনটি?',
    mr: 'दैनंदिन जीवनात "पिण्याचे पाणी" साठी योग्य शब्द कोणता?',
  },
  sentenceOrder: {
    hi: 'दिए गए विकल्पों में से सही वाक्य चुनें:',
    en: 'Choose the correctly formed sentence:',
    ta: 'சரியாக அமைக்கப்பட்ட வாக்கியத்தைத் தேர்ந்தெடுக்கவும்:',
    te: 'సరైన వాక్యాన్ని ఎంచుకోండి:',
    bn: 'সঠিক বাক্যটি নির্বাচন করুন:',
    mr: 'योग्य वाक्यरचना असलेला पर्याय निवडा:',
  },
  healthContext: {
    child: {
      hi: 'चोट लगने या बीमार होने पर क्या लेना चाहिए?',
      en: 'What do you take when you feel unwell or get hurt?',
      ta: 'உடல்நிலை சரியில்லாத போது என்ன எடுக்க வேண்டும்?',
      te: 'ఆరోగ్యం బాగోలేనప్పుడు ఏమి తీసుకోవాలి?',
      bn: 'অসুস্থ হলে কী নিতে হয়?',
      mr: 'आजारी पडल्यावर काय घ्यावे लागते?',
    },
    adult: {
      hi: 'अस्पताल या दुकान पर "दवा" के लिए कौन सा शब्द लिखा होता है?',
      en: 'Which word indicates "Medicine" at a clinic or pharmacy?',
      ta: 'மருந்தகத்தில் "மருந்து" என்பதைக் குறிக்கும் சொல் எது?',
      te: 'మందుల దుకాణంలో "మందు"ను సూచించే పదం ఏది?',
      bn: 'ঔষধের দোকানে "ওষুধ"-এর জন্য কোন শব্দটি থাকে?',
      mr: 'दवाखान्यात किंवा दुकानात "औषध" साठी कोणता शब्द असतो?',
    },
    senior: {
      hi: 'डॉक्टर द्वारा दी जाने वाली "दवा" की सही पहचान करें:',
      en: 'Identify the word for prescribed "Medicine":',
      ta: 'மருத்துவர் பரிந்துரைக்கும் "மருந்து" சொல்லை அடையாளம் காணவும்:',
      te: 'వైద్యులు ఇచ్చే "మందు" పదాన్ని గుర్తించండి:',
      bn: 'ডাক্তারের দেওয়া "ওষুধ" শব্দটি শনাক্ত করুন:',
      mr: 'डॉक्टरांनी दिलेल्या "औषध" शब्दाची योग्य ओळख करा:',
    },
  },
  practicalSign: {
    child: {
      hi: 'स्कूल बस या सड़क पर रुकने के लिए क्या लिखा होता है?',
      en: 'What sign tells the school bus or walkers to STOP?',
      ta: 'பேருந்து அல்லது பாதசாரிகள் நிற்க என்ன பலகை இருக்கும்?',
      te: 'పాఠశాల బస్సు ఆగడానికి ఏ సంకేతం ఉంటుంది?',
      bn: 'থামার জন্য কোন নির্দেশিকা বোর্ড থাকে?',
      mr: 'थांबण्यासाठी कोणता फलक असतो?',
    },
    adult: {
      hi: 'बैंक या बस में यात्रा के लिए कौन सा शब्द आवश्यक है?',
      en: 'Which word is required when boarding public transport?',
      ta: 'பேருந்து பயணத்திற்கு தேவையான சொல் எது?',
      te: 'బస్సు ప్రయాణానికి అవసరమైన పదం ఏది?',
      bn: 'বাসে ভ্রমণের জন্য কোনটি প্রয়োজনীয়?',
      mr: 'बस प्रवासासाठी कोणता शब्द आवश्यक आहे?',
    },
    senior: {
      hi: 'सार्वजनिक जगह पर रुकने (STOP) का संकेत पहचानें:',
      en: 'Identify the public sign for "STOP":',
      ta: '"நில்" (STOP) பலகையை அடையாளம் காணவும்:',
      te: '"ఆగండి" (STOP) సంకేతాన్ని గుర్తించండి:',
      bn: '"থামুন" (STOP) নির্দেশটি শনাক্ত করুন:',
      mr: '"थांबा" (STOP) चा फलक ओळखा:',
    },
  },
};

// Returns localized diagnostic placement questions
export function getPlacementQuestions(targetLang = 'hi', uiLang = 'en', ageGroup = 'adult') {
  const langData = ALPHABET_DATA[targetLang] || ALPHABET_DATA.hi;
  const vowels = langData.vowels || [];
  const consonants = langData.consonants || [];
  const words = langData.everydayWords || [];

  const firstVowel = vowels[0] || { char: 'A', translit: 'a' };
  const firstConsonant = consonants[0] || { char: 'K', translit: 'ka' };
  const waterWord = words.find((w) => w.category === 'market') || { word: 'Water', translit: 'Water' };
  const healthWord = words.find((w) => w.category === 'health') || { word: 'Medicine', translit: 'Dawa' };
  const transportWord = words.find((w) => w.category === 'transport') || { word: 'Bus', translit: 'Bus' };

  // Generate 5-6 adaptive diagnostic questions
  return [
    // Q1: Letter sound recognition
    {
      id: 'pt_1',
      difficulty: 1,
      instruction: INSTRUCTION_TEMPLATES.soundIdentify[uiLang] || INSTRUCTION_TEMPLATES.soundIdentify.en,
      audioPrompt: firstVowel.char,
      options: [
        { text: firstVowel.char, isCorrect: true, hint: firstVowel.translit },
        { text: (consonants[1] || { char: 'B' }).char, isCorrect: false },
        { text: (consonants[2] || { char: 'C' }).char, isCorrect: false },
        { text: (consonants[3] || { char: 'D' }).char, isCorrect: false },
      ],
    },

    // Q2: Consonant & Picture Identification
    {
      id: 'pt_2',
      difficulty: 2,
      instruction: INSTRUCTION_TEMPLATES.imageIdentify[uiLang] || INSTRUCTION_TEMPLATES.imageIdentify.en,
      imageHint: firstConsonant.icon || '🪷',
      audioPrompt: firstConsonant.char,
      options: [
        { text: firstConsonant.char, isCorrect: true, hint: firstConsonant.example || firstConsonant.translit },
        { text: (consonants[4] || { char: 'M' }).char, isCorrect: false },
        { text: (consonants[5] || { char: 'P' }).char, isCorrect: false },
        { text: (consonants[6] || { char: 'S' }).char, isCorrect: false },
      ],
    },

    // Q3: Everyday Vital Word (Drinking water)
    {
      id: 'pt_3',
      difficulty: 3,
      instruction: INSTRUCTION_TEMPLATES.waterMeaning[uiLang] || INSTRUCTION_TEMPLATES.waterMeaning.en,
      imageHint: '💧',
      audioPrompt: waterWord.word,
      options: [
        { text: `${waterWord.word} (${waterWord.translit})`, isCorrect: true },
        { text: targetLang === 'en' ? 'Book' : 'किताब / Book', isCorrect: false },
        { text: targetLang === 'en' ? 'Knife' : 'चाकू / Knife', isCorrect: false },
        { text: targetLang === 'en' ? 'Table' : 'मेज़ / Table', isCorrect: false },
      ],
    },

    // Q4: Health / Age Contextual Word
    {
      id: 'pt_4',
      difficulty: 4,
      instruction:
        (INSTRUCTION_TEMPLATES.healthContext[ageGroup] && INSTRUCTION_TEMPLATES.healthContext[ageGroup][uiLang]) ||
        INSTRUCTION_TEMPLATES.healthContext.adult[uiLang] ||
        INSTRUCTION_TEMPLATES.healthContext.adult.en,
      imageHint: '💊',
      audioPrompt: healthWord.word,
      options: [
        { text: `${healthWord.word} (${healthWord.translit})`, isCorrect: true },
        { text: targetLang === 'en' ? 'Cinema' : 'सिनेमा / Cinema', isCorrect: false },
        { text: targetLang === 'en' ? 'Hotel' : 'होटल / Hotel', isCorrect: false },
        { text: targetLang === 'en' ? 'Park' : 'पार्क / Park', isCorrect: false },
      ],
    },

    // Q5: Practical Public Signs / Transport
    {
      id: 'pt_5',
      difficulty: 5,
      instruction:
        (INSTRUCTION_TEMPLATES.practicalSign[ageGroup] && INSTRUCTION_TEMPLATES.practicalSign[ageGroup][uiLang]) ||
        INSTRUCTION_TEMPLATES.practicalSign.adult[uiLang] ||
        INSTRUCTION_TEMPLATES.practicalSign.adult.en,
      imageHint: '🛑',
      audioPrompt: transportWord.word,
      options: [
        { text: `${transportWord.word} (${transportWord.translit})`, isCorrect: true },
        { text: targetLang === 'en' ? 'Run' : 'दौड़ना / Run', isCorrect: false },
        { text: targetLang === 'en' ? 'Sleep' : 'सोना / Sleep', isCorrect: false },
      ],
    },
  ];
}

// Returns baseline assessment questions (for learners starting from basics) in UI Language
export function getBaselineQuestions(targetLang = 'hi', uiLang = 'en', ageGroup = 'adult') {
  const langData = ALPHABET_DATA[targetLang] || ALPHABET_DATA.hi;
  const vowels = langData.vowels || [];
  const firstVowel = vowels[0] || { char: 'A', translit: 'a' };

  const baselinePrompts = {
    q1: {
      hi: 'पहला कदम: इस ध्वनि को सुनकर सही अक्षर पहचानें:',
      en: 'First Step: Listen to this sound and identify the letter:',
      ta: 'முதல் படி: இந்த ஒலியைக் கேட்டு எழுத்தை அடையாளம் காணவும்:',
      te: 'మొదటి అడుగు: ఈ ధ్వనిని విని అక్షరాన్ని గుర్తించండి:',
      bn: 'প্রথম ধাপ: এই ধ্বনি শুনে বর্ণটি শনাক্ত করুন:',
      mr: 'पहिले पाऊल: हा आवाज ऐकून योग्य अक्षर ओळखा:',
    },
    q2: {
      hi: 'चित्र देखकर फल (Fruit) का सही अक्षर/शब्द चुनें:',
      en: 'Look at the picture and choose the correct Fruit name:',
      ta: 'படத்தைப் பார்த்து பழத்தின் பெயரைத் தேர்ந்தெடுக்கவும்:',
      te: 'చిత్రాన్ని చూసి పండు పేరును ఎంచుకోండి:',
      bn: 'ছবি দেখে ফলের নামটি নির্বাচন করুন:',
      mr: 'चित्र पाहून फळाचे योग्य नाव निवडा:',
    },
    q3: {
      hi: 'रुकने (STOP) का लाल संकेत पहचानें:',
      en: 'Identify the red STOP signal:',
      ta: 'நிறுத்துவதற்கான (STOP) சிவப்பு அடையாளத்தைக் கண்டறியவும்:',
      te: 'ఆగడానికి (STOP) ఎరుపు రంగు సంకేతాన్ని గుర్తించండి:',
      bn: 'থামার (STOP) লাল নির্দেশটি শনাক্ত করুন:',
      mr: 'थांबण्याचा (STOP) लाल संकेत ओळखा:',
    },
  };

  return [
    {
      id: 'base_1',
      instruction: baselinePrompts.q1[uiLang] || baselinePrompts.q1.en,
      audioPrompt: firstVowel.char,
      options: [
        { text: `${firstVowel.char} (${firstVowel.translit})`, isCorrect: true },
        { text: 'B', isCorrect: false },
        { text: 'P', isCorrect: false },
      ],
    },
    {
      id: 'base_2',
      instruction: baselinePrompts.q2[uiLang] || baselinePrompts.q2.en,
      imageHint: '🍎',
      audioPrompt: firstVowel.char,
      options: [
        { text: `${firstVowel.char} (Apple 🍎)`, isCorrect: true },
        { text: 'X', isCorrect: false },
        { text: 'Y', isCorrect: false },
      ],
    },
    {
      id: 'base_3',
      instruction: baselinePrompts.q3[uiLang] || baselinePrompts.q3.en,
      imageHint: '🛑',
      audioPrompt: 'Stop',
      options: [
        { text: uiLang === 'en' ? 'STOP (Red 🛑)' : 'रुकिए (लाल 🛑)', isCorrect: true },
        { text: uiLang === 'en' ? 'Go (Green 🟢)' : 'चलें (हरा 🟢)', isCorrect: false },
      ],
    },
  ];
}
