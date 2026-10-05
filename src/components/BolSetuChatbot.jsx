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

// =========================================================================
// COMPREHENSIVE MULTILINGUAL KNOWLEDGE BASE
// Covers core neo-learner concepts across 6 languages: MR, HI, TA, TE, BN, EN
// =========================================================================
const CHATBOT_KNOWLEDGE_BASE = {
  // Greetings & Conversational Essentials
  hello: {
    en: { text: 'Hello / Welcome', translit: 'Hello' },
    hi: { text: 'नमस्ते / प्रणाम', translit: 'Namaste' },
    mr: { text: 'नमस्कार / राम राम', translit: 'Namaskar' },
    ta: { text: 'வணக்கம்', translit: 'Vanakkam' },
    te: { text: 'నమస్కారం', translit: 'Namaskaram' },
    bn: { text: 'নমস্কার / সালাম', translit: 'Nomoshkar' },
  },
  how_are_you: {
    en: { text: 'How are you?', translit: 'How are you?' },
    hi: { text: 'आप कैसे हैं? / तुम कैसे हो?', translit: 'Aap kaise hain?' },
    mr: { text: 'तुम्ही कसे आहात? / कसा आहेस?', translit: 'Tumhi kase aahat?' },
    ta: { text: 'நீங்கள் எப்படி இருக்கிறீர்கள்?', translit: 'Neengal eppadi irukkireergal?' },
    te: { text: 'మీరు ఎలా ఉన్నారు?', translit: 'Meeru ela unnaaru?' },
    bn: { text: 'আপনি কেমন আছেন?', translit: 'Apni kemon achhen?' },
  },
  i_am_fine: {
    en: { text: 'I am fine / I am doing well', translit: 'I am fine' },
    hi: { text: 'मैं ठीक हूँ / मैं अच्छा हूँ', translit: 'Main theek hoon' },
    mr: { text: 'मी मजेत आहे / मी ठीक आहे', translit: 'Mi theek aahe / Mi majet aahe' },
    ta: { text: 'நான் நலமாக இருக்கிறேன் / நல்லா இருக்கேன்', translit: 'Naan nalamaaga irukkiren' },
    te: { text: 'నేను బాగున్నాను', translit: 'Nenu baagunnaanu' },
    bn: { text: 'আমি ভালো আছি', translit: 'Aami bhalo achhi' },
  },
  thank_you: {
    en: { text: 'Thank you very much', translit: 'Thank you' },
    hi: { text: 'धन्यवाद / शुक्रिया', translit: 'Dhanyavaad' },
    mr: { text: 'धन्यवाद / आभारी आहे', translit: 'Dhanyavaad' },
    ta: { text: 'மிக்க நன்றி', translit: 'Mikka nandri' },
    te: { text: 'చాలా ధన్యవాదాలు', translit: 'Chaala dhanyavaadaalu' },
    bn: { text: 'অনেক ধন্যবাদ', translit: 'Onek dhonnobaad' },
  },
  welcome: {
    en: { text: 'You are welcome', translit: 'You are welcome' },
    hi: { text: 'आपका स्वागत है / कोई बात नहीं', translit: 'Aapka swaagat hai' },
    mr: { text: 'तुमचे स्वागत आहे / काही हरकत नाही', translit: 'Tumche swagat aahe' },
    ta: { text: 'நல்வரவு / பரவாயில்லை', translit: 'Nalvaravu' },
    te: { text: 'స్వాగతం', translit: 'Swaagatham' },
    bn: { text: 'আপনাকে স্বাগতম', translit: 'Aapnake shagotom' },
  },
  sorry: {
    en: { text: 'I am sorry / Excuse me', translit: 'I am sorry' },
    hi: { text: 'माफ़ कीजिए / क्षमा करें', translit: 'Maaf kijiye' },
    mr: { text: 'माफ करा / मला क्षमा असावी', translit: 'Maaf kara' },
    ta: { text: 'மன்னிக்கவும்', translit: 'Mannikkavum' },
    te: { text: 'నన్ను క్షమించండి', translit: 'Nannu kshaminchandi' },
    bn: { text: 'ক্ষমা করবেন / দুঃখিত', translit: 'Khoma korben' },
  },
  please: {
    en: { text: 'Please', translit: 'Please' },
    hi: { text: 'कृपया', translit: 'Kripya' },
    mr: { text: 'कृपया', translit: 'Krupaya' },
    ta: { text: 'தயவுசெய்து', translit: 'Thayavuseithu' },
    te: { text: 'దయచేసి', translit: 'Dayachesi' },
    bn: { text: 'দয়া করে', translit: 'Doya kore' },
  },
  yes_no: {
    en: { text: 'Yes / No', translit: 'Yes or No' },
    hi: { text: 'हाँ (Yes) / नहीं (No)', translit: 'Haan / Nahin' },
    mr: { text: 'होय (Yes) / नाही (No)', translit: 'Hoy / Naahi' },
    ta: { text: 'ஆம் (Yes) / இல்லை (No)', translit: 'Aam / Illai' },
    te: { text: 'అవును (Yes) / కాదు (No)', translit: 'Avunu / Kaadu' },
    bn: { text: 'হ্যাঁ (Yes) / না (No)', translit: 'Hyaan / Naa' },
  },
  good_morning: {
    en: { text: 'Good morning', translit: 'Good morning' },
    hi: { text: 'शुभ प्रभात / सुप्रभात', translit: 'Shubh prabhat' },
    mr: { text: 'शुभ प्रभात / सुप्रभात', translit: 'Shubh prabhat' },
    ta: { text: 'காலை வணக்கம்', translit: 'Kaalai vanakkam' },
    te: { text: 'శుభోదయం', translit: 'Shubhodhayam' },
    bn: { text: 'সুপ্রভাত', translit: 'Suprobhat' },
  },
  good_night: {
    en: { text: 'Good night', translit: 'Good night' },
    hi: { text: 'शुभ रात्रि', translit: 'Shubh raatri' },
    mr: { text: 'शुभ रात्री', translit: 'Shubh raatri' },
    ta: { text: 'இனிய இரவு', translit: 'Iniya iravu' },
    te: { text: 'శుభరాత్రి', translit: 'Shubharaatri' },
    bn: { text: 'শুভ রাত্রি', translit: 'Shubho raatri' },
  },
  goodbye: {
    en: { text: 'Goodbye / See you later', translit: 'Goodbye' },
    hi: { text: 'फिर मिलेंगे / अलविदा', translit: 'Phir milenge' },
    mr: { text: 'पुन्हा भेटू / निरोप', translit: 'Puna bhetu' },
    ta: { text: 'போய் வருகிறேன்', translit: 'Poi varugiren' },
    te: { text: 'మళ్ళీ కలుద్దాం', translit: 'Malli kaluddaam' },
    bn: { text: 'আবার দেখা হবে', translit: 'Abar dekha hobe' },
  },

  // Introductions & Identity
  what_is_your_name: {
    en: { text: 'What is your name?', translit: 'What is your name?' },
    hi: { text: 'आपका नाम क्या है?', translit: 'Aapka naam kya hai?' },
    mr: { text: 'तुमचे नाव काय आहे?', translit: 'Tumche naav kaay aahe?' },
    ta: { text: 'உங்கள் பெயர் என்ன?', translit: 'Ungal peyar enna?' },
    te: { text: 'మీ పేరు ఏమిటి?', translit: 'Mee peru emiti?' },
    bn: { text: 'আপনার নাম কি?', translit: 'Aapnar naam ki?' },
  },
  my_name_is: {
    en: { text: 'My name is ...', translit: 'My name is ...' },
    hi: { text: 'मेरा नाम ... है', translit: 'Mera naam ... hai' },
    mr: { text: 'माझे नाव ... आहे', translit: 'Maajhe naav ... aahe' },
    ta: { text: 'என் பெயர் ...', translit: 'En peyar ...' },
    te: { text: 'నా పేరు ...', translit: 'Naa peru ...' },
    bn: { text: 'আমার নাম ...', translit: 'Aamar naam ...' },
  },
  who_are_you: {
    en: { text: 'I am BolSetu AI Sahayak, your literacy companion', translit: 'BolSetu AI' },
    hi: { text: 'मैं बोलसेतु AI सहायक हूँ, आपका साक्षरता मार्गदर्शक', translit: 'Main BolSetu AI sahayak hoon' },
    mr: { text: 'मी बोलसेतु AI साहाय्यक आहे, तुमचा भाषा मित्र', translit: 'Mi BolSetu AI sahayak aahe' },
    ta: { text: 'நான் போல்சேது AI தோழன், உங்கள் மொழி வழிகாட்டி', translit: 'Naan BolSetu AI thozhan' },
    te: { text: 'నేను బోల్‌సేతు AI సహాయకుడిని, మీ అక్షర నేస్తం', translit: 'Nenu BolSetu AI sahaayakudini' },
    bn: { text: 'আমি বোলসেতু এআই সহকারী, আপনার ভাষা বন্ধু', translit: 'Aami BolSetu AI sahayok' },
  },

  // Neo-Learner Essentials: Needs & Common Phrases
  i_want_water: {
    en: { text: 'I want water / Give me water', translit: 'I want water' },
    hi: { text: 'मुझे पानी चाहिए / पानी दीजिए', translit: 'Mujhe paani chahiye' },
    mr: { text: 'मला पाणी हवे आहे / पाणी द्या', translit: 'Mala paani have aahe' },
    ta: { text: 'எனக்கு தண்ணீர் வேண்டும்', translit: 'Enakku thanneer vendum' },
    te: { text: 'నాకు మంచి నీళ్ళు కావాలి', translit: 'Naaku manchi neellu kaavali' },
    bn: { text: 'আমার জল / পানি লাগবে', translit: 'Aamar jol lagbe' },
  },
  i_am_hungry: {
    en: { text: 'I am hungry / I want food', translit: 'I am hungry' },
    hi: { text: 'मुझे भूख लगी है / खाना चाहिए', translit: 'Mujhe bhookh lagi hai' },
    mr: { text: 'मला भूक लागली आहे / जेवण हवे', translit: 'Mala bhook lagli aahe' },
    ta: { text: 'எனக்கு பசிக்கிறது / உணவு வேண்டும்', translit: 'Enakku pasikkiradhu' },
    te: { text: 'నాకు ఆకలిగా ఉంది', translit: 'Naaku aakaligaa undi' },
    bn: { text: 'আমার খিদে পেয়েছে', translit: 'Aamar khide peyechhe' },
  },
  where_is_bathroom: {
    en: { text: 'Where is the restroom / bathroom?', translit: 'Where is the bathroom?' },
    hi: { text: 'शौचालय / बाथरूम कहाँ है?', translit: 'Shouchalay kahan hai?' },
    mr: { text: 'शौचालय / बाथरूम कुठे आहे?', translit: 'Shouchalay kuthe aahe?' },
    ta: { text: 'கழிப்பறை எங்கே உள்ளது?', translit: 'Kazhipparai enge ullathu?' },
    te: { text: 'మరుగుదొడ్డి / వాష్‌రూమ్ ఎక్కడ ఉంది?', translit: 'Washroom ekkada undi?' },
    bn: { text: 'টয়লেট / বাথরুম কোথায়?', translit: 'Toilet kothay?' },
  },
  how_much: {
    en: { text: 'How much does this cost? / Price?', translit: 'How much is this?' },
    hi: { text: 'यह कितने का है? / कितने रुपये?', translit: 'Yeh kitne ka hai?' },
    mr: { text: 'याची किंमत किती आहे? / किती रुपये?', translit: 'Yaachi kimmat kiti aahe?' },
    ta: { text: 'இதன் விலை என்ன? / எவ்வளவு?', translit: 'Idhan vilai enna?' },
    te: { text: 'దీని ధర ఎంత? / ఎంత?', translit: 'Deeni dhara entha?' },
    bn: { text: 'এটার দাম কত? / কত টাকা?', translit: 'Etar daam koto?' },
  },
  i_understand: {
    en: { text: 'I understand / I got it', translit: 'I understand' },
    hi: { text: 'मुझे समझ आ गया / मैं समझ गया', translit: 'Mujhe samajh aa gaya' },
    mr: { text: 'मला समजले / मला कळले', translit: 'Mala samajle / Mala kal-le' },
    ta: { text: 'எனக்கு புரிகிறது', translit: 'Enakku purigiradhu' },
    te: { text: 'నాకు అర్థమైంది', translit: 'Naaku arthamaindi' },
    bn: { text: 'আমি বুঝতে পেরেছি', translit: 'Aami bujhte perechhi' },
  },
  i_dont_understand: {
    en: { text: 'I do not understand', translit: 'I do not understand' },
    hi: { text: 'मुझे समझ नहीं आया', translit: 'Mujhe samajh nahi aaya' },
    mr: { text: 'मला समजले नाही / उमगले नाही', translit: 'Mala samajle naahi' },
    ta: { text: 'எனக்கு புரியவில்லை', translit: 'Enakku puriyavillai' },
    te: { text: 'నాకు అర్థం కాలేదు', translit: 'Naaku artham kaaledu' },
    bn: { text: 'আমি বুঝতে পারছি না', translit: 'Aami bujhte parchhi na' },
  },
  speak_slowly: {
    en: { text: 'Please speak slowly', translit: 'Please speak slowly' },
    hi: { text: 'कृपया धीरे बोलिए', translit: 'Kripya dheere boliye' },
    mr: { text: 'कृपया सावकाश बोला', translit: 'Krupaya saavkaash bola' },
    ta: { text: 'தயவுசெய்து மெதுவாக பேசுங்கள்', translit: 'Thayavuseithu medhuvaaga pesungal' },
    te: { text: 'దయచేసి నెమ్మదిగా మాట్లాడండి', translit: 'Dayachesi nemmadigaa maatlaadandi' },
    bn: { text: 'দয়া করে আস্তে কথা বলুন', translit: 'Doya kore aaste kotha bolun' },
  },

  // Daily Essentials
  water: {
    en: { text: 'Water', translit: 'Water' },
    hi: { text: 'पानी / जल', translit: 'Paani' },
    mr: { text: 'पाणी / जल', translit: 'Paani' },
    ta: { text: 'தண்ணீர்', translit: 'Thanneer' },
    te: { text: 'మంచి నీళ్ళు / నీరు', translit: 'Neeru' },
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
    bn: { text: 'ডাক্তার', translit: 'Daktar' },
  },
  help: {
    en: { text: 'Help me please', translit: 'Help' },
    hi: { text: 'कृपया मेरी मदद करें', translit: 'Kripya meri madad karein' },
    mr: { text: 'कृपया मला मदत करा', translit: 'Krupaya mala madat kara' },
    ta: { text: 'தயவுசெய்து எனக்கு உதவுங்கள்', translit: 'Thayavuseithu enakku udhavungal' },
    te: { text: 'దయచేసి నాకు సహాయం చేయండి', translit: 'Dayachesi naaku sahaayam cheyandi' },
    bn: { text: 'দয়া করে আমাকে সাহায্য করুন', translit: 'Doya kore amake sahajjo korun' },
  },

  // Transport & Navigation
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
    en: { text: 'Stop / Wait here', translit: 'Stop' },
    hi: { text: 'रुकिए / रोको', translit: 'Rukiye' },
    mr: { text: 'थांबा / थांबा इथे', translit: 'Thaamba' },
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

  // Family & Relationships
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
  brother: {
    en: { text: 'Brother', translit: 'Brother' },
    hi: { text: 'भाई / भइया', translit: 'Bhai' },
    mr: { text: 'भाऊ / दादा', translit: 'Bhau' },
    ta: { text: 'சகோதரன் / அண்ணன் / தம்பி', translit: 'Sagodharan' },
    te: { text: 'సోదరుడు / అన్న / తమ్ముడు', translit: 'Sodharudu' },
    bn: { text: 'ভাই / দাদা', translit: 'Bhai' },
  },
  sister: {
    en: { text: 'Sister', translit: 'Sister' },
    hi: { text: 'बहन / दीदी', translit: 'Bahen' },
    mr: { text: 'बहीण / ताई', translit: 'Bahin' },
    ta: { text: 'சகோதரி / அக்கா / தங்கை', translit: 'Sagodhari' },
    te: { text: 'సోదరి / అక్క / చెల్లి', translit: 'Sodhari' },
    bn: { text: 'বোন / দিদি', translit: 'Bon' },
  },
  friend: {
    en: { text: 'Friend', translit: 'Friend' },
    hi: { text: 'दोस्त / मित्र', translit: 'Dost' },
    mr: { text: 'मित्र / सखा', translit: 'Mitra' },
    ta: { text: 'நண்பர் / தோழன்', translit: 'Nanbar' },
    te: { text: 'స్నేహితుడు / మిత్రుడు', translit: 'Snehithudu' },
    bn: { text: 'বন্ধু', translit: 'Bondhu' },
  },

  // Education & Literacy
  book: {
    en: { text: 'Book', translit: 'Book' },
    hi: { text: 'किताब / पुस्तक', translit: 'Kitaab' },
    mr: { text: 'पुस्तक / वही', translit: 'Pustak' },
    ta: { text: 'புத்தகம்', translit: 'Puthagam' },
    te: { text: 'పుస్తకం', translit: 'Pusthakam' },
    bn: { text: 'বই / পুস্তক', translit: 'Boi' },
  },
  school: {
    en: { text: 'School', translit: 'School' },
    hi: { text: 'स्कूल / विद्यालय / पाठशाला', translit: 'School' },
    mr: { text: 'शाळा / विद्यालय', translit: 'Shaala' },
    ta: { text: 'பள்ளி / பாடசாலை', translit: 'Palli' },
    te: { text: 'పాఠశాల / బడి', translit: 'Paathashaala' },
    bn: { text: 'বিদ্যালয় / স্কুল', translit: 'Biddaloy' },
  },
  home: {
    en: { text: 'Home / House', translit: 'Home' },
    hi: { text: 'घर / गृह', translit: 'Ghar' },
    mr: { text: 'घर / निवास', translit: 'Ghar' },
    ta: { text: 'வீடு / இல்லம்', translit: 'Veedu' },
    te: { text: 'ఇల్లు / గృహం', translit: 'Illu' },
    bn: { text: 'বাড়ি / ঘর', translit: 'Bari' },
  },
  time: {
    en: { text: 'Time / What time is it?', translit: 'Time' },
    hi: { text: 'समय / कितना बजा है?', translit: 'Samay' },
    mr: { text: 'वेळ / किती वाजले आहेत?', translit: 'Vel' },
    ta: { text: 'நேரம் / மணி என்ன?', translit: 'Neram' },
    te: { text: 'సమయం / సమయం ఎంతైంది?', translit: 'Samayam' },
    bn: { text: 'সময় / কটা বাজে?', translit: 'Shomoy' },
  },

  // Numbers 1 to 10
  numbers: {
    en: { text: '1: One, 2: Two, 3: Three, 4: Four, 5: Five', translit: 'One to Five' },
    hi: { text: '१: एक, २: दो, ३: तीन, ४: चार, ५: पाँच', translit: 'Ek, Do, Teen, Chaar, Paanch' },
    mr: { text: '१: एक, २: दोन, ३: तीन, ४: चार, ५: पाच', translit: 'Ek, Don, Teen, Chaar, Paach' },
    ta: { text: '௧: ஒன்று, ௨: இரண்டு, ௩: மூன்று, ௪: நான்கு, ௫: ஐந்து', translit: 'Ondru, Irandu, Moondru, Naangu, Ainthu' },
    te: { text: '౧: ఒకటి, ౨: రెండు, ౩: మూడు, ౪: నాలుగు, ౫: ఐదు', translit: 'Okati, Rendu, Moodu, Naalugu, Aidu' },
    bn: { text: '১: এক, ২: দুই, ৩: তিন, ৪: চার, ৫: পাঁচ', translit: 'Ek, Dui, Tin, Char, Panch' },
  },
  vowels: {
    en: { text: 'Vowels: A, AA, I, EE, U, OO', translit: 'Foundational Vowels' },
    hi: { text: 'स्वर: अ, आ, इ, ई, उ, ऊ', translit: 'A, Aa, I, Ee, U, Oo' },
    mr: { text: 'स्वर: अ, आ, इ, ई, उ, ऊ', translit: 'A, Aa, I, Ee, U, Oo' },
    ta: { text: 'உயிரெழுத்துக்கள்: அ, ஆ, இ, ஈ, உ, ஊ', translit: 'A, Aa, I, Ee, U, Oo' },
    te: { text: 'అచ్చులు: అ, ఆ, ఇ, ఈ, ఉ, ఊ', translit: 'A, Aa, I, Ee, U, Oo' },
    bn: { text: 'স্বরবর্ণ: অ, আ, ই, ঈ, উ, ঊ', translit: 'O, Aa, I, Ee, U, Oo' },
  },
};

// =========================================================================
// SEARCH ALIASES FOR NATURAL LANGUAGE MATCHING
// =========================================================================
const ALIASES = {
  hello: ['hello', 'hi', 'hey', 'namaste', 'namaskar', 'vanakkam', 'namaskaram', 'nomoshkar', 'नमस्कार', 'नमस्ते', 'வணக்கம்', 'నమస్కారం'],
  how_are_you: ['how are you', 'how r u', 'how do you do', 'kaise ho', 'kaisa hai', 'kase aahat', 'kasa ahes', 'eppadi irukkireergal', 'ela unnaaru', 'kemon achen', 'kemon achho', 'कसे आहात', 'कैसे हो', 'எப்படி இருக்கீங்க'],
  i_am_fine: [
    'i am fine',
    "i'm fine",
    'am fine',
    'fine',
    'i am good',
    "i'm good",
    'good',
    'all good',
    'doing well',
    'thik hu',
    'theek hu',
    'theek hoon',
    'theek ahe',
    'theek aahe',
    'majet ahe',
    'majet aahe',
    'theek',
    'thik',
    'nallam',
    'nalla irukken',
    'bagunnanu',
    'baagunnaanu',
    'bhalo achhi',
    'bhalo achi',
    'मी मजेत आहे',
    'मी ठीक आहे',
    'मैं ठीक हूँ',
    'நல்லா இருக்கேன்',
    'బాగున్నాను',
    'ভালো আছি',
  ],
  thank_you: ['thank you', 'thanks', 'thank', 'thx', 'dhanyavaad', 'dhanyavad', 'nandri', 'dhanyavaadaalu', 'dhonnobaad', 'धन्यवाद', 'आभारी', 'நன்றி', 'ధన్యవాదాలు'],
  welcome: ['welcome', 'you are welcome', 'swagat', 'swagatam', 'nalvaravu', 'स्वागत', 'நல்வரவு', 'స్వాగతం'],
  sorry: ['sorry', 'apologize', 'maaf', 'maaf karo', 'maaf kara', 'kshama', 'mannikkavum', 'माफ करा', 'माफ़ कीजिए', 'மன்னிக்கவும்'],
  please: ['please', 'pls', 'kripya', 'krupaya', 'thayavuseithu', 'dayachesi', 'doya kore', 'कृपया', 'தயவுசெய்து'],
  yes_no: ['yes', 'no', 'haan', 'nahi', 'hoy', 'naahi', 'aam', 'illai', 'avunu', 'kaadu', 'हाँ', 'होय', 'नाही', 'नहीं'],
  good_morning: ['good morning', 'morning', 'suprabhat', 'shubh prabhat', 'kaalai vanakkam', 'subhodhayam', 'suprobhat', 'सुप्रभात', 'शुभ प्रभात'],
  good_night: ['good night', 'night', 'shubh ratri', 'shubh raatri', 'iniya iravu', 'shubharaatri', 'शुभ रात्री', 'शुभ रात्रि'],
  goodbye: ['goodbye', 'bye', 'see you', 'alvida', 'bhetu', 'tata', 'टाटा', 'अलविदा', 'पुन्हा भेटू'],
  what_is_your_name: ['what is your name', 'your name', 'naam kya hai', 'naav kay', 'peyar enna', 'peru emiti', 'naam ki', 'नाव काय', 'नाम क्या है'],
  my_name_is: ['my name is', 'my name', 'mera naam', 'majhe naav', 'maajhe naav', 'en peyar', 'naa peru', 'aamar naam', 'माझे नाव', 'मेरा नाम'],
  who_are_you: ['who are you', 'who r u', 'aap kaun ho', 'tum kaun ho', 'kon ahat', 'kaun hai', 'yaar neengal', 'ఎవరు మీరు', 'कोण आहात'],
  i_want_water: ['i want water', 'give me water', 'need water', 'pani chahiye', 'pani dya', 'pani pyaycha', 'thanneer vendum', 'neellu kaavali', 'पाणी हवे', 'पानी चाहिए'],
  i_am_hungry: ['hungry', 'i am hungry', 'want food', 'bhookh', 'bhookh lagi', 'bhook lagli', 'pasikkiradhu', 'aakali', 'khide', 'भूक लागली', 'भूख लगी'],
  where_is_bathroom: ['bathroom', 'toilet', 'washroom', 'restroom', 'shauchalay', 'sandaas', 'kazhipparai', 'शौचालय', 'बाथरूम'],
  how_much: ['how much', 'cost', 'price', 'rupees', 'rate', 'kitne ka', 'kitne rupaye', 'kiti rupaye', 'kimmat kiti', 'evvalavu', 'entha', 'dam koto', 'किती रुपये', 'कितने का'],
  i_understand: ['i understand', 'understood', 'got it', 'samajh gaya', 'samajhla', 'samajh aala', 'purigiradhu', 'arthamaindi', 'bujhte perechi', 'समजले', 'समझ गया'],
  i_dont_understand: ["don't understand", 'dont understand', 'not understand', 'nahi samjha', 'samajla nahi', 'puriyavillai', 'artham kaaledu', 'समजले नाही', 'समझ नहीं आया'],
  speak_slowly: ['speak slowly', 'talk slowly', 'slowly', 'dheere bolo', 'savkash bola', 'medhuvaaga pesu', 'nemmadiga', 'सावकाश बोला', 'धीरे बोलिए'],
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
  where_is: ['where is', 'where', 'kahan hai', 'kahan', 'kuthe aahe', 'kuthe', 'enge', 'ekkada', 'kothay', 'कुठे', 'कहाँ'],
  mother: ['mother', 'mom', 'maa', 'aai', 'amma', 'mata', 'आई', 'माँ', 'அம்மா', 'అమ్మ'],
  father: ['father', 'dad', 'papa', 'baba', 'pitaji', 'appa', 'naanna', 'बाबा', 'पिताजी'],
  brother: ['brother', 'bro', 'bhai', 'bhau', 'dada', 'thambi', 'anna', 'sodharudu', 'भाऊ', 'भाई'],
  sister: ['sister', 'sis', 'bahen', 'bahin', 'didi', 'tai', 'thangai', 'akka', 'sodhari', 'बहीण', 'बहन'],
  friend: ['friend', 'dost', 'mitra', 'sakha', 'nanban', 'snehithudu', 'bondhu', 'मित्र', 'दोस्त'],
  book: ['book', 'pustak', 'kitaab', 'putthagam', 'pusthakam', 'boi', 'पुस्तक', 'किताब'],
  school: ['school', 'vidyalaya', 'shala', 'shaala', 'palli', 'paathashala', 'शाळा', 'स्कूल'],
  home: ['home', 'house', 'ghar', 'veedu', 'illu', 'bari', 'घर'],
  time: ['time', 'clock', 'ghadi', 'samay', 'vel', 'neram', 'samayam', 'वेळ', 'समय'],
  numbers: ['numbers', 'count', 'ginti', 'akde', 'en', 'sankhya', 'गिनती', 'एक दोन', '1 to 5', '1 2 3', 'number'],
  vowels: ['vowels', 'vowel', 'swar', 'letters', 'alphabets', 'akshar', 'स्वर', 'अ आ इ ई', 'tracing'],
};

// =========================================================================
// FALLBACK VOCABULARY DICTIONARY (Word-by-word mapping for neo-learners)
// =========================================================================
const WORD_TRANSLATIONS = {
  i: { mr: 'मी', hi: 'मैं', ta: 'நான்', te: 'నేను', bn: 'আমি', en: 'I', translit: 'Mi / Main' },
  you: { mr: 'तुम्ही / तू', hi: 'आप / तुम', ta: 'நீங்கள்', te: 'మీరు', bn: 'আপনি', en: 'You', translit: 'Tumhi / Aap' },
  fine: { mr: 'मजेत / ठीक', hi: 'ठीक / अच्छा', ta: 'நலம்', te: 'బాగున్నాను', bn: 'ভালো', en: 'Fine', translit: 'Theek / Majet' },
  good: { mr: 'छान / चांगले', hi: 'अच्छा / बढ़िया', ta: 'நல்லது', te: 'మంచిది', bn: 'ভালো', en: 'Good', translit: 'Chhaan / Achha' },
  bad: { mr: 'वाईट', hi: 'बुरा / खराब', ta: 'மோசமானது', te: 'చెడ్డది', bn: 'খারাপ', en: 'Bad', translit: 'Vaait' },
  name: { mr: 'नाव', hi: 'नाम', ta: 'பெயர்', te: 'పేరు', bn: 'নাম', en: 'Name', translit: 'Naav / Naam' },
  water: { mr: 'पाणी', hi: 'पानी', ta: 'தண்ணீர்', te: 'నీరు', bn: 'জল', en: 'Water', translit: 'Paani' },
  milk: { mr: 'दूध', hi: 'दूध', ta: 'பால்', te: 'పాలు', bn: 'দুধ', en: 'Milk', translit: 'Doodh' },
  food: { mr: 'जेवण', hi: 'खाना', ta: 'உணவு', te: 'ఆహారం', bn: 'খাবার', en: 'Food', translit: 'Jevan' },
  tea: { mr: 'चहा', hi: 'चाय', ta: 'தேநீர்', te: 'టీ', bn: 'চা', en: 'Tea', translit: 'Chaha / Chai' },
  book: { mr: 'पुस्तक', hi: 'किताब', ta: 'புத்தகம்', te: 'పుస్తకం', bn: 'বই', en: 'Book', translit: 'Pustak' },
  pen: { mr: 'लेखणी / पेन', hi: 'कलम / पेन', ta: 'பேனா', te: 'కలం', bn: 'কলম', en: 'Pen', translit: 'Pen' },
  school: { mr: 'शाळा', hi: 'विद्यालय', ta: 'பள்ளி', te: 'పాఠశాల', bn: 'স্কুল', en: 'School', translit: 'Shaala' },
  home: { mr: 'घर', hi: 'घर', ta: 'வீடு', te: 'ఇల్లు', bn: 'বাড়ি', en: 'Home', translit: 'Ghar' },
  village: { mr: 'गाव', hi: 'गाँव', ta: 'கிராமம்', te: 'గ్రామం', bn: 'গ্রাম', en: 'Village', translit: 'Gaav' },
  city: { mr: 'शहर', hi: 'शहर', ta: 'நகரம்', te: 'నగరం', bn: 'শহর', en: 'City', translit: 'Shahar' },
  friend: { mr: 'मित्र', hi: 'दोस्त', ta: 'நண்பர்', te: 'మిత్రుడు', bn: 'বন্ধু', en: 'Friend', translit: 'Mitra' },
  read: { mr: 'वाचा / वाचन', hi: 'पढ़ना', ta: 'படி', te: 'చదువు', bn: 'পড়া', en: 'Read', translit: 'Vaachaa' },
  write: { mr: 'लिहा / लेखन', hi: 'लिखना', ta: 'எழுது', te: 'రాయి', bn: 'লেখা', en: 'Write', translit: 'Lihaa' },
  speak: { mr: 'बोला / बोलणे', hi: 'बोलना', ta: 'பேசு', te: 'మాట్లాడు', bn: 'বলা', en: 'Speak', translit: 'Bolaa' },
  learn: { mr: 'शिका / शिकणे', hi: 'सीखना', ta: 'கற்றுக்கொள்', te: 'నేర్చుకో', bn: 'শেখা', en: 'Learn', translit: 'Shikaa' },
  eat: { mr: 'खा / खाणे', hi: 'खाना', ta: 'சாப்பிடு', te: 'తిను', bn: 'খাওয়া', en: 'Eat', translit: 'Khaa' },
  drink: { mr: 'प्या / पिणे', hi: 'पीना', ta: 'குடி', te: 'త్రాగు', bn: 'পান করা', en: 'Drink', translit: 'Pyaa' },
  sleep: { mr: 'झोपा / झोपणे', hi: 'सोना', ta: 'தூங்கு', te: 'నిద్రించు', bn: 'ঘুমানো', en: 'Sleep', translit: 'Zhopaa' },
  sun: { mr: 'सूर्य', hi: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', en: 'Sun', translit: 'Surya' },
  moon: { mr: 'चंद्र', hi: 'चाँद', ta: 'நிலா', te: 'చంద్రుడు', bn: 'চাঁদ', en: 'Moon', translit: 'Chandra' },
  tree: { mr: 'झाड', hi: 'पेड़', ta: 'மரம்', te: 'చెట్టు', bn: 'গাছ', en: 'Tree', translit: 'Zhaad' },
};

// =========================================================================
// QUERY NORMALIZER FUNCTION (Strips conversational prefaces)
// =========================================================================
function normalizeChatQuery(rawQuery) {
  let cleaned = (rawQuery || '').toLowerCase().trim();

  // Remove punctuation
  cleaned = cleaned.replace(/[?!.,;:]/g, ' ').replace(/\s+/g, ' ').trim();

  // Strip conversational wrappers & filler words
  const prefixes = [
    'how to say',
    'how do i say',
    'how do you say',
    'how can i say',
    'what is the meaning of',
    'what is meaning of',
    'what is',
    'what does',
    'tell me how to say',
    'tell me the meaning of',
    'tell me',
    'translate',
    'how do we say',
    'kaise bole',
    'kaise kahein',
    'kase mhanave',
    'kase bolave',
  ];

  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix + ' ')) {
      cleaned = cleaned.substring(prefix.length).trim();
      break;
    }
  }

  // Strip trailing target language markers: "in marathi", "in hindi", etc.
  const suffixes = [
    'in marathi',
    'in hindi',
    'in tamil',
    'in telugu',
    'in bengali',
    'in english',
    'marathi mein',
    'marathi madhe',
    'hindi mein',
  ];

  for (const suffix of suffixes) {
    if (cleaned.endsWith(' ' + suffix)) {
      cleaned = cleaned.substring(0, cleaned.length - suffix.length).trim();
      break;
    }
  }

  return cleaned || rawQuery.toLowerCase().trim();
}

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
        ? `नमस्कार! मी तुमचा बोलसेतु AI मार्गदर्शक ("अक्षी") आहे. तुम्ही मला ${targetLangName} शिकण्यासाठी कोणताही शब्द, संभाषण किंवा उच्चार विचारू शकता (उदा: 'How are you', 'I am fine', 'Water').`
        : uiLang === 'hi'
        ? `नमस्ते! मैं आपका बोलसेतु AI मार्गदर्शक ("अक्षी") हूँ। आप मुझसे ${targetLangName} सीखने के लिए कोई भी शब्द, वाक्य या उच्चारण पूछ सकते हैं (उदा: 'How are you', 'I am fine', 'Water').`
        : `Hello! I am your BolSetu AI Literacy Companion ("Akshi"). Ask me how to speak or write any word or sentence in ${targetLangName}!`,
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
    const rawClean = raw.trim();
    const qNormalized = normalizeChatQuery(rawClean);
    const qLower = rawClean.toLowerCase();

    // 1. Direct or alias match in CHATBOT_KNOWLEDGE_BASE
    let matchedKey = null;

    // Check exact keys first
    if (CHATBOT_KNOWLEDGE_BASE[qNormalized]) {
      matchedKey = qNormalized;
    } else {
      // Check alias list with both raw and normalized queries
      for (const [key, aliases] of Object.entries(ALIASES)) {
        if (
          aliases.some(
            (alias) =>
              qNormalized === alias.toLowerCase() ||
              qLower === alias.toLowerCase() ||
              qNormalized.includes(alias.toLowerCase()) ||
              qLower.includes(alias.toLowerCase())
          )
        ) {
          matchedKey = key;
          break;
        }
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
          ? `'${rawClean}' चे ${targetLangName} आणि ${uiLangName} मधील अचूक भाषांतर व उच्चार:`
          : uiLang === 'hi'
          ? `'${rawClean}' का ${targetLangName} और ${uiLangName} में सटीक अनुवाद और उच्चारण:`
          : `Here is the translation and pronunciation for '${rawClean}' in ${targetLangName} and ${uiLangName}:`,
        sampleCard: {
          targetWord: targetData.text,
          targetTranslit: targetData.translit,
          targetLang: targetLang,
          meaningWord: uiData.text,
          meaningLang: uiLang,
        },
      };
    }

    // 2. Vocabulary dictionary lookup (WORD_TRANSLATIONS)
    const singleWordKey = qNormalized.replace(/\s+/g, '');
    if (WORD_TRANSLATIONS[singleWordKey] || WORD_TRANSLATIONS[qNormalized]) {
      const wData = WORD_TRANSLATIONS[singleWordKey] || WORD_TRANSLATIONS[qNormalized];
      const targetWord = wData[targetLang] || wData.en;
      const meaningWord = wData[uiLang] || wData.en;

      return {
        id: 'msg_' + Date.now(),
        sender: 'bot',
        text: uiLang === 'mr'
          ? `'${rawClean}' चा अर्थ आणि उच्चार:`
          : uiLang === 'hi'
          ? `'${rawClean}' का अर्थ और उच्चारण:`
          : `Here is the translation and pronunciation for '${rawClean}':`,
        sampleCard: {
          targetWord: targetWord,
          targetTranslit: wData.translit || targetWord,
          targetLang: targetLang,
          meaningWord: meaningWord,
          meaningLang: uiLang,
        },
      };
    }

    // 3. Intelligent Multi-token recognition
    const words = qNormalized.split(' ');
    const matchedTokens = [];
    for (const w of words) {
      if (WORD_TRANSLATIONS[w]) {
        matchedTokens.push({
          orig: w,
          target: WORD_TRANSLATIONS[w][targetLang] || w,
          ui: WORD_TRANSLATIONS[w][uiLang] || w,
          translit: WORD_TRANSLATIONS[w].translit || w,
        });
      }
    }

    if (matchedTokens.length > 0) {
      const combinedTarget = matchedTokens.map((t) => t.target).join(' ');
      const combinedMeaning = matchedTokens.map((t) => t.ui).join(' ');
      const combinedTranslit = matchedTokens.map((t) => t.translit).join(' ');

      return {
        id: 'msg_' + Date.now(),
        sender: 'bot',
        text: uiLang === 'mr'
          ? `'${rawClean}' मधील महत्त्वाचे शब्द व ${targetLangName} मधील अर्थ:`
          : uiLang === 'hi'
          ? `'${rawClean}' के मुख्य शब्द और ${targetLangName} में अर्थ:`
          : `Practicing key vocabulary for '${rawClean}' in ${targetLangName}:`,
        sampleCard: {
          targetWord: combinedTarget,
          targetTranslit: combinedTranslit,
          targetLang: targetLang,
          meaningWord: combinedMeaning,
          meaningLang: uiLang,
        },
      };
    }

    // 4. Smart Indic Educational Card (Never echoes untranslated English under Indic)
    const langDefaultWord =
      targetLang === 'mr'
        ? `सराव शब्द: "${rawClean}"`
        : targetLang === 'hi'
        ? `अभ्यास शब्द: "${rawClean}"`
        : targetLang === 'ta'
        ? `பயிற்சி சொல்: "${rawClean}"`
        : targetLang === 'te'
        ? `అభ్యాస పదం: "${rawClean}"`
        : targetLang === 'bn'
        ? `অনুশীলন শব্দ: "${rawClean}"`
        : `Practice Word: "${rawClean}"`;

    return {
      id: 'msg_' + Date.now(),
      sender: 'bot',
      text: uiLang === 'mr'
        ? `'${rawClean}' साठी ${targetLangName} साहाय्यक. उच्चार ऐकण्यासाठी खालील स्पीकर बटण दाबा:`
        : uiLang === 'hi'
        ? `'${rawClean}' के लिए ${targetLangName} अभ्यास। सही उच्चारण सुनने के लिए स्पीकर बटन दबाएं:`
        : `Practicing '${rawClean}' in ${targetLangName}. Tap the audio button below to listen:`,
      sampleCard: {
        targetWord: rawClean,
        targetTranslit: `Say clearly: "${rawClean}"`,
        targetLang: targetLang,
        meaningWord: `${rawClean} (${uiLangName})`,
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
    }, 380);
  };

  const quickChips = [
    { label: '👋 How are you?', query: 'how are you' },
    { label: '😊 I am fine', query: 'i am fine' },
    { label: targetLang === 'ta' ? '💧 Water (தண்ணீர்)' : '💧 Water (पाणी / जल)', query: 'water' },
    { label: '🙏 Thank You', query: 'thank you' },
    { label: '🏥 Hospital / Clinic', query: 'hospital' },
    { label: '🚌 Bus & Stop', query: 'bus stop' },
    { label: '🔢 Numbers 1-5', query: 'numbers' },
    { label: '👩 Mother (आई / माँ)', query: 'mother' },
  ];

  return (
    <>
      {/* Floating Mascot Trigger Button (Responsive class handles mobile height & placement) */}
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
                  padding: '5px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-sm)',
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
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          color: '#fff',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(79, 70, 229, 0.35)',
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
                          width: '32px',
                          height: '32px',
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
              placeholder={uiLang === 'mr' ? 'शब्द किंवा वाक्य विचारा (उदा. I am fine)...' : uiLang === 'hi' ? 'शब्द या वाक्य पूछें (उदा. I am fine)...' : 'Ask any word or sentence (e.g. I am fine)...'}
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
