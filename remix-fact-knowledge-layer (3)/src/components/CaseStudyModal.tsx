import React, { useState } from 'react';
import { X, BookOpen, CheckCircle, Copy, Check, Terminal, Layers, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';

interface CaseStudyModalProps {
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'walkthrough' | 'readme'>('walkthrough');

  const readmeMarkdown = `# Fact Knowledge Layer — Superjoin Engineering Assignment

> **Live Hosted Application**: https://factcheck-f6ace.web.app  
> **Hosted via**: Command Prompt (Firebase CLI)  
> **Submission for**: Superjoin VIT 2026 · Engineering Intern Hiring Assignment  

## 1. Setup and Run Instructions
- **Prerequisites**: Node.js v18+, npm
- **Environment**: Set \`GEMINI_API_KEY\` in your \`.env\` file
- **Install dependencies**: \`npm install\`
- **Run dev server**: \`npm run dev\`
- **Access application**: Open [http://localhost:3000](http://localhost:3000)
- **Production Build & Deploy**:
  \`\`\`bash
  npm run build
  npx firebase deploy --only hosting
  \`\`\`
  Hosted at: https://factcheck-f6ace.web.app

---

## 2. Approach & Architecture
### The Challenge
Important facts are scattered across documents, expressed differently, supported by cross-references, or contradicted elsewhere. A simple graph database alone is not the answer; the value lies in discovering, grounding, comparing, and reconciling facts.

### System Pipeline
1. **Multimodal Ingestion**: Accepts raw PDFs (or text) and transmits them directly to Gemini 3.8 Flash with full page, tabular, and layout preservation.
2. **Fact Extraction & Grounding**: Extracts discrete numerical and semantic propositions. Every fact is constrained to an exact verbatim quote and page reference.
3. **Cross-Document Semantic Comparison**: Compares statements across document pairs and clusters them into the four mandatory cases:
   - **Case 1: Corroboration (Agreement)** — Semantic equivalence despite syntactic differences ($42.5M vs $42,500,000 USD).
   - **Case 2: Genuine Contradiction** — Incompatible claims for identical temporal and structural parameters (1,240 vs 890 employees on Dec 31, 2023).
   - **Case 3: Apparent Contradiction Reconciled by Context** — Differences explained by chronology (CTO tenure transition), reporting scope (Q4 operating profit vs 12-month full-year profit), or units.
   - **Case 4: Extraction/Reasoning Failure Handled** — Footnote methodology shifts, ambiguous denominators, or OCR noise flagged with calibrated confidence scores and human-in-the-loop warnings.
4. **Interactive Fact Knowledge Layer Querying**: Natural language Q&A grounded with source citations.

---

## 3. Demonstration of the Four Required Cases

### Case 1: Corroborated Across Documents
- **Doc 2 (ApexTech 2023 Annual Report, p. 4)**: "Consolidated top-line revenue amounted to $42.5 million for the full fiscal year 2023."
- **Doc 3 (Independent Auditor Report, p. 2)**: "Gross revenue for the twelve-month period ending December 31, 2023 was independently verified at $42,500,000 USD ($42.5M)."
- **System Reasoning**: Verifies numerical parity ($42.5M = $42,500,000) and aligns semantic terms ("consolidated top-line" = "gross revenue") for the identical period.

### Case 2: Genuine or Likely Contradiction
- **Doc 2 (ApexTech 2023 Annual Report, p. 12)**: "As of December 31, 2023, ApexTech employed 1,240 full-time staff members worldwide across all engineering and customer hubs."
- **Doc 3 (Independent Auditor Report, p. 9)**: "Certified payroll audits confirm total permanent full-time personnel on payroll as of December 31, 2023 was 890 employees."
- **System Reasoning**: Genuine contradiction on the exact same date (Dec 31, 2023). Highlights public reporting discrepancy between internal management estimates and certified statutory payroll audits.

### Case 3: Apparent Contradiction Explained by Context (Time & Scope)
- **Example A (Time/Personnel)**: Elena Rostova listed as CTO in 2022 Annual Report vs David Chen appointed CTO in March 2023. Reconciled by temporal timeline.
- **Example B (Scope)**: Q4 Operating Income of $3.8M in Management Report vs Full-Year Operating Income of $14.2M in Auditor Report. Reconciled by quarterly (3-month) vs annual (12-month) scope.

### Case 4: Extraction / Reasoning Failure & Handling Strategy
- **Discovered Failure**: In Doc 1, the text asserts "Customer satisfaction index improved to 94", but a buried footnote notes the methodology changed mid-year and sample size was n=120. In Doc 2, CSAT is reported as "91%".
- **Naive Failure**: A basic model would infer a 3% decline or claim conflicting metrics.
- **Our Handling**: System extracts the attached qualification footnote, flags a low confidence score (0.52), alerts the user that baseline comparison is invalid due to methodology changes, and prevents erroneous automated trend reconciliation.

---

## 4. Limitations & Next Steps
- **Large PDF Scaling**: For 100+ page documents, implement hybrid retrieval (hierarchical chunking + BM25/Dense hybrid vector index) prior to LLM synthesis.
- **Dynamic Ontology Evolution**: Enable the fact schema to evolve automatically as new domain-specific dimensions emerge (e.g., ESG metrics, clinical trial endpoints).
- **Incremental Document Addition**: Ingest new files incrementally by diffing against existing entity graphs without re-processing all prior documents.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(readmeMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Superjoin Assignment Documentation
              </h3>
              <p className="text-[11px] text-slate-500">
                Architecture, 4 required test cases, and README specification
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab(activeTab === 'walkthrough' ? 'readme' : 'walkthrough')}
              className="text-xs px-2.5 py-1 font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            >
              {activeTab === 'walkthrough' ? 'View README.md' : 'View Visual Guide'}
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {activeTab === 'walkthrough' ? (
            <>
              {/* Four cases quick visual */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2.5 flex items-center">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
                  How this system fulfills the Four Required Cases:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                    <span className="font-bold text-emerald-900 block mb-1 text-xs">
                      1. Corroborated Across Documents
                    </span>
                    <p className="text-emerald-800 text-[11px] leading-normal">
                      Connects $42.5M in Annual Report with $42,500,000 USD in Auditor Report. Reconciles distinct phrasing into single verified agreement.
                    </p>
                  </div>

                  <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-lg">
                    <span className="font-bold text-rose-900 block mb-1 text-xs">
                      2. Genuine Contradiction
                    </span>
                    <p className="text-rose-800 text-[11px] leading-normal">
                      Flags conflicting headcount on identical date (Dec 31, 2023): Management claims 1,240 employees vs Auditor confirms 890 on payroll.
                    </p>
                  </div>

                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                    <span className="font-bold text-amber-900 block mb-1 text-xs">
                      3. Reconciled by Context (Time / Scope / Units)
                    </span>
                    <p className="text-amber-800 text-[11px] leading-normal">
                      Resolves CTO difference by date (Elena in 2022 vs David in 2023) and operating income by scope ($3.8M quarterly vs $14.2M full year).
                    </p>
                  </div>

                  <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-lg">
                    <span className="font-bold text-purple-900 block mb-1 text-xs">
                      4. Extraction/Reasoning Failure Handled
                    </span>
                    <p className="text-purple-800 text-[11px] leading-normal">
                      Discloses footnote methodology change in CSAT (94 index vs 91%), preventing erroneous decline calculations and alerting human reviewers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Approach summary */}
              <div className="border-t border-slate-200 pt-3.5">
                <h4 className="text-xs font-bold text-slate-900 mb-2">
                  System Architecture & Decision Log
                </h4>
                <ul className="space-y-1.5 list-disc list-inside text-slate-600 text-[11px]">
                  <li>
                    <strong className="text-slate-800">Direct Multimodal PDF Processing:</strong> Utilizes Gemini 3.8 Flash native PDF inline parsing, bypassing lossy text-only scraping to preserve tables, footnotes, and layout.
                  </li>
                  <li>
                    <strong className="text-slate-800">Strict Verbatim Grounding:</strong> Every extracted fact requires an exact quote and page reference, eliminating hallucinations.
                  </li>
                  <li>
                    <strong className="text-slate-800">Generalization:</strong> Not hard-coded to any document schema or filenames. Accepts arbitrary PDFs through API or UI.
                  </li>
                  <li>
                    <strong className="text-slate-800">Failure Handling:</strong> Evaluates confidence scores and context ambiguities rather than forcing premature consensus.
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">
                  README.md (Formatted for GitHub Submission)
                </span>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 mr-1" />
                      Copy README
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
                {readmeMarkdown}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 border-t border-slate-200 flex items-center justify-between bg-slate-50 rounded-b-xl">
          <span className="text-[10px] text-slate-500 font-medium">
            Superjoin Hiring Assignment • Fact Knowledge Layer
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md hover:bg-blue-700 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
