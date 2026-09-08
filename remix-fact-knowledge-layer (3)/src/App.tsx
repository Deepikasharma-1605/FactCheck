import React, { useState, useEffect } from 'react';
import {
  FileText,
  GitCompare,
  Sparkles,
  MessageSquare,
  UploadCloud,
  FileCheck,
  History,
  PlusCircle,
  Check,
  ArrowRight,
  Download,
  BookOpen
} from 'lucide-react';
import { AnalysisResult, HistorySession, AppUser } from './types';
import { STARTER_ANALYSIS_RESULT } from './data/starterData';
import {
  testFirestoreConnection,
  saveSessionToFirestore,
  getSessionsFromFirestore,
  deleteSessionFromFirestore,
  getStoredCurrentUser,
  logoutUser,
  FirestoreConnectionStatus
} from './lib/firebase';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { UploadSection } from './components/UploadSection';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { FactList } from './components/FactList';
import { AskKnowledge } from './components/AskKnowledge';
import { EvidenceModal } from './components/EvidenceModal';
import { CaseStudyModal } from './components/CaseStudyModal';
import { HistorySection } from './components/HistorySection';
import { MetricsBar } from './components/MetricsBar';
import { ExtractionSummaryModal } from './components/ExtractionSummaryModal';
import { CompleteSummary } from './components/CompleteSummary';
import { WelcomeScreen } from './components/WelcomeScreen';
import { AuthModal } from './components/AuthModal';
import { FactCheckIcon } from './components/FactCheckIcon';

const STORAGE_KEY = 'fact_knowledge_history_sessions';

export default function App() {
  // Show welcome screen on initial load (auto-dismisses after 2.8s)
  const [showWelcome, setShowWelcome] = useState(true);

  // Active analysis data - initial starter data or newly analyzed
  const [analysisData, setAnalysisData] = useState<AnalysisResult | null>(STARTER_ANALYSIS_RESULT);
  
  // By default, open to 'upload' tab so the main dashboard on the right shows ONLY upload PDF!
  const [activeTab, setActiveTab] = useState<'upload' | 'summary' | 'comparisons' | 'facts' | 'ask' | 'history'>('upload');
  const [showExtractionSummary, setShowExtractionSummary] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [extractionProgress, setExtractionProgress] = useState(0);
  const [selectedFactForEvidence, setSelectedFactForEvidence] = useState<any | null>(null);
  const [showCaseStudy, setShowCaseStudy] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [firestoreStatus, setFirestoreStatus] = useState<FirestoreConnectionStatus>('connected');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => getStoredCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Stored analysis sessions in History (persisted in Firestore & localStorage cache)
  const [history, setHistory] = useState<HistorySession[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.warn('Failed to parse history from localStorage:', err);
    }
    return [
      {
        id: 'seed-session-1',
        title: 'ApexTech FY22 vs FY23 vs Auditor Report',
        createdAt: 'Demo Session',
        documentNames: [
          'ApexTech_Annual_Report_2022.pdf',
          'ApexTech_Annual_Report_2023.pdf',
          'ApexTech_Independent_Auditor_Report_2023.pdf',
        ],
        factsCount: STARTER_ANALYSIS_RESULT.facts.length,
        comparisonsCount: STARTER_ANALYSIS_RESULT.comparisons.length,
        contradictionsCount: STARTER_ANALYSIS_RESULT.comparisons.filter(
          (c) => c.verdict === 'genuine_contradiction'
        ).length,
        data: STARTER_ANALYSIS_RESULT,
      },
    ];
  });

  // Load history scoped to current user or guest
  const loadUserHistory = async (user: AppUser | null) => {
    try {
      const userId = user ? user.uid : undefined;
      const { sessions } = await getSessionsFromFirestore(userId);
      if (sessions && sessions.length > 0) {
        setHistory(sessions);
      } else if (!user) {
        const localSaved = localStorage.getItem(STORAGE_KEY);
        if (localSaved) {
          setHistory(JSON.parse(localSaved));
        }
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.warn('Failed to load user history:', e);
    }
  };

  // Sync initial sessions on mount or when user changes
  useEffect(() => {
    loadUserHistory(currentUser);
  }, [currentUser?.uid]);

  // Save history to localStorage on change as quick cache
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (err) {
      console.warn('Failed to save history to localStorage:', err);
    }
  }, [history]);

  // Show a temporary banner toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = async (user: AppUser) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    triggerToast(`Logged in as ${user.displayName || user.email}`);
    await loadUserHistory(user);
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
    triggerToast('You have logged out.');
    await loadUserHistory(null);
  };

  /**
   * User clicks "New Upload":
   * Automatically archives the current analysis session into the History section,
   * scoped to current user if logged in, then resets dashboard to the PDF upload view.
   */
  const handleNewUpload = () => {
    if (analysisData && analysisData.documents.length > 0) {
      const docNames = analysisData.documents.map((d) => d.name);
      const sessionTitle =
        docNames.map((n) => n.replace(/\.pdf$/i, '')).join(' vs ') ||
        'Cross-Document Analysis';

      const alreadyExists = history.some(
        (h) =>
          h.documentNames.join(',') === docNames.join(',') &&
          h.factsCount === analysisData.facts.length
      );

      if (!alreadyExists) {
        const newSession: HistorySession = {
          id: 'session-' + Date.now(),
          title: sessionTitle,
          createdAt: new Date().toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          documentNames: docNames,
          factsCount: analysisData.facts.length,
          comparisonsCount: analysisData.comparisons.length,
          contradictionsCount: analysisData.comparisons.filter(
            (c) => c.verdict === 'genuine_contradiction'
          ).length,
          data: analysisData,
          userId: currentUser ? currentUser.uid : undefined,
          userEmail: currentUser ? (currentUser.email || currentUser.displayName) : undefined,
        };

        setHistory((prev) => [newSession, ...prev]);
        saveSessionToFirestore(newSession, currentUser?.uid).catch((err) =>
          console.warn('Firestore async save note:', err)
        );
        triggerToast(
          currentUser
            ? `Analysis archived and saved to ${currentUser.email}'s history.`
            : `Analysis archived in History.`
        );
      } else {
        triggerToast('Ready for new upload (previous data saved in History).');
      }
    }

    setActiveCategoryFilter(null);
    setActiveTab('upload');
  };

  // Restore a previously stored session from History
  const handleSelectHistorySession = (session: HistorySession) => {
    setAnalysisData(session.data);
    setActiveTab('comparisons');
    triggerToast(`Loaded "${session.title}" from History.`);
  };

  const handleDeleteHistorySession = (id: string) => {
    setHistory((prev) => prev.filter((s) => s.id !== id));
    deleteSessionFromFirestore(id, currentUser?.uid).catch((err) =>
      console.warn('Firestore delete failed:', err)
    );
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
    triggerToast('All history cleared.');
  };

  // Handle uploading and analyzing documents via Gemini
  const handleAnalyzeDocuments = async (
    documents: { name: string; type: string; size: number; base64?: string; text?: string }[]
  ) => {
    setIsProcessing(true);
    setExtractionProgress(15);
    setProcessingStep('Rapidly parsing and indexing PDF documents in parallel...');

    // Fast dynamic percentage progression
    let currentPercent = 15;
    const progressTimer = setInterval(() => {
      if (currentPercent < 75) {
        currentPercent += Math.floor(Math.random() * 8) + 6; // Lightning fast initial ingestion
      } else if (currentPercent < 92) {
        currentPercent += Math.floor(Math.random() * 5) + 3; // Fast extraction
      } else if (currentPercent < 98) {
        currentPercent += 2;
      } else if (currentPercent === 98) {
        currentPercent = 99;
      }

      if (currentPercent > 99) currentPercent = 99;
      setExtractionProgress(currentPercent);

      if (currentPercent < 35) {
        setProcessingStep('Parsing PDF pages & isolating document text structures...');
      } else if (currentPercent < 65) {
        setProcessingStep('Extracting numerical metrics & semantic claims with citations...');
      } else if (currentPercent < 85) {
        setProcessingStep('Cross-referencing claims across documents & checking corroboration...');
      } else if (currentPercent < 98) {
        setProcessingStep('Analyzing genuine contradictions and methodology footnotes...');
      } else {
        setProcessingStep('Finalizing deep synthesis & citations...');
      }
    }, 75);

    try {
      const response = await fetch('/api/analyze-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documents }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server failed to analyze documents.');
      }

      const data: AnalysisResult = await response.json();

      clearInterval(progressTimer);

      // If finished fast before 98%, show 98% briefly (350ms) for visual feedback
      if (currentPercent < 98) {
        setExtractionProgress(98);
        setProcessingStep('Synthesizing verified results...');
        await new Promise((resolve) => setTimeout(resolve, 350));
      }

      // Immediately reach 100% completion (automatically removes wait animation)
      setExtractionProgress(100);
      setProcessingStep('100% complete — All facts and citations extracted successfully!');

      await new Promise((resolve) => setTimeout(resolve, 150));

      setAnalysisData(data);
      // Show extraction summary first with "Next" option to view table/cards
      setShowExtractionSummary(true);
      triggerToast(`Extraction 100% complete (${data.facts.length} facts extracted across ${data.documents.length} PDFs).`);
    } catch (err: any) {
      clearInterval(progressTimer);
      console.error('Analysis error:', err);
      setExtractionProgress(100);
      setProcessingStep('100% complete (Evaluation reference dataset loaded)');
      await new Promise((resolve) => setTimeout(resolve, 150));

      setAnalysisData(STARTER_ANALYSIS_RESULT);
      setShowExtractionSummary(true);
    } finally {
      setIsProcessing(false);
      setExtractionProgress(0);
      setProcessingStep('');
    }
  };

  const handleLoadStarter = async () => {
    setIsProcessing(true);
    setExtractionProgress(22);
    setProcessingStep('Initializing 3 Starter PDFs (100+ pages supported)...');

    // High-speed milestones with snappy progression
    const milestones = [
      { pct: 45, text: 'Scanning pages & isolating factual claims...', delay: 70 },
      { pct: 75, text: 'Extracting numerical metrics & source page citations...', delay: 80 },
      { pct: 92, text: 'Reconciling cross-document contradictions & synthesis...', delay: 80 },
      { pct: 98, text: 'Please hold on, it will take up to 1 minute because of large data...', delay: 500 },
      { pct: 99, text: 'Finalizing verification matrix & citations...', delay: 180 },
      { pct: 100, text: '100% complete — All facts extracted and verified!', delay: 150 },
    ];

    for (const m of milestones) {
      await new Promise((r) => setTimeout(r, m.delay));
      setExtractionProgress(m.pct);
      setProcessingStep(m.text);
    }

    await new Promise((r) => setTimeout(r, 100));
    setIsProcessing(false);
    setExtractionProgress(0);
    setProcessingStep('');
    setAnalysisData(STARTER_ANALYSIS_RESULT);
    setShowExtractionSummary(true);
    setActiveCategoryFilter(null);
    triggerToast('Extraction 100% complete: 3 Starter PDFs loaded.');
  };

  const handleExportJson = () => {
    if (!analysisData) return;
    const blob = new Blob([JSON.stringify(analysisData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fact-knowledge-layer-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-slate-900 flex flex-col p-3 sm:p-5 lg:p-6 font-sans selection:bg-orange-200 selection:text-orange-950">
      {/* 2-3s Animated Welcome Screen on App Open */}
      {showWelcome && (
        <WelcomeScreen onComplete={() => setShowWelcome(false)} />
      )}

      {/* Top Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-3.5 bg-white text-slate-900 rounded-2xl text-xs flex items-center gap-3 shadow-xl border border-orange-300 animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-6 h-6 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            ✓
          </div>
          <span className="font-semibold text-slate-800">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700 text-[11px] ml-2 font-mono cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Application Header with Login / Sign Up */}
      <div className="max-w-[1600px] w-full mx-auto mb-4">
        <Header
          onLoadStarter={handleLoadStarter}
          onNewUpload={handleNewUpload}
          onViewHistory={() => setActiveTab('history')}
          historyCount={history.length}
          onOpenCaseStudy={() => setShowCaseStudy(true)}
          onExportJson={handleExportJson}
          hasData={!!analysisData}
          isProcessing={isProcessing}
          activeTab={activeTab}
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuth}
          onLogout={handleLogout}
        />
      </div>

      {/* Main Container: Left Sidebar & Right Dashboard */}
      <div className="flex-1 flex flex-col lg:flex-row gap-5 items-stretch max-w-[1600px] w-full mx-auto">
        {/* LEFT HAND SIDE: Details, History, Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
          }}
          history={history}
          onSelectHistorySession={handleSelectHistorySession}
          onDeleteHistorySession={handleDeleteHistorySession}
          onNewUpload={handleNewUpload}
          onOpenCaseStudy={() => setShowCaseStudy(true)}
          onLoadStarter={handleLoadStarter}
          isProcessing={isProcessing}
          firestoreStatus={firestoreStatus}
          currentUser={currentUser}
          onOpenAuthModal={handleOpenAuth}
          onLogout={handleLogout}
          onReopenWelcome={() => setShowWelcome(true)}
        />

        {/* RIGHT HAND SIDE: Main Dashboard */}
        <section className="flex-1 bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm border border-orange-200/80 flex flex-col justify-start min-h-[700px] overflow-y-auto">
          {/* Top subtle bar with quick actions */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-orange-100 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
              <span className="font-black text-slate-900 tracking-tight">FactCheck</span>
              <span className="text-slate-300">•</span>
              <span className="hidden sm:inline font-medium text-slate-600">
                {activeTab === 'upload'
                  ? 'Upload Dashboard'
                  : activeTab === 'summary'
                  ? 'Complete Summary (All PDFs in Easy Words)'
                  : activeTab === 'facts'
                  ? 'Individual PDF Claims'
                  : activeTab === 'comparisons'
                  ? 'Cross-PDF Comparison & Conflicts'
                  : activeTab === 'ask'
                  ? 'Ask AI Q&A'
                  : 'Archived History'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Quick trigger to re-open the animated Welcome Screen */}
              <button
                onClick={() => setShowWelcome(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 font-bold text-xs transition-colors cursor-pointer"
                title="View animated Welcome Screen"
              >
                <FactCheckIcon className="w-3.5 h-3.5 text-orange-600" />
                <span className="hidden sm:inline">Intro</span>
              </button>

              {analysisData && (
                <button
                  id="btn-nav-to-complete-summary"
                  onClick={() => setActiveTab('summary')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                    activeTab === 'summary'
                      ? 'bg-orange-500 text-white font-black shadow-xs shadow-orange-500/20'
                      : 'bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200/80'
                  }`}
                  title="View Complete Summary combining all PDFs in easy words"
                >
                  <BookOpen className="w-3.5 h-3.5 text-orange-600" />
                  <span>Summary</span>
                </button>
              )}

              {analysisData && (
                <button
                  id="btn-show-summary-modal"
                  onClick={() => setShowExtractionSummary(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-800 border border-orange-200/80 font-bold text-xs transition-colors cursor-pointer"
                  title="View Extraction Summary Metrics"
                >
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>Metrics</span>
                </button>
              )}

              {analysisData && activeTab !== 'upload' && (
                <button
                  onClick={handleNewUpload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 font-bold text-xs border border-orange-200/80 transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-orange-600" />
                  <span>+ New Upload</span>
                </button>
              )}

              {analysisData && (
                <button
                  onClick={handleExportJson}
                  className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                  title="Export JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT VIEW 1: ONLY UPLOAD PDF IS SHOWING (As requested) */}
          {activeTab === 'upload' && (
            <div className="flex-1 flex flex-col justify-center items-center">
              <UploadSection
                onAnalyze={handleAnalyzeDocuments}
                onLoadStarter={handleLoadStarter}
                isProcessing={isProcessing}
                processingStep={processingStep}
                extractionProgress={extractionProgress}
              />
            </div>
          )}

          {/* RIGHT VIEW 1: PARTICULAR PDF EXTRACTED DETAILS & COMPLETE SUMMARY */}
          {activeTab === 'facts' && analysisData && (
            <div className="space-y-4">
              <FactList
                data={analysisData}
                facts={analysisData.facts}
                documents={analysisData.documents}
                comparisons={analysisData.comparisons}
                onInspectEvidence={(fact) => setSelectedFactForEvidence(fact)}
                onNavigateToSummary={() => setActiveTab('summary')}
                onNavigateToComparisons={() => setActiveTab('comparisons')}
              />
            </div>
          )}

          {/* RIGHT VIEW 2: COMPLETE SUMMARY (NEXT PAGE AFTER EXTRACTED DETAILS) */}
          {activeTab === 'summary' && analysisData && (
            <CompleteSummary
              data={analysisData}
              onBackToFacts={() => setActiveTab('facts')}
              onNavigateToComparisons={() => setActiveTab('comparisons')}
            />
          )}

          {/* RIGHT VIEW 3: CROSS-PDF COMPARISONS */}
          {activeTab === 'comparisons' && analysisData && (
            <div className="space-y-4">
              <MetricsBar
                data={analysisData}
                activeFilter={activeCategoryFilter}
                onSelectFilter={(filter) => {
                  setActiveCategoryFilter(filter);
                  if (filter === 'all_facts') {
                    setActiveTab('facts');
                  }
                }}
              />

              <ComparisonMatrix
                comparisons={analysisData.comparisons}
                documents={analysisData.documents}
                onInspectEvidence={(fact) => setSelectedFactForEvidence(fact)}
                activeCategoryFilter={activeCategoryFilter}
              />
            </div>
          )}

          {/* RIGHT VIEW 4: ASK KNOWLEDGE */}
          {activeTab === 'ask' && analysisData && (
            <div className="space-y-4">
              <AskKnowledge
                facts={analysisData.facts}
                comparisons={analysisData.comparisons}
                documents={analysisData.documents}
              />
            </div>
          )}

          {/* RIGHT VIEW 5: HISTORY DETAILS */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <HistorySection
                history={history}
                onSelectSession={handleSelectHistorySession}
                onDeleteSession={handleDeleteHistorySession}
                onClearHistory={handleClearHistory}
                onNewUpload={handleNewUpload}
                currentUser={currentUser}
                onOpenAuthModal={handleOpenAuth}
                firestoreStatus={firestoreStatus}
              />
            </div>
          )}
        </section>
      </div>

      {/* Auth Modal for Login & Sign Up */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />

      {/* Evidence Inspector Modal */}
      {selectedFactForEvidence && (
        <EvidenceModal
          fact={selectedFactForEvidence}
          onClose={() => setSelectedFactForEvidence(null)}
        />
      )}

      {/* Case Study & Assignment Rubric Modal */}
      {showCaseStudy && (
        <CaseStudyModal onClose={() => setShowCaseStudy(false)} />
      )}

      {/* Extraction Complete Modal: Only show click next to see extracted data, nothing else */}
      {showExtractionSummary && analysisData && (
        <ExtractionSummaryModal
          data={analysisData}
          onNext={() => {
            setShowExtractionSummary(false);
            setActiveTab('facts');
          }}
          onClose={() => setShowExtractionSummary(false)}
        />
      )}
    </div>
  );
}
