export type PeriodType = 'Q3 2026' | 'Oct 2026 (Month-End)' | 'Q2 2026' | 'YTD 2026';
export type EntityType = 'Global Consolidated' | 'North America (US & CA)' | 'EMEA Tech Ltd' | 'APAC Expansion';
export type DepartmentType = 'All Departments' | 'R&D / Engineering' | 'Sales & Marketing' | 'General & Administrative' | 'Customer Success & Ops';
export type CurrencyType = 'USD ($)' | 'EUR (€)' | 'GBP (£)';
export type PackStatus = 'draft' | 'under_review' | 'audit_approved' | 'published';
export type TonePreference = 'board_level' | 'cfo_detailed' | 'auditor_defensive' | 'concise_bulleted';
export type StatementTab = 'pnl' | 'balance_sheet' | 'cash_flow' | 'executive_summary' | 'variance_bridge' | 'audit_trail';

export interface HistoricalMemoryNode {
  id: string;
  period: string;
  title: string;
  category: 'Headcount' | 'Cloud Infra' | 'Revenue Recognition' | 'Vendor Contracts' | 'FX & Macro' | 'CapEx' | 'M&A & Restructuring' | 'Tax & Compliance';
  narrativeText: string;
  impactEstimate: string;
  appliesToAccounts: string[];
  tags: string[];
  timestamp: string;
  isCached: boolean;
  author?: string;
}

export interface LineItem {
  id: string;
  code: string;
  name: string;
  category: string;
  actual: number; // in thousands ($k)
  budget: number;
  priorPeriod: number;
  variance: number; // actual - budget (favorable/unfavorable depends on account type)
  variancePct: number;
  isHeader?: boolean;
  isTotal?: boolean;
  isSubtotal?: boolean;
  indent?: number;
  accountType: 'revenue' | 'cogs' | 'opex' | 'asset' | 'liability' | 'equity' | 'cash_in' | 'cash_out';
  varianceDriver?: string;
  commentary: string;
  historicalCitations?: string[];
  isCustomCommentary?: boolean;
  department?: DepartmentType;
  children?: LineItem[];
}

export interface FinancialStatementData {
  pnl: LineItem[];
  balanceSheet: LineItem[];
  cashFlow: LineItem[];
}

export interface IngestionFileRecord {
  id: string;
  fileName: string;
  sourceSystem: string;
  uploadTime: string;
  rowCount: number;
  totalDebits: number;
  totalCredits: number;
  status: 'valid' | 'warning' | 'error';
  mappedAccountsCount: number;
  unmappedAccountsCount: number;
  checksum: string;
}

export interface IngestionValidationCheck {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
  metric: string;
  details: string;
}

export interface ExecutiveSummaryData {
  executiveOverview: string;
  keyHeadwinds: string[];
  keyTailwinds: string[];
  cfoRecommendations: string[];
  auditConfidenceScore: number;
  signOffStatus: {
    cfoSigned: boolean;
    cfoName: string;
    signedDate?: string;
    controllerSigned: boolean;
    controllerName: string;
  };
}

export interface VarianceBridgeItem {
  name: string;
  amount: number; // in $k
  type: 'base' | 'positive' | 'negative' | 'subtotal' | 'total';
  description: string;
  historicalRef?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  target: string;
  details: string;
  badge: 'AI Update' | 'Human Edit' | 'Approval' | 'Ingestion' | 'Cache Sync';
}
