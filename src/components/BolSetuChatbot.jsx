import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Volume2,
  Sparkles,
  Bot,
  User,
  HelpCircle,
  RotateCcw,
  Globe,
  ArrowRight,
} from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';
import { UI_TRANSLATIONS, getLocalizedLanguageName } from '../data/uiTranslations';

// Comprehensive multilingual dictionary covering common neo-learner concepts across all 6 supported languages
const CHATBOT_KNOWLEDGE_BASE = {
  // Greetings
  hello: {
    en: { text: 'Hello / Welcome', translit: 'Hello' },
    hi: { text: 'नमस्ते / प्रणाम', translit: 'Namaste' },
    mr: { text: 'नमस्कार', translit: 'Namaskar' },
    ta: { text: 'வணக்கம்', translit: 'Vanakkam' },
    te: { text: 'నమస్కారం', translit: 'Namaskaram' },
    bn: { text: 'নমস্কার / সালাম', translit: 'Nomoshkar' },
  },
  how_are_you: {
    en: { text: 'How are you?', translit: 'How are you?' },
    hi: { text: 'आप कैसे हैं?', translit: 'Aap kaise hain?' },
    mr: { text: 'तुम्ही कसे आहात?', translit: 'Tumhi kase aahat?' },
    ta: { text: 'நீங்கள் எப்படி இருக்கிறீர்கள்?', translit: 'Neengal eppadi irukkireergal?' },
    te: { text: 'మీరు ఎలా ఉన్నారు?', translit: 'Meeru ela unnaaru?' },
    bn: { text: 'আপনি কেমন আছেন?', translit: 'Apni kemon achhen?' },
  },
  thank_you: {
    en: { text: 'Thank you', translit: 'Thank you' },
    hi: { text: 'धन्यवाद / शुक्रिया', translit: 'Dhanyavaad' },
    mr: { text: 'धन्यवाद / आभारी आहे', translit: 'Dhanyavaad' },
    ta: { text: 'நன்றி', translit: 'Nandri' },
    te: { text: 'ధన్యవాదాలు', translit: 'Dhanyavaadaalu' },
    bn: { text: 'ধন্যবাদ', translit: 'Dhonnobaad' },
  },
  goodbye: {
    en: { text: 'Goodbye / See you', translit: 'Goodbye' },
    hi: { text: 'फिर मिलेंगे / अलविदा', translit: 'Phir milenge' },
    mr: { text: 'पुन्हा भेटू / निरोप', translit: 'Puna bhetu' },
    ta: { text: 'போய் வருகிறேன்', translit: 'Poi varugiren' },
    te: { text: 'మళ్ళీ కలుద్దాం', translit: 'Malli kaluddaam' },
    bn: { text: 'আবার দেখা হবে', translit: 'Abar dekha hobe' },
  },

  // Daily Essentials
  water: {
    en: { text: 'Water', translit: 'Water' },
    hi: { text: 'पानी', translit: 'Paani' },
    mr: { text: 'पाणी', translit: 'Paani' },
    ta: { text: 'தண்ணீர்', translit: 'Thanneer' },
    te: { text: 'నీరు / మంచి నీళ్ళు', translit: 'Neeru' },
    bn: { text: 'জল / পানি', translit: 'Jol' },
  },
  food: {
    en: { text: 'Food / Meal', translit: 'Food' },
    hi: { text: 'खाना / भोजन', translit: 'Khaana' },
    mr: { text: 'जेवण / अन्न', translit: 'Jevan' },
    ta: { text: 'உணவு / சாப்பாடு', translit: 'Unavu' },
    te: { text: 'ఆహారం / భోజనం', translit: 'Aahaaram' },
    bn: { text: 'খাবার / ভাত', translit: 'Khabar' },
  },
  tea: {
    en: { text: 'Tea', translit: 'Tea' },
    hi: { text: 'चाय', translit: 'Chai' },
    mr: { text: 'चहा', translit: 'Chaha' },
    ta: { text: 'தேநீர் / டீ', translit: 'Theeneer' },
    te: { text: 'టీ / తేనీరు', translit: 'Tea' },
    bn: { text: 'চা', translit: 'Cha' },
  },
  milk: {
    en: { text: 'Milk', translit: 'Milk' },
    hi: { text: 'दूध', translit: 'Doodh' },
    mr: { text: 'दूध', translit: 'Doodh' },
    ta: { text: 'பால்', translit: 'Paal' },
    te: { text: 'పాలు', translit: 'Paalu' },
    bn: { text: 'দুধ', translit: 'Dudh' },
  },

  // Health & Safety
  medicine: {
    en: { text: 'Medicine', translit: 'Medicine' },
    hi: { text: 'दवा / दवाई', translit: 'Dawa' },
    mr: { text: 'औषध', translit: 'Aushadh' },
    ta: { text: 'மருந்து', translit: 'Marundu' },
    te: { text: 'మందు', translit: 'Mandu' },
    bn: { text: 'ওষুধ', translit: 'Oshudh' },
  },
  hospital: {
    en: { text: 'Hospital / Clinic', translit: 'Hospital' },
    hi: { text: 'अस्पताल / दवाखाना', translit: 'Aspataal' },
    mr: { text: 'दवाखाना / रुग्णालय', translit: 'Davakhana' },
    ta: { text: 'மருத்துவமனை', translit: 'Maruthuvamanai' },
    te: { text: 'ఆసుపత్రి', translit: 'Aasupathri' },
    bn: { text: 'হাসপাতাল', translit: 'Haspatal' },
  },
  doctor: {
    en: { text: 'Doctor', translit: 'Doctor' },
    hi: { text: 'डॉक्टर / चिकित्सक', translit: 'Doctor' },
    mr: { text: 'डॉक्टर / वैद्य', translit: 'Doctor' },
    ta: { text: 'மருத்துவர்', translit: 'Maruthuvar' },
    te: { text: 'వైద్యుడు / డాక్టర్', translit: 'Vaidyudu' },
    bn: { text: 'ডাক্তার / চিকিৎসক', translit: 'Daktar' },
  },
  help: {
    en: { text: 'Help me please', translit: 'Help' },
    hi: { text: 'कृपया मेरी मदद करें', translit: 'Kripya meri madad karein' },
    mr: { text: 'कृपया मला मदत करा', translit: 'Krupaya mala madat kara' },
    ta: { text: 'தயவுசெய்து எனக்கு உதவுங்கள்', translit: 'Thayavuseithu enakku udhavungal' },
    te: { text: 'దయచేసి నాకు సహాయం చేయండి', translit: 'Dayachesi naaku sahaayam cheyandi' },
    bn: { text: 'দয়া করে আমাকে সাহায্য করুন', translit: 'Doya kore amake sahajjo korun' },
  },

  // Transport & Travel
  bus: {
    en: { text: 'Bus', translit: 'Bus' },
    hi: { text: 'बस', translit: 'Bus' },
    mr: { text: 'बस / गाडी', translit: 'Bus' },
    ta: { text: 'பேருந்து', translit: 'Perundhu' },
    te: { text: 'బస్సు', translit: 'Bussu' },
    bn: { text: 'বাস', translit: 'Bus' },
  },
  ticket: {
    en: { text: 'Ticket', translit: 'Ticket' },
    hi: { text: 'टिकट', translit: 'Ticket' },
    mr: { text: 'तिकीट', translit: 'Ticket' },
    ta: { text: 'பயணச்சீட்டு', translit: 'Payanachcheettu' },
    te: { text: 'టికెట్', translit: 'Ticket' },
    bn: { text: 'টিকিট', translit: 'Ticket' },
  },
  stop: {
    en: { text: 'Stop / Wait', translit: 'Stop' },
    hi: { text: 'रुकिए / रोको', translit: 'Rukiye' },
    mr: { text: 'थांबा', translit: 'Thaamba' },
    ta: { text: 'நில்லுங்கள்', translit: 'Nillungal' },
    te: { text: 'ఆగండి', translit: 'Aagandi' },
    bn: { text: 'থামুন', translit: 'Thamun' },
  },
  where_is: {
    en: { text: 'Where is the bus stop?', translit: 'Where is the bus stop?' },
    hi: { text: 'बस स्टॉप कहाँ है?', translit: 'Bus stop kahan hai?' },
    mr: { text: 'बस थांबा कुठे आहे?', translit: 'Bus thamba kuthe aahe?' },
    ta: { text: 'பேருந்து நிறுத்தம் எங்கே உள்ளது?', translit: 'Perundhu niruttham enge ullathu?' },
    te: { text: 'బస్ స్టాప్ ఎక్కడ ఉంది?', translit: 'Bus stop ekkada undi?' },
    bn: { text: 'বাস স্টপ কোথায়?', translit: 'Bus stop kothay?' },
  },

  // Family
  mother: {
    en: { text: 'Mother', translit: 'Mother' },
    hi: { text: 'माँ / माताजी', translit: 'Maa' },
    mr: { text: 'आई', translit: 'Aai' },
    ta: { text: 'அம்மா / தாய்', translit: 'Amma' },
    te: { text: 'అమ్మ / తల్లి', translit: 'Amma' },
    bn: { text: 'মা', translit: 'Maa' },
  },
  father: {
    en: { text: 'Father', translit: 'Father' },
    hi: { text: 'पिताजी / बापू', translit: 'Pitaji' },
    mr: { text: 'बाबा / वडील', translit: 'Baba' },
    ta: { text: 'அப்பா / தந்தை', translit: 'Appa' },
    te: { text: 'నాన్న / తండ్రి', translit: 'Naanna' },
    bn: { text: 'বাবা', translit: 'Baba' },
  },

  // Numbers 1-5
  numbers: {
    en: { text: '1: One, 2: Two, 3: Three, 4: Four, 5: Five', translit: 'One to Five' },
    hi: { text: '१: एक, २: दो, ३: तीन, ४: चार, ५: पाँच', translit: 'Ek, Do, Teen, Chaar, Paanch' },
    mr: { text: '१: एक, २: दोन, ३: तीन, ४: चार, ५: पाच', translit: 'Ek, Don, Teen, Chaar, Paach' },
    ta: { text: '௧: ஒன்று, ௨: இரண்டு, ௩: மூன்று, ௪: நான்கு, ௫: ஐந்து', translit: 'Ondru, Irandu, Moondru, Naangu, Ainthu' },
    te: { text: '౧: ఒకటి, ౨: రెండు, ౩: మూడు, ౪: నాలుగు, ౫: ఐదు', translit: 'Okati, Rendu, Moodu, Naalugu, Aidu' },
    bn: { text: '১: এক, ২: দুই, ৩: তিন, ৪: চার, ৫: পাঁচ', translit: 'Ek, Dui, Tin, Char, Panch' },
  },
};

// Key search aliases
const ALIASES = {
  water: ['water', 'pani', 'paani', 'neeru', 'thanneer', 'jol', 'पाणी', 'पानी', 'जल', 'నీరు', 'தண்ணீர்'],
  food: ['food', 'meal', 'khana', 'khaana', 'jevan', 'unavu', 'aahaaram', 'bhaat', 'खाना', 'जेवण', 'உணவு'],
  tea: ['tea', 'chai', 'chaha', 'cha', 'theeneer', 'चाय', 'चहा', 'চা'],
  milk: ['milk', 'doodh', 'paal', 'paalu', 'dudh', 'दूध', 'பால்', 'పాలు'],
  medicine: ['medicine', 'dawa', 'dawai', 'aushadh', 'marundu', 'mandu', 'oshudh', 'दवा', 'औषध', 'மருந்து', 'మందు'],
  hospital: ['hospital', 'clinic', 'aspataal', 'davakhana', 'aasupathri', 'haspatal', 'अस्पताल', 'दवाखाना', 'மருத்துவமனை'],
  doctor: ['doctor', 'dr', 'chikitsak', 'vaidya', 'maruthuvar', 'vaidyudu', 'डॉक्टर', 'वैद्य'],
  help: ['help', 'madad', 'sahayata', 'madat', 'udhavu', 'sahaayam', 'sahajjo', 'मदत', 'मदद', 'உதவி'],
  bus: ['bus', 'gaadi', 'perundhu', 'bussu', 'बस', 'பேருந்து', 'బస్సు'],
  ticket: ['ticket', 'tikki', 'payanachcheettu', 'तिकीट', 'टिकट'],
  stop: ['stop', 'ruko', 'thamba', 'nillu', 'aagu', 'thamun', 'थांबा', 'रुको'],
  where_is: ['where', 'bus stop', 'kahan', 'kuthe', 'enge', 'ekkada', 'kothay', 'कुठे', 'कहाँ'],
  mother: ['mother', 'mom', 'maa', 'aai', 'amma', 'mata', 'आई', 'माँ', 'அம்மா', 'అమ్మ'],
  father: ['father', 'dad', 'papa', 'baba', 'pitaji', 'appa', 'naanna', 'बाबा', 'पिताजी'],
  numbers: ['numbers', 'count', 'ginti', 'akde', 'en', 'sankhya', 'गिनती', 'एक दोन', '1 to 5', '1 2 3'],
  hello: ['hello', 'hi', 'namaste', 'namaskar', 'vanakkam', 'namaskaram', 'nomoshkar', 'नमस्कार', 'नमस्ते', 'வணக்கம்'],
  how_are_you: ['how are you', 'kaise ho', 'kase aahat', 'eppadi irukkireergal', 'ela unnaaru', 'kemon আছেন', 'कसे आहात', 'कैसे हो'],
  thank_you: ['thank', 'thanks', 'dhanyavaad', 'dhanyavad', 'nandri', 'dhonnobaad', 'धन्यवाद', 'நன்றி'],
  goodbye: ['bye', 'goodbye', 'alvida', 'bhetu', 'tata', 'टाटा', 'अलविदा'],
};

export function BolSetuChatbot({
  targetLang = 'mr',
  uiLang = 'en',
  onClose,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatBottomRef = useRef(null);

  const t = UI_TRANSLATIONS[uiLang] || UI_TRANSLATIONS.en;
  const targetLangName = getLocalizedLanguageName(targetLang, uiLang);
  const uiLangName = getLocalizedLanguageName(uiLang, uiLang);

  // Initialize with a warm, friendly welcome message
  useEffect(() => {
    const welcomeKey = 'hello';
    const sampleKb = CHATBOT_KNOWLEDGE_BASE[welcomeKey];
    const targetGreeting = sampleKb[targetLang]?.text || 'Hello';
    const targetTranslit = sampleKb[targetLang]?.translit || 'Hello';
    const uiGreeting = sampleKb[uiLang]?.text || 'Hello';

    const welcomeMsg = {
      id: 'msg_welcome',
      sender: 'bot',
      text: uiLang === 'mr'
        ? `नमस्कार! मी तुमचा बोलसेतु AI मार्गदर्शक आहे. तुम्ही मला ${targetLangName} शिकण्यासाठी कोणताही शब्द, वाक्य किंवा अर्थ विचारू शकता.`
        : uiLang === 'hi'
        ? `नमस्ते! मैं आपका बोलसेतु AI मार्गदर्शक हूँ। आप मुझसे ${targetLangName} सीखने के लिए कोई भी शब्द, वाक्य या उच्चारण पूछ सकते हैं।`
        : `Hello! I am your BolSetu AI Literacy Companion. Ask me how to speak or write any word or sentence in ${targetLangName}!`,
      sampleCard: {
        targetWord: targetGreeting,
        targetTranslit: targetTranslit,
        targetLang: targetLang,
        meaningWord: uiGreeting,
        meaningLang: uiLang,
      },
    };
    setMessages([welcomeMsg]);
  }, [targetLang, uiLang, targetLangName]);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleHear = (text, lang) => {
    sfx.playPop();
    const cleanWord = text.split('/')[0].split('(')[0].replace(/[\p{Emoji}\u200d]+/gu, '').trim() || text;
    audioEngine.speak(cleanWord, lang);
  };

  const processQuery = (raw) => {
    const q = raw.toLowerCase().trim();

    // Check alias match in knowledge base
    let matchedKey = null;
    for (const [key, aliases] of Object.entries(ALIASES)) {
      if (aliases.some((alias) => q.includes(alias.toLowerCase()))) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey && CHATBOT_KNOWLEDGE_BASE[matchedKey]) {
      const entry = CHATBOT_KNOWLEDGE_BASE[matchedKey];
      const targetData = entry[targetLang] || entry.en;
      const uiData = entry[uiLang] || entry.en;

      return {
        id: 'msg_' + Date.now(),
        sender: 'bot',
        text: uiLang === 'mr'
          ? `येथे '${raw}' चे ${targetLangName} आणि ${uiLangName} मधील अचूक भाषांतर व उच्चार आहे:`
          : uiLang === 'hi'
          ? `यहाँ '${raw}' का ${targetLangName} और ${uiLangName} में सटीक अनुवाद और उच्चारण दिया गया है:`
          : `Here is the translation and pronunciation for '${raw}' in ${targetLangName} and ${uiLangName}:`,
        sampleCard: {
          targetWord: targetData.text,
          targetTranslit: targetData.translit,
          targetLang: targetLang,
          meaningWord: uiData.text,
          meaningLang: uiLang,
        },
      };
    }

    // Dynamic smart response for any custom user input
    return {
      id: 'msg_' + Date.now(),
      sender: 'bot',
      text: uiLang === 'mr'
        ? `'${raw}' साठी ${targetLangName} शिकत आहात. खालीलप्रमाणे सराव करा आणि ऐकण्यासाठी ऑडिओ बटण दाबा:`
        : uiLang === 'hi'
        ? `'${raw}' के लिए ${targetLangName} सीख रहे हैं। नीचे दिए गए उच्चारण का अभ्यास करें और सुनने के लिए ऑडियो बटन दबाएं:`
        : `Practicing '${raw}' in ${targetLangName}. Tap the listen buttons below to hear authentic pronunciation:`,
      sampleCard: {
        targetWord: raw,
        targetTranslit: raw,
        targetLang: targetLang,
        meaningWord: raw,
        meaningLang: uiLang,
      },
    };
  };

  const handleSend = (textToSend = inputQuery) => {
    if (!textToSend || !textToSend.trim()) return;
    sfx.playPop();

    const userMsg = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      sfx.playSuccess();
      const botResponse = processQuery(textToSend);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 450);
  };

  const quickChips = [
    { label: targetLang === 'ta' ? '💧 Water (தண்ணீர்)' : '💧 Water (पाणी / जल)', query: 'water' },
    { label: '🙏 Thank You', query: 'thank you' },
    { label: '🏥 Hospital / Clinic', query: 'hospital' },
    { label: '🚌 Bus & Stop', query: 'bus stop' },
    { label: '🔢 Numbers 1-5', query: 'numbers' },
    { label: '👩 Mother (आई / माँ)', query: 'mother' },
  ];

  return (
    <>
      {/* Floating Mascot Trigger Button */}
      <button
        className="bolsetu-chatbot-trigger"
        onClick={() => {
          sfx.playPop();
          setIsOpen(!isOpen);
        }}
        title="Ask BolSetu AI Literacy Companion"
        aria-label="Ask BolSetu AI"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          borderRadius: '50px',
          padding: '10px 18px 10px 12px',
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          color: '#FFFFFF',
          border: '3px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.45)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          cursor: 'pointer',
          fontWeight: 800,
          fontSize: '0.95rem',
          transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            fontSize: '1.3rem',
          }}
        >
          🦉
        </div>
        <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
          <div style={{ fontSize: '0.92rem' }}>AI Sahayak</div>
          <div style={{ fontSize: '0.7rem', opacity: 0.85, fontWeight: 600 }}>बोलसेतु मित्र</div>
        </div>
      </button>

      {/* Floating Chat Modal / Drawer */}
      {isOpen && (
        <div
          className="bolsetu-chat-drawer"
          style={{
            position: 'fixed',
            bottom: '84px',
            right: '24px',
            width: '380px',
            maxWidth: 'calc(100vw - 32px)',
            height: '540px',
            maxHeight: 'calc(100vh - 120px)',
            background: 'var(--bg-card)',
            border: '2px solid var(--border-thick)',
            borderRadius: '24px',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.22)',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'modalSlideUp 0.25s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
              color: '#FFFFFF',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                }}
              >
                🦉
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900 }}>BolSetu AI Sahayak</h4>
                <span style={{ fontSize: '0.72rem', opacity: 0.9 }}>
                  {uiLangName} ➔ {targetLangName}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sfx.playPop();
                setIsOpen(false);
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Suggestion Chips Bar */}
          <div
            style={{
              padding: '10px 14px',
              background: 'var(--bg-main)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.query)}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-thick)',
                  borderRadius: '16px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  gap: '6px',
                }}
              >
                {/* Text Bubble */}
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px 16px',
                    borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: m.sender === 'user' ? 'linear-gradient(135deg, #4F46E5, #6366F1)' : 'var(--bg-main)',
                    color: m.sender === 'user' ? '#FFFFFF' : 'var(--text-main)',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    lineHeight: '1.45',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  }}
                >
                  {m.text}
                </div>

                {/* Multilingual Voice Card */}
                {m.sampleCard && (
                  <div
                    style={{
                      width: '100%',
                      background: 'var(--bg-card)',
                      border: '2px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '12px 14px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {/* Target Learning Language Tile */}
                    <div
                      style={{
                        background: 'rgba(79, 70, 229, 0.08)',
                        borderRadius: '12px',
                        padding: '10px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase' }}>
                          🎯 {targetLangName}
                        </span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '2px' }}>
                          {m.sampleCard.targetWord}
                        </div>
                        {m.sampleCard.targetTranslit && (
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {m.sampleCard.targetTranslit}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleHear(m.sampleCard.targetWord, m.sampleCard.targetLang)}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          color: '#fff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 6px rgba(79, 70, 229, 0.3)',
                        }}
                        title="Listen Target Language Voice"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>

                    {/* UI / Meaning Language Tile */}
                    <div
                      style={{
                        background: 'var(--bg-main)',
                        borderRadius: '12px',
                        padding: '8px 12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                          🌐 {uiLangName}
                        </span>
                        <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)' }}>
                          {m.sampleCard.meaningWord}
                        </div>
                      </div>

                      <button
                        onClick={() => handleHear(m.sampleCard.meaningWord, m.sampleCard.meaningLang)}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          background: 'var(--bg-card)',
                          color: 'var(--text-main)',
                          border: '1px solid var(--border-thick)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                        title="Listen Meaning Voice"
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  background: 'var(--bg-main)',
                  borderRadius: '16px',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  width: 'fit-content',
                }}
              >
                <span>🦉 Akshi is typing...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '12px 14px',
              borderTop: '2px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={uiLang === 'mr' ? 'शब्द किंवा वाक्य विचारा...' : uiLang === 'hi' ? 'शब्द या वाक्य पूछें...' : 'Ask any word or sentence...'}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '14px',
                border: '2px solid var(--border-subtle)',
                background: 'var(--bg-main)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />

            <button
              type="submit"
              disabled={!inputQuery.trim()}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '14px',
                background: inputQuery.trim() ? 'var(--primary)' : 'var(--border-subtle)',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: inputQuery.trim() ? 'pointer' : 'default',
                transition: 'background 0.2s',
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
