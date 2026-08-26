import React from 'react';
import { 
  Building2, 
  Calendar, 
  Layers, 
  FileSpreadsheet, 
  Sparkles, 
  Download, 
  Sun, 
  Moon, 
  ShieldCheck, 
  Database, 
  BrainCircuit,
  BotMessageSquare,
  CheckCircle2,
  Clock,
  Send
} from 'lucide-react';
import { PeriodType, EntityType, DepartmentType, CurrencyType, PackStatus } from '../types';

interface NavbarProps {
  period: PeriodType;
  setPeriod: (p: PeriodType) => void;
  entity: EntityType;
  setEntity: (e: EntityType) => void;
  department: DepartmentType;
  setDepartment: (d: DepartmentType) => void;
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  packStatus: PackStatus;
  setPackStatus: (s: PackStatus) => void;
  darkMode: boolean;
  setDarkMode: (d: boolean) => void;
  activeMemoryCount: number;
  memoryEnabled: boolean;
  onOpenMemoryDrawer: () => void;
  onOpenIngestionModal: () => void;
  onOpenExportModal: () => void;
  onOpenCopilot: () => void;
  isCopilotOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  period,
  setPeriod,
  entity,
  setEntity,
  department,
  setDepartment,
  currency,
  setCurrency,
  packStatus,
  setPackStatus,
  darkMode,
  setDarkMode,
  activeMemoryCount,
  memoryEnabled,
  onOpenMemoryDrawer,
  onOpenIngestionModal,
  onOpenExportModal,
  onOpenCopilot,
  isCopilotOpen,
}) => {
  const getStatusBadge = () => {
    switch (packStatus) {
      case 'audit_approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Audit-Approved
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Send className="w-3.5 h-3.5" />
            Published to Board
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Clock className="w-3.5 h-3.5" />
            Under CFO Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
            Draft In-Progress
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand & Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                  AutoPack<span className="text-indigo-600 dark:text-indigo-400">.AI</span>
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                  FP&A v4.2
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Autonomous Financial Reporting & Variance Intelligence
              </p>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            
            {/* Period Selector */}
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="period-select"
                aria-label="Financial Reporting Period"
                value={period}
                onChange={(e) => setPeriod(e.target.value as PeriodType)}
                className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer text-xs"
              >
                <option value="Q3 2026" className="dark:bg-slate-800">Q3 2026 (Quarter-End)</option>
                <option value="Oct 2026 (Month-End)" className="dark:bg-slate-800">Oct 2026 (Month-End)</option>
                <option value="Q2 2026" className="dark:bg-slate-800">Q2 2026 (Prior Quarter)</option>
                <option value="YTD 2026" className="dark:bg-slate-800">YTD 2026 (Year-to-Date)</option>
              </select>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Entity Selector */}
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="entity-select"
                aria-label="Reporting Legal Entity"
                value={entity}
                onChange={(e) => setEntity(e.target.value as EntityType)}
                className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer text-xs"
              >
                <option value="Global Consolidated" className="dark:bg-slate-800">Global Consolidated</option>
                <option value="North America (US & CA)" className="dark:bg-slate-800">North America (US & CA)</option>
                <option value="EMEA Tech Ltd" className="dark:bg-slate-800">EMEA Tech Ltd</option>
                <option value="APAC Expansion" className="dark:bg-slate-800">APAC Expansion</option>
              </select>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Department Filter */}
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="dept-select"
                aria-label="Department Cost Center"
                value={department}
                onChange={(e) => setDepartment(e.target.value as DepartmentType)}
                className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer text-xs"
              >
                <option value="All Departments" className="dark:bg-slate-800">All Departments</option>
                <option value="R&D / Engineering" className="dark:bg-slate-800">R&D / Engineering</option>
                <option value="Sales & Marketing" className="dark:bg-slate-800">Sales & Marketing</option>
                <option value="General & Administrative" className="dark:bg-slate-800">General & Administrative</option>
                <option value="Customer Success & Ops" className="dark:bg-slate-800">Customer Success & Ops</option>
              </select>
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />

            {/* Currency Selector */}
            <div className="flex items-center gap-1.5 px-2 py-1 text-xs">
              <select
                id="currency-select"
                aria-label="Reporting Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyType)}
                className="bg-transparent font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer text-xs font-mono"
              >
                <option value="USD ($)" className="dark:bg-slate-800">USD ($)</option>
                <option value="EUR (€)" className="dark:bg-slate-800">EUR (€)</option>
                <option value="GBP (£)" className="dark:bg-slate-800">GBP (£)</option>
              </select>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2.5">

            {/* Historical Context Cache Pill (Defensibility Spotlight) */}
            <button
              id="btn-open-memory-cache"
              onClick={onOpenMemoryDrawer}
              className={`relative flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all border ${
                memoryEnabled
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shadow-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/50'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
              title="Historical Context Caching: Ingest prior period narratives to drive variance intelligence"
            >
              <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Memory Cache:</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-indigo-600 text-white">
                {activeMemoryCount}
              </span>
              {memoryEnabled && (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </button>

            {/* Ingestion Trigger */}
            <button
              id="btn-open-ingestion"
              onClick={onOpenIngestionModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Ingest TB</span>
            </button>

            {/* Export Trigger */}
            <button
              id="btn-open-export"
              onClick={onOpenExportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Export</span>
            </button>

            {/* AI Copilot Toggle */}
            <button
              id="btn-toggle-copilot"
              onClick={onOpenCopilot}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                isCopilotOpen
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20'
              }`}
            >
              <BotMessageSquare className="w-3.5 h-3.5" />
              <span className="hidden md:inline">FP&A Copilot</span>
            </button>

            {/* Dark / Light Mode */}
            <button
              id="btn-toggle-theme"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Pack Status Dropdown */}
            <div className="hidden sm:block">
              {getStatusBadge()}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
