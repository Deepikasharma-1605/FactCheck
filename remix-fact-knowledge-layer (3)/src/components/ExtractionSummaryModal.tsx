import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ExtractionSummaryModalProps {
  data?: AnalysisResult;
  onNext: () => void;
  onClose?: () => void;
}

/**
 * Clean Interstitial Modal:
 * "only show click next to see extracted data , nothing else , everything shows on next page"
 * Does NOT show complete summary here.
 */
export const ExtractionSummaryModal: React.FC<ExtractionSummaryModalProps> = ({
  onNext,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-orange-200 p-6 sm:p-8 text-center my-auto">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg transition-colors text-xs font-mono cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        )}

        {/* Big check icon in warm orange gradient */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-orange-500/25 mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          PDF Extraction Complete
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 mb-6 leading-relaxed">
          Document claims and data points have been successfully parsed and verified.
        </p>

        {/* Requested primary action: Click next to see extracted data, nothing else */}
        <button
          type="button"
          id="btn-click-next-extracted-data"
          onClick={onNext}
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white font-black text-sm tracking-wide shadow-lg shadow-orange-600/25 transition-all cursor-pointer"
        >
          <span>Click Next to see extracted data</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
