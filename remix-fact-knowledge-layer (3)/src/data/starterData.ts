import { AnalysisResult } from '../types';

export const STARTER_DOCUMENTS = [
  {
    id: 'doc-apex-2022',
    name: 'ApexTech_Annual_Report_2022.pdf',
    size: 428000,
    type: 'application/pdf',
    uploadedAt: '2024-03-15T10:00:00Z',
    pageCount: 14,
    summary: 'ApexTech FY2022 consolidated operations, executive leadership overview, and initial cloud platform rollout.',
    rawTextPreview: `APEXTECH CORPORATION — 2022 ANNUAL REPORT & ACCOUNTS
Corporate Directory:
Headquarters: 742 Evergreen Terrace, Suite 400, Austin, TX 78701
Key Personnel:
- Marcus Vance, Chief Executive Officer
- Elena Rostova, Chief Technology Officer
Financial Highlights FY2022:
- Consolidated revenue for FY2022 stood at $31.8 million, an increase of 28% year-over-year.
- Operating loss was $(4.2) million as heavy investments were poured into research and cloud infrastructure.
- Headcount: Total full-time employees worldwide as of December 31, 2022 numbered 720.
Operational Disclosures:
- Customer satisfaction index improved to 94 [table footnote: CSAT sample size n=120 enterprise accounts, metric methodology altered mid-year] and retention remained robust.
- ApexTech is incorporated under the laws of the State of Delaware.`
  },
  {
    id: 'doc-apex-2023',
    name: 'ApexTech_Annual_Report_2023.pdf',
    size: 512000,
    type: 'application/pdf',
    uploadedAt: '2024-03-15T10:01:00Z',
    pageCount: 18,
    summary: 'ApexTech FY2023 management discussion, executive changes, and fourth quarter financial performance.',
    rawTextPreview: `APEXTECH CORPORATION — 2023 ANNUAL MANAGEMENT REPORT
Corporate Information:
Registered Address: 742 Evergreen Terrace, 4th Floor, Austin, Texas 78701
Executive Governance:
- Marcus Vance continues as CEO.
- Following the resignation of former CTO Elena Rostova in February 2023, David Chen was appointed Chief Technology Officer in March 2023.
Fiscal Year 2023 Financial Summary:
- Consolidated top-line revenue amounted to $42.5 million for the full fiscal year 2023.
- Fourth Quarter (Q4) 2023 operating income alone was $3.8 million, marking our first quarterly operating profit.
- Global Workforce: As of December 31, 2023, ApexTech employed 1,240 full-time staff members across all engineering and customer hubs.
Customer Metrics:
- Net customer dollar retention exceeded 120%, with CSAT recorded at 91% for the annual cycle.
Legal entity: Incorporated in the State of Delaware (File No. 6829104).`
  },
  {
    id: 'doc-apex-audit',
    name: 'ApexTech_Independent_Auditor_Report_2023.pdf',
    size: 384000,
    type: 'application/pdf',
    uploadedAt: '2024-03-15T10:02:00Z',
    pageCount: 12,
    summary: 'Independent statutory financial audit and workforce verification report for ApexTech Corp.',
    rawTextPreview: `KPMG & ASSOCIATES — INDEPENDENT AUDITORS' REPORT TO THE BOARD OF APEXTECH CORP
Scope of Audit:
We have audited the consolidated financial statements of ApexTech Corp for the year ended December 31, 2023.
Opinion:
In our opinion, the accompanying statements present fairly, in all material respects, the financial position.
Verified Revenue:
- Gross revenue for the twelve-month period ending December 31, 2023 was independently verified at $42,500,000 USD ($42.5M).
Operating Profitability:
- Annual operating income for the full fiscal year 2023 stood at $14.2 million.
Human Capital & Certified Payroll Disclosures:
- Certified payroll audits confirm total permanent full-time personnel on payroll as of December 31, 2023 was 890 employees. Note: Management internal estimates may include external contractors and contingent staff totaling 350 individuals which are not recognized under GAAP workforce definitions.
Registered Entity & Jurisdiction:
- ApexTech Corp is a certified Delaware C-Corporation, principal business office located at Austin, TX.`
  }
];

export const STARTER_ANALYSIS_RESULT: AnalysisResult = {
  documents: STARTER_DOCUMENTS,
  facts: [
    {
      id: 'fact-rev-2022',
      docId: 'doc-apex-2022',
      docName: 'ApexTech_Annual_Report_2022.pdf',
      entityOrTopic: 'Annual Revenue (FY2022)',
      category: 'financial',
      factClaim: 'ApexTech consolidated revenue for fiscal year 2022 was $31.8 million.',
      factType: 'numerical',
      numericalValue: 31800000,
      unit: 'USD',
      temporalScope: 'FY 2022',
      confidence: 0.98,
      reconciliationStatus: 'unique',
      statusExplanation: 'Appears exclusively in 2022 Annual Report; no conflicting or repeating statements in 2023 filings.',
      evidence: {
        docId: 'doc-apex-2022',
        docName: 'ApexTech_Annual_Report_2022.pdf',
        pageNumber: 3,
        section: 'Financial Highlights',
        exactQuote: 'Consolidated revenue for FY2022 stood at $31.8 million, an increase of 28% year-over-year.'
      }
    },
    {
      id: 'fact-rev-2023-doc2',
      docId: 'doc-apex-2023',
      docName: 'ApexTech_Annual_Report_2023.pdf',
      entityOrTopic: 'Annual Revenue (FY2023)',
      category: 'financial',
      factClaim: 'Consolidated top-line revenue reached $42.5 million in fiscal year 2023.',
      factType: 'numerical',
      numericalValue: 42500000,
      unit: 'USD',
      temporalScope: 'FY 2023',
      confidence: 0.99,
      reconciliationStatus: 'corroborated',
      statusExplanation: 'Supported by multiple documents: confirmed by both 2023 Annual Report and Independent Auditor Report ($42.5M).',
      relatedDocNames: ['ApexTech_Independent_Auditor_Report_2023.pdf'],
      comparisonId: 'comp-rev-2023',
      evidence: {
        docId: 'doc-apex-2023',
        docName: 'ApexTech_Annual_Report_2023.pdf',
        pageNumber: 4,
        section: 'Fiscal Year 2023 Financial Summary',
        exactQuote: 'Consolidated top-line revenue amounted to $42.5 million for the full fiscal year 2023.'
      }
    },
    {
      id: 'fact-rev-2023-doc3',
      docId: 'doc-apex-audit',
      docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
      entityOrTopic: 'Annual Revenue (FY2023)',
      category: 'financial',
      factClaim: 'Gross revenue for the period ending Dec 31, 2023 verified at $42,500,000 USD.',
      factType: 'numerical',
      numericalValue: 42500000,
      unit: 'USD',
      temporalScope: 'FY 2023',
      confidence: 0.99,
      reconciliationStatus: 'corroborated',
      statusExplanation: 'Supported by multiple documents: confirmed by both 2023 Annual Report and Independent Auditor Report ($42,500,000 USD).',
      relatedDocNames: ['ApexTech_Annual_Report_2023.pdf'],
      comparisonId: 'comp-rev-2023',
      evidence: {
        docId: 'doc-apex-audit',
        docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
        pageNumber: 2,
        section: 'Verified Revenue',
        exactQuote: 'Gross revenue for the twelve-month period ending December 31, 2023 was independently verified at $42,500,000 USD ($42.5M).'
      }
    },
    {
      id: 'fact-headcount-doc2',
      docId: 'doc-apex-2023',
      docName: 'ApexTech_Annual_Report_2023.pdf',
      entityOrTopic: 'Global Headcount (Dec 31, 2023)',
      category: 'personnel',
      factClaim: 'ApexTech reported 1,240 full-time staff members worldwide as of December 31, 2023.',
      factType: 'numerical',
      numericalValue: 1240,
      unit: 'employees',
      temporalScope: 'As of Dec 31, 2023',
      confidence: 0.96,
      reconciliationStatus: 'contradicted',
      statusExplanation: 'Two documents give genuinely different information about the same fact on the same date: 1,240 vs 890 payroll employees.',
      relatedDocNames: ['ApexTech_Independent_Auditor_Report_2023.pdf'],
      comparisonId: 'comp-headcount-conflict',
      evidence: {
        docId: 'doc-apex-2023',
        docName: 'ApexTech_Annual_Report_2023.pdf',
        pageNumber: 12,
        section: 'Global Workforce',
        exactQuote: 'As of December 31, 2023, ApexTech employed 1,240 full-time staff members across all engineering and customer hubs.'
      }
    },
    {
      id: 'fact-headcount-doc3',
      docId: 'doc-apex-audit',
      docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
      entityOrTopic: 'Global Headcount (Dec 31, 2023)',
      category: 'personnel',
      factClaim: 'Independent audit verifies 890 permanent full-time employees on certified payroll as of Dec 31, 2023.',
      factType: 'numerical',
      numericalValue: 890,
      unit: 'employees',
      temporalScope: 'As of Dec 31, 2023',
      confidence: 0.98,
      reconciliationStatus: 'contradicted',
      statusExplanation: 'Two documents give genuinely different information about the same fact on the same date: certified payroll audits confirm strictly 890 employees.',
      relatedDocNames: ['ApexTech_Annual_Report_2023.pdf'],
      comparisonId: 'comp-headcount-conflict',
      evidence: {
        docId: 'doc-apex-audit',
        docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
        pageNumber: 9,
        section: 'Human Capital & Certified Payroll Disclosures',
        exactQuote: 'Certified payroll audits confirm total permanent full-time personnel on payroll as of December 31, 2023 was 890 employees.'
      }
    },
    {
      id: 'fact-cto-2022',
      docId: 'doc-apex-2022',
      docName: 'ApexTech_Annual_Report_2022.pdf',
      entityOrTopic: 'Chief Technology Officer (CTO)',
      category: 'personnel',
      factClaim: 'Elena Rostova holds the position of Chief Technology Officer in 2022.',
      factType: 'semantic',
      temporalScope: '2022',
      confidence: 0.97,
      reconciliationStatus: 'context_reconciled',
      statusExplanation: 'The values look different, but there is a valid reason: chronological leadership transition in March 2023.',
      relatedDocNames: ['ApexTech_Annual_Report_2023.pdf'],
      comparisonId: 'comp-cto-timeline',
      evidence: {
        docId: 'doc-apex-2022',
        docName: 'ApexTech_Annual_Report_2022.pdf',
        pageNumber: 8,
        section: 'Key Personnel',
        exactQuote: '- Elena Rostova, Chief Technology Officer'
      }
    },
    {
      id: 'fact-cto-2023',
      docId: 'doc-apex-2023',
      docName: 'ApexTech_Annual_Report_2023.pdf',
      entityOrTopic: 'Chief Technology Officer (CTO)',
      category: 'personnel',
      factClaim: 'David Chen serves as Chief Technology Officer after appointment in March 2023.',
      factType: 'semantic',
      temporalScope: 'March 2023 onwards',
      confidence: 0.98,
      reconciliationStatus: 'context_reconciled',
      statusExplanation: 'The values look different, but there is a valid reason: appointed following former CTO resignation in Q1 2023.',
      relatedDocNames: ['ApexTech_Annual_Report_2022.pdf'],
      comparisonId: 'comp-cto-timeline',
      evidence: {
        docId: 'doc-apex-2023',
        docName: 'ApexTech_Annual_Report_2023.pdf',
        pageNumber: 10,
        section: 'Executive Governance',
        exactQuote: 'Following the resignation of former CTO Elena Rostova in February 2023, David Chen was appointed Chief Technology Officer in March 2023.'
      }
    },
    {
      id: 'fact-opincome-q4',
      docId: 'doc-apex-2023',
      docName: 'ApexTech_Annual_Report_2023.pdf',
      entityOrTopic: 'Operating Income (2023)',
      category: 'financial',
      factClaim: 'Fourth quarter (Q4) 2023 operating income reached $3.8 million.',
      factType: 'numerical',
      numericalValue: 3800000,
      unit: 'USD',
      temporalScope: 'Q4 2023 only',
      confidence: 0.97,
      reconciliationStatus: 'context_reconciled',
      statusExplanation: 'The values look different, but there is a valid reason: $3.8M represents single-quarter Q4 performance versus $14.2M full-year total.',
      relatedDocNames: ['ApexTech_Independent_Auditor_Report_2023.pdf'],
      comparisonId: 'comp-opincome-scope',
      evidence: {
        docId: 'doc-apex-2023',
        docName: 'ApexTech_Annual_Report_2023.pdf',
        pageNumber: 5,
        section: 'Fiscal Year 2023 Financial Summary',
        exactQuote: 'Fourth Quarter (Q4) 2023 operating income alone was $3.8 million, marking our first quarterly operating profit.'
      }
    },
    {
      id: 'fact-opincome-annual',
      docId: 'doc-apex-audit',
      docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
      entityOrTopic: 'Operating Income (2023)',
      category: 'financial',
      factClaim: 'Full fiscal year 2023 annual operating income was $14.2 million.',
      factType: 'numerical',
      numericalValue: 14200000,
      unit: 'USD',
      temporalScope: 'Full Year FY2023',
      confidence: 0.99,
      reconciliationStatus: 'context_reconciled',
      statusExplanation: 'The values look different, but there is a valid reason: $14.2M covers the complete 12-month fiscal audit period.',
      relatedDocNames: ['ApexTech_Annual_Report_2023.pdf'],
      comparisonId: 'comp-opincome-scope',
      evidence: {
        docId: 'doc-apex-audit',
        docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
        pageNumber: 3,
        section: 'Operating Profitability',
        exactQuote: 'Annual operating income for the full fiscal year 2023 stood at $14.2 million.'
      }
    },
    {
      id: 'fact-address-2022',
      docId: 'doc-apex-2022',
      docName: 'ApexTech_Annual_Report_2022.pdf',
      entityOrTopic: 'Corporate Address',
      category: 'operational',
      factClaim: 'ApexTech headquarters located at 742 Evergreen Terrace, Suite 400, Austin, TX 78701.',
      factType: 'semantic',
      confidence: 0.99,
      reconciliationStatus: 'corroborated',
      statusExplanation: 'Supported by multiple documents: Suite 400 and 4th Floor identify the exact same physical property.',
      relatedDocNames: ['ApexTech_Annual_Report_2023.pdf'],
      comparisonId: 'comp-address',
      evidence: {
        docId: 'doc-apex-2022',
        docName: 'ApexTech_Annual_Report_2022.pdf',
        pageNumber: 1,
        section: 'Corporate Directory',
        exactQuote: 'Headquarters: 742 Evergreen Terrace, Suite 400, Austin, TX 78701'
      }
    },
    {
      id: 'fact-address-2023',
      docId: 'doc-apex-2023',
      docName: 'ApexTech_Annual_Report_2023.pdf',
      entityOrTopic: 'Corporate Address',
      category: 'operational',
      factClaim: 'Registered address: 742 Evergreen Terrace, 4th Floor, Austin, Texas 78701.',
      factType: 'semantic',
      confidence: 0.99,
      reconciliationStatus: 'corroborated',
      statusExplanation: 'Supported by multiple documents: 4th Floor in Doc B corresponds to Suite 400 in Doc A.',
      relatedDocNames: ['ApexTech_Annual_Report_2022.pdf'],
      comparisonId: 'comp-address',
      evidence: {
        docId: 'doc-apex-2023',
        docName: 'ApexTech_Annual_Report_2023.pdf',
        pageNumber: 1,
        section: 'Corporate Information',
        exactQuote: 'Registered Address: 742 Evergreen Terrace, 4th Floor, Austin, Texas 78701'
      }
    },
    {
      id: 'fact-csat-ambiguity',
      docId: 'doc-apex-2022',
      docName: 'ApexTech_Annual_Report_2022.pdf',
      entityOrTopic: 'Customer Satisfaction / Retention Index',
      category: 'operational',
      factClaim: 'Customer satisfaction index stated as 94 with altered mid-year sample methodology.',
      factType: 'numerical',
      numericalValue: 94,
      temporalScope: 'FY 2022',
      confidence: 0.52,
      isAmbiguous: true,
      ambiguityReason: 'Footnote indicates metric definition changed mid-year and sample was restricted to n=120 enterprise accounts without clear denominator or scaling.',
      reconciliationStatus: 'uncertain',
      statusExplanation: 'Your AI extracted something but isn\'t completely sure: methodology altered mid-year with restricted sample size footnote.',
      comparisonId: 'comp-csat-failure-case',
      evidence: {
        docId: 'doc-apex-2022',
        docName: 'ApexTech_Annual_Report_2022.pdf',
        pageNumber: 6,
        section: 'Operational Disclosures',
        exactQuote: 'Customer satisfaction index improved to 94 [table footnote: CSAT sample size n=120 enterprise accounts, metric methodology altered mid-year] and retention remained robust.'
      }
    },
    {
      id: 'fact-patent-doc1',
      docId: 'doc-apex-2022',
      docName: 'ApexTech_Annual_Report_2022.pdf',
      entityOrTopic: 'Intellectual Property Portfolio',
      category: 'strategic',
      factClaim: 'USPTO Patent #US-98211 granted for Distributed Graph Optimization Architecture.',
      factType: 'semantic',
      confidence: 0.98,
      reconciliationStatus: 'unique',
      statusExplanation: 'A fact appears in only one document: disclosed exclusively in the 2022 patent schedule with no other document references.',
      evidence: {
        docId: 'doc-apex-2022',
        docName: 'ApexTech_Annual_Report_2022.pdf',
        pageNumber: 14,
        section: 'Intellectual Property & Patents',
        exactQuote: 'In October 2022, ApexTech was granted US Patent #US-98211 covering our core Distributed Graph Optimization Architecture.'
      }
    },
    {
      id: 'fact-iso-doc2',
      docId: 'doc-apex-2023',
      docName: 'ApexTech_Annual_Report_2023.pdf',
      entityOrTopic: 'Security & Compliance Standards',
      category: 'operational',
      factClaim: 'ApexTech attained ISO/IEC 27001:2022 Information Security Management certification in Q3 2023.',
      factType: 'semantic',
      temporalScope: 'Q3 2023',
      confidence: 0.99,
      reconciliationStatus: 'unique',
      statusExplanation: 'A fact appears in only one document: unique certification milestone documented exclusively in the 2023 compliance section.',
      evidence: {
        docId: 'doc-apex-2023',
        docName: 'ApexTech_Annual_Report_2023.pdf',
        pageNumber: 16,
        section: 'Enterprise Security & Compliance',
        exactQuote: 'During Q3 2023, our engineering and cloud platforms officially achieved ISO/IEC 27001:2022 certification following comprehensive third-party audit.'
      }
    },
    {
      id: 'fact-audit-liability-doc3',
      docId: 'doc-apex-audit',
      docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
      entityOrTopic: 'Operating Lease Obligations (ASC 842)',
      category: 'legal',
      factClaim: 'Undiscounted future operating lease commitments total $5.42 million across 5 years.',
      factType: 'numerical',
      numericalValue: 5420000,
      unit: 'USD',
      temporalScope: '5-Year Maturity Schedule',
      confidence: 0.99,
      reconciliationStatus: 'unique',
      statusExplanation: 'A fact appears in only one document: independent auditor note 11 detailing statutory lease discount rates under ASC 842.',
      evidence: {
        docId: 'doc-apex-audit',
        docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
        pageNumber: 7,
        section: 'Note 11 - Commitments and Contingencies',
        exactQuote: 'Undiscounted statutory future lease liabilities for operating facilities totaled $5,420,000 USD over the remaining 5-year scheduled duration.'
      }
    },
    {
      id: 'fact-legal-doc1',
      docId: 'doc-apex-2022',
      docName: 'ApexTech_Annual_Report_2022.pdf',
      entityOrTopic: 'Corporate Legal Entity & Incorporation',
      category: 'legal',
      factClaim: 'ApexTech is legally incorporated in the State of Delaware.',
      factType: 'semantic',
      confidence: 0.99,
      reconciliationStatus: 'corroborated',
      statusExplanation: 'Supported across all 3 documents: PDF 1, PDF 2, and PDF 3 independently confirm Delaware incorporation.',
      relatedDocNames: ['ApexTech_Annual_Report_2023.pdf', 'ApexTech_Independent_Auditor_Report_2023.pdf'],
      comparisonId: 'comp-legal-entity',
      evidence: {
        docId: 'doc-apex-2022',
        docName: 'ApexTech_Annual_Report_2022.pdf',
        pageNumber: 2,
        section: 'Corporate Directory',
        exactQuote: 'ApexTech is incorporated under the laws of the State of Delaware.'
      }
    },
    {
      id: 'fact-legal-doc2',
      docId: 'doc-apex-2023',
      docName: 'ApexTech_Annual_Report_2023.pdf',
      entityOrTopic: 'Corporate Legal Entity & Incorporation',
      category: 'legal',
      factClaim: 'ApexTech registered as a Delaware corporate entity under File No. 6829104.',
      factType: 'semantic',
      confidence: 0.99,
      reconciliationStatus: 'corroborated',
      statusExplanation: 'Supported across all 3 documents: PDF 1, PDF 2, and PDF 3 independently confirm Delaware incorporation.',
      relatedDocNames: ['ApexTech_Annual_Report_2022.pdf', 'ApexTech_Independent_Auditor_Report_2023.pdf'],
      comparisonId: 'comp-legal-entity',
      evidence: {
        docId: 'doc-apex-2023',
        docName: 'ApexTech_Annual_Report_2023.pdf',
        pageNumber: 2,
        section: 'Legal Structure',
        exactQuote: 'Legal entity: Incorporated in the State of Delaware (File No. 6829104).'
      }
    },
    {
      id: 'fact-legal-doc3',
      docId: 'doc-apex-audit',
      docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
      entityOrTopic: 'Corporate Legal Entity & Incorporation',
      category: 'legal',
      factClaim: 'Certified as Delaware C-Corporation with principal business office in Austin, TX.',
      factType: 'semantic',
      confidence: 0.99,
      reconciliationStatus: 'corroborated',
      statusExplanation: 'Supported across all 3 documents: PDF 1, PDF 2, and PDF 3 independently confirm Delaware incorporation.',
      relatedDocNames: ['ApexTech_Annual_Report_2022.pdf', 'ApexTech_Annual_Report_2023.pdf'],
      comparisonId: 'comp-legal-entity',
      evidence: {
        docId: 'doc-apex-audit',
        docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
        pageNumber: 1,
        section: 'Registered Entity & Jurisdiction',
        exactQuote: 'ApexTech Corp is a certified Delaware C-Corporation, principal business office located at Austin, TX.'
      }
    }
  ],
  comparisons: [
    {
      id: 'comp-legal-entity',
      entityOrTopic: 'Corporate Legal Entity & Incorporation',
      category: 'legal',
      verdict: 'corroborated',
      headline: 'Triple-PDF Verification: All 3 Documents Corroborate Delaware Registration',
      detailedReasoning: 'All three documents (PDF 1, PDF 2, and PDF 3) independently corroborate that ApexTech is incorporated under the laws of Delaware with its executive headquarters in Austin, TX.',
      plainLanguageSummary: 'The data in all 3 PDFs (PDF 1, PDF 2, and PDF 3) is Delaware corporate incorporation, hence corroborated.',
      factsCompared: [
        {
          factId: 'fact-legal-doc1',
          docName: 'ApexTech_Annual_Report_2022.pdf',
          page: 2,
          statement: 'ApexTech is incorporated under the laws of the State of Delaware.',
          exactQuote: 'ApexTech is incorporated under the laws of the State of Delaware.',
          timeOrScope: '2022 Filings'
        },
        {
          factId: 'fact-legal-doc2',
          docName: 'ApexTech_Annual_Report_2023.pdf',
          page: 2,
          statement: 'Legal entity: Incorporated in the State of Delaware (File No. 6829104).',
          exactQuote: 'Legal entity: Incorporated in the State of Delaware (File No. 6829104).',
          timeOrScope: '2023 Filings'
        },
        {
          factId: 'fact-legal-doc3',
          docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
          page: 1,
          statement: 'ApexTech Corp is a certified Delaware C-Corporation, principal business office located at Austin, TX.',
          exactQuote: 'ApexTech Corp is a certified Delaware C-Corporation, principal business office located at Austin, TX.',
          timeOrScope: 'Statutory Audit'
        }
      ]
    },
    {
      id: 'comp-rev-2023',
      entityOrTopic: 'FY 2023 Annual Gross Revenue',
      category: 'financial',
      verdict: 'corroborated',
      headline: 'Confirmed Agreement Across Documents: $42.5M Verified',
      detailedReasoning: 'Both the 2023 Management Annual Report and the Independent Auditors\' Report corroborate that total FY2023 gross revenue was $42.5 million. Although the Annual Report writes "$42.5 million" as consolidated top-line and the Audit Report documents "$42,500,000 USD ($42.5M)" as verified gross revenue, semantic and numerical synthesis confirms exact substantive agreement across documents.',
      plainLanguageSummary: 'In Document B (Annual Report) this is written: revenue was $42.5 million. In Document C (Auditor Report) this is written: revenue was verified at $42,500,000 USD. Hence, both documents agree on the exact same financial metric.',
      factsCompared: [
        {
          factId: 'fact-rev-2023-doc2',
          docName: 'ApexTech_Annual_Report_2023.pdf',
          page: 4,
          statement: 'Consolidated top-line revenue amounted to $42.5 million for the full fiscal year 2023.',
          exactQuote: 'Consolidated top-line revenue amounted to $42.5 million for the full fiscal year 2023.',
          timeOrScope: 'FY 2023 Full Year'
        },
        {
          factId: 'fact-rev-2023-doc3',
          docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
          page: 2,
          statement: 'Gross revenue for the period ending Dec 31, 2023 verified at $42,500,000 USD.',
          exactQuote: 'Gross revenue for the twelve-month period ending December 31, 2023 was independently verified at $42,500,000 USD ($42.5M).',
          timeOrScope: '12-Month Period Ending Dec 31, 2023'
        }
      ]
    },
    {
      id: 'comp-address',
      entityOrTopic: 'Corporate Headquarters Location',
      category: 'operational',
      verdict: 'corroborated',
      headline: 'Semantic Agreement: Identical Physical Location Stated Differently',
      detailedReasoning: 'The 2022 report writes "Suite 400, Austin, TX 78701" while the 2023 report writes "4th Floor, Austin, Texas 78701". The system resolves "Suite 400" and "4th Floor" as well as "TX" and "Texas" to the exact same physical property address.',
      plainLanguageSummary: 'In Document A this is written: headquarters is located at Suite 400. In Document B this is written: registered address is 4th Floor. Hence, both documents agree because Suite 400 and the 4th Floor describe the exact same physical location.',
      factsCompared: [
        {
          factId: 'fact-address-2022',
          docName: 'ApexTech_Annual_Report_2022.pdf',
          page: 1,
          statement: 'Headquarters: 742 Evergreen Terrace, Suite 400, Austin, TX 78701',
          exactQuote: 'Headquarters: 742 Evergreen Terrace, Suite 400, Austin, TX 78701'
        },
        {
          factId: 'fact-address-2023',
          docName: 'ApexTech_Annual_Report_2023.pdf',
          page: 1,
          statement: 'Registered Address: 742 Evergreen Terrace, 4th Floor, Austin, Texas 78701',
          exactQuote: 'Registered Address: 742 Evergreen Terrace, 4th Floor, Austin, Texas 78701'
        }
      ]
    },
    {
      id: 'comp-headcount-conflict',
      entityOrTopic: 'Workforce Headcount as of Dec 31, 2023',
      category: 'personnel',
      verdict: 'genuine_contradiction',
      headline: 'Genuine Conflict: 1,240 vs 890 Full-Time Employees on Same Date',
      detailedReasoning: 'A genuine factual discrepancy exists for the exact same point in time (December 31, 2023). The internal Annual Report claims "1,240 full-time staff members worldwide", whereas the statutory auditor\'s report asserts verified permanent workforce is strictly "890 employees". While the auditor report speculates management may have included 350 non-GAAP external contractors, the company\'s primary publication explicitly described all 1,240 as "full-time staff members", producing an unaligned public disclosure conflict.',
      plainLanguageSummary: 'In Document B (Annual Report) this is written: ApexTech employed 1,240 full-time staff members on Dec 31, 2023. In Document C (Auditor Report) this is written: certified payroll audits verified only 890 permanent full-time employees on that exact same date. Hence, there is a contradiction.',
      factsCompared: [
        {
          factId: 'fact-headcount-doc2',
          docName: 'ApexTech_Annual_Report_2023.pdf',
          page: 12,
          statement: 'As of Dec 31, 2023, ApexTech employed 1,240 full-time staff members worldwide.',
          exactQuote: 'As of December 31, 2023, ApexTech employed 1,240 full-time staff members across all engineering and customer hubs.',
          timeOrScope: 'As of Dec 31, 2023'
        },
        {
          factId: 'fact-headcount-doc3',
          docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
          page: 9,
          statement: 'Certified payroll audits confirm total permanent full-time personnel on payroll was 890 employees.',
          exactQuote: 'Certified payroll audits confirm total permanent full-time personnel on payroll as of December 31, 2023 was 890 employees.',
          timeOrScope: 'As of Dec 31, 2023'
        }
      ]
    },
    {
      id: 'comp-cto-timeline',
      entityOrTopic: 'Chief Technology Officer (CTO) Leadership',
      category: 'personnel',
      verdict: 'context_reconciled',
      headline: 'Apparent Contradiction Reconciled by Temporal Progression',
      detailedReasoning: 'In the 2022 Annual Report, Elena Rostova is listed as CTO. In the 2023 Annual Report, David Chen is listed as CTO. Rather than a factual contradiction regarding who held the title, the discrepancy is reconciled by chronology: Elena Rostova held the role throughout 2022 and resigned in February 2023, whereupon David Chen was appointed in March 2023.',
      plainLanguageSummary: 'In Document A this is written: Elena Rostova was Chief Technology Officer in 2022. In Document B this is written: David Chen was appointed CTO in March 2023. Hence, there is no real conflict because Elena led in 2022 and David took over in 2023.',
      reconciliationContext: {
        dimension: 'time',
        explanation: 'Chronological personnel transition in Q1 2023. Both records are factually true for their respective effective dates.'
      },
      factsCompared: [
        {
          factId: 'fact-cto-2022',
          docName: 'ApexTech_Annual_Report_2022.pdf',
          page: 8,
          statement: 'Elena Rostova serves as Chief Technology Officer.',
          exactQuote: '- Elena Rostova, Chief Technology Officer',
          timeOrScope: 'FY 2022'
        },
        {
          factId: 'fact-cto-2023',
          docName: 'ApexTech_Annual_Report_2023.pdf',
          page: 10,
          statement: 'David Chen serves as Chief Technology Officer following appointment in March 2023.',
          exactQuote: 'Following the resignation of former CTO Elena Rostova in February 2023, David Chen was appointed Chief Technology Officer in March 2023.',
          timeOrScope: 'March 2023 - Present'
        }
      ]
    },
    {
      id: 'comp-opincome-scope',
      entityOrTopic: '2023 Operating Income Figures',
      category: 'financial',
      verdict: 'context_reconciled',
      headline: 'Apparent Contradiction Reconciled by Reporting Scope: Q4 vs Full Year',
      detailedReasoning: 'Doc 2 records operating income as $3.8 million, while Doc 3 records operating income as $14.2 million. This appears to be a direct 3.7x numerical disagreement. However, cross-document context reconciliation shows Doc 2 was reporting Fourth Quarter (Q4) operating income, whereas Doc 3 was reporting the consolidated full-year (12-month) operating income.',
      plainLanguageSummary: 'In Document B this is written: operating income was $3.8 million. In Document C this is written: annual operating income was $14.2 million. Hence, there is no contradiction because Document B only reports a single quarter (Q4) whereas Document C reports the full 12 months.',
      reconciliationContext: {
        dimension: 'scope',
        explanation: '$3.8M represents single-quarter performance (Q4 2023), whereas $14.2M accounts for the full 12-month annual audited fiscal period.'
      },
      factsCompared: [
        {
          factId: 'fact-opincome-q4',
          docName: 'ApexTech_Annual_Report_2023.pdf',
          page: 5,
          statement: 'Fourth Quarter (Q4) 2023 operating income alone was $3.8 million.',
          exactQuote: 'Fourth Quarter (Q4) 2023 operating income alone was $3.8 million, marking our first quarterly operating profit.',
          timeOrScope: 'Quarter 4 (3 months)'
        },
        {
          factId: 'fact-opincome-annual',
          docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
          page: 3,
          statement: 'Annual operating income for the full fiscal year 2023 stood at $14.2 million.',
          exactQuote: 'Annual operating income for the full fiscal year 2023 stood at $14.2 million.',
          timeOrScope: 'Full Fiscal Year (12 months)'
        }
      ]
    },
    {
      id: 'comp-csat-failure-case',
      entityOrTopic: 'Customer Satisfaction (CSAT) Trend & Methodology Shift',
      category: 'operational',
      verdict: 'extraction_failure_risk',
      headline: 'Extraction & Reasoning Ambiguity: Methodology Shift & Missing Baselines',
      detailedReasoning: 'In Doc 1, the text asserts "Customer satisfaction index improved to 94", but a qualifying footnote reveals the methodology changed mid-year and the sample was restricted to enterprise accounts. In Doc 2, CSAT is reported as "91%". An uncalibrated system would naively declare a 3-point decline or a contradiction between a raw index (94) and a percentage (91%).',
      plainLanguageSummary: 'In Document A this is written: satisfaction was an index score of 94, with a footnote noting changed measurement rules. In Document B this is written: satisfaction was recorded as 91%. Hence, there is an ambiguity because the two reports used different measurement criteria.',
      mitigationOrHandling: 'How our system handles this failure mode: 1) Flags a low confidence score (0.52); 2) Detects ungrounded unit mismatch (Index point vs Percentage %); 3) Extracts attached footnotes and caveats rather than isolated numerical tokens; 4) Prompts the reviewer with an uncertainty warning explaining that cross-year baseline comparison is statistically invalid due to the disclosed methodology shift.',
      factsCompared: [
        {
          factId: 'fact-csat-ambiguity',
          docName: 'ApexTech_Annual_Report_2022.pdf',
          page: 6,
          statement: 'Customer satisfaction index stated as 94 with altered mid-year sample methodology footnote.',
          exactQuote: 'Customer satisfaction index improved to 94 [table footnote: CSAT sample size n=120 enterprise accounts, metric methodology altered mid-year] and retention remained robust.',
          timeOrScope: 'FY 2022 (Changed methodology)'
        },
        {
          docName: 'ApexTech_Annual_Report_2023.pdf',
          page: 13,
          statement: 'CSAT recorded at 91% for the annual cycle.',
          exactQuote: 'Net customer dollar retention exceeded 120%, with CSAT recorded at 91% for the annual cycle.',
          timeOrScope: 'FY 2023'
        }
      ]
    }
  ],
  systemMetrics: {
    totalFacts: 18,
    corroboratedCount: 3,
    contradictionCount: 1,
    contextReconciledCount: 2,
    failuresHandledCount: 1,
    processingTimeMs: 1100,
    modelUsed: 'gemini-3.8-flash'
  },
  completeSummary: {
    headlineTitle: 'All 3 ApexTech PDFs Combined in Super Easy Language',
    oneMinuteStory: 'Think of these 3 documents as a complete 3-part story of ApexTech: In 2022, the company was building new cloud tools and lost $4.2M. In 2023, their sales took off to $42.5M and they turned profitable. Finally, an outside referee (KPMG Auditor) checked their math, confirmed the $42.5M sales are 100% real, but caught them exaggerating their employee count—proving they only have 890 real full-time staff, not 1,240!',
    readingTimeMinutes: 3,
    documentsCombined: [
      {
        name: 'ApexTech_Annual_Report_2022.pdf',
        shortTitle: '2022 Annual Report',
        simpleRole: 'The Foundation: Tells what happened in 2022 when the company was still losing money but investing heavily in new tech.',
        badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200'
      },
      {
        name: 'ApexTech_Annual_Report_2023.pdf',
        shortTitle: '2023 Management Report',
        simpleRole: 'The Company Claims: Written by management to celebrate high sales ($42.5M), new profits, and a bigger team.',
        badgeColor: 'bg-purple-100 text-purple-900 border border-purple-200'
      },
      {
        name: 'ApexTech_Independent_Auditor_Report_2023.pdf',
        shortTitle: '2023 Auditor Report',
        simpleRole: 'The Outside Referee: Independent audit by KPMG to verify if management told the truth or exaggerated.',
        badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-200'
      }
    ],
    financialsInSimpleWords: {
      headline: 'The Money Story: How Much Did They Make & Spend?',
      moneyEarnedStory: 'In 2022, ApexTech brought in $31.8 Million. In 2023, sales jumped to $42.5 Million—a big 33.6% growth! Both the company report and the outside auditor agree 100% on the $42.5 Million figure, so we know this money is real.',
      profitOrLossStory: 'In 2022, ApexTech lost $4.2 Million because they spent so much on computer servers and engineers. By 2023, they turned that loss into a huge $14.2 Million annual operating profit! In the final 3 months of 2023 alone (Q4), they made $3.8 Million.',
      futureBillsStory: 'The auditor found that ApexTech signed leases for office space and data centers that will cost them $5.42 Million in bills over the next 5 years.',
      comparisons: [
        {
          topic: 'Annual Sales / Revenue (FY 2023)',
          category: 'Financial',
          simpleExplanation: 'Both Document 2 (Annual Report) and Document 3 (Auditor Report) agree that ApexTech brought in exactly $42.5 Million in 2023.',
          docClaims: [
            {
              docName: 'ApexTech_Annual_Report_2023.pdf',
              whatItSaysInEasyWords: 'Top-line sales reached $42.5 Million for the full year 2023.',
              exactQuote: 'Consolidated top-line revenue amounted to $42.5 million for the full fiscal year 2023.',
              page: 4
            },
            {
              docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
              whatItSaysInEasyWords: 'KPMG verified that gross revenue was $42,500,000 USD ($42.5M).',
              exactQuote: 'Gross revenue for the twelve-month period ending December 31, 2023 was independently verified at $42,500,000 USD ($42.5M).',
              page: 2
            }
          ],
          verdictType: 'agreed',
          verdictBadge: '100% Verified Agreement',
          verdictExplanation: 'The internal management report and the outside audit agree to the exact dollar ($42.5M).'
        },
        {
          topic: 'Operating Profits: $3.8M vs $14.2M (Q4 vs Full Year)',
          category: 'Financial',
          simpleExplanation: 'Doc 2 mentions $3.8M while Doc 3 mentions $14.2M. This looks like a mistake, but it is not! $3.8M was just for the last 3 months of winter, while $14.2M was for the entire 12 months.',
          docClaims: [
            {
              docName: 'ApexTech_Annual_Report_2023.pdf',
              whatItSaysInEasyWords: 'Q4 (the last 3 months) operating profit was $3.8 Million.',
              exactQuote: 'Fourth Quarter (Q4) 2023 operating income alone was $3.8 million, marking our first quarterly operating profit.',
              page: 5
            },
            {
              docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
              whatItSaysInEasyWords: 'The full 12-month annual operating profit was $14.2 Million.',
              exactQuote: 'Annual operating income for the full fiscal year 2023 stood at $14.2 million.',
              page: 3
            }
          ],
          verdictType: 'reconciled',
          verdictBadge: 'Explained by Time Frame (3 Months vs 12 Months)',
          verdictExplanation: 'One document measured a 3-month season, while the other measured the whole 12-month year.'
        }
      ]
    },
    peopleAndTeamInSimpleWords: {
      headline: 'The People Story: Who is in Charge and How Many People Work There?',
      leadershipStory: 'Marcus Vance has been the CEO (the big boss) across both 2022 and 2023. The technology boss (CTO) changed: Elena Rostova was CTO in 2022 and quit in February 2023. David Chen was hired to take over in March 2023.',
      headcountConflictStory: 'Here is the biggest fight between the documents: In 2023, management bragged that they have 1,240 full-time workers. But when the auditor inspected the official tax and payroll records, they found only 890 real employees! The other 350 were temporary freelance contractors.',
      comparisons: [
        {
          topic: 'Workforce Headcount (1,240 vs 890 Employees)',
          category: 'Personnel',
          simpleExplanation: 'The company claims 1,240 employees, but the auditor says there are only 890. The company counted 350 outside contractors as regular staff.',
          docClaims: [
            {
              docName: 'ApexTech_Annual_Report_2023.pdf',
              whatItSaysInEasyWords: 'Claims: We employ 1,240 full-time staff members worldwide.',
              exactQuote: 'As of December 31, 2023, ApexTech employed 1,240 full-time staff members across all engineering and customer hubs.',
              page: 12
            },
            {
              docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
              whatItSaysInEasyWords: 'Auditor fact-check: Only 890 employees are actually on certified payroll. 350 are external contractors!',
              exactQuote: 'Certified payroll audits confirm total permanent full-time personnel on payroll as of December 31, 2023 was 890 employees. Note: Management internal estimates may include external contractors and contingent staff totaling 350 individuals...',
              page: 9
            }
          ],
          verdictType: 'contradiction',
          verdictBadge: 'Real Contradiction (Exaggeration Caught)',
          verdictExplanation: 'Management stretched the truth by calling freelance contractors "full-time staff". You should trust the auditor number (890).'
        },
        {
          topic: 'Technology Boss (CTO) Transition',
          category: 'Personnel',
          simpleExplanation: 'Doc 1 lists Elena Rostova as CTO, while Doc 2 lists David Chen as CTO. Nobody lied: Elena left in Feb 2023 and David started in March 2023.',
          docClaims: [
            {
              docName: 'ApexTech_Annual_Report_2022.pdf',
              whatItSaysInEasyWords: 'Elena Rostova was the Chief Technology Officer in 2022.',
              exactQuote: '- Elena Rostova, Chief Technology Officer',
              page: 8
            },
            {
              docName: 'ApexTech_Annual_Report_2023.pdf',
              whatItSaysInEasyWords: 'David Chen became Chief Technology Officer in March 2023 after Elena resigned.',
              exactQuote: 'Following the resignation of former CTO Elena Rostova in February 2023, David Chen was appointed Chief Technology Officer in March 2023.',
              page: 10
            }
          ],
          verdictType: 'reconciled',
          verdictBadge: 'Explained by Timeline (Elena quit, David hired)',
          verdictExplanation: 'Both statements are true for their respective dates.'
        }
      ]
    },
    whereAllPdfsAgree: {
      headline: 'Where All 3 Documents Agree 100% (Solid Facts)',
      points: [
        {
          title: '2023 Sales were $42.5 Million',
          simpleDescription: 'Both internal company leadership and independent KPMG auditors confirm that ApexTech collected $42.5 Million in sales.',
          verifiedInDocs: ['ApexTech_Annual_Report_2023.pdf', 'ApexTech_Independent_Auditor_Report_2023.pdf']
        },
        {
          title: 'CEO Leadership',
          simpleDescription: 'All documents confirm Marcus Vance remained Chief Executive Officer across both 2022 and 2023.',
          verifiedInDocs: ['ApexTech_Annual_Report_2022.pdf', 'ApexTech_Annual_Report_2023.pdf']
        },
        {
          title: 'Company Headquarters Location',
          simpleDescription: 'All documents agree the main office is at 742 Evergreen Terrace in Austin, Texas. "Suite 400" and "4th Floor" refer to the same exact office.',
          verifiedInDocs: ['ApexTech_Annual_Report_2022.pdf', 'ApexTech_Annual_Report_2023.pdf', 'ApexTech_Independent_Auditor_Report_2023.pdf']
        },
        {
          title: 'Legal Incorporation',
          simpleDescription: 'All documents agree ApexTech is a certified corporation registered in the State of Delaware.',
          verifiedInDocs: ['ApexTech_Annual_Report_2022.pdf', 'ApexTech_Annual_Report_2023.pdf', 'ApexTech_Independent_Auditor_Report_2023.pdf']
        }
      ]
    },
    wherePdfsFightOrDisagree: {
      headline: 'Where the PDFs Fight: The Real Disagreements',
      conflicts: [
        {
          topic: 'Workforce Size on December 31, 2023',
          simpleQuestion: 'How many people actually work at ApexTech?',
          whatEachDocSays: [
            {
              docName: 'ApexTech_Annual_Report_2023.pdf',
              claim: 'Says: "1,240 full-time staff members worldwide".'
            },
            {
              docName: 'ApexTech_Independent_Auditor_Report_2023.pdf',
              claim: 'Says: "Only 890 permanent personnel on payroll. 350 are contractors".'
            }
          ],
          theTruthInPlainWords: 'The company exaggerated its size to sound bigger to investors. They counted 350 temporary external contractors as if they were permanent employees. The auditor caught this and set the record straight.',
          whoToTrust: 'Trust Document 3 (The Auditor). Legally and financially, only 890 people are permanent employees.'
        }
      ]
    },
    whySomeNumbersLookDifferent: {
      headline: 'Numbers That Look Confusing at First (But Make Total Sense)',
      explanations: [
        {
          topic: 'Operating Profit: $3.8 Million vs $14.2 Million',
          whatLooksWrong: 'Document 2 says profit was $3.8M, but Document 3 says profit was $14.2M. That looks like a huge error!',
          whyItIsActuallyOkay: 'Document 2 was only talking about Q4 (October, November, December). Document 3 was talking about all 12 months of the year. Both are correct!',
          simpleAnalogy: 'It is like saying "I ate 2 slices of pizza at dinner" vs "I ate 8 slices of pizza all day". Both statements are true!'
        },
        {
          topic: 'Tech Boss (CTO): Elena Rostova vs David Chen',
          whatLooksWrong: 'Document 1 says Elena is CTO, while Document 2 says David is CTO.',
          whyItIsActuallyOkay: 'Elena served throughout 2022 and quit in February 2023. David was hired in March 2023. Time passed between the two documents.',
          simpleAnalogy: 'It is like looking at a 5th grade school yearbook and a 6th grade yearbook—the teacher changed between school years.'
        },
        {
          topic: 'Office Address: Suite 400 vs 4th Floor',
          whatLooksWrong: 'One report says "Suite 400" and the other says "4th Floor".',
          whyItIsActuallyOkay: 'In office buildings, Suite 400 is simply the office suite on the 4th floor. It is the exact same physical room.',
          simpleAnalogy: 'Like saying "Apartment 2B" vs "2nd Floor Apartment B".'
        }
      ]
    },
    auditorSecretsAndFinePrint: {
      headline: 'Secrets & Warnings Found in the Fine Print (Footnotes)',
      secrets: [
        {
          title: 'Customer Satisfaction Footnote Caveat',
          plainExplanation: 'In 2022, ApexTech claimed a customer happiness score of 94. But a tiny footnote reveals they changed how they calculated it halfway through the year and only asked 120 big clients. You cannot fairly compare it to the 91% score in 2023!',
          foundInDoc: 'ApexTech_Annual_Report_2022.pdf (Page 6 footnote)',
          severity: 'high'
        },
        {
          title: 'Unpaid Future Lease Bills: $5.42 Million',
          plainExplanation: 'The auditor found Note 11 showing ApexTech is locked into paying $5.42 Million for building and server leases over the next 5 years.',
          foundInDoc: 'ApexTech_Independent_Auditor_Report_2023.pdf (Note 11, Page 7)',
          severity: 'medium'
        },
        {
          title: 'Official ISO 27001 Security Badge Achieved in Q3 2023',
          plainExplanation: 'ApexTech passed official security testing and earned an ISO/IEC 27001 security badge for its cloud platform.',
          foundInDoc: 'ApexTech_Annual_Report_2023.pdf (Page 16)',
          severity: 'info'
        },
        {
          title: 'US Patent Granted in October 2022',
          plainExplanation: 'ApexTech was granted US Patent #US-98211 for its graph optimization technology.',
          foundInDoc: 'ApexTech_Annual_Report_2022.pdf (Page 14)',
          severity: 'info'
        }
      ]
    },
    finalTakeawayInThreeSentences: 'ApexTech grew quickly, jumping from $31.8M in 2022 to $42.5M in sales in 2023 and turning a $4.2M loss into a solid $14.2M profit, which KPMG independently verified. While leadership smoothly transitioned to a new CTO (David Chen), the company exaggerated its size by claiming 1,240 employees when only 890 are real full-time staff. Bottom line: The business is financially healthy and growing, but whenever someone quotes their workforce, use the verified 890 employee figure!'
  }
};
