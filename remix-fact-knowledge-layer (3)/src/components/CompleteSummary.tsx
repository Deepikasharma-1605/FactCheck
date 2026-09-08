import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  Search,
  ArrowLeft,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AnalysisResult, CompleteSummaryData } from '../types';
import { getCompleteSummary } from '../utils/summaryGenerator';

interface CompleteSummaryProps {
  data: AnalysisResult;
  onBackToFacts?: () => void;
  onNavigateToComparisons?: () => void;
}

export const CompleteSummary: React.FC<CompleteSummaryProps> = ({
  data,
  onBackToFacts,
  onNavigateToComparisons,
}) => {
  const summary: CompleteSummaryData = getCompleteSummary(data);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Grouped points for the summary
  const summaryGroups = [
    {
      groupTitle: 'The 1-Minute Overview',
      points: [
        summary.oneMinuteStory,
        `This summary combines and checks all details across ${summary.documentsCombined.length} documents: ${summary.documentsCombined.map((d) => d.shortTitle).join(', ')}.`,
      ],
    },
    {
      groupTitle: 'Money, Sales & Profits (Financial Summary)',
      points: [
        `Sales Growth: ${summary.financialsInSimpleWords.moneyEarnedStory}`,
        `Profit Turnaround: ${summary.financialsInSimpleWords.profitOrLossStory}`,
        ...(summary.financialsInSimpleWords.futureBillsStory
          ? [`Future Bills: ${summary.financialsInSimpleWords.futureBillsStory}`]
          : []),
        ...summary.financialsInSimpleWords.comparisons.map(
          (c) => `${c.topic}: ${c.simpleExplanation} (${c.verdictBadge})`
        ),
      ],
    },
    {
      groupTitle: 'Company Team & Leadership (People Summary)',
      points: [
        `Leadership & Management: ${summary.peopleAndTeamInSimpleWords.leadershipStory}`,
        `Headcount Disagreement: ${summary.peopleAndTeamInSimpleWords.headcountConflictStory}`,
        ...summary.peopleAndTeamInSimpleWords.comparisons.map(
          (c) => `${c.topic}: ${c.simpleExplanation}`
        ),
      ],
    },
    {
      groupTitle: 'Where All 3 PDFs Agree 100% (Solid Facts)',
      points: summary.whereAllPdfsAgree.points.map(
        (p) => `${p.title}: ${p.simpleDescription}`
      ),
    },
    {
      groupTitle: 'Where The Documents Disagree (Contradictions & Mistakes)',
      points: summary.wherePdfsFightOrDisagree.conflicts.map(
        (c) =>
          `${c.topic} — Question: ${c.simpleQuestion} | The Plain Truth: ${c.theTruthInPlainWords} | Recommendation: ${c.whoToTrust}`
      ),
    },
    {
      groupTitle: 'Numbers That Look Different (But Make Total Sense)',
      points: summary.whySomeNumbersLookDifferent.explanations.map(
        (e) =>
          `${e.topic}: What looks confusing: "${e.whatLooksWrong}" → Why it is actually correct: ${e.whyItIsActuallyOkay}`
      ),
    },
    {
      groupTitle: 'Important Fine Print & Footnotes (Auditor Findings)',
      points: summary.auditorSecretsAndFinePrint.secrets.map(
        (s) => `${s.title}: ${s.plainExplanation} (Found in: ${s.foundInDoc})`
      ),
    },
    {
      groupTitle: 'Bottom Line Takeaway',
      points: [
        summary.finalTakeawayInThreeSentences,
      ],
    },
  ];

  // Filtered points if user types in search
  const filteredGroups = summaryGroups
    .map((group) => {
      const filteredPoints = group.points.filter((pt) =>
        pt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return {
        ...group,
        points: filteredPoints,
      };
    })
    .filter((group) => group.points.length > 0);

  const handleCopy = () => {
    const textToCopy = summaryGroups
      .map(
        (g) =>
          `=== ${g.groupTitle} ===\n` +
          g.points.map((pt, i) => `${i + 1}. ${pt}`).join('\n')
      )
      .join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload =
      `# Complete Summary (All Documents Combined)\n\n` +
      summaryGroups
        .map(
          (g) =>
            `## ${g.groupTitle}\n\n` +
            g.points.map((pt) => `- ${pt}`).join('\n')
        )
        .join('\n\n');

    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Complete_Summary_Points_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Simple Page Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          {onBackToFacts && (
            <button
              id="btn-back-to-facts"
              onClick={onBackToFacts}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Page: Extracted Details</span>
            </button>
          )}
          <span className="text-xs text-slate-400">|</span>
          <span className="text-xs font-semibold text-slate-600">
            Page: <strong>Complete Summary</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToComparisons && (
            <button
              id="btn-next-to-comparisons"
              onClick={onNavigateToComparisons}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Next: Cross-PDF Comparisons</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Box: Simple UI, Clear Points, Easy Language */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Title & Subtitle */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Complete Summary in Easy Points
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                A plain-English summary of all {summary.documentsCombined.length} PDFs combined into simple points that are easy to read and understand.
              </p>
            </div>

            {/* Simple Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="btn-copy-summary-points"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Copy all points to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy Points</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="btn-download-summary-points"
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Download points as text file"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Simple Search Filter */}
          <div className="mt-4 relative max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search points (e.g. sales, profit, employees)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* The Points Themselves */}
        <div className="space-y-6">
          {filteredGroups.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              No points found matching &quot;{searchQuery}&quot;. Try another search keyword.
            </div>
          ) : (
            filteredGroups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-2.5">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  <span>{group.groupTitle}</span>
                </h2>

                <ul className="space-y-2 pl-4 border-l-2 border-slate-100">
                  {group.points.map((point, pIdx) => (
                    <li
                      key={pIdx}
                      className="text-xs sm:text-sm text-slate-700 leading-relaxed list-disc marker:text-slate-400 pl-1"
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            You are viewing the complete combined summary of all 3 PDFs in simple points.
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {onBackToFacts && (
              <button
                onClick={onBackToFacts}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Extracted Details</span>
              </button>
            )}
            {onNavigateToComparisons && (
              <button
                onClick={onNavigateToComparisons}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Next: Cross-PDF Comparisons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
