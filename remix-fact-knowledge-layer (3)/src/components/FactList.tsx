import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Layers,
  AlertTriangle,
  CheckCircle2,
  GitCompare,
  HelpCircle,
  ExternalLink,
  LayoutGrid,
  Table as TableIcon,
  ArrowUpDown,
  ArrowRight,
  ArrowLeft,
  Scale,
  Quote,
  Sparkles,
  Info,
  BookOpen,
  Copy,
  Check,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  ExtractedFact,
  DocumentSource,
  FactComparison,
  ComparisonVerdict,
  AnalysisResult,
  CompleteSummaryData
} from '../types';
import { getCompleteSummary } from '../utils/summaryGenerator';

export type StatusFilterType =
  | 'all'
  | 'corroborated'
  | 'contradicted'
  | 'uncertain'
  | 'context_reconciled'
  | 'unique';

export type FactSortField =
  | 'factNumber'
  | 'status'
  | 'topic'
  | 'pdfCount';

interface FactListProps {
  data?: AnalysisResult;
  facts: ExtractedFact[];
  documents: DocumentSource[];
  comparisons?: FactComparison[];
  onInspectEvidence: (fact: ExtractedFact) => void;
  onNavigateToComparisons?: () => void;
  onNavigateToSummary?: () => void;
  initialStatusFilter?: string | null;
}

interface StatusOptionConfig {
  id: StatusFilterType;
  title: string;
  badgeLabel: string;
  icon: React.ElementType;
  activeBg: string;
  activeBorder: string;
  badgeColor: string;
  cardBorder: string;
  headerAccent: string;
  summaryBoxBg: string;
  summaryBoxBorder: string;
  summaryTextColor: string;
  priority: number;
}

const STATUS_OPTIONS: StatusOptionConfig[] = [
  {
    id: 'all',
    title: 'All Extracted Facts',
    badgeLabel: 'All Facts',
    icon: Layers,
    activeBg: 'bg-orange-600 text-white shadow-xs',
    activeBorder: 'border-orange-600',
    badgeColor: 'bg-orange-100 text-orange-900 border-orange-200',
    cardBorder: 'border-slate-200/90 hover:border-orange-300',
    headerAccent: 'bg-orange-600 text-white',
    summaryBoxBg: 'bg-orange-50/80',
    summaryBoxBorder: 'border-orange-200',
    summaryTextColor: 'text-orange-950',
    priority: 99,
  },
  {
    id: 'contradicted',
    title: 'Contradicted Facts',
    badgeLabel: 'Contradicted',
    icon: AlertTriangle,
    activeBg: 'bg-rose-600 text-white shadow-xs',
    activeBorder: 'border-rose-600',
    badgeColor: 'bg-rose-100 text-rose-950 border-rose-300 font-black',
    cardBorder: 'border-rose-300 hover:border-rose-400 bg-rose-50/20',
    headerAccent: 'bg-rose-600 text-white',
    summaryBoxBg: 'bg-rose-50/90',
    summaryBoxBorder: 'border-rose-200',
    summaryTextColor: 'text-rose-950',
    priority: 1,
  },
  {
    id: 'corroborated',
    title: 'Collaborated Facts (Agreed Across PDFs)',
    badgeLabel: 'Collaborated',
    icon: CheckCircle2,
    activeBg: 'bg-emerald-600 text-white shadow-xs',
    activeBorder: 'border-emerald-600',
    badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300 font-black',
    cardBorder: 'border-emerald-300 hover:border-emerald-400 bg-emerald-50/20',
    headerAccent: 'bg-emerald-600 text-white',
    summaryBoxBg: 'bg-emerald-50/90',
    summaryBoxBorder: 'border-emerald-200',
    summaryTextColor: 'text-emerald-950',
    priority: 2,
  },
  {
    id: 'context_reconciled',
    title: 'Context Differences',
    badgeLabel: 'Context Difference',
    icon: GitCompare,
    activeBg: 'bg-amber-600 text-white shadow-xs',
    activeBorder: 'border-amber-600',
    badgeColor: 'bg-amber-100 text-amber-950 border-amber-300 font-black',
    cardBorder: 'border-amber-300 hover:border-amber-400 bg-amber-50/20',
    headerAccent: 'bg-amber-600 text-white',
    summaryBoxBg: 'bg-amber-50/90',
    summaryBoxBorder: 'border-amber-200',
    summaryTextColor: 'text-amber-950',
    priority: 3,
  },
  {
    id: 'uncertain',
    title: 'Edge Cases / Uncertain',
    badgeLabel: 'Edge Case',
    icon: HelpCircle,
    activeBg: 'bg-purple-600 text-white shadow-xs',
    activeBorder: 'border-purple-600',
    badgeColor: 'bg-purple-100 text-purple-950 border-purple-300 font-black',
    cardBorder: 'border-purple-300 hover:border-purple-400 bg-purple-50/20',
    headerAccent: 'bg-purple-600 text-white',
    summaryBoxBg: 'bg-purple-50/90',
    summaryBoxBorder: 'border-purple-200',
    summaryTextColor: 'text-purple-950',
    priority: 4,
  },
  {
    id: 'unique',
    title: 'Unique to 1 PDF',
    badgeLabel: 'Unique to 1 PDF',
    icon: FileText,
    activeBg: 'bg-slate-700 text-white shadow-xs',
    activeBorder: 'border-slate-700',
    badgeColor: 'bg-slate-100 text-slate-900 border-slate-300 font-black',
    cardBorder: 'border-slate-200 hover:border-slate-300',
    headerAccent: 'bg-slate-700 text-white',
    summaryBoxBg: 'bg-slate-50',
    summaryBoxBorder: 'border-slate-200',
    summaryTextColor: 'text-slate-900',
    priority: 5,
  }
];

// Helper colors for PDF badges (PDF 1, PDF 2, PDF 3...)
const PDF_COLORS = [
  {
    badge: 'bg-blue-100 text-blue-900 border-blue-300',
    border: 'border-blue-200',
    bg: 'bg-blue-50/50',
    labelBg: 'bg-blue-600 text-white',
    ring: 'ring-blue-500/20'
  },
  {
    badge: 'bg-purple-100 text-purple-900 border-purple-300',
    border: 'border-purple-200',
    bg: 'bg-purple-50/50',
    labelBg: 'bg-purple-600 text-white',
    ring: 'ring-purple-500/20'
  },
  {
    badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    border: 'border-emerald-200',
    bg: 'bg-emerald-50/50',
    labelBg: 'bg-emerald-600 text-white',
    ring: 'ring-emerald-500/20'
  },
  {
    badge: 'bg-amber-100 text-amber-900 border-amber-300',
    border: 'border-amber-200',
    bg: 'bg-amber-50/50',
    labelBg: 'bg-amber-600 text-white',
    ring: 'ring-amber-500/20'
  }
];

export interface ExtractedDataPoint {
  pdfNumber: number; // 1, 2, 3...
  pdfLabel: string;  // "PDF 1", "PDF 2", "PDF 3"
  docName: string;
  page?: string | number;
  statement: string;
  exactQuote?: string;
  numericalValue?: string | number;
  unit?: string;
  temporalScope?: string;
  originalFact?: ExtractedFact;
}

export interface SynthesizedFact {
  factNumber: number; // 1, 2, 3...
  id: string;
  topic: string;
  category: string;
  status: StatusFilterType;
  comparisonVerdict?: ComparisonVerdict;
  sourcePdfs: {
    pdfNumber: number;
    pdfLabel: string;
    docName: string;
    page?: string | number;
  }[];
  extractedData: ExtractedDataPoint[];
  howDataIsCorroboratedOrContradicted: string;
  summarySentence: string;
  underlyingFacts: ExtractedFact[];
}

export const FactList: React.FC<FactListProps> = ({
  data,
  facts,
  documents,
  comparisons = [],
  onInspectEvidence,
  onNavigateToComparisons,
  onNavigateToSummary,
  initialStatusFilter = 'all',
}) => {
  const [selectedDoc, setSelectedDoc] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<StatusFilterType>(() => {
    if (initialStatusFilter === 'corroborated') return 'corroborated';
    if (initialStatusFilter === 'genuine_contradiction' || initialStatusFilter === 'contradicted') return 'contradicted';
    if (initialStatusFilter === 'context_reconciled') return 'context_reconciled';
    if (initialStatusFilter === 'extraction_failure_risk' || initialStatusFilter === 'uncertain') return 'uncertain';
    return 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [sortBy, setSortBy] = useState<FactSortField>('factNumber');

  // Special Column: Complete Summary state
  // "in extracted data section make a special column of complete summary section , if someone opens that , then show cpomplete summary othervise show extracted data include collaborated , facs etc"
  const [isSpecialSummaryColumnOpen, setIsSpecialSummaryColumnOpen] = useState(false);
  const [summarySearchQuery, setSummarySearchQuery] = useState('');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Compute or get Complete Summary across all documents in plain English
  const completeSummary: CompleteSummaryData = useMemo(() => {
    if (data) return getCompleteSummary(data);
    return getCompleteSummary({
      documents,
      facts,
      comparisons,
      systemMetrics: {
        totalFacts: facts.length,
        corroboratedCount: comparisons.filter((c) => c.verdict === 'corroborated').length,
        contradictionCount: comparisons.filter((c) => c.verdict === 'genuine_contradiction').length,
        contextReconciledCount: comparisons.filter((c) => c.verdict === 'context_reconciled').length,
        failuresHandledCount: comparisons.filter((c) => c.verdict === 'extraction_failure_risk').length,
        processingTimeMs: 1200,
        modelUsed: 'gemini-3.8-flash',
      },
    });
  }, [data, documents, facts, comparisons]);

  // Grouped plain-English points for Complete Summary
  const summaryGroups = useMemo(() => {
    if (!completeSummary) return [];
    return [
      {
        id: 'overview',
        groupTitle: 'The 1-Minute Overview',
        badge: 'Quick Story',
        badgeColor: 'bg-orange-100 text-orange-950 border-orange-300',
        points: [
          completeSummary.oneMinuteStory,
          `This summary combines and checks all details across ${completeSummary.documentsCombined.length} documents: ${completeSummary.documentsCombined.map((d) => d.shortTitle).join(', ')}.`,
        ],
      },
      {
        id: 'financial',
        groupTitle: 'Money, Sales & Profits (Financial Summary)',
        badge: 'Financials',
        badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-300',
        points: [
          `Sales Growth: ${completeSummary.financialsInSimpleWords.moneyEarnedStory}`,
          `Profit Turnaround: ${completeSummary.financialsInSimpleWords.profitOrLossStory}`,
          ...(completeSummary.financialsInSimpleWords.futureBillsStory
            ? [`Future Bills: ${completeSummary.financialsInSimpleWords.futureBillsStory}`]
            : []),
          ...completeSummary.financialsInSimpleWords.comparisons.map(
            (c) => `${c.topic}: ${c.simpleExplanation} (${c.verdictBadge})`
          ),
        ],
      },
      {
        id: 'people',
        groupTitle: 'Company Team & Leadership (People Summary)',
        badge: 'Leadership',
        badgeColor: 'bg-blue-100 text-blue-950 border-blue-300',
        points: [
          `Leadership & Management: ${completeSummary.peopleAndTeamInSimpleWords.leadershipStory}`,
          `Headcount Disagreement: ${completeSummary.peopleAndTeamInSimpleWords.headcountConflictStory}`,
          ...completeSummary.peopleAndTeamInSimpleWords.comparisons.map(
            (c) => `${c.topic}: ${c.simpleExplanation}`
          ),
        ],
      },
      {
        id: 'agreed',
        groupTitle: 'Where All 3 PDFs Agree 100% (Solid Facts)',
        badge: '100% Agreement',
        badgeColor: 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black',
        points: completeSummary.whereAllPdfsAgree.points.map(
          (p) => `${p.title}: ${p.simpleDescription}`
        ),
      },
      {
        id: 'conflicts',
        groupTitle: 'Where The Documents Disagree (Contradictions & Mistakes)',
        badge: 'Conflicts Flagged',
        badgeColor: 'bg-rose-100 text-rose-950 border-rose-400 font-black',
        points: completeSummary.wherePdfsFightOrDisagree.conflicts.map(
          (c) =>
            `${c.topic} — Question: ${c.simpleQuestion} | The Plain Truth: ${c.theTruthInPlainWords} | Recommendation: ${c.whoToTrust}`
        ),
      },
      {
        id: 'context',
        groupTitle: 'Numbers That Look Different (Context Reconciliations)',
        badge: 'Context Explained',
        badgeColor: 'bg-amber-100 text-amber-950 border-amber-300 font-black',
        points: completeSummary.whySomeNumbersLookDifferent.explanations.map(
          (e) =>
            `${e.topic}: What looks confusing: "${e.whatLooksWrong}" → Why it is actually correct: ${e.whyItIsActuallyOkay}`
        ),
      },
      {
        id: 'fineprint',
        groupTitle: 'Important Fine Print & Footnotes (Auditor Findings)',
        badge: 'Audit Notes',
        badgeColor: 'bg-purple-100 text-purple-950 border-purple-300 font-bold',
        points: completeSummary.auditorSecretsAndFinePrint.secrets.map(
          (s) => `${s.title}: ${s.plainExplanation} (Found in: ${s.foundInDoc})`
        ),
      },
      {
        id: 'takeaway',
        groupTitle: 'Bottom Line Takeaway',
        badge: 'Verdict',
        badgeColor: 'bg-slate-900 text-white font-black',
        points: [completeSummary.finalTakeawayInThreeSentences],
      },
    ];
  }, [completeSummary]);

  // Filtered summary groups based on search input
  const filteredSummaryGroups = useMemo(() => {
    if (!summarySearchQuery.trim()) return summaryGroups;
    const q = summarySearchQuery.toLowerCase();
    return summaryGroups
      .map((g) => ({
        ...g,
        points: g.points.filter((pt) => pt.toLowerCase().includes(q)),
      }))
      .filter((g) => g.points.length > 0);
  }, [summaryGroups, summarySearchQuery]);

  const handleCopySummary = () => {
    const textToCopy = summaryGroups
      .map(
        (g) =>
          `=== ${g.groupTitle} ===\n` +
          g.points.map((pt, i) => `${i + 1}. ${pt}`).join('\n')
      )
      .join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleDownloadSummary = () => {
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

  // Map each document to a user-friendly "PDF 1", "PDF 2", "PDF 3" label
  const docPdfMap = useMemo(() => {
    const map = new Map<string, { pdfNumber: number; pdfLabel: string; docName: string }>();
    documents.forEach((doc, idx) => {
      map.set(doc.name, {
        pdfNumber: idx + 1,
        pdfLabel: `PDF ${idx + 1}`,
        docName: doc.name
      });
    });
    return map;
  }, [documents]);

  const getPdfInfo = useMemo(() => {
    return (docName: string) => {
      const found = docPdfMap.get(docName);
      if (found) return found;

      // Check partial match
      for (const [key, value] of docPdfMap.entries()) {
        if (docName.includes(key) || key.includes(docName)) {
          return value;
        }
      }
      return {
        pdfNumber: 1,
        pdfLabel: 'PDF 1',
        docName: docName || 'Document'
      };
    };
  }, [docPdfMap]);

  // Build the Synthesized Fact list:
  // "Fact 1", "This data extracted from PDF 1, 2, 3", "The extracted data", "How the data is corroborated and contradicted", "Summary"
  const synthesizedFacts = useMemo(() => {
    const result: SynthesizedFact[] = [];
    const usedFactIds = new Set<string>();

    // Normalize topic helper
    const normalizeTopic = (t: string) =>
      t.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

    // 1. Process Comparisons first (these are cross-document facts compared across PDF 1, 2, 3)
    comparisons.forEach((comp) => {
      const matchingFacts = facts.filter((f) => {
        if (f.comparisonId && f.comparisonId === comp.id) return true;
        if (normalizeTopic(f.entityOrTopic) === normalizeTopic(comp.entityOrTopic)) return true;
        // Check quotes or statements
        const hasQuoteMatch = (comp.factsCompared || []).some(
          (fc) =>
            (fc.factId && fc.factId === f.id) ||
            (fc.exactQuote && f.evidence?.exactQuote && (fc.exactQuote.includes(f.evidence.exactQuote) || f.evidence.exactQuote.includes(fc.exactQuote))) ||
            (fc.statement && f.factClaim && (fc.statement.includes(f.factClaim) || f.factClaim.includes(fc.statement)))
        );
        return hasQuoteMatch;
      });

      matchingFacts.forEach((f) => usedFactIds.add(f.id));

      // Build data points for each document
      const extractedDataPoints: ExtractedDataPoint[] = [];
      const sourceDocSet = new Map<string, { pdfNumber: number; pdfLabel: string; docName: string; page?: string | number }>();

      // From factsCompared
      (comp.factsCompared || []).forEach((fc) => {
        const info = getPdfInfo(fc.docName);
        const relatedFact = matchingFacts.find((f) => f.docName === fc.docName);

        sourceDocSet.set(fc.docName, {
          pdfNumber: info.pdfNumber,
          pdfLabel: info.pdfLabel,
          docName: fc.docName,
          page: fc.page || relatedFact?.evidence.pageNumber
        });

        extractedDataPoints.push({
          pdfNumber: info.pdfNumber,
          pdfLabel: info.pdfLabel,
          docName: fc.docName,
          page: fc.page || relatedFact?.evidence.pageNumber,
          statement: fc.statement,
          exactQuote: fc.exactQuote || relatedFact?.evidence.exactQuote,
          numericalValue: relatedFact?.numericalValue,
          unit: relatedFact?.unit,
          temporalScope: fc.timeOrScope || relatedFact?.temporalScope,
          originalFact: relatedFact
        });
      });

      // Any matching facts not in factsCompared
      matchingFacts.forEach((f) => {
        const alreadyAdded = extractedDataPoints.some((dp) => dp.docName === f.docName);
        if (!alreadyAdded) {
          const info = getPdfInfo(f.docName);
          sourceDocSet.set(f.docName, {
            pdfNumber: info.pdfNumber,
            pdfLabel: info.pdfLabel,
            docName: f.docName,
            page: f.evidence.pageNumber
          });
          extractedDataPoints.push({
            pdfNumber: info.pdfNumber,
            pdfLabel: info.pdfLabel,
            docName: f.docName,
            page: f.evidence.pageNumber,
            statement: f.factClaim,
            exactQuote: f.evidence.exactQuote,
            numericalValue: f.numericalValue,
            unit: f.unit,
            temporalScope: f.temporalScope,
            originalFact: f
          });
        }
      });

      // Sort extracted data points by pdfNumber
      extractedDataPoints.sort((a, b) => a.pdfNumber - b.pdfNumber);

      const sourcePdfsList = Array.from(sourceDocSet.values()).sort((a, b) => a.pdfNumber - b.pdfNumber);

      // Determine status
      let status: StatusFilterType = 'corroborated';
      if (comp.verdict === 'genuine_contradiction') {
        status = 'contradicted';
      } else if (comp.verdict === 'context_reconciled') {
        status = 'context_reconciled';
      } else if (comp.verdict === 'extraction_failure_risk') {
        status = 'uncertain';
      } else {
        status = 'corroborated';
      }

      // Generate punchy summary sentence ("The data in both PDF 2 and PDF 3 is ..., hence corroborated")
      let summarySentence = comp.plainLanguageSummary || '';
      if (!summarySentence) {
        const pdfLabelsStr = sourcePdfsList.map((p) => p.pdfLabel).join(' and ');
        if (status === 'corroborated') {
          summarySentence = `The data in ${sourcePdfsList.length > 2 ? 'all ' + sourcePdfsList.length + ' PDFs (' + pdfLabelsStr + ')' : 'both ' + pdfLabelsStr} is substantive agreement for ${comp.entityOrTopic}, hence corroborated.`;
        } else if (status === 'contradicted') {
          summarySentence = `The data in ${sourcePdfsList[0]?.pdfLabel || 'PDF 1'} conflicts with ${sourcePdfsList[1]?.pdfLabel || 'PDF 2'} on the exact same date and metric, hence contradicted.`;
        } else if (status === 'context_reconciled') {
          summarySentence = `The data in ${pdfLabelsStr} has differing values due to reporting context, hence reconciled.`;
        } else {
          summarySentence = `The data across ${pdfLabelsStr} contains footnote or methodology variations, hence flagged as an edge case.`;
        }
      }

      result.push({
        factNumber: 0, // Assigned after sort
        id: comp.id,
        topic: comp.entityOrTopic,
        category: comp.category,
        status,
        comparisonVerdict: comp.verdict,
        sourcePdfs: sourcePdfsList,
        extractedData: extractedDataPoints,
        howDataIsCorroboratedOrContradicted: comp.detailedReasoning || comp.headline,
        summarySentence,
        underlyingFacts: matchingFacts
      });
    });

    // 2. Process remaining facts (facts appearing in only 1 PDF or not part of a comparison)
    const topicGroups = new Map<string, ExtractedFact[]>();
    facts.forEach((f) => {
      if (!usedFactIds.has(f.id)) {
        const norm = normalizeTopic(f.entityOrTopic);
        const group = topicGroups.get(norm) || [];
        group.push(f);
        topicGroups.set(norm, group);
      }
    });

    topicGroups.forEach((groupFacts) => {
      const firstFact = groupFacts[0];
      const sourceDocSet = new Map<string, { pdfNumber: number; pdfLabel: string; docName: string; page?: string | number }>();
      const extractedDataPoints: ExtractedDataPoint[] = [];

      groupFacts.forEach((f) => {
        const info = getPdfInfo(f.docName);
        sourceDocSet.set(f.docName, {
          pdfNumber: info.pdfNumber,
          pdfLabel: info.pdfLabel,
          docName: f.docName,
          page: f.evidence.pageNumber
        });

        extractedDataPoints.push({
          pdfNumber: info.pdfNumber,
          pdfLabel: info.pdfLabel,
          docName: f.docName,
          page: f.evidence.pageNumber,
          statement: f.factClaim,
          exactQuote: f.evidence.exactQuote,
          numericalValue: f.numericalValue,
          unit: f.unit,
          temporalScope: f.temporalScope,
          originalFact: f
        });
      });

      extractedDataPoints.sort((a, b) => a.pdfNumber - b.pdfNumber);
      const sourcePdfsList = Array.from(sourceDocSet.values()).sort((a, b) => a.pdfNumber - b.pdfNumber);

      const isSingleDoc = sourcePdfsList.length === 1;
      let status: StatusFilterType = 'unique';

      if (isSingleDoc) {
        status = firstFact.reconciliationStatus === 'uncertain' || (firstFact.confidence && firstFact.confidence < 0.75)
          ? 'uncertain'
          : 'unique';
      } else {
        const hasConflict = groupFacts.some((f) => f.reconciliationStatus === 'contradicted');
        const hasCorroboration = groupFacts.some((f) => f.reconciliationStatus === 'corroborated');
        status = hasConflict ? 'contradicted' : hasCorroboration ? 'corroborated' : 'unique';
      }

      const pdfLabel = sourcePdfsList[0]?.pdfLabel || 'PDF 1';
      const docName = sourcePdfsList[0]?.docName || 'Document';

      let howDataIsCorroboratedOrContradicted = '';
      let summarySentence = '';

      if (isSingleDoc) {
        howDataIsCorroboratedOrContradicted = `This data point is documented exclusively in ${pdfLabel} (${docName}). No other analyzed documents reference, modify, or contradict this factual claim.`;
        summarySentence = `The data appears only in ${pdfLabel} (${firstFact.factClaim.slice(0, 75)}...), hence unique to this document.`;
      } else {
        const pdfNames = sourcePdfsList.map((p) => p.pdfLabel).join(' and ');
        howDataIsCorroboratedOrContradicted = `Extracted independently across ${pdfNames} for topic "${firstFact.entityOrTopic}".`;
        summarySentence = `The data in ${pdfNames} covers ${firstFact.entityOrTopic}, hence ${status === 'corroborated' ? 'collaborated' : status}.`;
      }

      result.push({
        factNumber: 0,
        id: `fact-group-${firstFact.id}`,
        topic: firstFact.entityOrTopic,
        category: firstFact.category,
        status,
        sourcePdfs: sourcePdfsList,
        extractedData: extractedDataPoints,
        howDataIsCorroboratedOrContradicted,
        summarySentence,
        underlyingFacts: groupFacts
      });
    });

    // Sort order:
    // 1. Contradictions (Critical)
    // 2. Corroborated multi-PDF facts (High value)
    // 3. Context reconciled (Insightful)
    // 4. Edge cases
    // 5. Unique facts
    const statusPriority: Record<StatusFilterType, number> = {
      contradicted: 1,
      corroborated: 2,
      context_reconciled: 3,
      uncertain: 4,
      unique: 5,
      all: 99
    };

    result.sort((a, b) => {
      const prioDiff = (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
      if (prioDiff !== 0) return prioDiff;
      // Secondary: higher PDF count first
      return b.sourcePdfs.length - a.sourcePdfs.length;
    });

    // Assign sequential Fact 1, Fact 2, Fact 3...
    result.forEach((item, index) => {
      item.factNumber = index + 1;
    });

    return result;
  }, [facts, comparisons, getPdfInfo]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    synthesizedFacts.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set).sort();
  }, [synthesizedFacts]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: synthesizedFacts.length,
      contradicted: 0,
      corroborated: 0,
      context_reconciled: 0,
      uncertain: 0,
      unique: 0,
    };

    synthesizedFacts.forEach((fact) => {
      if (counts[fact.status] !== undefined) {
        counts[fact.status]++;
      }
    });
    return counts;
  }, [synthesizedFacts]);

  // Filtered facts
  const filteredFacts = useMemo(() => {
    return synthesizedFacts.filter((fact) => {
      // Document filter
      if (selectedDoc !== 'all') {
        const hasDoc = fact.sourcePdfs.some(
          (p) => p.docName === selectedDoc || p.pdfLabel === selectedDoc
        );
        if (!hasDoc) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && fact.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && fact.status !== selectedStatus) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTopic = fact.topic.toLowerCase().includes(q);
        const matchesAnalysis = fact.howDataIsCorroboratedOrContradicted.toLowerCase().includes(q);
        const matchesSummary = fact.summarySentence.toLowerCase().includes(q);
        const matchesData = fact.extractedData.some(
          (ed) =>
            ed.statement.toLowerCase().includes(q) ||
            (ed.exactQuote && ed.exactQuote.toLowerCase().includes(q)) ||
            ed.pdfLabel.toLowerCase().includes(q) ||
            ed.docName.toLowerCase().includes(q)
        );

        if (!matchesTopic && !matchesAnalysis && !matchesSummary && !matchesData) {
          return false;
        }
      }

      return true;
    });
  }, [synthesizedFacts, selectedDoc, selectedStatus, selectedCategory, searchQuery]);

  // Sorted facts
  const sortedAndFilteredFacts = useMemo(() => {
    const list = [...filteredFacts];
    return list.sort((a, b) => {
      if (sortBy === 'factNumber') {
        return a.factNumber - b.factNumber;
      }
      if (sortBy === 'status') {
        const prioA = STATUS_OPTIONS.find((s) => s.id === a.status)?.priority ?? 99;
        const prioB = STATUS_OPTIONS.find((s) => s.id === b.status)?.priority ?? 99;
        return prioA - prioB;
      }
      if (sortBy === 'topic') {
        return a.topic.localeCompare(b.topic);
      }
      if (sortBy === 'pdfCount') {
        return b.sourcePdfs.length - a.sourcePdfs.length;
      }
      return 0;
    });
  }, [filteredFacts, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top View Selector Bar */}
      <div className="bg-white rounded-2xl p-2.5 border border-orange-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600 px-2 py-1">View On Page:</span>
          <button
            type="button"
            id="tab-view-extracted"
            onClick={() => setIsSpecialSummaryColumnOpen(false)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              !isSpecialSummaryColumnOpen
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Extracted Data (Collaborated, Facts, etc.)
          </button>
          <button
            type="button"
            id="tab-view-special-summary"
            onClick={() => setIsSpecialSummaryColumnOpen(true)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isSpecialSummaryColumnOpen
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-600" />
            <span>⭐ Special Column: Complete Summary Section</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2 text-xs font-semibold text-slate-500">
          <span>{documents.length} PDFs Analyzed</span>
          <span>•</span>
          <span>{facts.length} Verified Facts</span>
        </div>
      </div>

      {/* CASE 1: IF SPECIAL COLUMN IS OPENED -> SHOW COMPLETE SUMMARY */}
      {isSpecialSummaryColumnOpen ? (
        <div className="space-y-6">
          {/* Active Banner with Back Button */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-orange-400 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                id="btn-back-to-extracted-from-summary"
                onClick={() => setIsSpecialSummaryColumnOpen(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>← Back to Extracted Data (Collaborated, Facts, etc.)</span>
              </button>
              <div>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] uppercase">
                  Special Column Open
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSpecialSummaryColumnOpen(false)}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
            >
              Close Summary ✕
            </button>
          </div>

          {/* Complete Summary Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-orange-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-orange-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-[11px] uppercase tracking-wider">
                  Complete Summary
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Combining All {documents.length} PDFs in Plain English
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Complete Summary in Easy Points
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5 max-w-2xl">
                A plain-English synthesis across all documents covering sales, profits, headcount conflict, agreed facts, and auditor footnotes.
              </p>
            </div>

            {/* Actions: Search, Copy, Download, Toggle Collapse */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                id="btn-copy-summary-extracted"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Copy all points to clipboard"
              >
                {copiedSummary ? (
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
                id="btn-download-summary-extracted"
                onClick={handleDownloadSummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Download points as text file"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Search Within Summary */}
          <div className="relative max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={summarySearchQuery}
              onChange={(e) => setSummarySearchQuery(e.target.value)}
              placeholder="Search summary points (e.g. sales, profit, headcount)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
            />
            {summarySearchQuery && (
              <button
                onClick={() => setSummarySearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Grouped Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSummaryGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/90 space-y-2.5 hover:bg-white transition-colors"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-200/70 pb-2">
                  <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{group.groupTitle}</span>
                  </h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${group.badgeColor}`}>
                    {group.badge}
                  </span>
                </div>

                <ul className="space-y-1.5 text-xs text-slate-700">
                  {group.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {pIdx + 1}
                      </span>
                      <span className="flex-1">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Return to Extracted Data button at bottom of summary */}
          <div className="pt-4 border-t border-slate-200 flex justify-center">
            <button
              type="button"
              onClick={() => setIsSpecialSummaryColumnOpen(false)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Extracted Data (Collaborated Facts, PDF Details, etc.)</span>
            </button>
          </div>
        </div>
      </div>
    ) : (
      /* CASE 2: OTHERWISE SHOW EXTRACTED DATA INCLUDE COLLABORATED, FACTS ETC */
      <div className="space-y-6">
        {/* SPECIAL COLUMN PROMINENT BANNER (Clicking opens complete summary section) */}
        <div className="bg-gradient-to-r from-amber-50/90 via-orange-50/90 to-amber-50/90 border-2 border-orange-300/90 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20 shrink-0 mt-0.5">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-orange-600 text-white font-black text-[10px] uppercase tracking-wider">
                  Special Column
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  Complete Summary Section
                </h3>
                <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                  ({documents.length} PDFs Combined)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Click <strong>"Open Complete Summary"</strong> to view the entire multi-document synthesized summary in simple points. Otherwise, explore the extracted data below (collaborated facts, PDF source data, and contradictions).
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-open-special-summary-banner"
            onClick={() => setIsSpecialSummaryColumnOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer shrink-0"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Complete Summary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-orange-200/90 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-950 font-black text-xs uppercase tracking-wider border border-orange-200">
                    Extracted Section
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Fact-by-Fact Verification
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Extracted Information & Cross-PDF Fact Analysis
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  Every fact is organized clearly with source attribution, extracted data from each PDF, 
                  how the data is collaborated or contradicted, and a plain-language summary.
                </p>
              </div>

              {/* Quick Nav Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {onNavigateToComparisons && (
                  <button
                    type="button"
                    onClick={onNavigateToComparisons}
                    className="px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <GitCompare className="w-4 h-4 text-orange-600" />
                    <span>Cross-PDF Comparison</span>
                  </button>
                )}
                {onNavigateToSummary && (
                  <button
                    type="button"
                    onClick={onNavigateToSummary}
                    className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Complete Summary</span>
                  </button>
                )}
              </div>
            </div>

        {/* PDF Attribution Row */}
        <div className="mt-5 pt-4 border-t border-slate-200/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-extrabold text-slate-700 flex items-center gap-1.5 mr-1">
            <FileText className="w-3.5 h-3.5 text-orange-600" />
            <span>Data Extracted From {documents.length} PDFs:</span>
          </span>
          {documents.map((doc, idx) => {
            const color = PDF_COLORS[idx % PDF_COLORS.length];
            const isSelected = selectedDoc === doc.name;
            return (
              <button
                key={doc.id || doc.name}
                type="button"
                onClick={() => setSelectedDoc(isSelected ? 'all' : doc.name)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? `${color.labelBg} border-transparent shadow-xs`
                    : `${color.badge} hover:opacity-90`
                }`}
                title={doc.name}
              >
                <span className="font-mono font-black">PDF {idx + 1}:</span>
                <span className="truncate max-w-[140px] sm:max-w-[200px]">{doc.name}</span>
              </button>
            );
          })}
          {selectedDoc !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedDoc('all')}
              className="text-[11px] font-bold text-orange-700 hover:text-orange-900 underline ml-1 cursor-pointer"
            >
              Reset PDF Filter
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs in ONE LINE with particular background colors */}
      <div className="bg-white rounded-2xl p-2 sm:p-2.5 border border-orange-200/80 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {STATUS_OPTIONS.map((opt) => {
            const isActive = selectedStatus === opt.id;
            const count = statusCounts[opt.id] ?? 0;
            const Icon = opt.icon;

            return (
              <button
                key={opt.id}
                id={`filter-tab-${opt.id}`}
                type="button"
                onClick={() => setSelectedStatus(opt.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isActive
                    ? `${opt.activeBg} ${opt.activeBorder}`
                    : `bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80`
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span className="whitespace-nowrap">{opt.title}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[11px] font-mono font-extrabold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-slate-800 border border-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Bar: Search, Category, Sorting, View Toggle */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-orange-200/70 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search facts, claims, or PDFs..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ×
            </button>
          )}
        </div>

        {/* Dropdowns & View Switches */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Category */}
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          )}

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as FactSortField)}
              className="bg-transparent border-none focus:outline-hidden text-xs font-bold text-slate-800 cursor-pointer"
            >
              <option value="factNumber">Fact 1, 2, 3... (Default)</option>
              <option value="status">Status Priority</option>
              <option value="pdfCount">Most PDFs First</option>
              <option value="topic">Topic (A-Z)</option>
            </select>
          </div>

          {/* View Switch: Cards vs Table */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-orange-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Structured Fact Cards"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-white text-orange-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Comparison Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content Rendering */}
      {sortedAndFilteredFacts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-orange-200 shadow-xs">
          <Info className="w-12 h-12 text-orange-400 mx-auto mb-3" />
          <h3 className="text-base font-black text-slate-900">No Extracted Facts Found</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            No extracted facts match your current filters. Try changing your search query or selecting "All Extracted Facts".
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedStatus('all');
              setSelectedDoc('all');
              setSelectedCategory('all');
              setSearchQuery('');
              setSortBy('factNumber');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs hover:bg-orange-700 transition-colors cursor-pointer shadow-xs"
          >
            Show All Extracted Facts
          </button>
        </div>
      ) : viewMode === 'cards' ? (
        /* ================= CARDS VIEW (Requested Fact 1, Extracted From, Extracted Data, How Collaborated/Contradicted, Summary) ================= */
        <div className="space-y-6">
          {sortedAndFilteredFacts.map((fact) => {
            const statusConfig = STATUS_OPTIONS.find((o) => o.id === fact.status) || STATUS_OPTIONS[0];
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={fact.id || fact.factNumber}
                id={`fact-card-${fact.factNumber}`}
                className={`bg-white rounded-3xl border ${statusConfig.cardBorder} p-5 sm:p-7 shadow-xs hover:shadow-md transition-all space-y-5`}
              >
                {/* 1. Header: Fact Number, Topic, Category, and Status Badge */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white font-black text-sm tracking-wide shadow-xs">
                      Fact {fact.factNumber}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                        {fact.topic}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                          {fact.category}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-600 font-medium">
                          Found in {fact.sourcePdfs.length} {fact.sourcePdfs.length === 1 ? 'PDF' : 'PDFs'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs uppercase tracking-wider border shadow-xs ${statusConfig.badgeColor}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{statusConfig.badgeLabel}</span>
                    </span>
                  </div>
                </div>

                {/* 2. "This data extracted from:" Section */}
                <div className="bg-slate-50/80 rounded-2xl p-3.5 sm:p-4 border border-slate-200/80">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span>This data extracted from {fact.sourcePdfs.length} {fact.sourcePdfs.length === 1 ? 'PDF' : 'PDFs'}:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {fact.sourcePdfs.map((doc) => {
                      const color = PDF_COLORS[(doc.pdfNumber - 1) % PDF_COLORS.length] || PDF_COLORS[0];
                      return (
                        <div
                          key={doc.docName}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${color.badge} shadow-xs`}
                        >
                          <span className="font-mono font-black">{doc.pdfLabel}:</span>
                          <span className="truncate max-w-[200px]">{doc.docName}</span>
                          {doc.page && (
                            <span className="px-1.5 py-0.5 bg-white/90 rounded text-[10px] font-mono font-black border border-current/20">
                              p. {doc.page}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. "The Extracted Data" Section (Per PDF boxes) */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-wider mb-3">
                    <Layers className="w-4 h-4 text-orange-600" />
                    <span>The Extracted Data:</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {fact.extractedData.map((dp, dpIdx) => {
                      const color = PDF_COLORS[(dp.pdfNumber - 1) % PDF_COLORS.length] || PDF_COLORS[0];
                      return (
                        <div
                          key={dp.docName + dpIdx}
                          className={`rounded-2xl p-4 border ${color.border} ${color.bg} flex flex-col justify-between transition-all`}
                        >
                          <div>
                            {/* PDF Label Header */}
                            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-black/5">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md font-mono font-black text-[11px] ${color.labelBg}`}>
                                  {dp.pdfLabel}
                                </span>
                                <span className="font-bold text-xs text-slate-800 truncate max-w-[160px] sm:max-w-[220px]" title={dp.docName}>
                                  {dp.docName}
                                </span>
                              </div>
                              {dp.page && (
                                <span className="px-2 py-0.5 bg-white rounded-md text-[11px] font-mono font-bold text-slate-700 border border-slate-200">
                                  Page {dp.page}
                                </span>
                              )}
                            </div>

                            {/* Extracted Claim */}
                            <p className="text-sm font-semibold text-slate-900 leading-snug mb-2.5">
                              {dp.statement}
                            </p>

                            {/* Numerical Value pill if available */}
                            {dp.numericalValue !== undefined && (
                              <div className="mb-2.5">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white rounded-lg border border-slate-200 text-xs font-mono font-extrabold text-slate-900 shadow-xs">
                                  <span>
                                    {typeof dp.numericalValue === 'number'
                                      ? dp.numericalValue.toLocaleString()
                                      : dp.numericalValue}{' '}
                                    {dp.unit || ''}
                                  </span>
                                  {dp.temporalScope && (
                                    <span className="text-[10px] text-slate-500 font-normal">
                                      ({dp.temporalScope})
                                    </span>
                                  )}
                                </span>
                              </div>
                            )}

                            {/* Verbatim quote */}
                            {dp.exactQuote && (
                              <div className="bg-white/95 rounded-xl p-3 border border-slate-200/90 text-xs text-slate-700 italic flex items-start gap-2 shadow-xs">
                                <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                <span className="leading-relaxed">"{dp.exactQuote}"</span>
                              </div>
                            )}
                          </div>

                          {/* Inspect action for this PDF */}
                          {dp.originalFact && (
                            <div className="mt-3 pt-2.5 border-t border-black/5 flex items-center justify-end">
                              <button
                                type="button"
                                onClick={() => onInspectEvidence(dp.originalFact!)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 hover:text-orange-900 transition-colors cursor-pointer"
                              >
                                <span>Inspect Evidence in {dp.pdfLabel}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 4. "How the data is Corroborated and Contradicted" Section */}
                <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider mb-2">
                    <Scale className="w-4 h-4 text-orange-600" />
                    <span>How the data is Corroborated and Contradicted:</span>
                  </div>
                  <p className="text-sm text-slate-800 leading-relaxed font-normal">
                    {fact.howDataIsCorroboratedOrContradicted}
                  </p>
                </div>

                {/* 5. Special Column: Complete Summary Section */}
                <div className={`rounded-2xl p-4 sm:p-5 border ${statusConfig.summaryBoxBorder} ${statusConfig.summaryBoxBg} shadow-xs`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-900">
                      <Sparkles className="w-4 h-4 text-orange-600 shrink-0" />
                      <span>Special Column: Complete Summary & Verdict</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSpecialSummaryColumnOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-extrabold shadow-xs transition-colors cursor-pointer w-fit"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Complete Summary Section</span>
                    </button>
                  </div>
                  <p className={`text-sm sm:text-base font-black leading-snug ${statusConfig.summaryTextColor}`}>
                    {fact.summarySentence}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= TABLE VIEW ================= */
        <div className="bg-white rounded-3xl border border-orange-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-orange-50/80 border-b border-orange-200 text-slate-800 font-black uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-3.5 text-center w-16">#</th>
                  <th className="py-3.5 px-3.5 min-w-[140px]">Topic</th>
                  <th className="py-3.5 px-3.5 min-w-[180px]">Extracted From</th>
                  <th className="py-3.5 px-3.5 min-w-[260px]">Extracted Data</th>
                  <th className="py-3.5 px-3.5 min-w-[240px]">Corroboration / Contradiction Analysis</th>
                  <th className="py-3.5 px-3.5 min-w-[280px] bg-amber-100/90 border-x-2 border-amber-300 text-amber-950 font-black">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                        <span>Special Column: Complete Summary</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsSpecialSummaryColumnOpen(true)}
                        className="px-2 py-0.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[9px] cursor-pointer shadow-xs normal-case tracking-normal shrink-0"
                        title="Open full Complete Summary section"
                      >
                        Open All →
                      </button>
                    </div>
                  </th>
                  <th className="py-3.5 px-3.5 min-w-[130px]">Status</th>
                  <th className="py-3.5 px-3.5 text-right w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sortedAndFilteredFacts.map((fact) => {
                  const statusConfig = STATUS_OPTIONS.find((o) => o.id === fact.status) || STATUS_OPTIONS[0];
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={fact.id || fact.factNumber} className="hover:bg-orange-50/30 transition-colors">
                      {/* # Fact 1, Fact 2 */}
                      <td className="py-3.5 px-3.5 text-center align-top">
                        <span className="px-2 py-1 rounded-md bg-slate-900 text-white font-black text-xs font-mono shadow-xs whitespace-nowrap">
                          Fact {fact.factNumber}
                        </span>
                      </td>

                      {/* Topic */}
                      <td className="py-3.5 px-3.5 align-top">
                        <span className="font-bold text-slate-900 text-xs block leading-snug">
                          {fact.topic}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5 block">
                          {fact.category}
                        </span>
                      </td>

                      {/* Extracted From (PDFs) */}
                      <td className="py-3.5 px-3.5 align-top">
                        <div className="flex flex-col gap-1.5">
                          {fact.sourcePdfs.map((doc) => {
                            const color = PDF_COLORS[(doc.pdfNumber - 1) % PDF_COLORS.length] || PDF_COLORS[0];
                            return (
                              <div
                                key={doc.docName}
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-bold ${color.badge}`}
                              >
                                <span className="font-mono">{doc.pdfLabel}:</span>
                                <span className="truncate max-w-[120px]">{doc.docName}</span>
                                {doc.page && <span className="text-slate-500 font-mono">p.{doc.page}</span>}
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      {/* Extracted Data */}
                      <td className="py-3.5 px-3.5 align-top">
                        <div className="space-y-2">
                          {fact.extractedData.map((dp, dpIdx) => (
                            <div key={dpIdx} className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 text-[11px]">
                              <div className="font-bold text-slate-800 flex items-center justify-between gap-1 mb-0.5">
                                <span>{dp.pdfLabel}</span>
                                {dp.page && <span className="text-slate-500 font-mono">p. {dp.page}</span>}
                              </div>
                              <p className="text-slate-700 leading-snug">{dp.statement}</p>
                              {dp.numericalValue !== undefined && (
                                <span className="inline-block mt-1 font-mono font-black text-slate-900">
                                  {typeof dp.numericalValue === 'number'
                                    ? dp.numericalValue.toLocaleString()
                                    : dp.numericalValue}{' '}
                                  {dp.unit || ''}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* How Corroborated / Contradicted */}
                      <td className="py-3.5 px-3.5 align-top">
                        <p className="text-xs text-slate-800 leading-relaxed max-w-[280px]">
                          {fact.howDataIsCorroboratedOrContradicted}
                        </p>
                      </td>

                      {/* Special Column: Complete Summary */}
                      <td className="py-3.5 px-3.5 align-top bg-amber-50/40 border-x-2 border-amber-200/80">
                        <div className={`p-2.5 rounded-xl border text-xs font-extrabold leading-snug ${statusConfig.summaryBoxBg} ${statusConfig.summaryBoxBorder} ${statusConfig.summaryTextColor}`}>
                          <p>{fact.summarySentence}</p>
                          <div className="mt-2 pt-1.5 border-t border-black/5 flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800">
                              Special Column
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsSpecialSummaryColumnOpen(true)}
                              className="inline-flex items-center gap-1 text-[11px] font-black text-orange-700 hover:text-orange-950 hover:underline cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3" />
                              <span>Open Complete Summary →</span>
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3.5 align-top">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border whitespace-nowrap shadow-xs ${statusConfig.badgeColor}`}
                        >
                          <StatusIcon className="w-3 h-3 shrink-0" />
                          <span>{statusConfig.badgeLabel}</span>
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-3.5 align-top text-right">
                        {fact.underlyingFacts[0] && (
                          <button
                            type="button"
                            onClick={() => onInspectEvidence(fact.underlyingFacts[0])}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 hover:bg-orange-600 text-orange-700 hover:text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs border border-orange-200"
                          >
                            <span>Inspect</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      </div>
    )}

      {/* Bottom Navigation */}
      {onNavigateToSummary && (
        <div className="p-5 sm:p-6 bg-orange-50/80 border border-orange-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-black text-slate-900">
              Want the overall story across all PDFs?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Read the Complete Summary combining all {documents.length} documents into simple, easy-to-read points.
            </p>
          </div>
          <button
            type="button"
            id="btn-facts-to-summary-bottom"
            onClick={onNavigateToSummary}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black uppercase tracking-wider transition-all shrink-0 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <span>Next Page: Complete Summary</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
