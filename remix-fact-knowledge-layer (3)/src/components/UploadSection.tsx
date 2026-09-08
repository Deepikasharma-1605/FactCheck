import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Trash2,
  ArrowRight,
  BarChart3,
  Megaphone,
  Check,
  AlertCircle,
  FilePlus,
  Zap,
  Clock,
  Layers
} from 'lucide-react';
import { CuteGirlWaitAnimation } from './CuteGirlWaitAnimation';
import { FactCheckIcon } from './FactCheckIcon';

interface UploadSectionProps {
  onAnalyze: (documents: { name: string; type: string; size: number; base64?: string; text?: string }[]) => Promise<void>;
  onLoadStarter: () => void;
  isProcessing: boolean;
  processingStep: string;
  extractionProgress?: number;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onAnalyze,
  onLoadStarter,
  isProcessing,
  processingStep,
  extractionProgress = 0,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'text'>('upload');

  // Custom text documents state
  const [customDocs, setCustomDocs] = useState<{ name: string; text: string }[]>([
    { name: 'Document_1.txt', text: '' },
    { name: 'Document_2.txt', text: '' }
  ]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setErrorMsg(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...droppedFiles]);
      setErrorMsg(null);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartAnalysis = async () => {
    setErrorMsg(null);

    if (inputMode === 'upload') {
      if (selectedFiles.length === 0) {
        setErrorMsg('Please select at least one PDF (You can upload 3+ pdf for comparison).');
        return;
      }

      // Convert files to base64 in parallel for maximum speed
      try {
        const payload = await Promise.all(
          selectedFiles.map(async (file) => {
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            return {
              name: file.name,
              type: file.type || 'application/pdf',
              size: file.size,
              base64,
            };
          })
        );
        await onAnalyze(payload);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to read uploaded files.');
      }
    } else {
      // Text mode
      const validDocs = customDocs.filter((d) => d.text.trim().length > 0);
      if (validDocs.length === 0) {
        setErrorMsg('Please enter document content in at least one document.');
        return;
      }
      await onAnalyze(
        validDocs.map((d) => ({
          name: d.name,
          type: 'text/plain',
          size: d.text.length,
          text: d.text,
        }))
      );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 sm:py-8 max-w-4xl mx-auto">
      {/* Centered Glowing Orange Icon Badge with F FactCheck Icon */}
      <div className="relative mb-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 text-white flex items-center justify-center shadow-xl shadow-orange-500/30 transform transition-transform hover:scale-105 select-none border border-white/40">
          <FactCheckIcon className="w-9 h-9 text-white" />
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight text-center mb-6">
        FactCheck Control Center
      </h1>

      {/* Two Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mb-6">
        {/* Left Orange Accent Card */}
        <button
          type="button"
          onClick={() => {
            setInputMode('upload');
            fileInputRef.current?.click();
          }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-5 rounded-2xl flex flex-col items-start justify-between min-h-[96px] shadow-lg shadow-orange-500/20 transition-all border border-orange-400/40 text-left group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
            <UploadCloud className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[11px] font-black uppercase tracking-wider text-white">
              UPLOAD 3+ PDFS
            </div>
            <div className="text-[10px] text-orange-100 mt-0.5">
              Select multiple documents
            </div>
          </div>
        </button>

        {/* Right White Card */}
        <button
          type="button"
          onClick={onLoadStarter}
          disabled={isProcessing}
          className="bg-white hover:bg-orange-50/50 text-slate-900 p-5 rounded-2xl flex flex-col items-start justify-between min-h-[96px] shadow-sm border border-orange-200 transition-all text-left group cursor-pointer disabled:opacity-50"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mb-3">
            <FactCheckIcon className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800 group-hover:text-orange-600 transition-colors">
              LOAD 3 SAMPLE PDFS
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Instant 3-document evaluation demo
            </div>
          </div>
        </button>
      </div>

      {/* Mode Switcher (Upload PDF / Paste Text) */}
      <div className="flex items-center justify-center gap-1 bg-orange-100/60 p-1 rounded-xl border border-orange-200/80 mb-4">
        <button
          onClick={() => setInputMode('upload')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
            inputMode === 'upload'
              ? 'bg-white text-orange-600 shadow-xs border border-orange-200/60 font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upload PDF Files
        </button>
        <button
          onClick={() => setInputMode('text')}
          className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
            inputMode === 'text'
              ? 'bg-white text-orange-600 shadow-xs border border-orange-200/60 font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Paste Raw Text
        </button>
      </div>

      {/* Main Upload / Text Box */}
      <div className="w-full max-w-2xl bg-white border border-orange-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
        {inputMode === 'upload' ? (
          <div>
            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-orange-500 bg-orange-50/80'
                  : 'border-orange-200 hover:border-orange-400 bg-orange-50/30 hover:bg-orange-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="application/pdf,text/plain"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-orange-200 flex items-center justify-center mx-auto mb-3 text-orange-600">
                <UploadCloud className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Click to browse or drag & drop PDFs here
              </h3>
              
              {/* Highlighted explicit badge */}
              <div className="inline-flex items-center gap-1.5 mt-2.5 px-3.5 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold border border-orange-200">
                <Zap className="w-3.5 h-3.5 text-orange-600" />
                <span>You can upload 3+ pdf (100+ pages each supported)</span>
              </div>

              <p className="text-[11px] text-slate-500 mt-2">
                Supported formats: PDF, TXT (High-speed parallel indexation across hundreds of pages)
              </p>
            </div>

            {/* Selected files list */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-semibold">
                  <span>Selected Documents ({selectedFiles.length})</span>
                  <button
                    onClick={() => setSelectedFiles([])}
                    className="text-slate-400 hover:text-rose-600 transition-colors text-[11px]"
                  >
                    Clear all
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold text-[10px]">
                          PDF
                        </div>
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 truncate text-[11px]">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile(idx);
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Text Snippets Mode */
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customDocs.map((doc, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-slate-50">
                  <div className="flex items-center justify-between mb-1.5">
                    <input
                      type="text"
                      value={doc.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCustomDocs((prev) =>
                          prev.map((d, i) => (i === idx ? { ...d, name: val } : d))
                        );
                      }}
                      className="text-xs font-semibold text-slate-800 bg-white px-2 py-0.5 border border-slate-200 rounded w-44"
                    />
                    <span className="text-[10px] text-slate-400 font-mono">Doc #{idx + 1}</span>
                  </div>
                  <textarea
                    rows={6}
                    value={doc.text}
                    placeholder={`Paste text content of ${doc.name} here...`}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCustomDocs((prev) =>
                        prev.map((d, i) => (i === idx ? { ...d, text: val } : d))
                      );
                    }}
                    className="w-full text-xs font-mono p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/30"
                  />
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setCustomDocs((prev) => [
                  ...prev,
                  { name: `Document_${prev.length + 1}.txt`, text: '' },
                ])
              }
              className="inline-flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
            >
              <FilePlus className="w-3.5 h-3.5 mr-1" />
              Add another document
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Live Processing Indicator showing Percentage up to 100% */}
        {isProcessing && (
          <div className="mt-4 p-4 rounded-2xl bg-white text-slate-900 border border-orange-300 animate-in fade-in duration-200 shadow-xl shadow-orange-500/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    extractionProgress === 100 ? 'bg-emerald-500' : 'bg-orange-500 animate-ping'
                  }`}
                />
                <span className="font-black text-slate-900">
                  {extractionProgress === 100
                    ? 'Extraction Complete (100%)'
                    : 'Extracting Facts with FactCheck AI'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-sm sm:text-base font-mono font-black px-2.5 py-0.5 rounded-lg border transition-colors ${
                    extractionProgress === 100
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-orange-50 text-orange-700 border-orange-300'
                  }`}
                >
                  {extractionProgress}%
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
              <Zap className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span>
                {processingStep ||
                  (extractionProgress === 100
                    ? '100% extracted! Ready to view cross-document insights.'
                    : 'Scanning 100+ pages per document & isolating factual claims...')}
              </span>
            </p>

            {/* Percentage Progress Bar up to 100% */}
            <div className="w-full h-3 bg-orange-100 rounded-full mt-3 overflow-hidden p-0.5 border border-orange-200 shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-200 ease-out relative ${
                  extractionProgress === 100
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-sm'
                    : 'bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 animate-pulse'
                }`}
                style={{ width: `${Math.max(extractionProgress, 4)}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-1.5 px-0.5 font-bold">
              <span>0% Initialized</span>
              <span className="text-orange-700">{extractionProgress}% of facts extracted</span>
              <span className={extractionProgress === 100 ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                100% Complete
              </span>
            </div>

            {/* Cute Girl Popping Animation after 98% (98% - 99%), automatically removed when 100% */}
            {extractionProgress >= 98 && extractionProgress < 100 && (
              <CuteGirlWaitAnimation progress={extractionProgress} />
            )}
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-5 pt-4 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onLoadStarter}
            disabled={isProcessing}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-orange-200 text-orange-900 bg-orange-50/70 hover:bg-orange-100 text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
          >
            <FactCheckIcon className="w-3.5 h-3.5 text-orange-600 mr-1.5" />
            Load 3 Starter PDFs (Instant Demo)
          </button>

          <button
            type="button"
            id="btn-process-docs"
            onClick={handleStartAnalysis}
            disabled={isProcessing || (inputMode === 'upload' && selectedFiles.length === 0)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xs font-extrabold shadow-md shadow-orange-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>
                  {extractionProgress === 100
                    ? '100% Extracted!'
                    : `Extracting Document (${extractionProgress}%)...`}
                </span>
              </div>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-1 text-white" />
                <span>Extract Document</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
