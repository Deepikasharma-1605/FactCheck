import React from 'react';
import { CheckCircle2, AlertTriangle, GitCompare, HelpCircle, FileCheck, Layers } from 'lucide-react';
import { AnalysisResult } from '../types';

interface MetricsBarProps {
  data: AnalysisResult;
  activeFilter: string | null;
  onSelectFilter: (filter: string | null) => void;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ data, activeFilter, onSelectFilter }) => {
  const { systemMetrics, documents } = data;

  const cards = [
    {
      id: 'all_facts',
      label: 'Verified Facts',
      count: systemMetrics.totalFacts,
      sublabel: `${documents.length} source documents`,
      dotColor: 'bg-blue-500',
      textColor: 'text-slate-900',
      tagColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'corroborated',
      label: 'Corroborated',
      count: systemMetrics.corroboratedCount,
      sublabel: 'Agrees across documents',
      dotColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      tagColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    },
    {
      id: 'genuine_contradiction',
      label: 'Contradictions',
      count: systemMetrics.contradictionCount,
      sublabel: 'Direct conflict on metric',
      dotColor: 'bg-rose-500',
      textColor: 'text-rose-700',
      tagColor: 'bg-rose-50 text-rose-700 border border-rose-200',
    },
    {
      id: 'context_reconciled',
      label: 'Contextual',
      count: systemMetrics.contextReconciledCount,
      sublabel: 'Scope, time, or unit shifts',
      dotColor: 'bg-amber-500',
      textColor: 'text-amber-700',
      tagColor: 'bg-amber-50 text-amber-700 border border-amber-200',
    },
    {
      id: 'extraction_failure_risk',
      label: 'Edge Cases',
      count: systemMetrics.failuresHandledCount,
      sublabel: 'Methodology & noise flagged',
      dotColor: 'bg-purple-500',
      textColor: 'text-purple-700',
      tagColor: 'bg-purple-50 text-purple-700 border border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 mb-5">
      {cards.map((c) => {
        const isSelected = activeFilter === c.id;

        return (
          <button
            key={c.id}
            id={`metric-filter-${c.id}`}
            onClick={() => onSelectFilter(isSelected ? null : c.id)}
            className={`p-3 rounded-lg border text-left transition-all bg-white ${
              isSelected
                ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                {c.label}
              </span>
              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${c.tagColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${c.dotColor}`} />
                <span>{c.count}</span>
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 tracking-tight">
                {c.count}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {c.sublabel}
            </p>
          </button>
        );
      })}
    </div>
  );
};
