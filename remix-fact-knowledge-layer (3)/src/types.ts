export interface DocumentSource {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  pageCount?: number;
  summary?: string;
  fileBase64?: string;
  rawTextPreview?: string;
}

export interface FactEvidence {
  docId: string;
  docName: string;
  pageNumber?: number | string;
  section?: string;
  exactQuote: string;
  contextSnippet?: string;
}

export type FactReconciliationStatus =
  | 'corroborated'         // Case 1: Same fact is supported by multiple documents
  | 'contradicted'         // Case 2: Two documents give genuinely different information about the same fact and context doesn't explain it
  | 'uncertain'            // Case 4: Your AI extracted something but isn't completely sure (low confidence / ambiguous)
  | 'context_reconciled'   // Case 3: The values look different, but there is a valid reason (time, scope, units)
  | 'unique';              // A fact appears in only one document

export interface ExtractedFact {
  id: string;
  docId: string;
  docName: string;
  entityOrTopic: string; // e.g. "Annual Revenue", "Chief Technology Officer", "Global Headcount"
  category: 'financial' | 'personnel' | 'operational' | 'strategic' | 'legal' | 'other';
  factClaim: string; // Concise factual claim
  factType: 'numerical' | 'semantic';
  numericalValue?: string | number;
  unit?: string;
  temporalScope?: string; // e.g. "FY 2023", "As of Dec 31, 2023", "Q4 2023"
  evidence: FactEvidence;
  confidence: number; // 0.0 to 1.0
  isAmbiguous?: boolean;
  ambiguityReason?: string;
  reconciliationStatus?: FactReconciliationStatus;
  statusExplanation?: string;
  relatedDocNames?: string[];
  comparisonId?: string;
}

export type ComparisonVerdict = 
  | 'corroborated'            // Case 1: Corroborated across documents (agrees, even if phrased differently)
  | 'genuine_contradiction'   // Case 2: Genuine or likely contradiction
  | 'context_reconciled'      // Case 3: Apparent contradiction explained by context (time, scope, units, reporting)
  | 'extraction_failure_risk'; // Case 4: Extraction or reasoning failure / ambiguity flagged

export interface FactComparison {
  id: string;
  entityOrTopic: string;
  category: string;
  verdict: ComparisonVerdict;
  headline: string;
  detailedReasoning: string;
  plainLanguageSummary?: string; // Plain English rephrasing ("In Document A this is written... In Document B this is written... Hence there is a contradiction")
  reconciliationContext?: {
    dimension: 'time' | 'scope' | 'units' | 'definition' | 'ocr_noise' | 'other';
    explanation: string;
  };
  factsCompared: {
    factId?: string;
    docName: string;
    page: string | number;
    statement: string;
    exactQuote: string;
    timeOrScope?: string;
  }[];
  mitigationOrHandling?: string; // For case 4: how the system handled or would improve this failure
}

export interface CompleteSummaryDocComparison {
  topic: string;
  category: string;
  simpleExplanation: string;
  docClaims: {
    docName: string;
    whatItSaysInEasyWords: string;
    exactQuote?: string;
    page?: string | number;
  }[];
  verdictType: 'agreed' | 'contradiction' | 'reconciled' | 'single_doc' | 'warning';
  verdictBadge: string;
  verdictExplanation: string;
}

export interface CompleteSummaryData {
  headlineTitle: string;
  oneMinuteStory: string;
  readingTimeMinutes?: number;
  documentsCombined: {
    name: string;
    shortTitle: string;
    simpleRole: string;
    badgeColor?: string;
  }[];
  financialsInSimpleWords: {
    headline: string;
    moneyEarnedStory: string;
    profitOrLossStory: string;
    futureBillsStory?: string;
    comparisons: CompleteSummaryDocComparison[];
  };
  peopleAndTeamInSimpleWords: {
    headline: string;
    leadershipStory: string;
    headcountConflictStory: string;
    comparisons: CompleteSummaryDocComparison[];
  };
  whereAllPdfsAgree: {
    headline: string;
    points: {
      title: string;
      simpleDescription: string;
      verifiedInDocs: string[];
    }[];
  };
  wherePdfsFightOrDisagree: {
    headline: string;
    conflicts: {
      topic: string;
      simpleQuestion: string;
      whatEachDocSays: {
        docName: string;
        claim: string;
      }[];
      theTruthInPlainWords: string;
      whoToTrust: string;
    }[];
  };
  whySomeNumbersLookDifferent: {
    headline: string;
    explanations: {
      topic: string;
      whatLooksWrong: string;
      whyItIsActuallyOkay: string;
      simpleAnalogy?: string;
    }[];
  };
  auditorSecretsAndFinePrint: {
    headline: string;
    secrets: {
      title: string;
      plainExplanation: string;
      foundInDoc: string;
      severity: 'high' | 'medium' | 'info';
    }[];
  };
  finalTakeawayInThreeSentences: string;
}

export interface AnalysisResult {
  documents: DocumentSource[];
  facts: ExtractedFact[];
  comparisons: FactComparison[];
  completeSummary?: CompleteSummaryData;
  systemMetrics: {
    totalFacts: number;
    corroboratedCount: number;
    contradictionCount: number;
    contextReconciledCount: number;
    failuresHandledCount: number;
    processingTimeMs: number;
    modelUsed: string;
  };
}

export interface QueryResponse {
  query: string;
  answer: string;
  verdictSummary: string;
  sources: {
    docName: string;
    page: string | number;
    quote: string;
  }[];
}

export interface HistorySession {
  id: string;
  title: string;
  createdAt: string;
  documentNames: string[];
  factsCount: number;
  comparisonsCount: number;
  contradictionsCount: number;
  data: AnalysisResult;
  userId?: string;
  userEmail?: string;
}

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  isAnonymous?: boolean;
}
