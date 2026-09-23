import React, { useRef } from 'react';
import { Award, Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { sfx } from '../services/soundEffects';

export function CertificateModal({
  isOpen,
  onClose,
  userName = 'शिक्षार्थी (Learner)',
  targetLangName = 'हिंदी (Hindi)',
  wordsMastered = 18,
  lessonsCompleted = 5,
  date = new Date().toLocaleDateString(),
}) {
  if (!isOpen) return null;

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
            🎓 साक्षरता उपलब्धि प्रमाणपत्र (Certificate of Achievement)
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
              बोलसेतु साक्षरता सम्मान
            </h2>
            <div style={{ fontSize: '0.9rem', color: '#92400E', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '20px' }}>
              BolSetu Certificate of Foundational Literacy
            </div>

            <p style={{ fontSize: '1rem', color: '#451A03', marginBottom: '8px' }}>
              यह प्रमाणित किया जाता है कि
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
              ने <strong>बोलसेतु (BolSetu)</strong> मंच पर <strong>{targetLangName}</strong> भाषा में बुनियादी अक्षरों, ध्वनियों, एवं <strong>{wordsMastered} से अधिक दैनिक शब्दों</strong> की पहचान और शुद्ध उच्चारण में उत्कृष्ट सफलता प्राप्त की है।
            </p>

            {/* Badges row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '8px 14px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700, display: 'block' }}>पूर्ण पाठ</span>
                <strong style={{ fontSize: '1.1rem', color: '#78350F' }}>{lessonsCompleted}</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '8px 14px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700, display: 'block' }}>शब्द सिद्धि</span>
                <strong style={{ fontSize: '1.1rem', color: '#78350F' }}>{wordsMastered} शब्द</strong>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.7)', padding: '8px 14px', borderRadius: '10px', border: '1px solid #FDE68A' }}>
                <span style={{ fontSize: '0.75rem', color: '#92400E', fontWeight: 700, display: 'block' }}>दिनांक</span>
                <strong style={{ fontSize: '1rem', color: '#78350F' }}>{date}</strong>
              </div>
            </div>

            {/* Signature & Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'cursive', fontSize: '1.2rem', color: '#1E3A8A' }}>बोलू (Bolu AI)</div>
                <div style={{ borderTop: '1px solid #B45309', width: '120px', fontSize: '0.75rem', color: '#78350F', fontWeight: 700 }}>
                  AI साक्षरता मार्गदर्शक
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
                  राष्ट्रीय साक्षरता मिशन
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lesson-footer">
          <button className="btn-3d btn-outline" onClick={onClose}>
            बंद करें (Close)
          </button>
          <button className="btn-3d btn-primary" onClick={handlePrint}>
            <Printer size={18} />
            प्रमाणपत्र प्रिंट / डाउनलोड करें
          </button>
        </div>
      </div>
    </div>
  );
}
