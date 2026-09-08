import React from 'react';
import { X, FileText, Quote, Copy, Check, ShieldCheck, Calendar, Tag } from 'lucide-react';

interface EvidenceModalProps {
  fact: any | null;
  onClose: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({ fact, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!fact) return null;

  const evidence = fact.evidence || {};
  const quoteText = evidence.exactQuote || fact.exactQuote || '';
  const docName = evidence.docName || fact.docName || 'Unknown Document';
  const pageNumber = evidence.pageNumber || fact.page || 'N/A';

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-5 relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className="w-7 h-7 rounded bg-blue-100 text-blue-700 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Source Evidence Citation
            </h3>
            <p className="text-[11px] text-slate-500">
              Verbatim grounding extracted directly from source PDF
            </p>
          </div>
        </div>

        {/* Document & Page reference */}
        <div className="grid grid-cols-2 gap-2 mb-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              Document
            </span>
            <p className="font-semibold text-slate-800 truncate text-[11px]">{docName}</p>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              Page / Section
            </span>
            <p className="font-semibold text-blue-600 font-mono text-[11px]">
              Page {pageNumber} {evidence.section ? `• ${evidence.section}` : ''}
            </p>
          </div>
        </div>

        {/* Fact Claim */}
        {fact.factClaim && (
          <div className="mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Extracted Statement:
            </span>
            <p className="text-xs font-semibold text-slate-900 bg-slate-50/70 p-2.5 rounded-lg border border-slate-200">
              {fact.factClaim}
            </p>
          </div>
        )}

        {/* Verbatim Quote */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <Quote className="w-3 h-3 mr-1 text-blue-600" />
              Verbatim Document Excerpt:
            </span>
            <button
              onClick={handleCopyQuote}
              className="text-[10px] text-slate-600 hover:text-blue-600 flex items-center gap-1 font-semibold"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="p-3 bg-blue-50/40 border-l-2 border-blue-600 rounded-r-lg text-xs font-mono text-slate-800 leading-relaxed">
            "{quoteText}"
          </div>
        </div>

        {/* Additional metadata tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-100 text-[10px] text-slate-600">
          {fact.entityOrTopic && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
              <Tag className="w-3 h-3 mr-1 text-slate-400" />
              {fact.entityOrTopic}
            </span>
          )}
          {fact.temporalScope && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
              <Calendar className="w-3 h-3 mr-1 text-slate-400" />
              {fact.temporalScope}
            </span>
          )}
          {fact.confidence && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 mr-1" />
              Confidence: {Math.round(fact.confidence * 100)}%
            </span>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-4 pt-2.5 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
