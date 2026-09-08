import React from 'react';
import {
  History,
  FileText,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Trash2,
  Download,
  Clock,
  Cloud,
  ShieldCheck,
  LogIn,
  UserPlus,
  User
} from 'lucide-react';
import { HistorySession, AppUser } from '../types';
import { FirestoreConnectionStatus } from '../lib/firebase';
import { FactCheckIcon } from './FactCheckIcon';

interface HistorySectionProps {
  history: HistorySession[];
  onSelectSession: (session: HistorySession) => void;
  onDeleteSession: (id: string) => void;
  onClearHistory: () => void;
  onNewUpload: () => void;
  currentUser?: AppUser | null;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
  firestoreStatus?: FirestoreConnectionStatus;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onSelectSession,
  onDeleteSession,
  onClearHistory,
  onNewUpload,
  currentUser,
  onOpenAuthModal,
  firestoreStatus = 'connected',
}) => {
  const handleExportSession = (session: HistorySession) => {
    const blob = new Blob([JSON.stringify(session.data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-session-${session.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Account & Sync Status Banner */}
      {currentUser ? (
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-emerald-950">
                  Account Active: {currentUser.displayName || currentUser.email}
                </p>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Cloud Synced
                </span>
              </div>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                All document analyses and contradiction reports are automatically saved to your account.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-orange-950">
                Sign in to sync your document history across all devices
              </p>
              <p className="text-orange-700 text-[11px] mt-0.5">
                You are currently in Guest mode. Log in or create a free account to store and access your reports anytime.
              </p>
            </div>
          </div>
          {onOpenAuthModal && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white hover:bg-orange-100/60 text-orange-800 font-bold text-xs border border-orange-200 shadow-xs transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthModal('signup')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Header bar */}
      <div className="bg-white rounded-2xl border border-orange-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 border border-orange-200 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Stored Analysis History
            </h2>
            <span className="px-2 py-0.5 text-xs font-semibold bg-orange-50 text-orange-900 border border-orange-200 rounded-full">
              {history.length} {history.length === 1 ? 'session' : 'sessions'}
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 rounded-full">
              <Cloud className="w-3 h-3 text-orange-600" />
              <span>Cloud Sync:</span>
              <span className="font-bold text-emerald-700">Online</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {currentUser
              ? `Archived reports for ${currentUser.email || currentUser.displayName}. Click any session to open it.`
              : 'Whenever you click "New Upload", your previous analysis is automatically archived here.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear your stored analysis history?')) {
                  onClearHistory();
                }
              }}
              className="text-xs text-slate-500 hover:text-rose-600 px-3 py-1.5 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
            >
              Clear all
            </button>
          )}

          <button
            onClick={onNewUpload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-xs cursor-pointer"
          >
            <span>+ New Upload</span>
          </button>
        </div>
      </div>

      {/* History Items */}
      {history.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-orange-200 p-8 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-3 text-orange-400 border border-orange-100">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            {currentUser ? 'No sessions stored under this account yet' : 'No stored history yet'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            {currentUser
              ? `When you upload and analyze 3+ PDFs, your extracted facts and cross-document contradiction reports will be automatically saved under ${currentUser.email}.`
              : 'When you analyze PDFs and click "New Upload", your previous analysis will be automatically archived here.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={onNewUpload}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-colors shadow-xs cursor-pointer"
            >
              Start an Upload (3+ PDFs)
            </button>
            {!currentUser && onOpenAuthModal && (
              <button
                onClick={() => onOpenAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 transition-colors cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-2xl border border-orange-200 p-5 shadow-xs hover:border-orange-400 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-orange-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                      {session.title}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-orange-50 text-orange-800 rounded-full border border-orange-200">
                      {session.documentNames.length} PDFs
                    </span>
                    {session.userEmail && (
                      <span className="px-2 py-0.5 text-[10px] font-medium bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                        {session.userEmail}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-500" />
                      {session.createdAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleExportSession(session)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    title="Export JSON"
                  >
                    <Download className="w-3 h-3" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete session"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onSelectSession(session)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-xs cursor-pointer"
                  >
                    <span>Load Analysis</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Document badges */}
              <div className="pt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Documents:
                </span>
                {session.documentNames.map((name, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-100 text-slate-700 font-medium"
                  >
                    <FileText className="w-3 h-3 text-orange-500" />
                    {name}
                  </span>
                ))}
              </div>

              {/* Metric stats */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span className="font-bold text-slate-900">{session.factsCount}</span> Extracted Facts
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <span className="font-bold text-slate-900">{session.comparisonsCount}</span> Cross-Audits
                </span>
                <span className="inline-flex items-center gap-1.5 text-rose-600 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{session.contradictionsCount} Contradictions Detected</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
