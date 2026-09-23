// Multilingual Curriculum Generator with Strict UI Language & Age Group Personalization
// Supports all 6 Target Languages & 6 UI Languages: Hindi, English, Tamil, Telugu, Bengali, Marathi
// Each of the 10 Levels contains exactly 10 distinct, non-repeating, creative pedagogical exercises.

import { ALPHABET_DATA } from './alphabetData.js';

export const CURRICULUM_STAGES = [
  {
    id: 'stage_1',
    titleKey: 'stage1Title',
    desc: 'Foundational Letters, Vowels, Consonants & Phonics',
    levels: [1, 2, 3],
    icon: '🌱',
    themeColor: '#58CC02',
  },
  {
    id: 'stage_2',
    titleKey: 'stage2Title',
    desc: 'Everyday Words: Market, Family, Food, Numbers',
    levels: [4, 5, 6],
    icon: '🍎',
    themeColor: '#1CB0F6',
  },
  {
    id: 'stage_3',
    titleKey: 'stage3Title',
    desc: 'Practical Sentences, Daily Conversations & Travel',
    levels: [7, 8],
    icon: '🚌',
    themeColor: '#FF9600',
  },
  {
    id: 'stage_4',
    titleKey: 'stage4Title',
    desc: 'Real-World Literacy: Bank Forms, Hospital, Emergency Signs',
    levels: [9, 10],
    icon: '🏆',
    themeColor: '#CE82FF',
  },
];

// Localized lesson titles and descriptions in all 6 UI Languages
const LEVEL_METADATA = {
  1: {
    title: {
      hi: 'स्तर १: पहला कदम - स्वर ध्वनियाँ',
      en: 'Level 1: First Steps - Vowel Sounds',
      ta: 'நிலை 1: முதல் படி - உயிர் எழுத்துக்கள்',
      te: 'స్థాయి 1: మొదటి అడుగు - అచ్చులు',
      bn: 'স্তর ১: প্রথম ধাপ - স্বরবর্ণের ধ্বনি',
      mr: 'स्तर १: पहिले पाऊल - स्वर ओळख',
    },
    desc: {
      hi: 'स्वर और उनकी ध्वनियों को पहचानना और बोलना सीखें',
      en: 'Learn to recognize and pronounce foundational vowel sounds',
      ta: 'உயிர் எழுத்துக்களின் ஒலிகளை அடையாளம் காணவும் பேசவும் கற்றுக்கொள்ளுங்கள்',
      te: 'అచ్చులు మరియు వాటి శబ్దాలను గుర్తించడం మరియు పలకడం నేర్చుకోండి',
      bn: 'স্বরবর্ণ ও তাদের ধ্বনি চিনতে ও উচ্চারণ করতে শিখুন',
      mr: 'स्वर आणि त्यांचे आवाज ओळखणे व उच्चारणे शिका',
    },
  },
  2: {
    title: {
      hi: 'स्तर २: व्यंजनों का संसार',
      en: 'Level 2: The World of Consonants',
      ta: 'நிலை 2: மெய் எழுத்துக்கள் உலகம்',
      te: 'స్థాయి 2: హల్లుల ప్రపంచం',
      bn: 'স্তর ২: ব্যঞ্জনবর্ণের জগৎ',
      mr: 'स्तर २: व्यंजनांचे जग',
    },
    desc: {
      hi: 'व्यंजन और चित्रों से जुड़े अक्षरों की पहचान',
      en: 'Identify consonants with pictures and phonetic clues',
      ta: 'படங்கள் மற்றும் ஒலிகள் மூலம் மெய் எழுத்துக்களை அடையாளம் காணவும்',
      te: 'చిత్రాలు మరియు ధ్వనుల ద్వారా హల్లులను గుర్తించండి',
      bn: 'ছবি ও ধ্বনির মাধ্যমে ব্যঞ্জনবর্ণ চিনুন',
      mr: 'चित्रे आणि आवाजांद्वारे व्यंजनांची ओळख',
    },
  },
  3: {
    title: {
      hi: 'स्तर ३: सरल दो-अक्षर शब्द',
      en: 'Level 3: Simple Two-Letter Words',
      ta: 'நிலை 3: எளிய ஈரெழுத்துச் சொற்கள்',
      te: 'స్థాయి 3: చిన్న రెండక్షరాల పదాలు',
      bn: 'স্তর ৩: সহজ দুই বর্ণের শব্দ',
      mr: 'स्तर ३: सोपे दोन-अक्षरी शब्द',
    },
    desc: {
      hi: 'अक्षरों को जोड़कर रोज़मर्रा के सरल शब्द पढ़ना',
      en: 'Blend letters together into everyday simple words',
      ta: 'எழுத்துக்களை இணைத்து அன்றாட சொற்களை வாசிக்கவும்',
      te: 'అక్షరాలను కలిపి రోజువారీ పదాలను చదవండి',
      bn: 'বর্ণ মিলিয়ে নিত্যদিনের শব্দ পড়তে শিখুন',
      mr: 'अक्षरे जोडून रोजच्या वापरातील सोपे शब्द वाचणे',
    },
  },
  4: {
    title: {
      hi: 'स्तर ४: बाज़ार व भोजन',
      en: 'Level 4: Market & Food Vocabulary',
      ta: 'நிலை 4: சந்தை மற்றும் உணவு',
      te: 'స్థాయి 4: మార్కెట్ & ఆహార పదాలు',
      bn: 'স্তর ৪: বাজার ও খাবার শব্দাবলী',
      mr: 'स्तर ४: बाजार व खाण्यापिण्याचे शब्द',
    },
    desc: {
      hi: 'पानी, दूध, फल, रोटी जैसे आवश्यक शब्द',
      en: 'Essential words: water, milk, fruit, and daily meals',
      ta: 'தண்ணீர், பால், பழம் போன்ற அத்தியாவசிய சொற்கள்',
      te: 'నీరు, పాలు, పండ్లు మరియు భోజన పదాలు',
      bn: 'জল, দুধ, ফল, ভাত ইত্যাদি নিত্যপ্রয়োজনীয় শব্দ',
      mr: 'पाणी, दूध, फळ आणि जेवणाचे रोजचे शब्द',
    },
  },
  5: {
    title: {
      hi: 'स्तर ५: परिवार व घर',
      en: 'Level 5: Family & Home Relations',
      ta: 'நிலை 5: குடும்பம் & உறவுகள்',
      te: 'స్థాయి 5: కుటుంబం & బంధుత్వాలు',
      bn: 'স্তর ৫: পরিবার ও আত্মীয়স্বজন',
      mr: 'स्तर ५: कुटुंब व नातेसंबंध',
    },
    desc: {
      hi: 'माँ, पिता, भाई, बहन, घर के रिश्ते',
      en: 'Family members: mother, father, brother, sister, and home',
      ta: 'அம்மா, அப்பா, சகோதரன், சகோதரி போன்ற உறவுச் சொற்கள்',
      te: 'అమ్మ, నాన్న, సోదరుడు, సోదరి మరియు కుటుంబ పదాలు',
      bn: 'মা, বাবা, ভাই, বোন ও পরিবারের মানুষজন',
      mr: 'आई, बाबा, भाऊ, बहीण व घरातील नातेसंबंध',
    },
  },
  6: {
    title: {
      hi: 'स्तर ६: संख्याएँ व समय',
      en: 'Level 6: Numbers 1-10 & Daily Time',
      ta: 'நிலை 6: எண்கள் & நேரம்',
      te: 'స్థాయి 6: సంఖ్యలు & సమయం',
      bn: 'স্তর ৬: সংখ্যা ও সময়ের জ্ঞান',
      mr: 'स्तर ६: संख्या १-१० व वेळ',
    },
    desc: {
      hi: 'गिनती, घड़ी का समय, सुबह और शाम',
      en: 'Counting digits, clock time, morning and evening',
      ta: 'எண்கள், கடிகார நேரம், காலை மற்றும் மாலை',
      te: 'లెక్కలు, గడియార సమయం, ఉదయం మరియు సాయంత్రం',
      bn: 'গণনা, ঘড়ির সময়, সকাল ও সন্ধ্যার পরিচিতি',
      mr: 'आकडेमोड, घड्याळाची वेळ, सकाळ व संध्याकाळ',
    },
  },
  7: {
    title: {
      hi: 'स्तर ७: यात्रा, बस व दिशाएँ',
      en: 'Level 7: Travel, Bus & Public Direction Signs',
      ta: 'நிலை 7: பயணம் & வழிகாட்டு பலகைகள்',
      te: 'స్థాయి 7: ప్రయాణం & దిశలు',
      bn: 'স্তর ৭: ভ্রমণ, বাস ও রাস্তার দিকনির্দেশ',
      mr: 'स्तर ७: प्रवास, बस व दिशा फलक',
    },
    desc: {
      hi: 'बस स्टॉप, टिकट, सड़क और दिशा के बोर्ड पढ़ना',
      en: 'Read bus stop boards, tickets, routes, and directions',
      ta: 'பேருந்து நிறுத்தம், பயணச்சீட்டு மற்றும் திசைப் பலகைகள்',
      te: 'బస్ స్టాప్, టికెట్ మరియు దారి బోర్డులను చదవండి',
      bn: 'বাস স্টপ, টিকিট, রাস্তা এবং দিকনির্দেশক সাইনবোর্ড পড়া',
      mr: 'बस स्थानक, तिकीट, रस्ता व पाट्या वाचणे',
    },
  },
  8: {
    title: {
      hi: 'स्तर ८: स्वास्थ्य, डॉक्टर व दवा',
      en: 'Level 8: Health, Clinic & Medicine',
      ta: 'நிலை 8: மருத்துவம் & நல்வாழ்வு',
      te: 'స్థాయి 8: వైద్యం & ఆసుపత్రి అవసరాలు',
      bn: 'স্তর ৮: স্বাস্থ্য, ডাক্তার ও ওষুধ',
      mr: 'स्तर ८: आरोग्य, दवाखाना व औषध',
    },
    desc: {
      hi: 'दवा का पर्चा, अस्पताल, आपातकालीन मदद',
      en: 'Clinic signs, medicine labels, and emergency assistance',
      ta: 'மருத்துவமனை, மருந்துச் சீட்டு மற்றும் அவசர உதவி',
      te: 'ఆసుపత్రి, మందుల చీటీ మరియు అత్యవసర సహాయం',
      bn: 'হাসপাতাল, ওষুধের রসিদ ও জরুরি সহায়তার শব্দ',
      mr: 'दवाखाना, औषधाची पावती व तातडीची मदत',
    },
  },
  9: {
    title: {
      hi: 'स्तर ९: बैंक, पर्ची व स्वाक्षरी',
      en: 'Level 9: Bank Deposit, Signature & Forms',
      ta: 'நிலை 9: வங்கி படிவங்கள் & கையொப்பம்',
      te: 'స్థాయి 9: బ్యాంకు రసీదులు & సంతకం',
      bn: 'স্তর ৯: ব্যাংক ফর্ম ও স্বাক্ষর',
      mr: 'स्तर ९: बँक, पावती व स्वाक्षरी',
    },
    desc: {
      hi: 'बैंक पर्ची भरना, हस्ताक्षर, खाता और लेन-देन',
      en: 'Fill deposit slips, write signature, manage account and cash',
      ta: 'வங்கி ரசீது நிரப்புதல், கையொப்பம் மற்றும் பணம்',
      te: 'బ్యాంకు ఫారాలు నింపడం, సంతకం మరియు నగదు జమ',
      bn: 'ব্যাংক জমা স্লিপ পূরণ, সই ও লেনদেনের পাঠ',
      mr: 'बँकेची पावती भरणे, सही करणे व पैशांचे व्यवहार',
    },
  },
  10: {
    title: {
      hi: 'स्तर १०: साक्षर नागरिक व प्रमाणपत्र',
      en: 'Level 10: Civic Literacy & Graduation Certificate',
      ta: 'நிலை 10: முழு எழுத்தறிவு சாதனை & சான்றிதழ்',
      te: 'స్థాయి 10: సంపూర్ణ అక్షరాస్యత & పట్టా',
      bn: 'স্তর ১০: সাক্ষর নাগরিক ও স্নাতক সনদ',
      mr: 'स्तर १०: साक्षर नागरिक व पदवी प्रमाणपत्र',
    },
    desc: {
      hi: 'सार्वजनिक सूचनाएँ, समाचार पढ़ना और पूर्ण साक्षरता सिद्धि',
      en: 'Read public notices, newspapers, and earn literacy graduation',
      ta: 'பொது அறிவிப்புகள், செய்தி வாசித்தல் மற்றும் இறுதி சான்றிதழ்',
      te: 'ప్రజా ప్రకటనలు, వార్తాపత్రికలు చదివి గౌరవపత్రం పొందండి',
      bn: 'সরকারি নোটিশ, খবরের কাগজ পড়া ও সফল সমাপ্তি',
      mr: 'सरकारी सूचना फलक, वर्तमानपत्र वाचणे व साक्षरतेचे यश',
    },
  },
};

// Generates adapted lessons dynamically based on target language, UI language, and age group
export function getCurriculumForLanguage(targetLang = 'mr', uiLang = 'en') {
  const langData = ALPHABET_DATA[targetLang] || ALPHABET_DATA.mr || ALPHABET_DATA.hi;
  const vowels = langData.vowels || [];
  const consonants = langData.consonants || [];
  const words = langData.everydayWords || [];
  const numbers = langData.numbers || [];

  const getInst = (key) => {
    const insts = {
      listenLetter: {
        hi: 'आवाज़ सुनकर सही अक्षर चुनें:',
        en: 'Listen to the sound and choose the correct letter:',
        ta: 'ஒலியைக் கேட்டு சரியான எழுத்தைத் தேர்ந்தெடுக்கவும்:',
        te: 'ధ్వనిని విని సరైన అక్షరాన్ని ఎంచుకోండి:',
        bn: 'ধ্বনি শুনে সঠিক বর্ণটি নির্বাচন করুন:',
        mr: 'आवाज ऐकून योग्य अक्षर निवडा:',
      },
      lookImage: {
        hi: 'चित्र देखकर सही पहचान चुनें:',
        en: 'Look at the picture and choose the matching letter or word:',
        ta: 'படத்தைப் பார்த்து சரியான விடையைத் தேர்ந்தெடுக்கவும்:',
        te: 'చిత్రాన్ని చూసి సరైన సమాధానాన్ని ఎంచుకోండి:',
        bn: 'ছবি দেখে সঠিক উত্তর নির্বাচন করুন:',
        mr: 'चित्र पाहून योग्य पर्याय निवडा:',
      },
      wordMeaning: {
        hi: 'इस शब्द का सही अर्थ चुनें:',
        en: 'Choose the correct meaning of this word:',
        ta: 'இந்தச் சொல்லின் சரியான பொருளைத் தேர்ந்தெடுக்கவும்:',
        te: 'ఈ పదానికి సరైన అర్ధాన్ని ఎంచుకోండి:',
        bn: 'এই শব্দের সঠিক অর্থ নির্বাচন করুন:',
        mr: 'या शब्दाचा योग्य अर्थ निवडा:',
      },
      traceLetter: {
        hi: 'अक्षर लिखने के लिए नीले तीर को आगे खिसकाएँ:',
        en: 'Slide the blue arrow along the path to trace the character:',
        ta: 'எழுத்தை வரைய நீல அம்புக்குறியை நகர்த்தவும்:',
        te: 'అక్షరాన్ని రాయడానికి నీలి బాణాన్ని ముందుకు జరపండి:',
        bn: 'বর্ণটি লিখতে নীল তীরটি পথ ধরে এগিয়ে নিন:',
        mr: 'अक्षर गिरवण्यासाठी निळा बाण रेषेवरून पुढे सरकवा:',
      },
      matchWords: {
        hi: 'सही जोड़ों को आपस में मिलाएँ:',
        en: 'Match the 4 word pairs correctly:',
        ta: '4 சொல் ஜோடிகளைச் சரியாகப் பொருத்தவும்:',
        te: '4 పదాల జతలను సరిగ్గా కలపండి:',
        bn: '৪টি শব্দের জোড়া সঠিকভাবে মেলান:',
        mr: '४ योग्य जोड्या लावा:',
      },
      buildSentence: {
        hi: 'वाक्य बनाने के लिए शब्दों को सही क्रम में टैप करें:',
        en: 'Tap the words in order to form the sentence:',
        ta: 'வாக்கியத்தை உருவாக்க சொற்களை வரிசையாகத் தட்டவும்:',
        te: 'వాక్యాన్ని రూపొందించడానికి పదాలను సరైన క్రమంలో నొక్కండి:',
        bn: 'বাক্য তৈরি করতে শব্দগুলিতে সঠিক ক্রমে ট্যাপ করুন:',
        mr: 'वाक्य तयार करण्यासाठी शब्दांवर योग्य क्रमाने टॅप करा:',
      },
      speakWord: {
        hi: 'माइक दबाकर स्पष्ट आवाज़ में बोलें:',
        en: 'Press the microphone and pronounce clearly:',
        ta: 'மைக் அழுத்தி தெளிவாகப் பேசவும்:',
        te: 'మైక్ నొక్కి స్పష్టంగా పలకండి:',
        bn: 'মাইক চেপে পরিষ্কার উচ্চারণ করুন:',
        mr: 'माईक दाबून स्पष्ट आवाजात उच्चार करा:',
      },
      listenPhrase: {
        hi: 'ध्यान से सुनकर चुनें कि क्या बोला गया:',
        en: 'Listen carefully and select what was spoken:',
        ta: 'கவனமாகக் கேட்டு பேசப்பட்டதைத் தேர்ந்தெடுக்கவும்:',
        te: 'శ్రద్ధగా విని పలికినదాన్ని ఎంచుకోండి:',
        bn: 'মনোযোগ দিয়ে শুনে সঠিক বাক্যটি বাছুন:',
        mr: 'लक्षपूर्वक ऐका आणि काय बोलले ते निवडा:',
      },
      fillBlank: {
        hi: 'वाक्य पूरा करने के लिए खाली स्थान भरें:',
        en: 'Fill in the blank to complete the sentence:',
        ta: 'வாக்கியத்தை முடிக்க விடுபட்ட இடத்தை நிரப்பவும்:',
        te: 'వాక్యాన్ని పూర్తి చేయడానికి ఖాళీని పూరించండి:',
        bn: 'বাক্য সম্পূর্ণ করতে শূন্যস্থান পূরণ করুন:',
        mr: 'वाक्य पूर्ण करण्यासाठी रिकामी जागा भरा:',
      },
      masteryChallenge: {
        hi: 'दक्षता चुनौती: सही उत्तर तुरंत पहचानें:',
        en: 'Mastery Challenge: Identify the correct answer quickly:',
        ta: 'திறன் சவால்: சரியான விடையை விரைவாகக் கண்டறியவும்:',
        te: 'పాండిత్య సవాలు: సరైన సమాధానాన్ని వెంటనే గుర్తించండి:',
        bn: 'দক্ষতা চ্যালেঞ্জ: দ্রুত সঠিক উত্তরটি চিনুন:',
        mr: 'प्रावीण्य आव्हान: योग्य उत्तर त्वरित ओळखा:',
      },
    };
    return (insts[key] && insts[key][uiLang]) || (insts[key] && insts[key].en) || '';
  };

  // Build 10 distinct non-repeating levels
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvlId) => {
    const meta = LEVEL_METADATA[lvlId] || LEVEL_METADATA[1];
    const title = meta.title[uiLang] || meta.title.en;
    const description = meta.desc[uiLang] || meta.desc.en;

    let stageId = 'stage_1';
    if (lvlId >= 9) stageId = 'stage_4';
    else if (lvlId >= 7) stageId = 'stage_3';
    else if (lvlId >= 4) stageId = 'stage_2';

    // Unique vocabulary selection per level
    let questions = [];

    if (lvlId === 1) {
      // LEVEL 1: FOUNDATIONAL VOWELS (अ, आ, इ, ई)
      const vA = vowels[0] || { char: 'अ', translit: 'a', icon: '🍎' };
      const vAa = vowels[1] || { char: 'आ', translit: 'aa', icon: '🥭' };
      const vI = vowels[2] || { char: 'इ', translit: 'i', icon: '🏢' };
      const vEe = vowels[3] || { char: 'ई', translit: 'ee', icon: '🍋' };

      questions = [
        {
          id: 'q1_1',
          type: 'multiple_choice',
          instruction: getInst('listenLetter'),
          audioPrompt: vA.char,
          options: [
            { text: vA.char, isCorrect: true, hint: vA.translit },
            { text: vAa.char, isCorrect: false },
            { text: vI.char, isCorrect: false },
            { text: vEe.char, isCorrect: false },
          ],
        },
        {
          id: 'q1_2',
          type: 'multiple_choice',
          instruction: getInst('lookImage'),
          imageHint: vAa.icon || '🥭',
          audioPrompt: vAa.char,
          options: [
            { text: vAa.char, isCorrect: true },
            { text: vA.char, isCorrect: false },
            { text: vI.char, isCorrect: false },
            { text: vEe.char, isCorrect: false },
          ],
        },
        {
          id: 'q1_3',
          type: 'multiple_choice',
          instruction: getInst('wordMeaning'),
          questionText: vAa.example ? vAa.example.split(' ')[0] : vAa.char,
          audioPrompt: vAa.example ? vAa.example.split(' ')[0] : vAa.char,
          options: [
            { text: uiLang === 'mr' ? 'आंबा फळ' : uiLang === 'hi' ? 'आम फल' : 'Mango fruit', isCorrect: true },
            { text: uiLang === 'mr' ? 'पाणी' : uiLang === 'hi' ? 'पानी' : 'Water', isCorrect: false },
            { text: uiLang === 'mr' ? 'घर' : uiLang === 'hi' ? 'घर' : 'House', isCorrect: false },
            { text: uiLang === 'mr' ? 'दूध' : uiLang === 'hi' ? 'दूध' : 'Milk', isCorrect: false },
          ],
        },
        {
          id: 'q1_4',
          type: 'duolingo_trace',
          instruction: getInst('traceLetter'),
          char: vA.char,
          phonetic: vA.translit,
        },
        {
          id: 'q1_5',
          type: 'match_pairs',
          instruction: getInst('matchWords'),
          pairs: [
            { left: vA.char, right: vA.icon || '🍎' },
            { left: vAa.char, right: vAa.icon || '🥭' },
            { left: vI.char, right: vI.icon || '🏢' },
            { left: vEe.char, right: vEe.icon || '🍋' },
          ],
        },
        {
          id: 'q1_6',
          type: 'scramble',
          instruction: getInst('buildSentence'),
          promptText: uiLang === 'mr' ? 'हे पाणी आहे' : uiLang === 'hi' ? 'यह पानी है' : 'This is water',
          tokens: targetLang === 'mr' ? ['हे', 'पाणी', 'आहे'] : targetLang === 'hi' ? ['यह', 'पानी', 'है'] : ['This', 'is', 'water'],
          correctSentence: targetLang === 'mr' ? 'हे पाणी आहे' : targetLang === 'hi' ? 'यह पानी है' : 'This is water',
        },
        {
          id: 'q1_7',
          type: 'pronunciation',
          instruction: getInst('speakWord'),
          targetWord: vAa.char,
          translit: vAa.translit,
          hint: vAa.char,
          icon: vAa.icon,
        },
        {
          id: 'q1_8',
          type: 'listening_mcq',
          instruction: getInst('listenPhrase'),
          audioPrompt: vI.char,
          options: [
            { text: vI.char, isCorrect: true },
            { text: vA.char, isCorrect: false },
            { text: vAa.char, isCorrect: false },
            { text: vEe.char, isCorrect: false },
          ],
        },
        {
          id: 'q1_9',
          type: 'fill_blank',
          instruction: getInst('fillBlank'),
          sentenceParts: targetLang === 'mr' ? ['हे फळ गोड ', '.'] : targetLang === 'hi' ? ['यह फल मीठा ', '।'] : ['This fruit ', ' sweet.'],
          options: [
            { text: targetLang === 'mr' ? 'आहे' : targetLang === 'hi' ? 'है' : 'is', isCorrect: true },
            { text: targetLang === 'mr' ? 'नाही' : targetLang === 'hi' ? 'नहीं' : 'not', isCorrect: false },
            { text: targetLang === 'mr' ? 'पाणी' : targetLang === 'hi' ? 'पानी' : 'water', isCorrect: false },
          ],
        },
        {
          id: 'q1_10',
          type: 'multiple_choice',
          instruction: getInst('masteryChallenge'),
          questionText: vEe.char,
          audioPrompt: vEe.char,
          options: [
            { text: vEe.char, isCorrect: true },
            { text: vA.char, isCorrect: false },
            { text: vAa.char, isCorrect: false },
            { text: vI.char, isCorrect: false },
          ],
        },
      ];
    } else if (lvlId === 2) {
      // LEVEL 2: CORE CONSONANTS (क, ख, ग, घ)
      const cKa = consonants[0] || { char: 'क', translit: 'ka', icon: '🪷' };
      const cKha = consonants[1] || { char: 'ख', translit: 'kha', icon: '🖍️' };
      const cGa = consonants[2] || { char: 'ग', translit: 'ga', icon: '🪴' };
      const cGha = consonants[3] || { char: 'घ', translit: 'gha', icon: '🏠' };

      questions = [
        {
          id: 'q2_1',
          type: 'multiple_choice',
          instruction: getInst('listenLetter'),
          audioPrompt: cKa.char,
          options: [
            { text: cKa.char, isCorrect: true },
            { text: cKha.char, isCorrect: false },
            { text: cGa.char, isCorrect: false },
            { text: cGha.char, isCorrect: false },
          ],
        },
        {
          id: 'q2_2',
          type: 'multiple_choice',
          instruction: getInst('lookImage'),
          imageHint: cKa.icon || '🪷',
          audioPrompt: cKa.char,
          options: [
            { text: cKa.char, isCorrect: true },
            { text: cGa.char, isCorrect: false },
            { text: cGha.char, isCorrect: false },
            { text: cKha.char, isCorrect: false },
          ],
        },
        {
          id: 'q2_3',
          type: 'multiple_choice',
          instruction: getInst('wordMeaning'),
          questionText: cGha.char === 'घ' ? (targetLang === 'mr' ? 'घर' : 'घर') : cGha.char,
          audioPrompt: cGha.char === 'घ' ? 'घर' : cGha.char,
          options: [
            { text: uiLang === 'mr' ? 'घर' : uiLang === 'hi' ? 'घर' : 'Home / House', isCorrect: true },
            { text: uiLang === 'mr' ? 'झाड' : uiLang === 'hi' ? 'पेड़' : 'Tree', isCorrect: false },
            { text: uiLang === 'mr' ? 'रस्ता' : uiLang === 'hi' ? 'सड़क' : 'Road', isCorrect: false },
            { text: uiLang === 'mr' ? 'नदी' : uiLang === 'hi' ? 'नदी' : 'River', isCorrect: false },
          ],
        },
        {
          id: 'q2_4',
          type: 'duolingo_trace',
          instruction: getInst('traceLetter'),
          char: cKa.char,
          phonetic: cKa.translit,
        },
        {
          id: 'q2_5',
          type: 'match_pairs',
          instruction: getInst('matchWords'),
          pairs: [
            { left: cKa.char, right: cKa.icon || '🪷' },
            { left: cKha.char, right: cKha.icon || '🖍️' },
            { left: cGa.char, right: cGa.icon || '🪴' },
            { left: cGha.char, right: cGha.icon || '🏠' },
          ],
        },
        {
          id: 'q2_6',
          type: 'scramble',
          instruction: getInst('buildSentence'),
          promptText: uiLang === 'mr' ? 'घर सुंदर आहे' : uiLang === 'hi' ? 'घर सुंदर है' : 'The house is beautiful',
          tokens: targetLang === 'mr' ? ['घर', 'सुंदर', 'आहे'] : targetLang === 'hi' ? ['घर', 'सुंदर', 'है'] : ['The', 'house', 'is', 'beautiful'],
          correctSentence: targetLang === 'mr' ? 'घर सुंदर आहे' : targetLang === 'hi' ? 'घर सुंदर है' : 'The house is beautiful',
        },
        {
          id: 'q2_7',
          type: 'pronunciation',
          instruction: getInst('speakWord'),
          targetWord: cKha.char,
          translit: cKha.translit,
          hint: cKha.char,
          icon: cKha.icon,
        },
        {
          id: 'q2_8',
          type: 'listening_mcq',
          instruction: getInst('listenPhrase'),
          audioPrompt: targetLang === 'mr' ? 'घर' : 'घर',
          options: [
            { text: targetLang === 'mr' ? 'घर' : 'घर', isCorrect: true },
            { text: cKa.char, isCorrect: false },
            { text: cGa.char, isCorrect: false },
            { text: cKha.char, isCorrect: false },
          ],
        },
        {
          id: 'q2_9',
          type: 'fill_blank',
          instruction: getInst('fillBlank'),
          sentenceParts: targetLang === 'mr' ? ['माझे ', ' स्वच्छ आहे.'] : targetLang === 'hi' ? ['मेरा ', ' साफ़ है।'] : ['My ', ' is clean.'],
          options: [
            { text: targetLang === 'mr' ? 'घर' : 'घर', isCorrect: true },
            { text: targetLang === 'mr' ? 'दूध' : 'दूध', isCorrect: false },
            { text: targetLang === 'mr' ? 'फळ' : 'फल', isCorrect: false },
          ],
        },
        {
          id: 'q2_10',
          type: 'multiple_choice',
          instruction: getInst('masteryChallenge'),
          questionText: cGa.char,
          audioPrompt: cGa.char,
          options: [
            { text: cGa.char, isCorrect: true },
            { text: cKa.char, isCorrect: false },
            { text: cGha.char, isCorrect: false },
            { text: cKha.char, isCorrect: false },
          ],
        },
      ];
    } else if (lvlId === 3) {
      // LEVEL 3: SIMPLE TWO-LETTER WORDS (नल/नळ, जल, फल, मन)
      const tapWord = targetLang === 'mr' ? 'नळ' : 'नल';
      const fruitWord = targetLang === 'mr' ? 'फळ' : 'फल';
      const waterWord = targetLang === 'mr' ? 'जल' : 'जल';
      const mindWord = targetLang === 'mr' ? 'मन' : 'मन';

      questions = [
        {
          id: 'q3_1',
          type: 'multiple_choice',
          instruction: getInst('listenLetter'),
          audioPrompt: tapWord,
          options: [
            { text: tapWord, isCorrect: true },
            { text: fruitWord, isCorrect: false },
            { text: waterWord, isCorrect: false },
            { text: mindWord, isCorrect: false },
          ],
        },
        {
          id: 'q3_2',
          type: 'multiple_choice',
          instruction: getInst('lookImage'),
          imageHint: '🚰',
          audioPrompt: tapWord,
          options: [
            { text: tapWord, isCorrect: true },
            { text: fruitWord, isCorrect: false },
            { text: mindWord, isCorrect: false },
            { text: waterWord, isCorrect: false },
          ],
        },
        {
          id: 'q3_3',
          type: 'multiple_choice',
          instruction: getInst('wordMeaning'),
          questionText: tapWord,
          audioPrompt: tapWord,
          options: [
            { text: uiLang === 'mr' ? 'नळ' : uiLang === 'hi' ? 'पानी का नल' : 'Water Tap', isCorrect: true },
            { text: uiLang === 'mr' ? 'दरवाजा' : uiLang === 'hi' ? 'दरवाज़ा' : 'Door', isCorrect: false },
            { text: uiLang === 'mr' ? 'खिडकी' : uiLang === 'hi' ? 'खिड़की' : 'Window', isCorrect: false },
            { text: uiLang === 'mr' ? 'भिंत' : uiLang === 'hi' ? 'दीवार' : 'Wall', isCorrect: false },
          ],
        },
        {
          id: 'q3_4',
          type: 'duolingo_trace',
          instruction: getInst('traceLetter'),
          char: 'म',
          phonetic: 'ma',
        },
        {
          id: 'q3_5',
          type: 'match_pairs',
          instruction: getInst('matchWords'),
          pairs: [
            { left: tapWord, right: '🚰' },
            { left: fruitWord, right: '🍌' },
            { left: waterWord, right: '💧' },
            { left: mindWord, right: '🧠' },
          ],
        },
        {
          id: 'q3_6',
          type: 'scramble',
          instruction: getInst('buildSentence'),
          promptText: uiLang === 'mr' ? 'नळ चालू करा' : uiLang === 'hi' ? 'नल चालू करो' : 'Turn on the tap',
          tokens: targetLang === 'mr' ? ['नळ', 'चालू', 'करा'] : targetLang === 'hi' ? ['नल', 'चालू', 'करो'] : ['Turn', 'on', 'the', 'tap'],
          correctSentence: targetLang === 'mr' ? 'नळ चालू करा' : targetLang === 'hi' ? 'नल चालू करो' : 'Turn on the tap',
        },
        {
          id: 'q3_7',
          type: 'pronunciation',
          instruction: getInst('speakWord'),
          targetWord: tapWord,
          translit: 'Nal',
          hint: tapWord,
          icon: '🚰',
        },
        {
          id: 'q3_8',
          type: 'listening_mcq',
          instruction: getInst('listenPhrase'),
          audioPrompt: fruitWord,
          options: [
            { text: fruitWord, isCorrect: true },
            { text: tapWord, isCorrect: false },
            { text: waterWord, isCorrect: false },
            { text: mindWord, isCorrect: false },
          ],
        },
        {
          id: 'q3_9',
          type: 'fill_blank',
          instruction: getInst('fillBlank'),
          sentenceParts: targetLang === 'mr' ? ['रोज ताजे ', ' खावे.'] : targetLang === 'hi' ? ['रोज ताज़ा ', ' खाना चाहिए।'] : ['Eat fresh ', ' daily.'],
          options: [
            { text: fruitWord, isCorrect: true },
            { text: tapWord, isCorrect: false },
            { text: mindWord, isCorrect: false },
          ],
        },
        {
          id: 'q3_10',
          type: 'multiple_choice',
          instruction: getInst('masteryChallenge'),
          questionText: waterWord,
          audioPrompt: waterWord,
          options: [
            { text: waterWord, isCorrect: true },
            { text: fruitWord, isCorrect: false },
            { text: tapWord, isCorrect: false },
            { text: mindWord, isCorrect: false },
          ],
        },
      ];
    } else if (lvlId === 4) {
      // LEVEL 4: MARKET & FOOD (पाणी, दूध, भाकरी/रोटी, चहा)
      const paani = targetLang === 'mr' ? 'पाणी' : 'पानी';
      const doodh = 'दूध';
      const roti = targetLang === 'mr' ? 'भाकरी' : 'रोटी';
      const chaha = targetLang === 'mr' ? 'चहा' : 'चाय';

      questions = [
        {
          id: 'q4_1',
          type: 'multiple_choice',
          instruction: getInst('listenLetter'),
          audioPrompt: paani,
          options: [
            { text: paani, isCorrect: true },
            { text: doodh, isCorrect: false },
            { text: roti, isCorrect: false },
            { text: chaha, isCorrect: false },
          ],
        },
        {
          id: 'q4_2',
          type: 'multiple_choice',
          instruction: getInst('lookImage'),
          imageHint: '🥛',
          audioPrompt: doodh,
          options: [
            { text: doodh, isCorrect: true },
            { text: paani, isCorrect: false },
            { text: roti, isCorrect: false },
            { text: chaha, isCorrect: false },
          ],
        },
        {
          id: 'q4_3',
          type: 'multiple_choice',
          instruction: getInst('wordMeaning'),
          questionText: roti,
          audioPrompt: roti,
          options: [
            { text: uiLang === 'mr' ? 'भाकरी किंवा पोळी' : uiLang === 'hi' ? 'रोटी' : 'Flatbread / Meal', isCorrect: true },
            { text: uiLang === 'mr' ? 'तेल' : uiLang === 'hi' ? 'तेल' : 'Oil', isCorrect: false },
            { text: uiLang === 'mr' ? 'साखर' : uiLang === 'hi' ? 'चीनी' : 'Sugar', isCorrect: false },
            { text: uiLang === 'mr' ? 'मीठ' : uiLang === 'hi' ? 'नमक' : 'Salt', isCorrect: false },
          ],
        },
        {
          id: 'q4_4',
          type: 'duolingo_trace',
          instruction: getInst('traceLetter'),
          char: 'प',
          phonetic: 'pa',
        },
        {
          id: 'q4_5',
          type: 'match_pairs',
          instruction: getInst('matchWords'),
          pairs: [
            { left: paani, right: uiLang === 'mr' ? 'पाणी 💧' : uiLang === 'hi' ? 'पानी 💧' : 'Water 💧' },
            { left: doodh, right: uiLang === 'mr' ? 'दूध 🥛' : uiLang === 'hi' ? 'दूध 🥛' : 'Milk 🥛' },
            { left: roti, right: uiLang === 'mr' ? 'भाकरी 🫓' : uiLang === 'hi' ? 'रोटी 🫓' : 'Bread 🫓' },
            { left: chaha, right: uiLang === 'mr' ? 'चहा ☕' : uiLang === 'hi' ? 'चाय ☕' : 'Tea ☕' },
          ],
        },
        {
          id: 'q4_6',
          type: 'scramble',
          instruction: getInst('buildSentence'),
          promptText: uiLang === 'mr' ? 'मला एक ग्लास पाणी द्या' : uiLang === 'hi' ? 'मुझे एक गिलास पानी दो' : 'Give me a glass of water',
          tokens: targetLang === 'mr' ? ['मला', 'पाणी', 'द्या'] : targetLang === 'hi' ? ['मुझे', 'पानी', 'दो'] : ['Give', 'me', 'water'],
          correctSentence: targetLang === 'mr' ? 'मला पाणी द्या' : targetLang === 'hi' ? 'मुझे पानी दो' : 'Give me water',
        },
        {
          id: 'q4_7',
          type: 'pronunciation',
          instruction: getInst('speakWord'),
          targetWord: paani,
          translit: 'Paani',
          hint: paani,
          icon: '💧',
        },
        {
          id: 'q4_8',
          type: 'listening_mcq',
          instruction: getInst('listenPhrase'),
          audioPrompt: chaha,
          options: [
            { text: chaha, isCorrect: true },
            { text: paani, isCorrect: false },
            { text: doodh, isCorrect: false },
            { text: roti, isCorrect: false },
          ],
        },
        {
          id: 'q4_9',
          type: 'fill_blank',
          instruction: getInst('fillBlank'),
          sentenceParts: targetLang === 'mr' ? ['सकाळी गरम ', ' प्यावे.'] : targetLang === 'hi' ? ['सुबह गर्म ', ' पिएं।'] : ['Drink warm ', ' in morning.'],
          options: [
            { text: doodh, isCorrect: true },
            { text: roti, isCorrect: false },
            { text: paani, isCorrect: false },
          ],
        },
        {
          id: 'q4_10',
          type: 'multiple_choice',
          instruction: getInst('masteryChallenge'),
          questionText: doodh,
          audioPrompt: doodh,
          options: [
            { text: doodh, isCorrect: true },
            { text: chaha, isCorrect: false },
            { text: roti, isCorrect: false },
            { text: paani, isCorrect: false },
          ],
        },
      ];
    } else if (lvlId === 5) {
      // LEVEL 5: FAMILY & HOME (आई/माँ, बाबा/पिता, भाऊ/भाई, बहीण/बहन)
      const aai = targetLang === 'mr' ? 'आई' : 'माँ';
      const baba = targetLang === 'mr' ? 'बाबा' : 'पिता';
      const bhau = targetLang === 'mr' ? 'भाऊ' : 'भाई';
      const bahin = targetLang === 'mr' ? 'बहीण' : 'बहन';

      questions = [
        {
          id: 'q5_1',
          type: 'multiple_choice',
          instruction: getInst('listenLetter'),
          audioPrompt: aai,
          options: [
            { text: aai, isCorrect: true },
            { text: baba, isCorrect: false },
            { text: bhau, isCorrect: false },
            { text: bahin, isCorrect: false },
          ],
        },
        {
          id: 'q5_2',
          type: 'multiple_choice',
          instruction: getInst('lookImage'),
          imageHint: '👩',
          audioPrompt: aai,
          options: [
            { text: aai, isCorrect: true },
            { text: baba, isCorrect: false },
            { text: bhau, isCorrect: false },
            { text: bahin, isCorrect: false },
          ],
        },
        {
          id: 'q5_3',
          type: 'multiple_choice',
          instruction: getInst('wordMeaning'),
          questionText: bahin,
          audioPrompt: bahin,
          options: [
            { text: uiLang === 'mr' ? 'बहीण' : uiLang === 'hi' ? 'बहन' : 'Sister', isCorrect: true },
            { text: uiLang === 'mr' ? 'भाऊ' : uiLang === 'hi' ? 'भाई' : 'Brother', isCorrect: false },
            { text: uiLang === 'mr' ? 'मित्र' : uiLang === 'hi' ? 'दोस्त' : 'Friend', isCorrect: false },
            { text: uiLang === 'mr' ? 'काका' : uiLang === 'hi' ? 'चाचा' : 'Uncle', isCorrect: false },
          ],
        },
        {
          id: 'q5_4',
          type: 'duolingo_trace',
          instruction: getInst('traceLetter'),
          char: 'स',
          phonetic: 'sa',
        },
        {
          id: 'q5_5',
          type: 'match_pairs',
          instruction: getInst('matchWords'),
          pairs: [
            { left: aai, right: uiLang === 'mr' ? 'आई (Mother)' : uiLang === 'hi' ? 'माताजी' : 'Mother' },
            { left: baba, right: uiLang === 'mr' ? 'बाबा (Father)' : uiLang === 'hi' ? 'पिताजी' : 'Father' },
            { left: bhau, right: uiLang === 'mr' ? 'भाऊ (Brother)' : uiLang === 'hi' ? 'भाई' : 'Brother' },
            { left: bahin, right: uiLang === 'mr' ? 'बहीण (Sister)' : uiLang === 'hi' ? 'बहन' : 'Sister' },
          ],
        },
        {
          id: 'q5_6',
          type: 'scramble',
          instruction: getInst('buildSentence'),
          promptText: uiLang === 'mr' ? 'आई जेवण बनवते' : uiLang === 'hi' ? 'माँ खाना बनाती है' : 'Mother cooks meal',
          tokens: targetLang === 'mr' ? ['आई', 'जेवण', 'बनवते'] : targetLang === 'hi' ? ['माँ', 'खाना', 'बनाती'] : ['Mother', 'cooks', 'food'],
          correctSentence: targetLang === 'mr' ? 'आई जेवण बनवते' : targetLang === 'hi' ? 'माँ खाना बनाती' : 'Mother cooks food',
        },
        {
          id: 'q5_7',
          type: 'pronunciation',
          instruction: getInst('speakWord'),
          targetWord: aai,
          translit: 'Aai',
          hint: aai,
          icon: '👩',
        },
        {
          id: 'q5_8',
          type: 'listening_mcq',
          instruction: getInst('listenPhrase'),
          audioPrompt: baba,
          options: [
            { text: baba, isCorrect: true },
            { text: aai, isCorrect: false },
            { text: bhau, isCorrect: false },
            { text: bahin, isCorrect: false },
          ],
        },
        {
          id: 'q5_9',
          type: 'fill_blank',
          instruction: getInst('fillBlank'),
          sentenceParts: targetLang === 'mr' ? ['माझा ', ' शाळेत जातो.'] : targetLang === 'hi' ? ['मेरा ', ' स्कूल जाता है।'] : ['My ', ' goes to school.'],
          options: [
            { text: bhau, isCorrect: true },
            { text: aai, isCorrect: false },
            { text: bahin, isCorrect: false },
          ],
        },
        {
          id: 'q5_10',
          type: 'multiple_choice',
          instruction: getInst('masteryChallenge'),
          questionText: bahin,
          audioPrompt: bahin,
          options: [
            { text: bahin, isCorrect: true },
            { text: aai, isCorrect: false },
            { text: baba, isCorrect: false },
            { text: bhau, isCorrect: false },
          ],
        },
      ];
    } else if (lvlId === 6) {
      // LEVEL 6: NUMBERS & TIME (एक, दोन, पाच, दहा)
      const n1 = targetLang === 'mr' ? 'एक' : 'एक';
      const n2 = targetLang === 'mr' ? 'दोन' : 'दो';
      const n5 = targetLang === 'mr' ? 'पाच' : 'पाँच';
      const n10 = targetLang === 'mr' ? 'दहा' : 'दस';

      questions = [
        {
          id: 'q6_1',
          type: 'multiple_choice',
          instruction: getInst('listenLetter'),
          audioPrompt: n5,
          options: [
            { text: n5, isCorrect: true },
            { text: n1, isCorrect: false },
            { text: n2, isCorrect: false },
            { text: n10, isCorrect: false },
          ],
        },
        {
          id: 'q6_2',
          type: 'multiple_choice',
          instruction: getInst('lookImage'),
          imageHint: '🔟',
          audioPrompt: n10,
          options: [
            { text: n10, isCorrect: true },
            { text: n1, isCorrect: false },
            { text: n2, isCorrect: false },
            { text: n5, isCorrect: false },
          ],
        },
        {
          id: 'q6_3',
          type: 'multiple_choice',
          instruction: getInst('wordMeaning'),
          questionText: n2,
          audioPrompt: n2,
          options: [
            { text: uiLang === 'mr' ? 'दोन (संख्या २)' : uiLang === 'hi' ? 'दो (२)' : 'Two (2)', isCorrect: true },
            { text: uiLang === 'mr' ? 'एक' : uiLang === 'hi' ? 'एक' : 'One (1)', isCorrect: false },
            { text: uiLang === 'mr' ? 'तीन' : uiLang === 'hi' ? 'तीन' : 'Three (3)', isCorrect: false },
            { text: uiLang === 'mr' ? 'चार' : uiLang === 'hi' ? 'चार' : 'Four (4)', isCorrect: false },
          ],
        },
        {
          id: 'q6_4',
          type: 'duolingo_trace',
          instruction: getInst('traceLetter'),
          char: 'त',
          phonetic: 'ta',
        },
        {
          id: 'q6_5',
          type: 'match_pairs',
          instruction: getInst('matchWords'),
          pairs: [
            { left: n1, right: '1️⃣' },
            { left: n2, right: '2️⃣' },
            { left: n5, right: '5️⃣' },
            { left: n10, right: '🔟' },
          ],
        },
        {
          id: 'q6_6',
          type: 'scramble',
          instruction: getInst('buildSentence'),
          promptText: uiLang === 'mr' ? 'आता पाच वाजले' : uiLang === 'hi' ? 'अभी पांच बजे हैं' : 'It is five o clock',
          tokens: targetLang === 'mr' ? ['आता', 'पाच', 'वाजले'] : targetLang === 'hi' ? ['अभी', 'पांच', 'बजे'] : ['It', 'is', 'five'],
          correctSentence: targetLang === 'mr' ? 'आता पाच वाजले' : targetLang === 'hi' ? 'अभी पांच बजे' : 'It is five',
        },
        {
          id: 'q6_7',
          type: 'pronunciation',
          instruction: getInst('speakWord'),
          targetWord: n10,
          translit: 'Daha',
          hint: n10,
          icon: '🔟',
        },
        {
          id: 'q6_8',
          type: 'listening_mcq',
          instruction: getInst('listenPhrase'),
          audioPrompt: n1,
          options: [
            { text: n1, isCorrect: true },
            { text: n2, isCorrect: false },
            { text: n5, isCorrect: false },
            { text: n10, isCorrect: false },
          ],
        },
        {
          id: 'q6_9',
          type: 'fill_blank',
          instruction: getInst('fillBlank'),
          sentenceParts: targetLang === 'mr' ? ['आठवड्यात सात ', ' असतात.'] : targetLang === 'hi' ? ['सप्ताह में सात ', ' होते हैं।'] : ['Seven ', ' in a week.'],
          options: [
            { text: targetLang === 'mr' ? 'दिवस' : 'दिन', isCorrect: true },
            { text: targetLang === 'mr' ? 'तास' : 'घंटे', isCorrect: false },
            { text: targetLang === 'mr' ? 'महिने' : 'महीने', isCorrect: false },
          ],
        },
        {
          id: 'q6_10',
          type: 'multiple_choice',
          instruction: getInst('masteryChallenge'),
          questionText: n5,
          audioPrompt: n5,
          options: [
            { text: n5, isCorrect: true },
            { text: n1, isCorrect: false },
            { text: n2, isCorrect: false },
            { text: n10, isCorrect: false },
          ],
        },
      ];
    } else if (lvlId === 7) {
      // LEVEL 7: TRAVEL & BUS (बस, तिकीट, रस्ता, थांबा)
      const bus = 'बस';
      const ticket = targetLang === 'mr' ? 'तिकीट' : 'टिकट';
      const rasta = targetLang === 'mr' ? 'रस्ता' : 'सड़क';
      const thamba = targetLang === 'mr' ? 'थांबा' : 'रुकिए';

      questions = [
        {
          id: 'q7_1',
          type: 'multiple_choice',
          instruction: getInst('listenLetter'),
          audioPrompt: ticket,
          options: [
            { text: ticket, isCorrect: true },
            { text: bus, isCorrect: false },
            { text: rasta, isCorrect: false },
            { text: thamba, isCorrect: false },
          ],
        },
        {
          id: 'q7_2',
          type: 'multiple_choice',
          instruction: getInst('lookImage'),
          imageHint: '🎫',
          audioPrompt: ticket,
          options: [
            { text: ticket, isCorrect: true },
            { text: bus, isCorrect: false },
            { text: rasta, isCorrect: false },
            { text: thamba, isCorrect: false },
          ],
        },
        {
          id: 'q7_3',
          type: 'multiple_choice',
          instruction: getInst('wordMeaning'),
          questionText: thamba,
          audioPrompt: thamba,
          options: [
            { text: uiLang === 'mr' ? 'थांबा किंवा थांबा चिन्ह' : uiLang === 'hi' ? 'रुकिए / स्टॉप' : 'Stop sign', isCorrect: true },
            { text: uiLang === 'mr' ? 'वेगाने चला' : uiLang === 'hi' ? 'तेज़ चलो' : 'Go fast', isCorrect: false },
            { text: uiLang === 'mr' ? 'तिकीट' : uiLang === 'hi' ? 'टिकट' : 'Ticket', isCorrect: false },
            { text: uiLang === 'mr' ? 'पैसे' : uiLang === 'hi' ? 'पैसे' : 'Money', isCorrect: false },
          ],
        },
        {
          id: 'q7_4',
          type: 'duolingo_trace',
          instruction: getInst('traceLetter'),
          char: 'ब',
          phonetic: 'ba',
        },
        {
          id: 'q7_5',
          type: 'match_pairs',
          instruction: getInst('matchWords'),
          pairs: [
            { left: bus, right: '🚌' },
            { left: ticket, right: '🎫' },
            { left: rasta, right: '🛣️' },
            { left: thamba, right: '🛑' },
          ],
        },
        {
          id: 'q7_6',
          type: 'scramble',
          instruction: getInst('buildSentence'),
          promptText: uiLang === 'mr' ? 'बस वेळेवर आली' : uiLang === 'hi' ? 'बस समय पर आई' : 'Bus arrived on time',
          tokens: targetLang === 'mr' ? ['बस', 'वेळेवर', 'आली'] : targetLang === 'hi' ? ['बस', 'समय', 'पर', 'आई'] : ['Bus', 'arrived', 'on', 'time'],
          correctSentence: targetLang === 'mr' ? 'बस वेळेवर आली' : targetLang === 'hi' ? 'बस समय पर आई' : 'Bus arrived on time',
        },
        {
          id: 'q7_7',
          type: 'pronunciation',
          instruction: getInst('speakWord'),
          targetWord: bus,
          translit: 'Bus',
          hint: bus,
          icon: '🚌',
        },
        {
          id: 'q7_8',
          type: 'listening_mcq',
          instruction: getInst('listenPhrase'),
          audioPrompt: rasta,
          options: [
            { text: rasta, isCorrect: true },
            { text: bus, isCorrect: false },
            { text: ticket, isCorrect: false },
            { text: thamba, isCorrect: false },
          ],
        },
        {
          id: 'q7_9',
          type: 'fill_blank',
          instruction: getInst('fillBlank'),
          sentenceParts: targetLang === 'mr' ? ['प्रवासासाठी ', ' आवश्यक आहे.'] : targetLang === 'hi' ? ['यात्रा के लिए ', ' ज़रूरी है।'] : ['Need a ', ' to travel.'],
          options: [
            { text: ticket, isCorrect: true },
            { text: bus, isCorrect: false },
            { text: thamba, isCorrect: false },
          ],
        },
        {
          id: 'q7_10',
          type: 'multiple_choice',
          instruction: getInst('masteryChallenge'),
          questionText: ticket,
          audioPrompt: ticket,
          options: [
            { text: ticket, isCorrect: true },
            { text: bus, isCorrect: false },
            { text: rasta, isCorrect: false },
            { text: thamba, isCorrect: false },
          ],
        },
      ];
    } else if (lvlId === 8) {
      // LEVEL 8: HEALTH & CLINIC (दवाखाना/अस्पताल, औषध/दवा, डॉक्टर, मदत)
      const clinic = targetLang === 'mr' ? 'दवाखाना' : 'अस्पताल';
      const med = targetLang === 'mr' ? 'औषध' : 'दवा';
      const doc = 'डॉक्टर';
      const help = targetLang === 'mr' ? 'मदत' : 'मदद';

      questions = [
        {
          id: 'q8_1',
          type: 'multiple_choice',
          instruction: getInst('listenLetter'),
          audioPrompt: med,
          options: [
            { text: med, isCorrect: true },
            { text: clinic, isCorrect: false },
            { text: doc, isCorrect: false },
            { text: help, isCorrect: false },
          ],
        },
        {
          id: 'q8_2',
          type: 'multiple_choice',
          instruction: getInst('lookImage'),
          imageHint: '🏥',
          audioPrompt: clinic,
          options: [
            { text: clinic, isCorrect: true },
            { text: med, isCorrect: false },
            { text: doc, isCorrect: false },
            { text: help, isCorrect: false },
          ],
        },
        {
          id: 'q8_3',
          type: 'multiple_choice',
          instruction: getInst('wordMeaning'),
          questionText: help,
          audioPrompt: help,
          options: [
            { text: uiLang === 'mr' ? 'मदत किंवा साहाय्य' : uiLang === 'hi' ? 'मदद / सहायता' : 'Help / Assistance', isCorrect: true },
            { text: uiLang === 'mr' ? 'दुकान' : uiLang === 'hi' ? 'दुकान' : 'Shop', isCorrect: false },
            { text: uiLang === 'mr' ? 'पैसा' : uiLang === 'hi' ? 'पैसा' : 'Money', isCorrect: false },
            { text: uiLang === 'mr' ? 'घर' : uiLang === 'hi' ? 'घर' : 'House', isCorrect: false },
          ],
        },
        {
          id: 'q8_4',
          type: 'duolingo_trace',
          instruction: getInst('traceLetter'),
          char: 'द',
          phonetic: 'da',
        },
        {
          id: 'q8_5',
          type: 'match_pairs',
          instruction: getInst('matchWords'),
          pairs: [
            { left: clinic, right: '🏥' },
            { left: med, right: '💊' },
            { left: doc, right: '🩺' },
            { left: help, right: '🆘' },
          ],
        },
        {
          id: 'q8_6',
          type: 'scramble',
          instruction: getInst('buildSentence'),
          promptText: uiLang === 'mr' ? 'औषध वेळेवर घ्या' : uiLang === 'hi' ? 'दवा समय पर लें' : 'Take medicine on time',
          tokens: targetLang === 'mr' ? ['औषध', 'वेळेवर', 'घ्या'] : targetLang === 'hi' ? ['दवा', 'समय', 'पर', 'लें'] : ['Take', 'medicine', 'on', 'time'],
          correctSentence: targetLang === 'mr' ? 'औषध वेळेवर घ्या' : targetLang === 'hi' ? 'दवा समय पर लें' : 'Take medicine on time',
        },
        {
          id: 'q8_7',
          type: 'pronunciation',
          instruction: getInst('speakWord'),
          targetWord: med,
          translit: 'Aushadh',
          hint: med,
          icon: '💊',
        },
        {
          id: 'q8_8',
          type: 'listening_mcq',
          instruction: getInst('listenPhrase'),
          audioPrompt: doc,
          options: [
            { text: doc, isCorrect: true },
            { text: clinic, isCorrect: false },
            { text: med, isCorrect: false },
            { text: help, isCorrect: false },
          ],
        },
        {
          id: 'q8_9',
          type: 'fill_blank',
          instruction: getInst('fillBlank'),
          sentenceParts: targetLang === 'mr' ? ['आजारी पडल्यावर ', ' कडे जावे.'] : targetLang === 'hi' ? ['बीमार होने पर ', ' के पास जाएं।'] : ['Visit the ', ' when unwell.'],
          options: [
            { text: doc, isCorrect: true },
            { text: help, isCorrect: false },
            { text: med, isCorrect: false },
          ],
        },
        {
          id: 'q8_10',
          type: 'multiple_choice',
          instruction: getInst('masteryChallenge'),
          questionText: clinic,
          audioPrompt: clinic,
          options: [
            { text: clinic, isCorrect: true },
            { text: med, isCorrect: false },
            { text: doc, isCorrect: false },
            { text: help, isCorrect: false },
          ],
        },
      ];
    } else if (lvlId === 9) {
      // LEVEL 9: BANK & WORKPLACE (बँक, खाते/खाता, पैसे, सही/दस्तख़त)
      const bank = 'बँक';
      const khate = targetLang === 'mr' ? 'खाते' : 'खाता';
      const paise = 'पैसे';
      const sahi = targetLang === 'mr' ? 'सही' : 'हस्ताक्षर';

      questions = [
        {
          id: 'q9_1',
          type: 'multiple_choice',
          instruction: getInst('listenLetter'),
          audioPrompt: bank,
          options: [
            { text: bank, isCorrect: true },
            { text: khate, isCorrect: false },
            { text: paise, isCorrect: false },
            { text: sahi, isCorrect: false },
          ],
        },
        {
          id: 'q9_2',
          type: 'multiple_choice',
          instruction: getInst('lookImage'),
          imageHint: '🏦',
          audioPrompt: bank,
          options: [
            { text: bank, isCorrect: true },
            { text: khate, isCorrect: false },
            { text: paise, isCorrect: false },
            { text: sahi, isCorrect: false },
          ],
        },
        {
          id: 'q9_3',
          type: 'multiple_choice',
          instruction: getInst('wordMeaning'),
          questionText: sahi,
          audioPrompt: sahi,
          options: [
            { text: uiLang === 'mr' ? 'स्वाक्षरी / सही' : uiLang === 'hi' ? 'हस्ताक्षर / दस्तख़त' : 'Signature', isCorrect: true },
            { text: uiLang === 'mr' ? 'पावती' : uiLang === 'hi' ? 'रसीद' : 'Receipt', isCorrect: false },
            { text: uiLang === 'mr' ? 'पैसे' : uiLang === 'hi' ? 'पैसे' : 'Money', isCorrect: false },
            { text: uiLang === 'mr' ? 'तारीख' : uiLang === 'hi' ? 'दिनांक' : 'Date', isCorrect: false },
          ],
        },
        {
          id: 'q9_4',
          type: 'duolingo_trace',
          instruction: getInst('traceLetter'),
          char: 'न',
          phonetic: 'na',
        },
        {
          id: 'q9_5',
          type: 'match_pairs',
          instruction: getInst('matchWords'),
          pairs: [
            { left: bank, right: '🏦' },
            { left: khate, right: '📁' },
            { left: paise, right: '💵' },
            { left: sahi, right: '✍️' },
          ],
        },
        {
          id: 'q9_6',
          type: 'scramble',
          instruction: getInst('buildSentence'),
          promptText: uiLang === 'mr' ? 'येथे आपली सही करा' : uiLang === 'hi' ? 'यहाँ अपना हस्ताक्षर करें' : 'Sign here',
          tokens: targetLang === 'mr' ? ['येथे', 'आपली', 'सही', 'करा'] : targetLang === 'hi' ? ['यहाँ', 'हस्ताक्षर', 'करें'] : ['Sign', 'your', 'name', 'here'],
          correctSentence: targetLang === 'mr' ? 'येथे आपली सही करा' : targetLang === 'hi' ? 'यहाँ हस्ताक्षर करें' : 'Sign your name here',
        },
        {
          id: 'q9_7',
          type: 'pronunciation',
          instruction: getInst('speakWord'),
          targetWord: bank,
          translit: 'Bank',
          hint: bank,
          icon: '🏦',
        },
        {
          id: 'q9_8',
          type: 'listening_mcq',
          instruction: getInst('listenPhrase'),
          audioPrompt: paise,
          options: [
            { text: paise, isCorrect: true },
            { text: bank, isCorrect: false },
            { text: khate, isCorrect: false },
            { text: sahi, isCorrect: false },
          ],
        },
        {
          id: 'q9_9',
          type: 'fill_blank',
          instruction: getInst('fillBlank'),
          sentenceParts: targetLang === 'mr' ? ['बँकेत पैसे भरण्यासाठी ', ' भरावी.'] : targetLang === 'hi' ? ['पैसे जमा करने हेतु ', ' भरें।'] : ['Fill the deposit ', ' at the bank.'],
          options: [
            { text: targetLang === 'mr' ? 'पावती' : 'पर्ची', isCorrect: true },
            { text: targetLang === 'mr' ? 'पेन्सिल' : 'कलम', isCorrect: false },
            { text: targetLang === 'mr' ? 'तिकीट' : 'टिकट', isCorrect: false },
          ],
        },
        {
          id: 'q9_10',
          type: 'multiple_choice',
          instruction: getInst('masteryChallenge'),
          questionText: sahi,
          audioPrompt: sahi,
          options: [
            { text: sahi, isCorrect: true },
            { text: bank, isCorrect: false },
            { text: khate, isCorrect: false },
            { text: paise, isCorrect: false },
          ],
        },
      ];
    } else {
      // LEVEL 10: CIVIC NOTICES & GRADUATION (सूचना, वाचनालय, नागरिक, प्रमाणपत्र)
      const suchana = targetLang === 'mr' ? 'सूचना' : 'सूचना';
      const vachanalay = targetLang === 'mr' ? 'वाचनालय' : 'पुस्तकालय';
      const nagarik = 'नागरिक';
      const pramanpatra = 'प्रमाणपत्र';

      questions = [
        {
          id: 'q10_1',
          type: 'multiple_choice',
          instruction: getInst('listenLetter'),
          audioPrompt: nagarik,
          options: [
            { text: nagarik, isCorrect: true },
            { text: suchana, isCorrect: false },
            { text: vachanalay, isCorrect: false },
            { text: pramanpatra, isCorrect: false },
          ],
        },
        {
          id: 'q10_2',
          type: 'multiple_choice',
          instruction: getInst('lookImage'),
          imageHint: '📜',
          audioPrompt: pramanpatra,
          options: [
            { text: pramanpatra, isCorrect: true },
            { text: suchana, isCorrect: false },
            { text: vachanalay, isCorrect: false },
            { text: nagarik, isCorrect: false },
          ],
        },
        {
          id: 'q10_3',
          type: 'multiple_choice',
          instruction: getInst('wordMeaning'),
          questionText: vachanalay,
          audioPrompt: vachanalay,
          options: [
            { text: uiLang === 'mr' ? 'पुस्तकालय / वाचनालय' : uiLang === 'hi' ? 'पुस्तकालय' : 'Public Library', isCorrect: true },
            { text: uiLang === 'mr' ? 'कार्यालय' : uiLang === 'hi' ? 'दफ़्तर' : 'Office', isCorrect: false },
            { text: uiLang === 'mr' ? 'बाजार' : uiLang === 'hi' ? 'बाज़ार' : 'Market', isCorrect: false },
            { text: uiLang === 'mr' ? 'स्टेशन' : uiLang === 'hi' ? 'स्टेशन' : 'Station', isCorrect: false },
          ],
        },
        {
          id: 'q10_4',
          type: 'duolingo_trace',
          instruction: getInst('traceLetter'),
          char: 'ल',
          phonetic: 'la',
        },
        {
          id: 'q10_5',
          type: 'match_pairs',
          instruction: getInst('matchWords'),
          pairs: [
            { left: suchana, right: '📢' },
            { left: vachanalay, right: '📚' },
            { left: nagarik, right: '🇮🇳' },
            { left: pramanpatra, right: '📜' },
          ],
        },
        {
          id: 'q10_6',
          type: 'scramble',
          instruction: getInst('buildSentence'),
          promptText: uiLang === 'mr' ? 'मी आता साक्षर नागरिक आहे' : uiLang === 'hi' ? 'मैं अब साक्षर नागरिक हूँ' : 'I am now a literate citizen',
          tokens: targetLang === 'mr' ? ['मी', 'साक्षर', 'नागरिक', 'आहे'] : targetLang === 'hi' ? ['मैं', 'साक्षर', 'नागरिक', 'हूँ'] : ['I', 'am', 'literate', 'now'],
          correctSentence: targetLang === 'mr' ? 'मी साक्षर नागरिक आहे' : targetLang === 'hi' ? 'मैं साक्षर नागरिक हूँ' : 'I am literate now',
        },
        {
          id: 'q10_7',
          type: 'pronunciation',
          instruction: getInst('speakWord'),
          targetWord: nagarik,
          translit: 'Nagarik',
          hint: nagarik,
          icon: '🇮🇳',
        },
        {
          id: 'q10_8',
          type: 'listening_mcq',
          instruction: getInst('listenPhrase'),
          audioPrompt: suchana,
          options: [
            { text: suchana, isCorrect: true },
            { text: nagarik, isCorrect: false },
            { text: vachanalay, isCorrect: false },
            { text: pramanpatra, isCorrect: false },
          ],
        },
        {
          id: 'q10_9',
          type: 'fill_blank',
          instruction: getInst('fillBlank'),
          sentenceParts: targetLang === 'mr' ? ['वाचनालयात अनेक उत्तम पुस्तके ', '.'] : targetLang === 'hi' ? ['पुस्तकालय में कई अच्छी पुस्तकें ', '।'] : ['Many good books ', ' in library.'],
          options: [
            { text: targetLang === 'mr' ? 'आहेत' : 'हैं', isCorrect: true },
            { text: targetLang === 'mr' ? 'नाहीत' : 'नहीं', isCorrect: false },
            { text: targetLang === 'mr' ? 'पाणी' : 'पानी', isCorrect: false },
          ],
        },
        {
          id: 'q10_10',
          type: 'multiple_choice',
          instruction: getInst('masteryChallenge'),
          questionText: pramanpatra,
          audioPrompt: pramanpatra,
          options: [
            { text: pramanpatra, isCorrect: true },
            { text: suchana, isCorrect: false },
            { text: vachanalay, isCorrect: false },
            { text: nagarik, isCorrect: false },
          ],
        },
      ];
    }

    return {
      levelId: lvlId,
      stageId,
      title,
      description,
      xpReward: 20 + lvlId * 5,
      questions,
    };
  });
}

export const getCurriculumForUser = getCurriculumForLanguage;
