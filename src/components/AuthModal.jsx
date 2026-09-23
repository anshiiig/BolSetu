import React, { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../services/audioEngine';
import { UI_TRANSLATIONS, getLocalizedLanguageName } from '../data/uiTranslations';
import { sfx } from '../services/soundEffects';
import { Sparkles, CheckCircle2, User, Mail, Lock, Volume2, ArrowRight, AlertCircle } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';

export function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login', // 'login' | 'register'
  onAuthSuccess,
  uiLang = 'en',
  setUiLang,
}) {
  const [mode, setMode] = useState(initialMode);
  const [loginTab, setLoginTab] = useState('learner'); // 'learner' | 'admin'
  const [adminSubMode, setAdminSubMode] = useState('login'); // 'login' | 'register'
  const [adminName, setAdminName] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');
  const [regStep, setRegStep] = useState(1);
  const [authError, setAuthError] = useState('');

  // Form Fields
  const [selectedUiLang, setSelectedUiLang] = useState(uiLang);
  const [selectedTargetLang, setSelectedTargetLang] = useState('mr'); // Default Marathi
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(28);
  const [ageGroup, setAgeGroup] = useState('adult'); // 'child' | 'adult' | 'senior'
  const [proficiency, setProficiency] = useState('beginner');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [startPath, setStartPath] = useState('placement'); // 'basics' | 'placement'

  // Synchronize mode whenever modal is opened with initialMode
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode || 'login');
      setLoginTab('learner');
      setAdminSubMode('login');
      setAuthError('');
      setAdminSuccessMsg('');
      setRegStep(1);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const t = UI_TRANSLATIONS[selectedUiLang] || UI_TRANSLATIONS.en;

  const getRegisteredUsers = () => {
    try {
      const stored = localStorage.getItem('akshar_registered_users');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveRegisteredUser = (userObj) => {
    try {
      const users = getRegisteredUsers();
      const filtered = users.filter((u) => u.email.toLowerCase() !== userObj.email.toLowerCase());
      filtered.push(userObj);
      localStorage.setItem('akshar_registered_users', JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to save user:', e);
    }
  };

  const getApprovedAdmins = () => {
    try {
      const stored = localStorage.getItem('akshar_approved_admins');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const getPendingAdminRequests = () => {
    try {
      const stored = localStorage.getItem('akshar_pending_admin_requests');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const handleAgeChange = (val) => {
    const num = Number(val);
    setAge(num);
    if (num < 15) setAgeGroup('child');
    else if (num > 50) setAgeGroup('senior');
    else setAgeGroup('adult');
  };

  // Handle Admin Registration Request
  const handleAdminRegisterSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAuthError('');
    setAdminSuccessMsg('');
    const cleanName = (adminName || '').trim();
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanName) {
      setAuthError(selectedUiLang === 'en' ? 'Please enter your full name.' : 'कृपया अपना पूरा नाम दर्ज करें।');
      sfx.playError();
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setAuthError(selectedUiLang === 'en' ? 'Please enter a valid email address.' : 'कृपया एक मान्य ईमेल दर्ज करें।');
      sfx.playError();
      return;
    }
    if (!cleanPassword || cleanPassword.length < 4) {
      setAuthError(selectedUiLang === 'en' ? 'Password must be at least 4 characters.' : 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।');
      sfx.playError();
      return;
    }

    // Strict uniqueness check across all users, approved admins, and pending requests
    const learners = getRegisteredUsers();
    const approvedAdmins = getApprovedAdmins();
    const pendingAdmins = getPendingAdminRequests();

    if (
      cleanEmail === 'anshigupta17051@gmail.com' ||
      learners.some((u) => u.email.toLowerCase() === cleanEmail) ||
      approvedAdmins.some((a) => a.email.toLowerCase() === cleanEmail) ||
      pendingAdmins.some((p) => p.email.toLowerCase() === cleanEmail)
    ) {
      setAuthError(
        selectedUiLang === 'en'
          ? 'This email is already registered! Duplicate registrations are not permitted.'
          : 'यह ईमेल पहले से पंजीकृत है! दोबारा पंजीकरण की अनुमति नहीं है।'
      );
      sfx.playError();
      return;
    }

    const newRequest = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      status: 'pending',
      requestedAt: new Date().toLocaleString(),
    };

    pendingAdmins.push(newRequest);
    localStorage.setItem('akshar_pending_admin_requests', JSON.stringify(pendingAdmins));

    sfx.playSuccess();
    setAdminSuccessMsg(
      selectedUiLang === 'en'
        ? 'Admin registration request submitted! Awaiting approval from Chief Administrator (anshigupta17051@gmail.com). You will be able to log in once approved.'
        : 'व्यवस्थापक पंजीकरण अनुरोध भेजा गया! मुख्य व्यवस्थापक (anshigupta17051@gmail.com) द्वारा अनुमोदन की प्रतीक्षा है।'
    );
    setAdminSubMode('login');
  };

  const handleLoginSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setAuthError('');
    setAdminSuccessMsg('');
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Check for Admin Portal Login
    if (loginTab === 'admin' || cleanEmail === 'anshigupta17051@gmail.com') {
      // 1. Check if it's the Chief / Main Admin
      if (cleanEmail === 'anshigupta17051@gmail.com') {
        if (cleanPassword !== 'anii1234') {
          setAuthError(
            selectedUiLang === 'en'
              ? 'Incorrect password for Chief Administrator.'
              : 'मुख्य व्यवस्थापक के लिए गलत पासवर्ड।'
          );
          sfx.playError();
          return;
        }
        sfx.playSuccess();
        const mainAdminUser = {
          name: 'Anshi Gupta (Chief Administrator)',
          email: 'anshigupta17051@gmail.com',
          role: 'super_admin',
          uiLang: selectedUiLang,
          targetLang: selectedTargetLang,
          isRegistered: true,
          testCompleted: true,
        };
        onAuthSuccess(mainAdminUser);
        return;
      }

      // 2. Check if it's an approved admin
      const approvedAdmins = getApprovedAdmins();
      const approvedMatch = approvedAdmins.find((a) => a.email.toLowerCase() === cleanEmail);

      if (approvedMatch) {
        if (approvedMatch.password !== cleanPassword) {
          setAuthError(
            selectedUiLang === 'en'
              ? 'Incorrect admin password.'
              : 'गलत व्यवस्थापक पासवर्ड।'
          );
          sfx.playError();
          return;
        }
        sfx.playSuccess();
        const adminUser = {
          name: approvedMatch.name || 'System Administrator',
          email: approvedMatch.email,
          role: 'admin',
          uiLang: selectedUiLang,
          targetLang: selectedTargetLang,
          isRegistered: true,
          testCompleted: true,
        };
        onAuthSuccess(adminUser);
        return;
      }

      // 3. Check if it's a pending admin request
      const pendingAdmins = getPendingAdminRequests();
      const pendingMatch = pendingAdmins.find((p) => p.email.toLowerCase() === cleanEmail);

      if (pendingMatch) {
        setAuthError(
          selectedUiLang === 'en'
            ? 'Your admin registration request is pending approval by Chief Administrator (anshigupta17051@gmail.com).'
            : 'आपका व्यवस्थापक पंजीकरण अनुरोध मुख्य व्यवस्थापक (anshigupta17051@gmail.com) द्वारा अनुमोदन की प्रतीक्षा में है।'
        );
        sfx.playError();
        return;
      }

      // Not found
      setAuthError(
        selectedUiLang === 'en'
          ? 'Admin account not found. Please register for admin access or verify credentials.'
          : 'व्यवस्थापक खाता नहीं मिला। कृपया व्यवस्थापक पंजीकरण करें।'
      );
      sfx.playError();
      return;
    }

    if (!cleanEmail) {
      setAuthError(selectedUiLang === 'en' ? 'Please enter your email address.' : 'कृपया अपना ईमेल पता दर्ज करें।');
      sfx.playError();
      return;
    }

    const users = getRegisteredUsers();
    const existingUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existingUser) {
      // If password was set during registration, check it
      if (existingUser.password && cleanPassword && existingUser.password !== cleanPassword) {
        setAuthError(
          selectedUiLang === 'en'
            ? 'Incorrect password. Please verify and try again.'
            : 'गलत पासवर्ड। कृपया पुनः प्रयास करें।'
        );
        sfx.playError();
        return;
      }

      sfx.playSuccess();
      onAuthSuccess({
        ...existingUser,
        isRegistered: true,
      });
    } else {
      // First-time direct email login: create account with username derived from email
      const usernamePart = cleanEmail.split('@')[0];
      const derivedName = usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1);
      const newUser = {
        name: derivedName,
        email: cleanEmail,
        password: cleanPassword,
        uiLang: selectedUiLang,
        targetLang: selectedTargetLang,
        age: 28,
        ageGroup: 'adult',
        proficiency: 'beginner',
        startPath: 'basics',
        testCompleted: true, // Login doesn't force re-test
        isRegistered: true,
      };
      saveRegisteredUser(newUser);
      sfx.playSuccess();
      onAuthSuccess(newUser);
    }
  };

  const handleRegNext = () => {
    sfx.playPop();
    setAuthError('');

    if (regStep === 2) {
      if (!fullName.trim()) {
        setAuthError(selectedUiLang === 'en' ? 'Please enter your name.' : 'कृपया अपना नाम दर्ज करें।');
        sfx.playError();
        return;
      }
    }

    if (regStep < 4) {
      setRegStep(regStep + 1);
    } else {
      // Final Step 4: Validate email & uniqueness
      const cleanEmail = (email || '').trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        setAuthError(selectedUiLang === 'en' ? 'Please enter a valid email address.' : 'कृपया एक मान्य ईमेल दर्ज करें।');
        sfx.playError();
        return;
      }

      const users = getRegisteredUsers();
      const approvedAdmins = getApprovedAdmins();
      const pendingAdmins = getPendingAdminRequests();
      const alreadyExists =
        cleanEmail === 'anshigupta17051@gmail.com' ||
        users.some((u) => u.email.toLowerCase() === cleanEmail) ||
        approvedAdmins.some((a) => a.email.toLowerCase() === cleanEmail) ||
        pendingAdmins.some((p) => p.email.toLowerCase() === cleanEmail);

      if (alreadyExists) {
        setAuthError(
          selectedUiLang === 'en'
            ? 'This email is already registered! Duplicate registrations are not permitted.'
            : 'यह ईमेल पहले से पंजीकृत है! दोबारा पंजीकरण की अनुमति नहीं है।'
        );
        sfx.playError();
        return;
      }

      sfx.playSuccess();
      const newUser = {
        name: fullName.trim() || cleanEmail.split('@')[0],
        email: cleanEmail,
        password: password.trim(),
        uiLang: selectedUiLang,
        targetLang: selectedTargetLang,
        age,
        ageGroup,
        proficiency,
        startPath,
        testCompleted: false, // New registration takes initial test
        isRegistered: true,
      };
      saveRegisteredUser(newUser);
      onAuthSuccess(newUser);
    }
  };

  const stepTitles = {
    1: t.stepLanguage,
    2: t.stepProfile,
    3: t.stepProficiency,
    4: t.stepAccount,
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="lesson-modal"
        style={{ maxWidth: '580px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Mode Switcher */}
        <div className="lesson-header">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                sfx.playPop();
                setMode('login');
                setAuthError('');
              }}
            >
              {t.login}
            </button>
            <button
              className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => {
                sfx.playPop();
                setMode('register');
                setAuthError('');
              }}
            >
              {t.register}
            </button>
          </div>

          <button className="icon-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="lesson-body">
          {/* Global Auth Error Alert */}
          {authError && (
            <div
              style={{
                marginBottom: '16px',
                padding: '12px 16px',
                borderRadius: '10px',
                background: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.88rem',
                fontWeight: 700,
                border: '1px solid #FCA5A5',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} />
                <span>{authError}</span>
              </div>
              {authError.includes('लॉग इन') || authError.includes('log in') ? (
                <button
                  type="button"
                  className="btn-3d btn-primary"
                  onClick={() => {
                    sfx.playPop();
                    setMode('login');
                    setAuthError('');
                  }}
                  style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                >
                  {t.login}
                </button>
              ) : null}
            </div>
          )}

          {/* =========================================================
              LOGIN MODE
             ========================================================= */}
          {mode === 'login' ? (
            <div>
              {/* Segmented Selector: Learner vs Admin Portal */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  background: 'var(--bg-main)',
                  padding: '4px',
                  borderRadius: '12px',
                  marginBottom: '18px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <button
                  type="button"
                  className={`tab-btn ${loginTab === 'learner' ? 'active' : ''}`}
                  onClick={() => {
                    sfx.playPop();
                    setLoginTab('learner');
                    setAuthError('');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  👤 {selectedUiLang === 'en' ? 'Learner Login' : selectedUiLang === 'mr' ? 'शिकणारा प्रवेश' : 'शिक्षार्थी लॉगिन'}
                </button>
                <button
                  type="button"
                  className={`tab-btn ${loginTab === 'admin' ? 'active' : ''}`}
                  onClick={() => {
                    sfx.playPop();
                    setLoginTab('admin');
                    setAdminSubMode('login');
                    setAuthError('');
                    setAdminSuccessMsg('');
                    setEmail('');
                    setPassword('');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  🛡️ {selectedUiLang === 'en' ? 'Admin Portal' : selectedUiLang === 'mr' ? 'प्रशासक पोर्टल' : 'व्यवस्थापक पोर्टल'}
                </button>
              </div>

              {/* Admin Mode Sub-Navigation Toggle */}
              {loginTab === 'admin' && (
                <div
                  style={{
                    display: 'flex',
                    gap: '6px',
                    background: 'var(--bg-main)',
                    padding: '4px',
                    borderRadius: '10px',
                    marginBottom: '16px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop();
                      setAdminSubMode('login');
                      setAuthError('');
                      setAdminSuccessMsg('');
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      background: adminSubMode === 'login' ? 'var(--bg-card)' : 'transparent',
                      color: adminSubMode === 'login' ? 'var(--primary)' : 'var(--text-muted)',
                      boxShadow: adminSubMode === 'login' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    🛡️ {selectedUiLang === 'en' ? 'Admin Login' : 'व्यवस्थापक लॉगिन'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sfx.playPop();
                      setAdminSubMode('register');
                      setAuthError('');
                      setAdminSuccessMsg('');
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      background: adminSubMode === 'register' ? 'var(--bg-card)' : 'transparent',
                      color: adminSubMode === 'register' ? 'var(--primary)' : 'var(--text-muted)',
                      boxShadow: adminSubMode === 'register' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    📝 {selectedUiLang === 'en' ? 'Request Admin Access' : 'व्यवस्थापक नोंदणी'}
                  </button>
                </div>
              )}

              {/* Success Notification Message for Admin Requests */}
              {adminSuccessMsg && (
                <div
                  style={{
                    background: 'rgba(88, 204, 2, 0.12)',
                    border: '1px solid #86EFAC',
                    borderRadius: '12px',
                    padding: '14px',
                    color: '#15803D',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    marginBottom: '16px',
                    lineHeight: 1.4,
                  }}
                >
                  <CheckCircle2 size={20} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{adminSuccessMsg}</span>
                </div>
              )}

              {/* Form Submission: Learner Login OR Admin Login OR Admin Registration Request */}
              <form
                onSubmit={
                  loginTab === 'admin' && adminSubMode === 'register'
                    ? handleAdminRegisterSubmit
                    : handleLoginSubmit
                }
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div style={{ textAlign: 'center', marginBottom: '4px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '4px' }}>
                    {loginTab === 'admin' ? (adminSubMode === 'register' ? '📝' : '🛡️') : '👋'}
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900 }}>
                    {loginTab === 'admin'
                      ? adminSubMode === 'register'
                        ? selectedUiLang === 'en'
                          ? 'Request Admin Privileges'
                          : 'व्यवस्थापक प्रवेश नोंदणी'
                        : selectedUiLang === 'en'
                        ? 'Administrator Login'
                        : 'व्यवस्थापक प्रवेश'
                      : t.loginTitle}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem' }}>
                    {loginTab === 'admin'
                      ? adminSubMode === 'register'
                        ? selectedUiLang === 'en'
                          ? 'Submit registration request for Chief Admin review'
                          : 'मुख्य प्रशासक मंजुरीसाठी नोंदणी विनंती पाठवा'
                        : selectedUiLang === 'en'
                        ? 'Chief Administrator & Approved Staff Login'
                        : 'मुख्य प्रशासक व मान्यताप्राप्त अधिकारी प्रवेश'
                      : t.loginSubtitle}
                  </p>
                </div>

                {/* Admin Registration: Full Name field */}
                {loginTab === 'admin' && adminSubMode === 'register' && (
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                      {selectedUiLang === 'en' ? 'Full Name & Designation' : 'पूर्ण नाव आणि पद'}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        required
                        placeholder={selectedUiLang === 'en' ? 'e.g. Dr. Rajesh Kulkarni' : 'उदा. डॉ. राजेश कुलकर्णी'}
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: '10px',
                          border: '2px solid var(--border-subtle)',
                          background: 'var(--bg-main)',
                          color: 'var(--text-main)',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                    {loginTab === 'admin' ? (selectedUiLang === 'en' ? 'Admin Email Address' : 'व्यवस्थापक ईमेल') : t.emailLabel}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      required
                      placeholder={loginTab === 'admin' ? 'official.admin@bolsetu.gov.in' : 'name@example.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: '10px',
                        border: '2px solid var(--border-subtle)',
                        background: 'var(--bg-main)',
                        color: 'var(--text-main)',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                    {loginTab === 'admin'
                      ? adminSubMode === 'register'
                        ? selectedUiLang === 'en' ? 'Create Admin Password' : 'पासवर्ड तयार करा'
                        : selectedUiLang === 'en' ? 'Admin Password' : 'व्यवस्थापक पासवर्ड'
                      : t.passwordLabel}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 38px',
                        borderRadius: '10px',
                        border: '2px solid var(--border-subtle)',
                        background: 'var(--bg-main)',
                        color: 'var(--text-main)',
                        outline: 'none',
                      }}
                    />
                  </div>
                  {loginTab === 'admin' && adminSubMode === 'register' && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px', lineHeight: 1.35 }}>
                      ℹ️ New registrations are queued for approval by Chief Administrator (<code>anshigupta17051@gmail.com</code>).
                    </span>
                  )}
                  {loginTab === 'admin' && adminSubMode === 'login' && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                      Chief Administrator: <code>anshigupta17051@gmail.com</code>
                    </span>
                  )}
                </div>

                <button
                  className="btn-3d btn-primary"
                  type="submit"
                  style={{
                    marginTop: '8px',
                    padding: '14px',
                    background: loginTab === 'admin' ? 'linear-gradient(135deg, #1E1B4B, #312E81)' : undefined,
                  }}
                >
                  {loginTab === 'admin'
                    ? adminSubMode === 'register'
                      ? selectedUiLang === 'en' ? 'Submit Admin Request ➔' : 'नोंदणी विनंती पाठवा ➔'
                      : selectedUiLang === 'en' ? 'Authenticate as Admin ➔' : 'व्यवस्थापक म्हणून प्रवेश ➔'
                    : t.login}
                </button>

                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <span
                    style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                    onClick={() => {
                      sfx.playPop();
                      setMode('register');
                      setAuthError('');
                    }}
                  >
                    {t.dontHaveAccount}
                  </span>
                </div>
              </form>
            </div>
          ) : (
            /* =========================================================
               REGISTRATION MODE (Step by Step)
               ========================================================= */
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontWeight: 800, color: 'var(--primary-dark)', fontSize: '0.9rem' }}>
                  {selectedUiLang === 'en' ? `Step ${regStep} of 4: ${stepTitles[regStep]}` : `पंजीकरण चरण ${regStep}/4: ${stepTitles[regStep]}`}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {stepTitles[regStep]}
                </span>
              </div>

              {/* STEP 1: UI Language & Target Language */}
              {regStep === 1 && (
                <div>
                  <h4 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '4px' }}>
                    {t.selectUiLang}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
                    {t.uiLangPrompt}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px' }}>
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <div
                        key={l.code}
                        className={`mcq-option ${selectedUiLang === l.code ? 'selected' : ''}`}
                        onClick={() => {
                          sfx.playPop();
                          setSelectedUiLang(l.code);
                          setUiLang(l.code);
                        }}
                        style={{ padding: '10px 6px', fontSize: '0.9rem', fontWeight: 800 }}
                      >
                        {getLocalizedLanguageName(l.code, selectedUiLang)}
                      </div>
                    ))}
                  </div>

                  <h4 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '4px' }}>
                    {t.selectTargetLang}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '14px' }}>
                    {t.targetLangPrompt}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <div
                        key={l.code}
                        className={`mcq-option ${selectedTargetLang === l.code ? 'selected' : ''}`}
                        onClick={() => {
                          sfx.playPop();
                          setSelectedTargetLang(l.code);
                        }}
                        style={{ padding: '14px', textAlign: 'left' }}
                      >
                        <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                          {getLocalizedLanguageName(l.code, selectedUiLang)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{l.script}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 2: Name & Age */}
              {regStep === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                      {t.nameLabel}
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input
                        type="text"
                        required
                        placeholder={t.namePlaceholder}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '12px 14px 12px 38px',
                          borderRadius: '10px',
                          border: '2px solid var(--border-subtle)',
                          background: 'var(--bg-main)',
                          color: 'var(--text-main)',
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '6px', display: 'block' }}>
                      {t.ageLabel} {age} {t.ageUnit}
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="85"
                      value={age}
                      onChange={(e) => handleAgeChange(e.target.value)}
                      style={{ width: '100%', accentColor: 'var(--primary)' }}
                    />
                  </div>

                  {/* Age Track Indicator */}
                  <div
                    style={{
                      background: 'var(--bg-main)',
                      padding: '14px',
                      borderRadius: '12px',
                      border: '2px solid var(--border-subtle)',
                    }}
                  >
                    <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '4px' }}>
                      {ageGroup === 'child' ? t.ageChildShort : ageGroup === 'senior' ? t.ageSeniorShort : t.ageAdultShort}
                    </strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {ageGroup === 'child' ? t.ageChild : ageGroup === 'senior' ? t.ageSenior : t.ageAdult}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 3: Self-Assessed Proficiency */}
              {regStep === 3 && (
                <div>
                  <h4 style={{ fontWeight: 900, fontSize: '1.2rem', marginBottom: '4px' }}>
                    {t.proficiencyTitle}
                  </h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                    {t.proficiencyPrompt}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      { id: 'beginner', title: t.profBeginner, icon: '🌱' },
                      { id: 'letters', title: t.profSomeLetters, icon: '🔤' },
                      { id: 'words', title: t.profSimpleWords, icon: '📖' },
                      { id: 'conversational', title: t.profConversational, icon: '💬' },
                    ].map((item) => (
                      <div
                        key={item.id}
                        className={`mcq-option ${proficiency === item.id ? 'selected' : ''}`}
                        onClick={() => {
                          sfx.playPop();
                          setProficiency(item.id);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          textAlign: 'left',
                          padding: '14px',
                        }}
                      >
                        <span style={{ fontSize: '1.8rem' }}>{item.icon}</span>
                        <span style={{ fontWeight: 800, fontSize: '0.98rem' }}>{item.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4: Email, Password & Starting Choice */}
              {regStep === 4 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '2px solid var(--border-subtle)',
                        background: 'var(--bg-main)',
                        color: 'var(--text-main)',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '4px', display: 'block' }}>
                      {t.passwordLabel}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '2px solid var(--border-subtle)',
                        background: 'var(--bg-main)',
                        color: 'var(--text-main)',
                      }}
                    />
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px', display: 'block' }}>
                      {t.startChoicePrompt}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                      <div
                        className={`mcq-option ${startPath === 'basics' ? 'selected' : ''}`}
                        onClick={() => {
                          sfx.playPop();
                          setStartPath('basics');
                        }}
                        style={{ padding: '14px', textAlign: 'center' }}
                      >
                        <div style={{ fontSize: '1.8rem' }}>🌱</div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{t.startFromBasics}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.startBasicsSub}</span>
                      </div>

                      <div
                        className={`mcq-option ${startPath === 'placement' ? 'selected' : ''}`}
                        onClick={() => {
                          sfx.playPop();
                          setStartPath('placement');
                        }}
                        style={{ padding: '14px', textAlign: 'center' }}
                      >
                        <div style={{ fontSize: '1.8rem' }}>🎯</div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{t.testLevel}</div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.startPlacementSub}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {mode === 'register' && (
          <div className="lesson-footer">
            {regStep > 1 ? (
              <button
                className="btn-3d btn-outline"
                onClick={() => {
                  sfx.playPop();
                  setRegStep(regStep - 1);
                }}
              >
                {t.backBtn}
              </button>
            ) : (
              <div />
            )}

            <button className="btn-3d btn-primary" onClick={handleRegNext}>
              {regStep === 4 ? t.createAccountAndStart : t.continueBtn}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
