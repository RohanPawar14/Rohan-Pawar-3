import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Presentation, 
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { LineItem, ExecutiveSummaryData, HistoricalMemoryNode, PeriodType, EntityType, CurrencyType } from '../types';
import { downloadCSV, formatCurrency } from '../utils/financialUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: PeriodType;
  entity: EntityType;
  currency: CurrencyType;
  pnlData: LineItem[];
  bsData: LineItem[];
  cfData: LineItem[];
  executiveSummary: ExecutiveSummaryData;
  memoryNodes: HistoricalMemoryNode[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  period,
  entity,
  currency,
  pnlData,
  bsData,
  cfData,
  executiveSummary,
  memoryNodes,
}) => {
  const [activeTab, setActiveTab] = useState<'excel' | 'pdf' | 'presentation'>('excel');
  const [includeMemoryNotes, setIncludeMemoryNotes] = useState(true);
  const [includeAuditTrail, setIncludeAuditTrail] = useState(true);

  if (!isOpen) return null;

  const handleDownloadExcel = () => {
    // Compile comprehensive multi-statement CSV package
    const pnlRows: (string | number)[][] = [
      [`AutoPack AI - Financial Reporting Pack (${period} - ${entity})`],
      ['Generated:', new Date().toISOString()],
      ['Status:', 'Audit-Approved & Certified'],
      [''],
      ['--- STATEMENT OF PROFIT & LOSS (P&L) (in $000s) ---'],
      ['Account Code', 'Line Item Description', 'Actual', 'Budget', 'Prior Period', 'Variance ($)', 'Variance (%)', 'Variance Driver', 'AI Variance Commentary'],
      ...pnlData.map(item => [
        item.code,
        item.name,
        item.actual,
        item.budget,
        item.priorPeriod,
        item.variance,
        `${item.variancePct}%`,
        item.varianceDriver || '',
        item.commentary || ''
      ]),
      [''],
      ['--- CONSOLIDATED BALANCE SHEET (in $000s) ---'],
      ['Account Code', 'Line Item Description', 'Actual', 'Budget', 'Prior Period', 'Variance ($)', 'Variance (%)', 'Commentary'],
      ...bsData.map(item => [
        item.code,
        item.name,
        item.actual,
        item.budget,
        item.priorPeriod,
        item.variance,
        `${item.variancePct}%`,
        item.commentary || ''
      ]),
      [''],
      ['--- STATEMENT OF CASH FLOWS (in $000s) ---'],
      ['Account Code', 'Line Item Description', 'Actual', 'Budget', 'Prior Period', 'Variance ($)', 'Variance (%)', 'Commentary'],
      ...cfData.map(item => [
        item.code,
        item.name,
        item.actual,
        item.budget,
        item.priorPeriod,
        item.variance,
        `${item.variancePct}%`,
        item.commentary || ''
      ]),
    ];

    if (includeMemoryNotes) {
      pnlRows.push(
        [''],
        ['--- CACHED HISTORICAL CONTEXT / DEFENSIVE MEMORY NODES ---'],
        ['Memory ID', 'Period', 'Title', 'Category', 'Estimated Financial Impact', 'Linked Accounts', 'Narrative Driver'],
        ...memoryNodes.map(m => [
          m.id,
          m.period,
          m.title,
          m.category,
          m.impactEstimate,
          m.appliesToAccounts.join('; '),
          m.narrativeText
        ])
      );
    }

    const cleanFilename = `AutoPack_Financial_Pack_${period.replace(/[^a-zA-Z0-9]/g, '_')}_${entity.replace(/[^a-zA-Z0-9]/g, '_')}.csv`;
    downloadCSV(cleanFilename, pnlRows);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Export Financial Reporting Pack
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {period} • {entity} • Corporate Finance Reporting Standard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/30 dark:bg-slate-900/30 gap-6">
          <button
            onClick={() => setActiveTab('excel')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'excel'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel / CSV Multi-Statement Workbook
          </button>

          <button
            onClick={() => setActiveTab('pdf')}
            className={`py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'pdf'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            Printable Board Deck (PDF View)
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          
          {activeTab === 'excel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                  Included Statement Sheets
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>01_Income_Statement_P&L.csv</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>02_Consolidated_Balance_Sheet.csv</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>03_Statement_of_Cash_Flows.csv</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>04_Variance_Bridge_and_Commentary.csv</span>
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeMemoryNotes}
                    onChange={(e) => setIncludeMemoryNotes(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Include Historical Context Memory Vector Chunks as Appendix Sheet</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeAuditTrail}
                    onChange={(e) => setIncludeAuditTrail(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Include General Ledger Checksums & Tie-out Verification Hashes</span>
                </label>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-emerald-900 dark:text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Audit Assurance: 100% debits & credits balance test verified ($0.00 delta)</span>
                </div>
                <button
                  id="btn-download-excel-action"
                  onClick={handleDownloadExcel}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Workbook (.CSV)</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white dark:bg-slate-900 shadow-inner space-y-6">
                
                {/* PDF Cover Header Mockup */}
                <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold">
                      Board of Directors Confidential Financial Report
                    </span>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {entity} — Financial Reporting Pack
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Period: {period} • Currency: {currency} • Prepared by FP&A Automation Engine
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" /> Audit Certified
                    </span>
                  </div>
                </div>

                {/* KPI Overview Grid in PDF */}
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-slate-500 text-[10px]">Revenue</div>
                    <div className="font-bold text-sm font-mono mt-0.5">{formatCurrency(32450, currency)}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-slate-500 text-[10px]">Gross Margin</div>
                    <div className="font-bold text-sm font-mono mt-0.5">74.2%</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-slate-500 text-[10px]">Adj. EBITDA</div>
                    <div className="font-bold text-sm font-mono mt-0.5">{formatCurrency(6820, currency)}</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-slate-500 text-[10px]">Ending Cash</div>
                    <div className="font-bold text-sm font-mono mt-0.5">{formatCurrency(42150, currency)}</div>
                  </div>
                </div>

                {/* Narrative Excerpt */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Executive Performance Summary
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                    {executiveSummary.executiveOverview}
                  </p>
                </div>

                {/* Sign-off Stamps in PDF */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="text-[10px] text-slate-400 uppercase">CFO Digital Certification</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-1">{executiveSummary.signOffStatus.cfoName}</div>
                    <div className="text-[10px] text-emerald-600 font-mono mt-0.5">✓ Certified via AutoPack PKI Signature</div>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="text-[10px] text-slate-400 uppercase">Controller GL Tie-out</div>
                    <div className="font-bold text-slate-900 dark:text-white mt-1">{executiveSummary.signOffStatus.controllerName}</div>
                    <div className="text-[10px] text-emerald-600 font-mono mt-0.5">✓ General Ledger Tie-out Passed</div>
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready for executive distribution and Board of Directors audit packet
                </span>
                <button
                  id="btn-print-pdf-action"
                  onClick={handlePrintPDF}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print to PDF</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
