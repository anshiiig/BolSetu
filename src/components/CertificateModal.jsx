import React from 'react';
import { Award, Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { sfx } from '../services/soundEffects';

const CERT_STRINGS = {
  hi: {
    modalTitle: '🎓 साक्षरता उपलब्धि प्रमाणपत्र',
    certTitle: 'बोलसेतु साक्षरता सम्मान',
    certSubtitle: 'BolSetu Certificate of Foundational Literacy',
    certifyThat: 'यह प्रमाणित किया जाता है कि',
    achievementDesc: (user, targetLang, words) =>
      `ने बोलसेतु (BolSetu) मंच पर ${targetLang} भाषा में बुनियादी अक्षरों, ध्वनियों, एवं ${words} से अधिक दैनिक शब्दों की पहचान और शुद्ध उच्चारण में उत्कृष्ट सफलता प्राप्त की है।`,
    lessonsLabel: 'पूर्ण पाठ',
    wordsLabel: 'शब्द सिद्धि',
    wordsUnit: 'शब्द',
    dateLabel: 'दिनांक',
    guideRole: 'AI साक्षरता मार्गदर्शक',
    orgRole: 'राष्ट्रीय साक्षरता मिशन',
    closeBtn: 'बंद करें',
    printBtn: 'प्रमाणपत्र प्रिंट / डाउनलोड करें',
  },
  mr: {
    modalTitle: '🎓 साक्षरता संपादन प्रमाणपत्र',
    certTitle: 'बोलसेतु साक्षरता गौरव पुरस्कार',
    certSubtitle: 'BolSetu Certificate of Foundational Literacy',
    certifyThat: 'याद्वारे प्रमाणित करण्यात येते की',
    achievementDesc: (user, targetLang, words) =>
      `यांनी बोलसेतु (BolSetu) मंचावर ${targetLang} भाषेतील पायाभूत अक्षरे, उच्चार, आणि ${words} पेक्षा अधिक दैनंदिन शब्दांचे आकलन व अचूक वाचन यशस्वीरीत्या पूर्ण केले आहे.`,
    lessonsLabel: 'पूर्ण धडे',
    wordsLabel: 'शब्द प्रभुत्व',
    wordsUnit: 'शब्द',
    dateLabel: 'तारीख',
    guideRole: 'AI साक्षरता मार्गदर्शक',
    orgRole: 'डिजिटल साक्षरता अभियान',
    closeBtn: 'बंद करा',
    printBtn: 'प्रमाणपत्र प्रिंट / डाउनलोड करा',
  },
  ta: {
    modalTitle: '🎓 எழுத்தறிவு சாதனை சான்றிதழ்',
    certTitle: 'போல்சேது எழுத்தறிவு கௌரவச் சான்றிதழ்',
    certSubtitle: 'BolSetu Certificate of Foundational Literacy',
    certifyThat: 'சான்றளிக்கப்படுவது யாதெனில்',
    achievementDesc: (user, targetLang, words) =>
      `போல்சேது (BolSetu) தளத்தில் ${targetLang} மொழியின் அடிப்படை எழுத்துக்கள், ஒலிகள் மற்றும் ${words}-க்கும் மேற்பட்ட அன்றாட சொற்களை அடையாளம் கண்டு சரியாய் உச்சரிக்கும் திறனை வெற்றிகரமாகப் பெற்றுள்ளார்.`,
    lessonsLabel: 'முடிக்கப்பட்ட பாடங்கள்',
    wordsLabel: 'சொல் தேர்ச்சி',
    wordsUnit: 'சொற்கள்',
    dateLabel: 'தேதி',
    guideRole: 'AI எழுத்தறிவு வழிகாட்டி',
    orgRole: 'தேசிய எழுத்தறிவு இயக்கம்',
    closeBtn: 'மூடு',
    printBtn: 'சான்றிதழை அச்சிடுக / பதிவிறக்குக',
  },
  te: {
    modalTitle: '🎓 అక్షరాస్యత సాధన ధృవీకరణ పత్రం',
    certTitle: 'బోల్ సేతు అక్షరాస్యత పురస్కారం',
    certSubtitle: 'BolSetu Certificate of Foundational Literacy',
    certifyThat: 'దీని ద్వారా ధృవీకరించడమైనది ఏమిటంటే',
    achievementDesc: (user, targetLang, words) =>
      `బోల్ సేతు (BolSetu) వేదికపై ${targetLang} భాషలో ప్రాథమిక అక్షరాలు, ధ్వనులు మరియు ${words} కు పైగా రోజువారీ పదాలను గుర్తించి సరైన ఉచ్ఛారణలో విశేష విజయం సాధించారు.`,
    lessonsLabel: 'పూర్తయిన పాఠాలు',
    wordsLabel: 'పద పాండిత్యం',
    wordsUnit: 'పదాలు',
    dateLabel: 'తేదీ',
    guideRole: 'AI అక్షరాస్యత మార్గదర్శి',
    orgRole: 'డిజిటల్ అక్షరాస్యత మిషన్',
    closeBtn: 'మూసివేయి',
    printBtn: 'సర్టిఫికేట్ ప్రింట్ / డౌన్‌లోడ్ చేయండి',
  },
  bn: {
    modalTitle: '🎓 সাক্ষরতা অর্জন শংসাপত্র',
    certTitle: 'বোলসেতু সাক্ষরতা সম্মাননা',
    certSubtitle: 'BolSetu Certificate of Foundational Literacy',
    certifyThat: 'এই মর্মে প্রত্যয়ন করা হচ্ছে যে',
    achievementDesc: (user, targetLang, words) =>
      `বোলসেতু (BolSetu) মঞ্চে ${targetLang} ভাষার মৌলিক বর্ণ, ধ্বনি এবং ${words}-এর বেশি দৈনন্দিন শব্দ শনাক্তকরণ ও সঠিক উচ্চারণে অসাধারণ সাফল্য অর্জন করেছেন।`,
    lessonsLabel: 'সম্পূর্ণ পাঠ',
    wordsLabel: 'শব্দ দক্ষতা',
    wordsUnit: 'শব্দ',
    dateLabel: 'তারিখ',
    guideRole: 'AI সাক্ষরতা নির্দেশক',
    orgRole: 'জাতীয় সাক্ষরতা অভিযান',
    closeBtn: 'বন্ধ করুন',
    printBtn: 'শংসাপত্র প্রিন্ট / ডাউনলোড করুন',
  },
  en: {
    modalTitle: '🎓 Literacy Achievement Certificate',
    certTitle: 'BolSetu Foundational Literacy Award',
    certSubtitle: 'BolSetu Certificate of Foundational Literacy',
    certifyThat: 'This is proudly presented to certify that',
    achievementDesc: (user, targetLang, words) =>
      `has demonstrated outstanding proficiency in recognizing foundational letters, sounds, and mastering over ${words} essential everyday vocabulary words in ${targetLang} on the BolSetu platform.`,
    lessonsLabel: 'Lessons Completed',
    wordsLabel: 'Words Mastered',
    wordsUnit: 'words',
    dateLabel: 'Date',
    guideRole: 'AI Literacy Guide',
    orgRole: 'National Literacy Initiative',
    closeBtn: 'Close',
    printBtn: 'Print / Download Certificate',
  },
};

export function CertificateModal({
  isOpen,
  onClose,
  userName = 'शिक्षार्थी (Learner)',
  targetLangName = 'मराठी (Marathi)',
  uiLang = 'en',
  wordsMastered = 18,
  lessonsCompleted = 5,
  date = new Date().toLocaleDateString(),
}) {
  if (!isOpen) return null;

  const t = CERT_STRINGS[uiLang] || CERT_STRINGS.en;

  const handlePrint = () => {
    sfx.playPop();
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="lesson-modal"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="lesson-header">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            {t.modalTitle}
          </h3>
          <button className="icon-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            ✕
          </button>
        </div>

        <div className="lesson-body">
          {/* Printable Certificate Template */}
          <div
            id="printable-certificate"
            style={{
              background: 'linear-gradient(135deg, #FFFDF5, #FEF9C3)',
              border: '6px double #D97706',
              borderRadius: '16px',
              padding: '36px 24px',
              textAlign: 'center',
              boxShadow: '0 8px 24px rgba(217, 119, 6, 0.15)',
              position: 'relative',
            }}
          >
            {/* Corner Decorative stars */}
            <div style={{ position: 'absolute', top: '12px', left: '12px', color: '#D97706', fontSize: '1.2rem' }}>★</div>
            <div style={{ position: 'absolute', top: '12px', right: '12px', color: '#D97706', fontSize: '1.2rem' }}>★</div>
            <div style={{ position: 'absolute', bottom: '12px', left: '12px', color: '#D97706', fontSize: '1.2rem' }}>★</div>
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', color: '#D97706', fontSize: '1.2rem' }}>★</div>

            {/* Emblem */}
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFC800, #F59E0B)',
                margin: '0 auto 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
              }}
            >
              <Award size={40} />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#78350F', marginBottom: '4px', letterSpacing: '1px' }}>
              {t.certTitle}
            </h2>
            <div style={{ fontSize: '0.9rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
              {t.certSubtitle}
            </div>

            <p style={{ fontSize: '1rem', color: '#451A03', marginBottom: '8px' }}>
              {t.certifyThat}
            </p>

            <div
              style={{
                fontSize: '1.9rem',
                fontWeight: 900,
                color: '#1E3A8A',
                borderBottom: '2px dashed #B45309',
                display: 'inline-block',
                padding: '2px 24px',
                marginBottom: '16px',
                fontFamily: 'var(--font-indic)',
              }}
            >
              {userName}
            </div>

            <p style={{ fontSize: '0.95rem', color: '#451A03', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto 24px' }}>
              {t.achievementDesc(userName, targetLangName, wordsMastered)}
            </p>

            {/* Badges row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '8px 14px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700, display: 'block' }}>{t.lessonsLabel}</span>
                <strong style={{ fontSize: '1.1rem', color: '#78350F' }}>{lessonsCompleted}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '8px 14px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700, display: 'block' }}>{t.wordsLabel}</span>
                <strong style={{ fontSize: '1.1rem', color: '#78350F' }}>{wordsMastered} {t.wordsUnit}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '8px 14px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700, display: 'block' }}>{t.dateLabel}</span>
                <strong style={{ fontSize: '1rem', color: '#78350F' }}>{date}</strong>
              </div>
            </div>

            {/* Signature & Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'cursive', fontSize: '1.2rem', color: '#1E3A8A' }}>Akshi (अक्षी)</div>
                <div style={{ borderTop: '1px solid #B45309', width: '120px', fontSize: '0.75rem', color: '#78350F', fontWeight: 700 }}>
                  {t.guideRole}
                </div>
              </div>

              <div
                style={{
                  border: '2px solid #D97706',
                  borderRadius: '50%',
                  width: '54px',
                  height: '54px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D97706',
                  fontWeight: 900,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                }}
              >
                Verified
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#1E3A8A' }}>BolSetu (बोलसेतु)</div>
                <div style={{ borderTop: '1px solid #B45309', width: '120px', fontSize: '0.75rem', color: '#78350F', fontWeight: 700 }}>
                  {t.orgRole}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lesson-footer">
          <button className="btn-3d btn-outline" onClick={onClose}>
            {t.closeBtn}
          </button>
          <button className="btn-3d btn-primary" onClick={handlePrint}>
            <Printer size={18} />
            {t.printBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
