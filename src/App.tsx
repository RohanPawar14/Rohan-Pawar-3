import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  BarChart3, 
  Building2, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  BrainCircuit, 
  Database, 
  Download, 
  BotMessageSquare, 
  Layers, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  FileText, 
  Sliders, 
  Info,
  ChevronRight,
  RefreshCw,
  Zap,
  ArrowRight
} from 'lucide-react';

import { 
  PeriodType, 
  EntityType, 
  DepartmentType, 
  CurrencyType, 
  PackStatus, 
  StatementTab, 
  LineItem, 
  HistoricalMemoryNode, 
  ExecutiveSummaryData, 
  AuditLogEntry 
} from './types';

import { 
  INITIAL_PNL_DATA, 
  INITIAL_BALANCE_SHEET, 
  INITIAL_CASH_FLOW, 
  INITIAL_MEMORY_NODES, 
  INITIAL_EXECUTIVE_SUMMARY, 
  INITIAL_AUDIT_TRAIL 
} from './data/initialData';

import { Navbar } from './components/Navbar';
import { FinancialStatementTable } from './components/FinancialStatementTable';
import { ExecutiveSummaryView } from './components/ExecutiveSummaryView';
import { VarianceBridgeView } from './components/VarianceBridgeView';
import { AuditTrailView } from './components/AuditTrailView';
import { HistoricalMemoryDrawer } from './components/HistoricalMemoryDrawer';
import { DataIngestionModal } from './components/DataIngestionModal';
import { ExportModal } from './components/ExportModal';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { formatCurrency } from './utils/financialUtils';

export default function App() {
  // Global Pack Filters
  const [period, setPeriod] = useState<PeriodType>('Q3 2026');
  const [entity, setEntity] = useState<EntityType>('Global Consolidated');
  const [department, setDepartment] = useState<DepartmentType>('All Departments');
  const [currency, setCurrency] = useState<CurrencyType>('USD ($)');
  const [packStatus, setPackStatus] = useState<PackStatus>('audit_approved');
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Active View Tab
  const [activeTab, setActiveTab] = useState<StatementTab>('executive_summary');

  // Datasets State
  const [pnlData, setPnlData] = useState<LineItem[]>(INITIAL_PNL_DATA);
  const [bsData, setBsData] = useState<LineItem[]>(INITIAL_BALANCE_SHEET);
  const [cfData, setCfData] = useState<LineItem[]>(INITIAL_CASH_FLOW);
  const [executiveSummary, setExecutiveSummary] = useState<ExecutiveSummaryData>(INITIAL_EXECUTIVE_SUMMARY);
  const [memoryNodes, setMemoryNodes] = useState<HistoricalMemoryNode[]>(INITIAL_MEMORY_NODES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_TRAIL);

  // Historical Context Caching State
  const [memoryEnabled, setMemoryEnabled] = useState<boolean>(true);

  // Modals and Drawers
  const [isMemoryDrawerOpen, setIsMemoryDrawerOpen] = useState(false);
  const [isIngestionModalOpen, setIsIngestionModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Dark Mode Sync
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Handle commentary updates on statements
  const handleUpdatePnlCommentary = (itemId: string, newText: string, driver?: string) => {
    const updateRecursive = (items: LineItem[]): LineItem[] => {
      return items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            commentary: newText,
            varianceDriver: driver || item.varianceDriver,
            isCustomCommentary: true,
          };
        }
        if (item.children) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };

    setPnlData(updateRecursive(pnlData));
    
    // Log in audit trail
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'FP&A Analyst (Human Edit)',
      action: 'Commentary Updated',
      target: `Line Item ID: ${itemId}`,
      details: newText.slice(0, 80) + '...',
      badge: 'Human Edit',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast('Variance commentary updated and saved.');
  };

  const handleUpdateBsCommentary = (itemId: string, newText: string) => {
    const updateRecursive = (items: LineItem[]): LineItem[] => {
      return items.map((item) => {
        if (item.id === itemId) {
          return { ...item, commentary: newText, isCustomCommentary: true };
        }
        if (item.children) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };
    setBsData(updateRecursive(bsData));
    showToast('Balance sheet commentary saved.');
  };

  const handleUpdateCfCommentary = (itemId: string, newText: string) => {
    const updateRecursive = (items: LineItem[]): LineItem[] => {
      return items.map((item) => {
        if (item.id === itemId) {
          return { ...item, commentary: newText, isCustomCommentary: true };
        }
        if (item.children) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };
    setCfData(updateRecursive(cfData));
    showToast('Cash flow commentary saved.');
  };

  // Memory Node Management
  const handleAddMemoryNode = (node: HistoricalMemoryNode) => {
    setMemoryNodes((prev) => [node, ...prev]);
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Memory Cache Subsystem',
      action: 'Historical Context Ingested',
      target: node.title,
      details: `Cached: ${node.narrativeText.slice(0, 70)}...`,
      badge: 'Cache Sync',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Indexed historical context: "${node.title}"`);
  };

  const handleDeleteMemoryNode = (id: string) => {
    setMemoryNodes((prev) => prev.filter((n) => n.id !== id));
    showToast('Historical context node removed.');
  };

  const handleToggleNodeCache = (id: string) => {
    setMemoryNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isCached: !n.isCached } : n))
    );
  };

  // Ingestion complete
  const handleIngestComplete = (datasetName: string) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: 'Automated Ingestion Engine',
      action: 'Trial Balance Ingested',
      target: datasetName,
      details: 'Harmonized 1,420 ERP accounts. All 5 validation checks passed.',
      badge: 'Ingestion',
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    showToast(`Successfully ingested and validated ${datasetName}!`);
  };

  const tabs: { id: StatementTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'executive_summary', label: 'Executive Board Pack', icon: <Sparkles className="w-3.5 h-3.5" />, badge: 'CFO Ready' },
    { id: 'pnl', label: 'P&L (Income Statement)', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
    { id: 'balance_sheet', label: 'Balance Sheet', icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: 'cash_flow', label: 'Cash Flow Statement', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'variance_bridge', label: 'EBITDA Waterfall Bridge', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'audit_trail', label: 'Audit Trail & Governance', icon: <ShieldCheck className="w-3.5 h-3.5" />, badge: 'Verified' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased transition-colors">
      
      {/* Global Header */}
      <Navbar
        period={period}
        setPeriod={setPeriod}
        entity={entity}
        setEntity={setEntity}
        department={department}
        setDepartment={setDepartment}
        currency={currency}
        setCurrency={setCurrency}
        packStatus={packStatus}
        setPackStatus={setPackStatus}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeMemoryCount={memoryNodes.filter((n) => n.isCached).length}
        memoryEnabled={memoryEnabled}
        onOpenMemoryDrawer={() => setIsMemoryDrawerOpen(true)}
        onOpenIngestionModal={() => setIsIngestionModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
        isCopilotOpen={isCopilotOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Historical Context Caching Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-white/10 text-indigo-200 border border-white/10 shrink-0">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold tracking-tight">
                  AutoPack AI: Autonomous Financial Reporting & Defensible Context Engine
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Memory Active
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-1 max-w-3xl leading-relaxed">
                Applying <strong>{memoryNodes.filter(n => n.isCached).length} cached prior period narrative vectors</strong> (AWS EDP commitments, R&D hiring freeze lag, and SaaS Summit timing) to eliminate repetitive variance research.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
              id="btn-inspect-memory-banner"
              onClick={() => setIsMemoryDrawerOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>Manage Memory Cache</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/40 dark:bg-indigo-950/20'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Quick Context Summary Tag */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Period: <strong className="text-slate-800 dark:text-slate-200">{period}</strong></span>
            <span>&bull;</span>
            <span>Entity: <strong className="text-slate-800 dark:text-slate-200">{entity}</strong></span>
          </div>
        </div>

        {/* Tab Views */}
        <div className="pt-2 animate-fadeIn">
          {activeTab === 'executive_summary' && (
            <ExecutiveSummaryView
              summaryData={executiveSummary}
              onUpdateSummary={(data) => setExecutiveSummary((prev) => ({ ...prev, ...data }))}
              period={period}
              entity={entity}
              currency={currency}
              memoryNodes={memoryNodes}
              memoryEnabled={memoryEnabled}
              onOpenMemoryDrawer={() => setIsMemoryDrawerOpen(true)}
              onSelectTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'pnl' && (
            <FinancialStatementTable
              title="Consolidated Statement of Profit and Loss (Income Statement)"
              statementType="pnl"
              items={pnlData}
              currency={currency}
              period={period}
              entity={entity}
              department={department}
              memoryNodes={memoryNodes}
              memoryEnabled={memoryEnabled}
              onUpdateCommentary={handleUpdatePnlCommentary}
              onOpenMemoryDrawer={() => setIsMemoryDrawerOpen(true)}
            />
          )}

          {activeTab === 'balance_sheet' && (
            <FinancialStatementTable
              title="Consolidated Statement of Financial Position (Balance Sheet)"
              statementType="balance_sheet"
              items={bsData}
              currency={currency}
              period={period}
              entity={entity}
              department={department}
              memoryNodes={memoryNodes}
              memoryEnabled={memoryEnabled}
              onUpdateCommentary={handleUpdateBsCommentary}
              onOpenMemoryDrawer={() => setIsMemoryDrawerOpen(true)}
            />
          )}

          {activeTab === 'cash_flow' && (
            <FinancialStatementTable
              title="Consolidated Statement of Cash Flows (Indirect Method)"
              statementType="cash_flow"
              items={cfData}
              currency={currency}
              period={period}
              entity={entity}
              department={department}
              memoryNodes={memoryNodes}
              memoryEnabled={memoryEnabled}
              onUpdateCommentary={handleUpdateCfCommentary}
              onOpenMemoryDrawer={() => setIsMemoryDrawerOpen(true)}
            />
          )}

          {activeTab === 'variance_bridge' && (
            <VarianceBridgeView
              period={period}
              entity={entity}
              currency={currency}
              memoryNodes={memoryNodes}
              onOpenMemoryDrawer={() => setIsMemoryDrawerOpen(true)}
            />
          )}

          {activeTab === 'audit_trail' && (
            <AuditTrailView
              logs={auditLogs}
              period={period}
              entity={entity}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">AutoPack AI</span>
            <span>&bull;</span>
            <span>Corporate Finance GAAP/IFRS Standards</span>
            <span>&bull;</span>
            <span className="text-emerald-600 font-medium">✓ General Ledger Tie-out: $0.00 Variance</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Historical Vectors: {memoryNodes.length} Cached</span>
            <span>&bull;</span>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
            >
              Export Report Pack
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-3.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Historical Context Memory Drawer */}
      <HistoricalMemoryDrawer
        isOpen={isMemoryDrawerOpen}
        onClose={() => setIsMemoryDrawerOpen(false)}
        memoryNodes={memoryNodes}
        onAddMemoryNode={handleAddMemoryNode}
        onDeleteMemoryNode={handleDeleteMemoryNode}
        onToggleNodeCache={handleToggleNodeCache}
        memoryEnabled={memoryEnabled}
        onToggleMemoryEnabled={setMemoryEnabled}
      />

      {/* Data Ingestion Simulation Modal */}
      <DataIngestionModal
        isOpen={isIngestionModalOpen}
        onClose={() => setIsIngestionModalOpen(false)}
        onIngestComplete={handleIngestComplete}
      />

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        period={period}
        entity={entity}
        currency={currency}
        pnlData={pnlData}
        bsData={bsData}
        cfData={cfData}
        executiveSummary={executiveSummary}
        memoryNodes={memoryNodes}
      />

      {/* AI Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        period={period}
        entity={entity}
        pnlData={pnlData}
        memoryNodes={memoryNodes}
      />

    </div>
  );
}
