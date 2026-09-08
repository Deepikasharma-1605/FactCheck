import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  GitCompare,
  HelpCircle,
  Clock,
  Filter,
  FileText,
  Quote,
  ShieldAlert,
  Search,
  ExternalLink,
  Table as TableIcon,
  LayoutGrid,
  Sparkles,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { FactComparison, ComparisonVerdict, DocumentSource } from '../types';

interface ComparisonMatrixProps {
  comparisons: FactComparison[];
  documents?: DocumentSource[];
  onInspectEvidence: (fact: any) => void;
  activeCategoryFilter?: string | null;
}

interface DocColumn {
  id: string;
  name: string;
  letter: string;
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  comparisons,
  documents,
  onInspectEvidence,
  activeCategoryFilter,
}) => {
  const [selectedVerdict, setSelectedVerdict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [sortBy, setSortBy] = useState<'verdict' | 'topic' | 'category'>('verdict');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Dynamically compute document columns (e.g. Document Evidence A, B, C...)
  const docColumns: DocColumn[] = useMemo(() => {
    if (documents && documents.length > 0) {
      return documents.map((doc, idx) => ({
        id: doc.id || `doc-${idx}`,
        name: doc.name,
        letter: String.fromCharCode(65 + idx), // A, B, C, D...
      }));
    }

    // Fallback: discover distinct documents mentioned in comparisons
    const discoveredNames: string[] = [];
    comparisons.forEach((comp) => {
      comp.factsCompared?.forEach((f) => {
        if (f.docName && !discoveredNames.includes(f.docName)) {
          discoveredNames.push(f.docName);
        }
      });
    });

    if (discoveredNames.length === 0) {
      discoveredNames.push('Document 1', 'Document 2');
    }

    return discoveredNames.map((name, idx) => ({
      id: `doc-${idx}`,
      name,
      letter: String.fromCharCode(65 + idx),
    }));
  }, [documents, comparisons]);

  // Helper to match a document to a column
  const getFactForColumn = (comp: FactComparison, col: DocColumn, colIdx: number) => {
    if (!comp.factsCompared || comp.factsCompared.length === 0) return null;

    // 1. Direct name match (exact or substring)
    const exactMatch = comp.factsCompared.find(
      (f) =>
        f.docName.toLowerCase() === col.name.toLowerCase() ||
        f.docName.toLowerCase().includes(col.name.toLowerCase()) ||
        col.name.toLowerCase().includes(f.docName.toLowerCase())
    );
    if (exactMatch) return exactMatch;

    // 2. Index match if column corresponds directly and didn't match another column
    if (comp.factsCompared[colIdx]) {
      const otherColMatches = docColumns.some(
        (otherCol, otherIdx) =>
          otherIdx !== colIdx &&
          (comp.factsCompared[colIdx].docName.toLowerCase() === otherCol.name.toLowerCase() ||
            comp.factsCompared[colIdx].docName.toLowerCase().includes(otherCol.name.toLowerCase()))
      );
      if (!otherColMatches) {
        return comp.factsCompared[colIdx];
      }
    }

    return null;
  };

  // Helper to format/generate the "Summary" in plain, easy language
  const renderPlainLanguageSummary = (comp: FactComparison) => {
    const summaryText = comp.plainLanguageSummary;

    let conclusionStyle = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    let conclusionText = 'Hence, both documents agree.';
    if (comp.verdict === 'genuine_contradiction') {
      conclusionStyle = 'bg-rose-50 text-rose-800 border-rose-200';
      conclusionText = 'Hence, there is a contradiction.';
    } else if (comp.verdict === 'context_reconciled') {
      conclusionStyle = 'bg-amber-50 text-amber-800 border-amber-200';
      const dim = comp.reconciliationContext?.dimension;
      if (dim === 'time') {
        conclusionText = 'Hence, there is no real conflict because this changed over time.';
      } else if (dim === 'scope') {
        conclusionText = 'Hence, there is no contradiction because one reports quarterly and the other reports full-year.';
      } else {
        conclusionText = `Hence, this difference is explained by context (${dim || 'reporting scope'}).`;
      }
    } else if (comp.verdict === 'extraction_failure_risk') {
      conclusionStyle = 'bg-purple-50 text-purple-800 border-purple-200';
      conclusionText = 'Hence, there is ambiguity due to changed measurement methodology.';
    }

    // If a customized plainLanguageSummary is already present
    if (summaryText && summaryText.trim().length > 0) {
      const henceIdx = summaryText.indexOf('Hence');
      if (henceIdx !== -1) {
        const statementsPart = summaryText.slice(0, henceIdx).trim();
        const hencePart = summaryText.slice(henceIdx).trim();
        return (
          <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-200/80 text-xs leading-relaxed space-y-1.5 shadow-2xs">
            <p className="text-slate-800 font-normal leading-normal whitespace-pre-line">{statementsPart}</p>
            <div className={`px-2 py-0.5 rounded font-bold text-[11px] border inline-block ${conclusionStyle}`}>
              {hencePart}
            </div>
          </div>
        );
      }
      return (
        <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-200/80 text-xs leading-relaxed text-slate-800 shadow-2xs">
          {summaryText}
        </div>
      );
    }

    // Dynamically build plain language sentences for each document
    const entries: { letter: string; name: string; text: string }[] = [];
    docColumns.forEach((col, idx) => {
      const fact = getFactForColumn(comp, col, idx);
      if (fact) {
        let cleanText = (fact.statement || fact.exactQuote || '').replace(/^["']|["']$/g, '').trim();
        entries.push({
          letter: col.letter,
          name: col.name,
          text: cleanText,
        });
      }
    });

    if (entries.length === 0 && comp.factsCompared) {
      comp.factsCompared.forEach((f, idx) => {
        entries.push({
          letter: String.fromCharCode(65 + idx),
          name: f.docName,
          text: (f.statement || f.exactQuote || '').replace(/^["']|["']$/g, '').trim(),
        });
      });
    }

    return (
      <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-200/80 text-xs leading-relaxed space-y-1.5 shadow-2xs">
        <div className="space-y-1 text-slate-800">
          {entries.map((item, i) => (
            <p key={i}>
              <span className="font-semibold text-slate-900">
                In document {item.letter.toLowerCase()} this is written:
              </span>{' '}
              <span className="text-slate-700 italic">"{item.text}"</span>
            </p>
          ))}
        </div>
        <div className={`mt-1 px-2 py-0.5 rounded font-bold text-[11px] border inline-block ${conclusionStyle}`}>
          {conclusionText}
        </div>
      </div>
    );
  };

  // Filter comparisons
  const filteredComparisons = comparisons.filter((c) => {
    // Verdict filter
    if (selectedVerdict !== 'all' && c.verdict !== selectedVerdict) {
      return false;
    }
    // External filter from MetricsBar
    if (activeCategoryFilter && activeCategoryFilter !== 'all_facts' && c.verdict !== activeCategoryFilter) {
      return false;
    }
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTopic = c.entityOrTopic.toLowerCase().includes(q);
      const matchHeadline = c.headline.toLowerCase().includes(q);
      const matchReasoning = c.detailedReasoning.toLowerCase().includes(q);
      const matchFacts = c.factsCompared.some(
        (f) =>
          f.statement.toLowerCase().includes(q) ||
          f.exactQuote.toLowerCase().includes(q) ||
          f.docName.toLowerCase().includes(q)
      );
      return matchTopic || matchHeadline || matchReasoning || matchFacts;
    }
    return true;
  });

  const verdictPriority: Record<ComparisonVerdict, number> = {
    genuine_contradiction: 1,
    corroborated: 2,
    context_reconciled: 3,
    extraction_failure_risk: 4,
  };

  const sortedComparisons = useMemo(() => {
    return [...filteredComparisons].sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'verdict') {
        cmp = (verdictPriority[a.verdict] ?? 9) - (verdictPriority[b.verdict] ?? 9);
        if (cmp === 0) cmp = a.entityOrTopic.localeCompare(b.entityOrTopic);
      } else if (sortBy === 'topic') {
        cmp = a.entityOrTopic.localeCompare(b.entityOrTopic);
      } else if (sortBy === 'category') {
        cmp = a.category.localeCompare(b.category);
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredComparisons, sortBy, sortDirection]);

  const getRowBg = (verdict: ComparisonVerdict) => {
    switch (verdict) {
      case 'genuine_contradiction':
        return 'bg-rose-50/50 hover:bg-rose-100/70 border-l-4 border-l-rose-500';
      case 'corroborated':
        return 'bg-emerald-50/50 hover:bg-emerald-100/70 border-l-4 border-l-emerald-500';
      case 'context_reconciled':
        return 'bg-amber-50/50 hover:bg-amber-100/70 border-l-4 border-l-amber-500';
      case 'extraction_failure_risk':
        return 'bg-purple-50/50 hover:bg-purple-100/70 border-l-4 border-l-purple-500';
      default:
        return 'bg-white hover:bg-slate-50';
    }
  };

  const getCardBg = (verdict: ComparisonVerdict) => {
    switch (verdict) {
      case 'genuine_contradiction':
        return 'bg-rose-50/40 border-rose-200 hover:border-rose-300 border-l-4 border-l-rose-500';
      case 'corroborated':
        return 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300 border-l-4 border-l-emerald-500';
      case 'context_reconciled':
        return 'bg-amber-50/40 border-amber-200 hover:border-amber-300 border-l-4 border-l-amber-500';
      case 'extraction_failure_risk':
        return 'bg-purple-50/40 border-purple-200 hover:border-purple-300 border-l-4 border-l-purple-500';
      default:
        return 'bg-white border-slate-200';
    }
  };

  const renderVerdictBadge = (verdict: ComparisonVerdict, compact = false) => {
    switch (verdict) {
      case 'corroborated':
        return (
          <span
            className={`inline-flex items-center gap-1 font-bold uppercase rounded ${
              compact
                ? 'px-2 py-0.5 text-[10px] bg-emerald-100 text-emerald-700'
                : 'px-2.5 py-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Agree</span>
          </span>
        );
      case 'genuine_contradiction':
        return (
          <span
            className={`inline-flex items-center gap-1 font-bold uppercase rounded ${
              compact
                ? 'px-2 py-0.5 text-[10px] bg-rose-100 text-rose-700'
                : 'px-2.5 py-1 text-xs bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
            <span>Contradict</span>
          </span>
        );
      case 'context_reconciled':
        return (
          <span
            className={`inline-flex items-center gap-1 font-bold uppercase rounded ${
              compact
                ? 'px-2 py-0.5 text-[10px] bg-amber-100 text-amber-700'
                : 'px-2.5 py-1 text-xs bg-amber-50 text-amber-700 border border-amber-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span>Contextual</span>
          </span>
        );
      case 'extraction_failure_risk':
        return (
          <span
            className={`inline-flex items-center gap-1 font-bold uppercase rounded ${
              compact
                ? 'px-2 py-0.5 text-[10px] bg-purple-100 text-purple-700'
                : 'px-2.5 py-1 text-xs bg-purple-50 text-purple-700 border border-purple-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
            <span>Edge Case</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Section Header & High-Density Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Cross-Document Analysis
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded">
                {filteredComparisons.length} facts analyzed
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing extracted claims across source documents with automated alignment and contradiction analysis
            </p>
          </div>

          {/* Search bar, Sort & View mode toggle */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full md:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter facts, quotes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white"
              />
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-xs">
              <ArrowUpDown className="w-3 h-3 text-orange-600" />
              <span className="text-slate-500 font-semibold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer text-xs"
              >
                <option value="verdict">Status & Color</option>
                <option value="topic">Topic (A-Z)</option>
                <option value="category">Category</option>
              </select>
              <button
                type="button"
                onClick={() => setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
                className="ml-0.5 p-0.5 hover:bg-slate-200 rounded text-slate-600 font-bold"
                title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortDirection === 'asc' ? <ArrowUp className="w-3 h-3 text-orange-600" /> : <ArrowDown className="w-3 h-3 text-orange-600" />}
              </button>
            </div>

            {/* Toggle Table vs Cards */}
            <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 shrink-0">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-orange-600 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="High-density tabular view"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  viewMode === 'cards'
                    ? 'bg-white text-orange-600 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Expanded card view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>
          </div>
        </div>

        {/* Verdict Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 text-xs">
          <button
            onClick={() => setSelectedVerdict('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedVerdict === 'all'
                ? 'bg-orange-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Results ({comparisons.length})
          </button>
          <button
            onClick={() => setSelectedVerdict('corroborated')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              selectedVerdict === 'corroborated'
                ? 'bg-emerald-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Agreed ({comparisons.filter((c) => c.verdict === 'corroborated').length})</span>
          </button>
          <button
            onClick={() => setSelectedVerdict('genuine_contradiction')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              selectedVerdict === 'genuine_contradiction'
                ? 'bg-rose-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span>Contradict ({comparisons.filter((c) => c.verdict === 'genuine_contradiction').length})</span>
          </button>
          <button
            onClick={() => setSelectedVerdict('context_reconciled')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              selectedVerdict === 'context_reconciled'
                ? 'bg-amber-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span>Contextual ({comparisons.filter((c) => c.verdict === 'context_reconciled').length})</span>
          </button>
          <button
            onClick={() => setSelectedVerdict('extraction_failure_risk')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              selectedVerdict === 'extraction_failure_risk'
                ? 'bg-purple-600 text-white font-semibold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
            <span>Edge Cases ({comparisons.filter((c) => c.verdict === 'extraction_failure_risk').length})</span>
          </button>
        </div>
      </div>

      {filteredComparisons.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl border border-slate-200 p-6">
          <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No comparisons found for this filter</p>
          <p className="text-xs text-slate-500 mt-1">Try resetting the filter tabs or clear your search query.</p>
        </div>
      ) : viewMode === 'table' ? (
        /* HIGH-DENSITY TABLE VIEW (With Document Evidence A, B, C... and Summary Column) */
        <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider min-w-[170px]">
                    Extracted Fact
                  </th>
                  {docColumns.map((col) => (
                    <th
                      key={col.id}
                      className="px-4 py-2.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider min-w-[220px]"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold">
                          {col.letter}
                        </span>
                        <span>Document Evidence {col.letter}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-400 truncate max-w-[200px] normal-case mt-0.5" title={col.name}>
                        {col.name}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-2.5 text-[11px] font-bold text-blue-700 uppercase tracking-wider min-w-[280px] bg-blue-50/40">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Summary</span>
                    </div>
                    <div className="text-[10px] font-normal text-blue-600/80 normal-case mt-0.5">
                      Plain language synthesis
                    </div>
                  </th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider min-w-[110px]">
                    Relationship
                  </th>
                  <th className="px-4 py-2.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right min-w-[80px]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {sortedComparisons.map((comp) => {
                  const firstFact = comp.factsCompared?.[0];

                  return (
                    <tr
                      key={comp.id}
                      className={`${getRowBg(comp.verdict)} transition-colors group cursor-pointer`}
                      onClick={() => {
                        if (firstFact) {
                          onInspectEvidence({
                            docName: firstFact.docName,
                            evidence: {
                              docName: firstFact.docName,
                              pageNumber: firstFact.page,
                              exactQuote: firstFact.exactQuote,
                            },
                            factClaim: firstFact.statement,
                            entityOrTopic: comp.entityOrTopic,
                          });
                        }
                      }}
                    >
                      {/* Column 1: Fact Topic & Headline */}
                      <td className="px-4 py-3 align-top min-w-[170px]">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {comp.entityOrTopic}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium capitalize">
                          {comp.category}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {comp.headline}
                        </div>
                      </td>

                      {/* Dynamic Document Evidence Columns (A, B, C...) */}
                      {docColumns.map((col, colIdx) => {
                        const fact = getFactForColumn(comp, col, colIdx);

                        return (
                          <td key={col.id} className="px-4 py-3 align-top min-w-[220px]">
                            {fact ? (
                              <div>
                                <div className="text-slate-800 font-medium leading-snug">
                                  "{fact.exactQuote}"
                                </div>
                                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                  <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider font-mono bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                    Page {fact.page}
                                  </span>
                                  <span className="text-[10px] text-slate-400 truncate max-w-[140px]" title={fact.docName}>
                                    {fact.docName}
                                  </span>
                                  {fact.timeOrScope && (
                                    <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                                      <Clock className="w-2.5 h-2.5 text-slate-400" />
                                      {fact.timeOrScope}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="py-2 text-slate-400 italic text-[11px] flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                <span>Not mentioned in Doc {col.letter}</span>
                              </div>
                            )}
                          </td>
                        );
                      })}

                      {/* Column: Summary (Plain Language rephrased) */}
                      <td className="px-4 py-3 align-top min-w-[280px] bg-blue-50/10">
                        {renderPlainLanguageSummary(comp)}
                      </td>

                      {/* Column: Verdict / Relationship */}
                      <td className="px-4 py-3 align-top whitespace-nowrap min-w-[110px]">
                        {renderVerdictBadge(comp.verdict, true)}
                        {comp.reconciliationContext && (
                          <div className="text-[10px] text-amber-700 mt-1 font-medium flex items-center gap-1">
                            <GitCompare className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                            <span className="capitalize">{comp.reconciliationContext.dimension}</span>
                          </div>
                        )}
                      </td>

                      {/* Column: Inspect Action */}
                      <td className="px-4 py-3 align-top text-right whitespace-nowrap min-w-[80px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (firstFact) {
                              onInspectEvidence({
                                docName: firstFact.docName,
                                evidence: {
                                  docName: firstFact.docName,
                                  pageNumber: firstFact.page,
                                  exactQuote: firstFact.exactQuote,
                                },
                                factClaim: firstFact.statement,
                                entityOrTopic: comp.entityOrTopic,
                              });
                            }
                          }}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded transition-colors"
                          title="Inspect original source citation"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* DETAILED CARDS VIEW */
        <div className="space-y-3">
          {sortedComparisons.map((comp) => {
            return (
              <div
                key={comp.id}
                id={`comp-card-${comp.id}`}
                className={`rounded-xl p-4 shadow-xs transition-all ${getCardBg(comp.verdict)}`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                      {comp.category}
                    </span>
                    <span className="text-slate-300">•</span>
                    <h3 className="text-sm font-bold text-slate-900">
                      {comp.entityOrTopic}
                    </h3>
                  </div>
                  <div>{renderVerdictBadge(comp.verdict)}</div>
                </div>

                {/* Headline summary */}
                <p className="text-xs font-semibold text-slate-800 mt-2.5">
                  {comp.headline}
                </p>

                {/* Plain Language Summary Box */}
                <div className="mt-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Summary (Plain Language):</span>
                  </div>
                  {renderPlainLanguageSummary(comp)}
                </div>

                {/* Detailed synthesis & reasoning */}
                <div className="mt-2.5 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <p className="font-semibold text-slate-700 mb-0.5 text-[11px]">
                    Detailed Synthesis & Grounded Reasoning:
                  </p>
                  <p>{comp.detailedReasoning}</p>
                </div>

                {/* Reconciliation Dimension */}
                {comp.reconciliationContext && (
                  <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                    <GitCompare className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold capitalize">
                        Reconciled by {comp.reconciliationContext.dimension}:
                      </span>{' '}
                      <span>{comp.reconciliationContext.explanation}</span>
                    </div>
                  </div>
                )}

                {/* Mitigation strategy */}
                {comp.mitigationOrHandling && (
                  <div className="mt-2 p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 flex items-start gap-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">
                        System Handling & Improvement Strategy:
                      </span>{' '}
                      <span>{comp.mitigationOrHandling}</span>
                    </div>
                  </div>
                )}

                {/* Side-by-Side Fact Evidence (Dynamically for Document Evidence A, B, C...) */}
                <div className="mt-3">
                  <div className={`grid grid-cols-1 ${docColumns.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-2.5`}>
                    {docColumns.map((col, colIdx) => {
                      const f = getFactForColumn(comp, col, colIdx);

                      if (!f) {
                        return (
                          <div
                            key={col.id}
                            className="p-3 rounded-lg border border-dashed border-slate-200 bg-slate-50/30 text-xs flex flex-col justify-center items-center text-center text-slate-400 min-h-[100px]"
                          >
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold mb-1">
                              {col.letter}
                            </span>
                            <span className="font-medium text-slate-500">Document Evidence {col.letter}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">Not mentioned in this document</span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={col.id}
                          className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-semibold text-slate-800 flex items-center truncate max-w-[200px]" title={f.docName}>
                                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold mr-1.5 shrink-0">
                                  {col.letter}
                                </span>
                                {f.docName}
                              </span>
                              <span className="px-1.5 py-0.5 text-[10px] font-mono text-blue-600 font-semibold bg-white border border-slate-200 rounded shrink-0">
                                Page {f.page}
                              </span>
                            </div>

                            <p className="text-slate-800 font-medium mb-1.5">
                              {f.statement}
                            </p>

                            <blockquote className="italic text-slate-600 pl-2 border-l-2 border-blue-500 text-[11px] leading-relaxed bg-white py-1 pr-1.5 rounded-r">
                              "{f.exactQuote}"
                            </blockquote>
                          </div>

                          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                            {f.timeOrScope ? (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {f.timeOrScope}
                              </span>
                            ) : (
                              <span />
                            )}
                            <button
                              onClick={() =>
                                onInspectEvidence({
                                  docName: f.docName,
                                  evidence: {
                                    docName: f.docName,
                                    pageNumber: f.page,
                                    exactQuote: f.exactQuote,
                                  },
                                  factClaim: f.statement,
                                  entityOrTopic: comp.entityOrTopic,
                                })
                              }
                              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5"
                            >
                              <span>Inspect quote</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
