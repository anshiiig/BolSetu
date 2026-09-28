import React, { useEffect, useState } from 'react';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';
import { BolSetuMascotIcon } from './BolSetuLogo';
import { sfx } from '../services/soundEffects';

/**
 * PwaInstallBanner: 1-Tap Mobile App Install Banner
 * Allows mobile learners to install BolSetu as a standalone home-screen app.
 */
export function PwaInstallBanner({ uiLang = 'en' }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Check if user dismissed it this session
      if (!sessionStorage.getItem('bolsetu_pwa_dismissed')) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    sfx.playPop();
    if (!deferredPrompt) {
      // If iOS Safari or prompt not ready, show manual guide
      alert(
        uiLang === 'en'
          ? 'To install BolSetu: Tap Share (⎋) in your browser and select "Add to Home Screen" (➕)!'
          : 'बोलसेतु ऐप इंस्टॉल करने के लिए: ब्राउज़र में Share (⎋) दबाएं और "Add to Home Screen" (➕) चुनें!'
      );
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      sfx.playSuccess();
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sfx.playPop();
    setIsVisible(false);
    sessionStorage.setItem('bolsetu_pwa_dismissed', 'true');
  };

  if (!isVisible || isInstalled) return null;

  return (
    <div
      className="pwa-install-banner"
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '16px',
        right: '16px',
        maxWidth: '480px',
        margin: '0 auto',
        zIndex: 99,
        background: 'linear-gradient(135deg, #1E1B4B, #312E81)',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 10px 30px rgba(30, 27, 75, 0.4), 0 0 0 2px rgba(88, 204, 2, 0.5)',
        animation: 'pop-up 0.3s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        <BolSetuMascotIcon size={38} animated={false} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>{uiLang === 'en' ? 'Install BolSetu App' : 'बोलसेतु ऐप इंस्टॉल करें'}</span>
            <span style={{ fontSize: '0.65rem', background: '#58CC02', color: '#000', padding: '1px 5px', borderRadius: '4px', fontWeight: 900 }}>
              FREE
            </span>
          </div>
          <div style={{ fontSize: '0.74rem', opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {uiLang === 'en' ? 'Play offline, instant audio & notifications' : 'ऑफ़लाइन अभ्यास, तेज़ आवाज़ और आसान पढ़ाई'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        <button
          className="btn-3d"
          onClick={handleInstallClick}
          style={{
            background: '#58CC02',
            color: '#000',
            border: 'none',
            padding: '6px 14px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 900,
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 3px 0 #46A302',
            cursor: 'pointer',
          }}
        >
          <Download size={14} strokeWidth={3} />
          <span>{uiLang === 'en' ? 'Install' : 'इंस्टॉल'}</span>
        </button>

        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '26px',
            height: '26px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            cursor: 'pointer',
          }}
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
