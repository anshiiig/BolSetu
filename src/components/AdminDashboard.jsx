import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Database,
  Volume2,
  Sparkles,
  Search,
  Plus,
  Trash2,
  Award,
  ChevronRight,
  ChevronDown,
  Download,
  LogOut,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Gamepad2,
  Sun,
  Moon,
  Edit3,
  UserCheck,
  UserX,
  Clock,
  BookOpen,
  Check,
  X,
} from 'lucide-react';
import { getCurriculumForLanguage, CURRICULUM_STAGES } from '../data/curriculumData';
import { audioEngine, SUPPORTED_LANGUAGES } from '../services/audioEngine';
import { sfx } from '../services/soundEffects';
import confetti from 'canvas-confetti';

export function AdminDashboard({
  currentUser,
  onLogout,
  onSwitchToLearnerView,
  onUpdateCurrentUser,
  theme = 'light',
  toggleTheme,
}) {
  // Navigation tabs: 'overview' | 'learners' | 'curriculum' | 'games' | 'requests'
  const [activeTab, setActiveTab] = useState('overview');

  const isChiefAdmin = (currentUser?.email || '').toLowerCase() === 'anshigupta17051@gmail.com';

  // =========================================================================
  // PENDING & APPROVED ADMIN MANAGEMENT (Chief Admin Workflow)
  // =========================================================================
  const [pendingRequests, setPendingRequests] = useState(() => {
    try {
      const stored = localStorage.getItem('akshar_pending_admin_requests');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [approvedAdmins, setApprovedAdmins] = useState(() => {
    try {
      const stored = localStorage.getItem('akshar_approved_admins');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const reloadAdminLists = () => {
    try {
      const pending = JSON.parse(localStorage.getItem('akshar_pending_admin_requests') || '[]');
      const approved = JSON.parse(localStorage.getItem('akshar_approved_admins') || '[]');
      setPendingRequests(pending);
      setApprovedAdmins(approved);
    } catch (e) {
      console.warn('Failed to load admin lists:', e);
    }
  };

  const handleApproveAdmin = (requestId) => {
    try {
      const reqToApprove = pendingRequests.find((r) => r.id === requestId);
      if (!reqToApprove) return;

      const updatedPending = pendingRequests.filter((r) => r.id !== requestId);
      const newApproved = {
        ...reqToApprove,
        status: 'approved',
        approvedAt: new Date().toLocaleString(),
      };
      const updatedApproved = [...approvedAdmins.filter((a) => a.email !== reqToApprove.email), newApproved];

      localStorage.setItem('akshar_pending_admin_requests', JSON.stringify(updatedPending));
      localStorage.setItem('akshar_approved_admins', JSON.stringify(updatedApproved));

      setPendingRequests(updatedPending);
      setApprovedAdmins(updatedApproved);

      sfx.playSuccess();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch (e) {
      console.error('Approval failed:', e);
    }
  };

  const handleRejectAdmin = (requestId) => {
    try {
      sfx.playPop();
      const updatedPending = pendingRequests.filter((r) => r.id !== requestId);
      localStorage.setItem('akshar_pending_admin_requests', JSON.stringify(updatedPending));
      setPendingRequests(updatedPending);
    } catch (e) {
      console.error('Rejection failed:', e);
    }
  };

  const handleRevokeAdmin = (email) => {
    if (confirm(`Revoke administrator access for ${email}?`)) {
      sfx.playPop();
      const updated = approvedAdmins.filter((a) => a.email !== email);
      localStorage.setItem('akshar_approved_admins', JSON.stringify(updated));
      setApprovedAdmins(updated);
    }
  };

  // =========================================================================
  // LEARNER MANAGEMENT
  // =========================================================================
  const [learners, setLearners] = useState(() => {
    try {
      const stored = localStorage.getItem('akshar_registered_users');
      const parsed = stored ? JSON.parse(stored) : [];
      if (parsed.length === 0) {
        const defaultLearners = [
          {
            name: 'Aarav Sharma',
            email: 'aarav.sharma@example.in',
            targetLang: 'mr',
            uiLang: 'en',
            age: 12,
            ageGroup: 'child',
            level: 3,
            xp: 240,
            streak: 5,
            isRegistered: true,
          },
          {
            name: 'Priya Deshmukh',
            email: 'priya.deshmukh@example.in',
            targetLang: 'te',
            uiLang: 'mr',
            age: 29,
            ageGroup: 'adult',
            level: 6,
            xp: 580,
            streak: 12,
            isRegistered: true,
          },
          {
            name: 'Ramesh Patel',
            email: 'ramesh.patel@example.in',
            targetLang: 'ta',
            uiLang: 'hi',
            age: 58,
            ageGroup: 'senior',
            level: 2,
            xp: 180,
            streak: 3,
            isRegistered: true,
          },
          {
            name: 'Ananya Roy',
            email: 'ananya.roy@example.in',
            targetLang: 'bn',
            uiLang: 'en',
            age: 22,
            ageGroup: 'adult',
            level: 8,
            xp: 820,
            streak: 19,
            isRegistered: true,
          },
        ];
        localStorage.setItem('akshar_registered_users', JSON.stringify(defaultLearners));
        return defaultLearners;
      }
      return parsed;
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterLang, setFilterLang] = useState('all');

  const persistLearners = (updated) => {
    setLearners(updated);
    try {
      localStorage.setItem('akshar_registered_users', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to persist learners:', e);
    }
  };

  const handleGrantXp = (email) => {
    sfx.playSuccess();
    const updated = learners.map((l) => {
      if (l.email === email) {
        return { ...l, xp: (l.xp || 0) + 50 };
      }
      return l;
    });
    persistLearners(updated);
  };

  const handleResetLevel = (email) => {
    sfx.playPop();
    const updated = learners.map((l) => {
      if (l.email === email) {
        return { ...l, level: 1 };
      }
      return l;
    });
    persistLearners(updated);
  };

  const handleSetMastery = (email) => {
    sfx.playSuccess();
    const updated = learners.map((l) => {
      if (l.email === email) {
        return { ...l, level: 10, xp: Math.max(l.xp || 0, 950) };
      }
      return l;
    });
    persistLearners(updated);
  };

  const handleDeleteLearner = (email) => {
    if (confirm(`Are you sure you want to delete user ${email}?`)) {
      sfx.playPop();
      const updated = learners.filter((l) => l.email !== email);
      persistLearners(updated);
    }
  };

  const handleExportJSON = () => {
    sfx.playPop();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(learners, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bolsetu_learners_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportCSV = () => {
    sfx.playPop();
    const headers = ['Name', 'Email', 'Target Language', 'UI Language', 'Age', 'Level', 'XP', 'Streak'];
    const rows = learners.map((l) => [
      `"${l.name || ''}"`,
      `"${l.email || ''}"`,
      l.targetLang || 'mr',
      l.uiLang || 'en',
      l.age || 25,
      l.level || 1,
      l.xp || 0,
      l.streak || 0,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `bolsetu_learners_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredLearners = learners.filter((l) => {
    const matchesSearch =
      (l.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = filterLang === 'all' || l.targetLang === filterLang;
    return matchesSearch && matchesLang;
  });

  const totalLearners = learners.length;
  const totalXp = learners.reduce((acc, l) => acc + (l.xp || 0), 0);

  // =========================================================================
  // CURRICULUM INSPECTOR & QUESTION CRUD STATE
  // =========================================================================
  const [currTargetLang, setCurrTargetLang] = useState('mr');
  const [expandedLevel, setExpandedLevel] = useState(1);

  // Custom question overrides stored in localStorage: { [lang_level]: [questions] }
  const [customCurriculum, setCustomCurriculum] = useState(() => {
    try {
      const stored = localStorage.getItem('akshar_custom_curriculum');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Active level questions (base curriculum merged with custom additions/edits)
  const defaultCurriculumLevels = getCurriculumForLanguage(currTargetLang, 'en');
  const getActiveLevelQuestions = (levelId) => {
    const key = `${currTargetLang}_${levelId}`;
    if (customCurriculum[key]) {
      return customCurriculum[key];
    }
    const match = defaultCurriculumLevels.find((l) => l.levelId === levelId);
    return match ? match.questions : [];
  };

  // Question Edit / Add Modal State
  const [editingQuestion, setEditingQuestion] = useState(null); // null or { levelId, question, isNew }
  const [qFormData, setQFormData] = useState({
    type: 'word_audio_match',
    targetWord: '',
    translit: '',
    meaning: '',
    instruction: '',
  });

  const handleOpenAddQuestion = (levelId) => {
    sfx.playPop();
    setEditingQuestion({ levelId, isNew: true });
    setQFormData({
      type: 'word_audio_match',
      targetWord: '',
      translit: '',
      meaning: '',
      instruction: 'Listen carefully and select the correct matching word',
    });
  };

  const handleOpenEditQuestion = (levelId, qObj, index) => {
    sfx.playPop();
    setEditingQuestion({ levelId, qIndex: index, isNew: false, id: qObj.id });
    setQFormData({
      type: qObj.type || 'word_audio_match',
      targetWord: qObj.targetWord || qObj.letter || '',
      translit: qObj.translit || '',
      meaning: qObj.meaning || '',
      instruction: qObj.instruction || qObj.hint || '',
    });
  };

  const handleSaveQuestion = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!qFormData.targetWord.trim()) return;

    const levelId = editingQuestion.levelId;
    const key = `${currTargetLang}_${levelId}`;
    const currentQuestions = [...getActiveLevelQuestions(levelId)];

    if (editingQuestion.isNew) {
      const newQ = {
        id: `custom_${Date.now()}`,
        type: qFormData.type,
        targetWord: qFormData.targetWord.trim(),
        translit: qFormData.translit.trim(),
        meaning: qFormData.meaning.trim(),
        instruction: qFormData.instruction.trim(),
        options: [qFormData.targetWord.trim(), 'पानी', 'घर', 'मित्र'],
      };
      currentQuestions.push(newQ);
    } else {
      const idx = editingQuestion.qIndex;
      if (idx >= 0 && idx < currentQuestions.length) {
        currentQuestions[idx] = {
          ...currentQuestions[idx],
          type: qFormData.type,
          targetWord: qFormData.targetWord.trim(),
          translit: qFormData.translit.trim(),
          meaning: qFormData.meaning.trim(),
          instruction: qFormData.instruction.trim(),
        };
      }
    }

    const updatedMap = {
      ...customCurriculum,
      [key]: currentQuestions,
    };
    setCustomCurriculum(updatedMap);
    localStorage.setItem('akshar_custom_curriculum', JSON.stringify(updatedMap));

    sfx.playSuccess();
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (levelId, qIndex) => {
    if (!confirm('Are you sure you want to remove this question?')) return;
    sfx.playPop();
    const key = `${currTargetLang}_${levelId}`;
    const currentQuestions = [...getActiveLevelQuestions(levelId)];
    currentQuestions.splice(qIndex, 1);

    const updatedMap = {
      ...customCurriculum,
      [key]: currentQuestions,
    };
    setCustomCurriculum(updatedMap);
    localStorage.setItem('akshar_custom_curriculum', JSON.stringify(updatedMap));
  };

  // =========================================================================
  // MINI-GAMES & VOCABULARY MANAGER
  // =========================================================================
  const [customGameWords, setCustomGameWords] = useState(() => {
    try {
      const stored = localStorage.getItem('akshar_custom_game_words');
      return stored ? JSON.parse(stored) : [
        { id: 1, word: 'सुप्रभात', translit: 'suprabhat', meaning: 'Good morning', icon: '🌅', lang: 'mr' },
        { id: 2, word: 'मित्र', translit: 'mitra', meaning: 'Friend', icon: '🤝', lang: 'mr' },
        { id: 3, word: 'आनंद', translit: 'anand', meaning: 'Joy / Happiness', icon: '✨', lang: 'hi' },
        { id: 4, word: 'नमस्ते', translit: 'namaste', meaning: 'Greetings', icon: '🙏', lang: 'hi' },
      ];
    } catch {
      return [];
    }
  });

  const [newGameWord, setNewGameWord] = useState({
    word: '',
    translit: '',
    meaning: '',
    icon: '💡',
    lang: 'mr',
  });

  const handleAddGameWord = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newGameWord.word.trim()) return;

    const newItem = {
      id: Date.now(),
      word: newGameWord.word.trim(),
      translit: newGameWord.translit.trim(),
      meaning: newGameWord.meaning.trim(),
      icon: newGameWord.icon.trim() || '💡',
      lang: newGameWord.lang,
    };

    const updated = [newItem, ...customGameWords];
    setCustomGameWords(updated);
    localStorage.setItem('akshar_custom_game_words', JSON.stringify(updated));

    setNewGameWord({ word: '', translit: '', meaning: '', icon: '💡', lang: newGameWord.lang });
    sfx.playSuccess();
  };

  const handleDeleteGameWord = (id) => {
    sfx.playPop();
    const updated = customGameWords.filter((w) => w.id !== id);
    setCustomGameWords(updated);
    localStorage.setItem('akshar_custom_game_words', JSON.stringify(updated));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Admin Navbar Header */}
      <header
        style={{
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)',
          color: '#FFFFFF',
          padding: '16px 28px',
          borderBottom: '2px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #58CC02, #1CB0F6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(88, 204, 2, 0.4)',
            }}
          >
            <Shield size={26} color="#FFFFFF" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              BolSetu Admin Command Center
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '3px', fontSize: '0.82rem', color: '#C7D2FE' }}>
              <span>🛡️ Administrator Portal</span>
              <span>•</span>
              <span>{isChiefAdmin ? 'Chief Administrator (Anshi Gupta)' : 'Authorized Staff'}</span>
            </div>
          </div>
        </div>

        {/* Header Quick Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Light / Dark Mode Toggle Button */}
          {toggleTheme && (
            <button
              className="btn-3d"
              onClick={toggleTheme}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '8px 14px',
                fontSize: '0.85rem',
                fontWeight: 800,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
              title="Toggle Light / Dark Mode"
            >
              {theme === 'dark' ? <Sun size={16} color="#FBBF24" /> : <Moon size={16} color="#C7D2FE" />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          )}

          <button
            className="btn-3d"
            onClick={onSwitchToLearnerView}
            style={{
              background: '#1CB0F6',
              color: '#FFFFFF',
              boxShadow: '0 4px 0 #1899D6',
              padding: '8px 18px',
              fontSize: '0.9rem',
              fontWeight: 800,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Eye size={16} />
            <span>Preview Learner View</span>
          </button>

          <button
            className="btn-3d"
            onClick={onLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '8px 16px',
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Admin Subnav Tabs */}
      <div
        style={{
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 28px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
        }}
      >
        {[
          { id: 'overview', label: '📊 System Overview & KPIs' },
          { id: 'learners', label: `👥 Learner Roster (${learners.length})` },
          { id: 'curriculum', label: '📚 Curriculum Inspector & Editor (900 Qs)' },
          { id: 'games', label: `🎮 Mini-Games & Vocabulary (${customGameWords.length})` },
          ...(isChiefAdmin
            ? [{ id: 'requests', label: `🛡️ Admin Staff & Requests (${pendingRequests.length + approvedAdmins.length})` }]
            : []),
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sfx.playPop();
                setActiveTab(tab.id);
              }}
              style={{
                padding: '14px 18px',
                fontSize: '0.92rem',
                fontWeight: isActive ? 900 : 700,
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '3px solid var(--primary)' : '3px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Stage */}
      <main style={{ padding: '28px', maxWidth: '1280px', width: '100%', margin: '0 auto', flex: 1 }}>
        {/* Prominent Chief Admin Approval Banner (Shown if pending requests exist) */}
        {isChiefAdmin && pendingRequests.length > 0 && activeTab !== 'requests' && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 150, 0, 0.15), rgba(234, 88, 12, 0.15))',
              border: '2px solid #F97316',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#F97316',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                }}
              >
                ⚠️
              </div>
              <div>
                <strong style={{ fontSize: '1rem', color: 'var(--text-main)', display: 'block' }}>
                  {pendingRequests.length} Pending Admin Registration Request{pendingRequests.length > 1 ? 's' : ''} Awaiting Approval
                </strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  New administrators cannot log in until you review and grant approval.
                </span>
              </div>
            </div>

            <button
              className="btn-3d"
              onClick={() => {
                sfx.playPop();
                setActiveTab('requests');
              }}
              style={{
                background: '#F97316',
                color: '#FFFFFF',
                boxShadow: '0 3px 0 #C2410C',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 800,
                borderRadius: '10px',
              }}
            >
              Review Requests ➔
            </button>
          </div>
        )}

        {/* =========================================================================
            TAB 1: SYSTEM OVERVIEW & METRICS (Desktop 4-card layout fixed)
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* KPI Metric Cards - Fixed Desktop Grid (never wraps 4th card awkwardly) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >
              {/* Card 1: Total Learners */}
              <div
                className="stat-card"
                style={{
                  background: 'var(--bg-card)',
                  padding: '20px',
                  borderRadius: '18px',
                  border: '2px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                    TOTAL LEARNERS
                  </span>
                  <span style={{ fontSize: '1.6rem' }}>👥</span>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', marginTop: '8px' }}>
                  {totalLearners}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 700, marginTop: '4px' }}>
                  ↑ 100% Active Profiles
                </div>
              </div>

              {/* Card 2: XP Logged */}
              <div
                className="stat-card"
                style={{
                  background: 'var(--bg-card)',
                  padding: '20px',
                  borderRadius: '18px',
                  border: '2px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                    XP LOGGED
                  </span>
                  <span style={{ fontSize: '1.6rem' }}>⚡</span>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#FF9600', marginTop: '8px' }}>
                  {totalXp.toLocaleString()} XP
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px' }}>
                  Avg {Math.round(totalXp / Math.max(1, totalLearners))} XP / user
                </div>
              </div>

              {/* Card 3: Indic Regional Languages */}
              <div
                className="stat-card"
                style={{
                  background: 'var(--bg-card)',
                  padding: '20px',
                  borderRadius: '18px',
                  border: '2px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                    INDIC LANGUAGES
                  </span>
                  <span style={{ fontSize: '1.6rem' }}>🇮🇳</span>
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1CB0F6', marginTop: '8px' }}>
                  6 Active
                </div>
                <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 700, marginTop: '4px' }}>
                  MR • HI • TE • TA • BN • EN
                </div>
              </div>

              {/* Card 4: Curriculum Questions (Desktop fix: cleanly styled 600 / 600) */}
              <div
                className="stat-card"
                style={{
                  background: 'var(--bg-card)',
                  padding: '20px',
                  borderRadius: '18px',
                  border: '2px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                    CURRICULUM QUESTIONS
                  </span>
                  <span style={{ fontSize: '1.6rem' }}>📖</span>
                </div>
                <div
                  style={{
                    fontSize: '2.0rem',
                    fontWeight: 900,
                    color: '#58CC02',
                    marginTop: '8px',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '4px',
                  }}
                >
                  <span>900 Questions</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 700, marginTop: '4px' }}>
                  ✓ 15 Questions per Lesson
                </div>
              </div>
            </div>

            {/* Platform Quick Operational Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '2px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 900 }}>
                  🚀 Quick Administrative Controls
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Rapid shortcuts to inspect curricula, reward learners, or manage interactive mini-games.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    className="btn-3d btn-primary"
                    onClick={() => {
                      sfx.playPop();
                      setActiveTab('curriculum');
                    }}
                    style={{ padding: '12px', fontSize: '0.85rem', fontWeight: 800 }}
                  >
                    📚 Edit Curriculum
                  </button>
                  <button
                    className="btn-3d btn-outline"
                    onClick={() => {
                      sfx.playPop();
                      setActiveTab('games');
                    }}
                    style={{ padding: '12px', fontSize: '0.85rem', fontWeight: 800 }}
                  >
                    🎮 Manage Games
                  </button>
                  <button
                    className="btn-3d btn-outline"
                    onClick={() => {
                      sfx.playPop();
                      setActiveTab('learners');
                    }}
                    style={{ padding: '12px', fontSize: '0.85rem', fontWeight: 800 }}
                  >
                    👥 Manage Roster
                  </button>
                  {isChiefAdmin && (
                    <button
                      className="btn-3d"
                      onClick={() => {
                        sfx.playPop();
                        setActiveTab('requests');
                      }}
                      style={{
                        padding: '12px',
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        background: '#F97316',
                        color: '#fff',
                      }}
                    >
                      🛡️ Access ({pendingRequests.length})
                    </button>
                  )}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '20px',
                  padding: '24px',
                  border: '2px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <h3 style={{ margin: '0 0 8px', fontSize: '1.15rem', fontWeight: 900 }}>
                  🛡️ Security & Access Status
                </h3>
                <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Platform governance policy and approved administrator counts.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Chief Administrator:</span>
                    <strong style={{ color: 'var(--primary)' }}>anshigupta17051@gmail.com</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Approved Staff Admins:</span>
                    <strong>{approvedAdmins.length} active</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Pending Approvals:</span>
                    <strong style={{ color: pendingRequests.length > 0 ? '#F97316' : '#16A34A' }}>
                      {pendingRequests.length} waiting
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: LEARNER ROSTER
           ========================================================================= */}
        {activeTab === 'learners' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '2px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '380px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '10px',
                      border: '2px solid var(--border-subtle)',
                      background: 'var(--bg-main)',
                      color: 'var(--text-main)',
                      outline: 'none',
                    }}
                  />
                </div>

                <select
                  value={filterLang}
                  onChange={(e) => setFilterLang(e.target.value)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '2px solid var(--border-subtle)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontWeight: 700,
                  }}
                >
                  <option value="all">All Languages</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="en">English</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="btn-3d btn-outline"
                  onClick={handleExportCSV}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Download size={15} />
                  <span>Export CSV</span>
                </button>
                <button
                  className="btn-3d btn-outline"
                  onClick={handleExportJSON}
                  style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                >
                  <Download size={15} />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            {/* Roster Table */}
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '18px',
                border: '2px solid var(--border-subtle)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-card-subtle)', borderBottom: '2px solid var(--border-subtle)' }}>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Learner</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Target Lang</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Age Track</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Level & XP</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800 }}>Streak</th>
                      <th style={{ padding: '14px 18px', fontWeight: 800, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLearners.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No learners found matching your filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredLearners.map((learner) => (
                        <tr key={learner.email} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #5B42F3, #FF5376)',
                                  color: '#fff',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 900,
                                }}
                              >
                                {(learner.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{learner.name || 'Learner'}</div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{learner.email}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ padding: '4px 10px', borderRadius: '6px', background: 'var(--primary-light)', color: 'var(--primary-dark)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>
                              {learner.targetLang || 'mr'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ fontSize: '0.85rem' }}>{learner.age || 25} yrs ({learner.ageGroup || 'adult'})</span>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ fontWeight: 800, color: 'var(--primary)' }}>Lvl {learner.level || 1}</span>
                            <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>({learner.xp || 0} XP)</span>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ fontWeight: 800, color: '#F97316' }}>🔥 {learner.streak || 0}d</span>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              <button
                                className="btn-3d"
                                onClick={() => handleGrantXp(learner.email)}
                                title="Grant +50 XP"
                                style={{
                                  padding: '6px 10px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  background: '#FF9600',
                                  color: '#fff',
                                  borderRadius: '8px',
                                  boxShadow: '0 2px 0 #E68500',
                                }}
                              >
                                +50 XP
                              </button>
                              <button
                                className="btn-3d"
                                onClick={() => handleResetLevel(learner.email)}
                                title="Reset to Level 1"
                                style={{
                                  padding: '6px 10px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  background: 'var(--bg-main)',
                                  color: 'var(--text-main)',
                                  border: '1px solid var(--border-subtle)',
                                  borderRadius: '8px',
                                }}
                              >
                                Reset
                              </button>
                              <button
                                className="btn-3d"
                                onClick={() => handleSetMastery(learner.email)}
                                title="Unlock Level 10"
                                style={{
                                  padding: '6px 10px',
                                  fontSize: '0.75rem',
                                  fontWeight: 800,
                                  background: '#58CC02',
                                  color: '#fff',
                                  borderRadius: '8px',
                                  boxShadow: '0 2px 0 #46A302',
                                }}
                              >
                                Lvl 10
                              </button>
                              <button
                                className="icon-btn"
                                onClick={() => handleDeleteLearner(learner.email)}
                                title="Delete Learner"
                                style={{ width: '30px', height: '30px', borderRadius: '8px', color: '#EF4444' }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: CURRICULUM INSPECTOR & QUESTION EDITOR (Add / Edit / Delete)
           ========================================================================= */}
        {activeTab === 'curriculum' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Language Selector Header */}
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '2px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
                  Curriculum Bank Inspector & Question Editor
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Inspect, add, modify, or remove pedagogical questions across all 10 levels.
                </p>
              </div>

              {/* Language Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    className={`btn-3d ${currTargetLang === l.code ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => {
                      sfx.playPop();
                      setCurrTargetLang(l.code);
                    }}
                    style={{ padding: '6px 14px', fontSize: '0.85rem', borderRadius: '10px' }}
                  >
                    {l.nativeName}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Accordion List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {defaultCurriculumLevels.map((lvl) => {
                const isExpanded = expandedLevel === lvl.levelId;
                const questions = getActiveLevelQuestions(lvl.levelId);

                return (
                  <div
                    key={lvl.levelId}
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '18px',
                      border: isExpanded ? '2px solid var(--primary)' : '2px solid var(--border-subtle)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {/* Level Bar Header */}
                    <div
                      onClick={() => {
                        sfx.playPop();
                        setExpandedLevel(isExpanded ? null : lvl.levelId);
                      }}
                      style={{
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        background: isExpanded ? 'var(--bg-card-subtle)' : 'transparent',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '12px',
                            background: 'var(--primary-light)',
                            color: 'var(--primary-dark)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '1.1rem',
                          }}
                        >
                          {lvl.levelId}
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                            {lvl.title}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            {lvl.description}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            background: 'rgba(88, 204, 2, 0.1)',
                            color: '#15803D',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                          }}
                        >
                          {questions.length} Questions • +{lvl.xpReward} XP
                        </span>
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </div>
                    </div>

                    {/* Questions Detail Table & Add Question Button */}
                    {isExpanded && (
                      <div style={{ padding: '0 20px 20px', borderTop: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', marginBottom: '8px' }}>
                          <button
                            className="btn-3d btn-primary"
                            onClick={() => handleOpenAddQuestion(lvl.levelId)}
                            style={{ padding: '6px 14px', fontSize: '0.82rem', borderRadius: '8px' }}
                          >
                            <Plus size={14} />
                            <span>Add New Question to Level {lvl.levelId}</span>
                          </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {questions.map((q, idx) => (
                            <div
                              key={q.id || idx}
                              style={{
                                padding: '12px 16px',
                                borderRadius: '12px',
                                background: 'var(--bg-main)',
                                border: '1px solid var(--border-subtle)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '12px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span
                                  style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'var(--primary)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                  }}
                                >
                                  {idx + 1}
                                </span>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span
                                      style={{
                                        fontSize: '0.72rem',
                                        padding: '2px 8px',
                                        borderRadius: '6px',
                                        background: 'rgba(91, 66, 243, 0.1)',
                                        color: 'var(--primary)',
                                        fontWeight: 800,
                                        textTransform: 'uppercase',
                                      }}
                                    >
                                      {q.type}
                                    </span>
                                    <strong style={{ fontSize: '0.95rem' }}>
                                      {q.targetWord || q.letter || q.audioPrompt || q.questionText || 'Exercise'}
                                    </strong>
                                    {q.translit && (
                                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        ({q.translit})
                                      </span>
                                    )}
                                    {q.meaning && (
                                      <span style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600 }}>
                                        — {q.meaning}
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                    {q.instruction || q.hint || ''}
                                  </div>
                                </div>
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                  className="btn-3d"
                                  onClick={() => {
                                    const textToSpeak = q.targetWord || q.letter || q.audioPrompt || q.questionText;
                                    if (textToSpeak) {
                                      audioEngine.speak(textToSpeak, currTargetLang);
                                    }
                                  }}
                                  style={{
                                    padding: '6px 10px',
                                    borderRadius: '8px',
                                    fontSize: '0.78rem',
                                    background: 'var(--primary-light)',
                                    color: 'var(--primary-dark)',
                                    boxShadow: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                  }}
                                >
                                  <Volume2 size={13} />
                                  <span>Audio</span>
                                </button>

                                <button
                                  className="icon-btn"
                                  onClick={() => handleOpenEditQuestion(lvl.levelId, q, idx)}
                                  title="Edit Question"
                                  style={{ width: '28px', height: '28px', borderRadius: '6px', color: 'var(--primary)' }}
                                >
                                  <Edit3 size={14} />
                                </button>

                                <button
                                  className="icon-btn"
                                  onClick={() => handleDeleteQuestion(lvl.levelId, idx)}
                                  title="Delete Question"
                                  style={{ width: '28px', height: '28px', borderRadius: '6px', color: '#EF4444' }}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: MINI-GAMES & VOCABULARY MANAGER
           ========================================================================= */}
        {activeTab === 'games' && (
          <div className="admin-games-grid" style={{ display: 'grid', gap: '24px' }}>
            {/* Add Custom Word Form */}
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                padding: '24px',
                border: '2px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 900 }}>
                ➕ Add Game Word / Vocabulary Card
              </h3>
              <p style={{ margin: '0 0 18px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Words added here automatically feed into Balloon Pop, Memory Flip, Speed Strike, and Akshar Catch.
              </p>

              <form onSubmit={handleAddGameWord} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '4px', display: 'block' }}>
                    LANGUAGE:
                  </label>
                  <select
                    value={newGameWord.lang}
                    onChange={(e) => setNewGameWord({ ...newGameWord, lang: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--border-subtle)',
                      fontWeight: 700,
                    }}
                  >
                    <option value="mr">Marathi (मराठी)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="te">Telugu (తెలుగు)</option>
                    <option value="ta">Tamil (தமிழ்)</option>
                    <option value="bn">Bengali (বাংলা)</option>
                    <option value="en">English</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '4px', display: 'block' }}>
                    WORD IN NATIVE SCRIPT:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. सुंदर / पुस्तक"
                    value={newGameWord.word}
                    onChange={(e) => setNewGameWord({ ...newGameWord, word: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '2px solid var(--border-subtle)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-indic)',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '4px', display: 'block' }}>
                      TRANSLITERATION:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. sundar"
                      value={newGameWord.translit}
                      onChange={(e) => setNewGameWord({ ...newGameWord, translit: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid var(--border-subtle)',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '4px', display: 'block' }}>
                      ICON / EMOJI:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 🌸"
                      value={newGameWord.icon}
                      onChange={(e) => setNewGameWord({ ...newGameWord, icon: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid var(--border-subtle)',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '4px', display: 'block' }}>
                    MEANING / DEFINITION:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Beautiful"
                    value={newGameWord.meaning}
                    onChange={(e) => setNewGameWord({ ...newGameWord, meaning: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '2px solid var(--border-subtle)',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-3d btn-primary"
                  style={{ marginTop: '8px', padding: '12px', fontWeight: 900 }}
                >
                  <Plus size={16} />
                  <span>Add Word to Games Pool</span>
                </button>
              </form>
            </div>

            {/* List of Custom Game Words */}
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                padding: '24px',
                border: '2px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 900 }}>
                🎮 Active Game Vocabulary Words ({customGameWords.length})
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                These items shuffle dynamically each time a learner plays any literacy mini-game.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '480px', overflowY: 'auto' }}>
                {customGameWords.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'var(--bg-main)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{item.icon || '💡'}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{item.word}</strong>
                          {item.translit && (
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>({item.translit})</span>
                          )}
                          <span style={{ fontSize: '0.72rem', padding: '2px 6px', borderRadius: '4px', background: 'var(--primary-light)', color: 'var(--primary-dark)', fontWeight: 800, textTransform: 'uppercase' }}>
                            {item.lang}
                          </span>
                        </div>
                        {item.meaning && (
                          <div style={{ fontSize: '0.8rem', color: '#16A34A', fontWeight: 600 }}>
                            {item.meaning}
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn-3d"
                        onClick={() => audioEngine.speak(item.word, item.lang)}
                        style={{ padding: '6px 10px', fontSize: '0.78rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', boxShadow: 'none' }}
                      >
                        <Volume2 size={13} />
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => handleDeleteGameWord(item.id)}
                        style={{ width: '28px', height: '28px', borderRadius: '6px', color: '#EF4444' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: ADMIN ACCESS REQUESTS (Chief Admin Only)
           ========================================================================= */}
        {activeTab === 'requests' && isChiefAdmin && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Pending Requests Section */}
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                padding: '24px',
                border: '2px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>
                    🛡️ Pending Admin Registration Requests ({pendingRequests.length})
                  </h3>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Applicants waiting for your authorization. Once approved, they can log into the Admin Command Center.
                  </p>
                </div>
                <button
                  className="btn-3d btn-outline"
                  onClick={reloadAdminLists}
                  style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                >
                  Refresh
                </button>
              </div>

              {pendingRequests.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <UserCheck size={36} color="#16A34A" style={{ marginBottom: '8px' }} />
                  <div>No pending requests at this time. All submissions have been reviewed.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '14px',
                        background: 'var(--bg-main)',
                        border: '2px solid #F97316',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '50%',
                            background: '#F97316',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 900,
                            fontSize: '1.1rem',
                          }}
                        >
                          {(req.name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                            {req.name}
                          </div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                            {req.email}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Requested: {req.requestedAt}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          className="btn-3d"
                          onClick={() => handleApproveAdmin(req.id)}
                          style={{
                            background: '#16A34A',
                            color: '#fff',
                            boxShadow: '0 3px 0 #15803D',
                            padding: '10px 18px',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <Check size={16} />
                          <span>Allow / Approve</span>
                        </button>
                        <button
                          className="btn-3d"
                          onClick={() => handleRejectAdmin(req.id)}
                          style={{
                            background: '#EF4444',
                            color: '#fff',
                            boxShadow: '0 3px 0 #DC2626',
                            padding: '10px 16px',
                            fontSize: '0.88rem',
                            fontWeight: 800,
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <X size={16} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Administrators List */}
            <div
              style={{
                background: 'var(--bg-card)',
                borderRadius: '20px',
                padding: '24px',
                border: '2px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 900 }}>
                ✅ Currently Approved Staff Administrators ({approvedAdmins.length})
              </h3>
              <p style={{ margin: '0 0 16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                These authorized staff members have access to the Admin Command Center.
              </p>

              {approvedAdmins.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No secondary administrators have been approved yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {approvedAdmins.map((admin) => (
                    <div
                      key={admin.email}
                      style={{
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'var(--bg-main)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '0.98rem' }}>{admin.name}</strong>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{admin.email}</div>
                        <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>
                          Approved: {admin.approvedAt}
                        </div>
                      </div>

                      <button
                        className="btn-3d"
                        onClick={() => handleRevokeAdmin(admin.email)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#EF4444',
                          border: '1px solid #FCA5A5',
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          borderRadius: '8px',
                        }}
                      >
                        Revoke Access
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal: Question Add / Edit */}
        {editingQuestion && (
          <div className="modal-backdrop" onClick={() => setEditingQuestion(null)}>
            <div
              className="lesson-modal"
              style={{ maxWidth: '540px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lesson-header">
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>
                  {editingQuestion.isNew ? '➕ Add New Question' : '✏️ Edit Question'}
                </h3>
                <button className="icon-btn" onClick={() => setEditingQuestion(null)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveQuestion} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '4px', display: 'block' }}>
                    EXERCISE TYPE:
                  </label>
                  <select
                    value={qFormData.type}
                    onChange={(e) => setQFormData({ ...qFormData, type: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '2px solid var(--border-subtle)',
                      fontWeight: 700,
                    }}
                  >
                    <option value="word_audio_match">Audio to Word Match (MCQ)</option>
                    <option value="tracing">Letter Tracing Practice</option>
                    <option value="sentence_builder">Sentence Construction</option>
                    <option value="matching_pairs">Vocabulary Pairs Matching</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '4px', display: 'block' }}>
                    TARGET WORD / LETTER (NATIVE SCRIPT):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. नमस्कार / पुस्तक"
                    value={qFormData.targetWord}
                    onChange={(e) => setQFormData({ ...qFormData, targetWord: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '2px solid var(--border-subtle)',
                      fontSize: '1rem',
                      fontFamily: 'var(--font-indic)',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '4px', display: 'block' }}>
                      TRANSLITERATION:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. namaskar"
                      value={qFormData.translit}
                      onChange={(e) => setQFormData({ ...qFormData, translit: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid var(--border-subtle)',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '4px', display: 'block' }}>
                      MEANING:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Greetings"
                      value={qFormData.meaning}
                      onChange={(e) => setQFormData({ ...qFormData, meaning: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '2px solid var(--border-subtle)',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '4px', display: 'block' }}>
                    INSTRUCTION / HINT:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Listen carefully and tap the right word"
                    value={qFormData.instruction}
                    onChange={(e) => setQFormData({ ...qFormData, instruction: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '2px solid var(--border-subtle)',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    className="btn-3d btn-outline"
                    onClick={() => setEditingQuestion(null)}
                    style={{ padding: '10px 16px', fontSize: '0.88rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-3d btn-primary"
                    style={{ padding: '10px 20px', fontSize: '0.88rem' }}
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
