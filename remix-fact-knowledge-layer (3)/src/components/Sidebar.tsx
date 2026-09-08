import React, { useState } from 'react';
import {
  UploadCloud,
  History,
  GitCompare,
  FileCheck,
  MessageSquare,
  BookOpen,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  FileText,
  Trash2,
  Download,
  BarChart3,
  Users,
  Megaphone,
  Calendar,
  Shield,
  Settings,
  Database,
  Cloud,
  LogIn,
  LogOut,
  User,
  UserPlus
} from 'lucide-react';
import { HistorySession, AppUser } from '../types';
import { FirestoreConnectionStatus } from '../lib/firebase';
import { FactCheckIcon } from './FactCheckIcon';

interface SidebarProps {
  activeTab: 'upload' | 'summary' | 'comparisons' | 'facts' | 'ask' | 'history';
  onSelectTab: (tab: 'upload' | 'summary' | 'comparisons' | 'facts' | 'ask' | 'history') => void;
  history: HistorySession[];
  onSelectHistorySession: (session: HistorySession) => void;
  onDeleteHistorySession: (id: string) => void;
  onNewUpload: () => void;
  onOpenCaseStudy: () => void;
  onLoadStarter: () => void;
  isProcessing: boolean;
  firestoreStatus?: FirestoreConnectionStatus;
  currentUser?: AppUser | null;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
  onLogout?: () => void;
  onReopenWelcome?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  history,
  onSelectHistorySession,
  onDeleteHistorySession,
  onNewUpload,
  onOpenCaseStudy,
  onLoadStarter,
  isProcessing,
  firestoreStatus = 'connected',
  currentUser,
  onOpenAuthModal,
  onLogout,
  onReopenWelcome,
}) => {
  const [historyExpanded, setHistoryExpanded] = useState(true);

  return (
    <aside className="w-full lg:w-72 bg-white text-slate-800 rounded-3xl p-5 flex flex-col justify-between shadow-sm shrink-0 border border-orange-200/80">
      {/* Top Profile & Header */}
      <div className="space-y-4">
        {/* FactCheck Branding */}
        <div className="flex items-center justify-between pb-3 border-b border-orange-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
              <FactCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-slate-900 font-black text-lg tracking-tight leading-tight flex items-center gap-1.5">
                <span>FactCheck</span>
                <span className="w-2 h-2 rounded-full bg-orange-500 inline-block" />
              </div>
              <div className="text-[10px] text-orange-600 font-extrabold uppercase tracking-widest mt-0.5">
                AUDIT WORKSPACE
              </div>
            </div>
          </div>

          {onReopenWelcome && (
            <button
              onClick={onReopenWelcome}
              className="p-1.5 text-orange-500 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors text-[11px] font-semibold flex items-center gap-1 border border-orange-200/60"
              title="Show Welcome screen"
            >
              <span>Intro</span>
            </button>
          )}
        </div>

        {/* User Account Bar in Sidebar */}
        <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-200/70">
          {currentUser ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {currentUser.displayName || currentUser.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-medium truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                    History Scoped
                  </div>
                </div>
              </div>
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Account Access</span>
                <span className="text-[10px] text-orange-600 font-semibold">Guest Mode</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-snug">
                Log in to sync and store document history across your sessions.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                {onOpenAuthModal && (
                  <>
                    <button
                      onClick={() => onOpenAuthModal('login')}
                      className="flex-1 py-1.5 text-center text-xs font-bold text-orange-700 bg-white hover:bg-orange-100/70 rounded-lg border border-orange-200 shadow-xs transition-colors cursor-pointer"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => onOpenAuthModal('signup')}
                      className="flex-1 py-1.5 text-center text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>


        {/* Navigation Menu */}
        <nav className="space-y-1.5 text-xs">
          {/* Item 1: Upload Dashboard (Active Default) */}
          <button
            id="nav-upload-dashboard"
            onClick={() => onSelectTab('upload')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all text-left uppercase tracking-wider text-[11px] ${
              activeTab === 'upload'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-black'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/80'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <UploadCloud className={`w-4 h-4 ${activeTab === 'upload' ? 'text-white' : 'text-orange-500'}`} />
            </div>
            <span className="flex-1">Upload PDF (3+)</span>
          </button>

          {/* Item 2: Particular PDF Extracted Details */}
          <button
            id="nav-facts"
            onClick={() => onSelectTab('facts')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all text-left uppercase tracking-wider text-[11px] ${
              activeTab === 'facts'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-black'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/80'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <FileCheck className={`w-4 h-4 ${activeTab === 'facts' ? 'text-white' : 'text-orange-500'}`} />
            </div>
            <span className="flex-1">PDF Extracted Details</span>
          </button>

          {/* Item 3: Complete Summary (Next page after Extracted Details) */}
          <button
            id="nav-complete-summary"
            onClick={() => onSelectTab('summary')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all text-left uppercase tracking-wider text-[11px] ${
              activeTab === 'summary'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25 font-black'
                : 'text-orange-800 bg-orange-50/70 hover:bg-orange-100 hover:text-orange-900 border border-orange-200/60'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <BookOpen className={`w-4 h-4 ${activeTab === 'summary' ? 'text-white' : 'text-orange-600'}`} />
            </div>
            <span className="flex-1">Complete Summary</span>
            <span
              className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-md uppercase tracking-wider ${
                activeTab === 'summary'
                  ? 'bg-white text-orange-700'
                  : 'bg-orange-200 text-orange-900'
              }`}
            >
              Easy
            </span>
          </button>

          {/* Item 4: Cross-PDF Comparison Matrix */}
          <button
            id="nav-comparisons"
            onClick={() => onSelectTab('comparisons')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all text-left uppercase tracking-wider text-[11px] ${
              activeTab === 'comparisons'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-black'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/80'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <GitCompare className={`w-4 h-4 ${activeTab === 'comparisons' ? 'text-white' : 'text-orange-500'}`} />
            </div>
            <span className="flex-1">Cross-PDF Comparison</span>
          </button>

          {/* Item 5: Ask Knowledge AI */}
          <button
            id="nav-ask"
            onClick={() => onSelectTab('ask')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all text-left uppercase tracking-wider text-[11px] ${
              activeTab === 'ask'
                ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-black'
                : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/80'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <MessageSquare className={`w-4 h-4 ${activeTab === 'ask' ? 'text-white' : 'text-orange-500'}`} />
            </div>
            <span className="flex-1">Ask FactCheck AI</span>
          </button>

          {/* Item 6: History & Stored Sessions */}
          <div className="pt-1">
            <div className="flex items-center justify-between">
              <button
                id="nav-history"
                onClick={() => onSelectTab('history')}
                className={`flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all text-left uppercase tracking-wider text-[11px] ${
                  activeTab === 'history'
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 font-black'
                    : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50/80'
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <History className={`w-4 h-4 ${activeTab === 'history' ? 'text-white' : 'text-orange-500'}`} />
                </div>
                <span className="flex-1">History & Sessions</span>
                {history.length > 0 && (
                  <span className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-full ${
                    activeTab === 'history' ? 'bg-white text-orange-600' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {history.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setHistoryExpanded(!historyExpanded)}
                className="p-1 text-orange-500 hover:text-orange-700 transition-colors"
                title="Toggle history list"
              >
                <span className="text-[10px]">{historyExpanded ? '▲' : '▼'}</span>
              </button>
            </div>

            {/* Sub-items for History */}
            {historyExpanded && (
              <div className="pl-9 pr-1 py-1.5 space-y-1">
                {history.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic py-1">
                    No stored sessions yet.
                  </div>
                ) : (
                  history.slice(0, 4).map((session) => (
                    <div
                      key={session.id}
                      onClick={() => onSelectHistorySession(session)}
                      className="group flex items-center justify-between py-1.5 px-2 rounded-lg text-[11px] text-slate-600 hover:text-orange-900 hover:bg-orange-50 cursor-pointer transition-all border border-transparent hover:border-orange-100"
                    >
                      <div className="truncate mr-2">
                        <p className="truncate font-semibold text-slate-700 group-hover:text-orange-700">
                          {session.title}
                        </p>
                        <p className="text-[9px] text-slate-400">{session.createdAt}</p>
                      </div>
                      <span className="text-[9px] font-mono text-orange-600 font-bold shrink-0">
                        {session.factsCount}f
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Item 7: Case Study Docs */}
          <button
            id="nav-docs"
            onClick={onOpenCaseStudy}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all text-left uppercase tracking-wider text-[11px] text-slate-600 hover:text-orange-600 hover:bg-orange-50/80"
          >
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-orange-400" />
            </div>
            <span className="flex-1">Documentation & Cases</span>
          </button>
        </nav>
      </div>

      {/* Bottom Session Action & Firestore Status */}
      <div className="pt-4 border-t border-orange-100 space-y-2">
        <button
          id="btn-sidebar-new-upload"
          onClick={onNewUpload}
          disabled={isProcessing}
          className="w-full py-2.5 px-4 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 hover:text-orange-800 font-black text-xs uppercase tracking-wider transition-all text-center border border-orange-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          title="Save current analysis in History and open clean upload screen"
        >
          <PlusCircle className="w-4 h-4 text-orange-600" />
          <span>+ New Upload Session</span>
        </button>

        {/* Cloud Sync Status (No Private Details) */}
        <div className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Cloud className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span>Cloud Sync</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-emerald-700">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

