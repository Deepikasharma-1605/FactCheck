import React from 'react';
import { FileText, BookOpen, Download, History, PlusCircle, LogIn, LogOut, User, UserPlus } from 'lucide-react';
import { FactCheckIcon } from './FactCheckIcon';
import { AppUser } from '../types';

interface HeaderProps {
  onLoadStarter: () => void;
  onNewUpload: () => void;
  onViewHistory: () => void;
  historyCount: number;
  onOpenCaseStudy: () => void;
  onExportJson: () => void;
  hasData: boolean;
  isProcessing: boolean;
  activeTab: string;
  currentUser: AppUser | null;
  onOpenAuthModal: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onLoadStarter,
  onNewUpload,
  onViewHistory,
  historyCount,
  onOpenCaseStudy,
  onExportJson,
  hasData,
  isProcessing,
  activeTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-xs">
              <FactCheckIcon className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-tight text-slate-900">
                FactCheck
              </h1>
            </div>
          </div>

          {/* Action & Auth buttons */}
          <div className="flex items-center gap-2">
            {/* New Upload button */}
            <button
              id="btn-new-upload"
              onClick={onNewUpload}
              disabled={isProcessing}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all shadow-xs ${
                activeTab === 'upload'
                  ? 'bg-orange-600 text-white ring-2 ring-orange-400/40'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              } disabled:opacity-50`}
              title="Start a new PDF upload (current analysis will be stored in History)"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Upload</span>
            </button>

            {/* History button */}
            <button
              id="btn-view-history"
              onClick={onViewHistory}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors ${
                activeTab === 'history'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title="View stored analyses"
            >
              <History className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-orange-100 text-orange-700">
                  {historyCount}
                </span>
              )}
            </button>

            <button
              id="btn-starter-dataset"
              onClick={onLoadStarter}
              disabled={isProcessing}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors border border-slate-200 disabled:opacity-50"
              title="Load 3 starter PDFs with pre-grounded facts and 4 test cases"
            >
              <FactCheckIcon className="w-3.5 h-3.5 text-orange-600" />
              <span>Demo 3 PDFs</span>
            </button>

            {hasData && (
              <button
                id="btn-export-json"
                onClick={onExportJson}
                className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
                title="Export complete knowledge layer data as JSON"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export</span>
              </button>
            )}

            {/* Divider */}
            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* User Log In / Sign Up / Profile */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-950 text-xs font-semibold"
                  title={`Logged in as ${currentUser.email || currentUser.displayName}`}
                >
                  <div className="w-5 h-5 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-[10px]">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="max-w-[110px] sm:max-w-[140px] truncate">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </div>
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-md text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer"
                  title="Log Out of your account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-login"
                  onClick={() => onOpenAuthModal('login')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md text-slate-700 hover:text-orange-600 hover:bg-orange-50 border border-slate-200 transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Log In</span>
                </button>
                <button
                  id="btn-signup"
                  onClick={() => onOpenAuthModal('signup')}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold rounded-md bg-orange-600 hover:bg-orange-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

    </header>
  );
};

