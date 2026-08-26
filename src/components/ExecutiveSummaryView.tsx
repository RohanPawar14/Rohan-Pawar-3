import React, { useState } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  ShieldCheck, 
  BrainCircuit, 
  Edit3, 
  Check, 
  FileText,
  DollarSign,
  PieChart,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  UserCheck
} from 'lucide-react';
import { ExecutiveSummaryData, HistoricalMemoryNode, PeriodType, EntityType, CurrencyType, VarianceBridgeItem } from '../types';
import { INITIAL_EBITDA_BRIDGE } from '../data/initialData';
import { formatCurrency } from '../utils/financialUtils';

interface ExecutiveSummaryViewProps {
  summaryData: ExecutiveSummaryData;
  onUpdateSummary: (data: Partial<ExecutiveSummaryData>) => void;
  period: PeriodType;
  entity: EntityType;
  currency: CurrencyType;
  memoryNodes: HistoricalMemoryNode[];
  memoryEnabled: boolean;
  onOpenMemoryDrawer: () => void;
  onSelectTab: (tab: any) => void;
}

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({
  summaryData,
  onUpdateSummary,
  period,
  entity,
  currency,
  memoryNodes,
  memoryEnabled,
  onOpenMemoryDrawer,
  onSelectTab,
}) => {
  const [isEditingOverview, setIsEditingOverview] = useState(false);
  const [overviewText, setOverviewText] = useState(summaryData.executiveOverview);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bridgeItems, setBridgeItems] = useState<VarianceBridgeItem[]>(INITIAL_EBITDA_BRIDGE);

  const handleSaveOverview = () => {
    onUpdateSummary({ executiveOverview: overviewText });
    setIsEditingOverview(false);
  };

  const handleRegenerateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period,
          entity,
          summaryMetrics: {
            revenueActual: 32450,
            revenueBudget: 31200,
            gpActual: 24080,
            gpBudget: 22650,
            grossMarginPct: 74.2,
            opexActual: 17260,
            opexBudget: 17480,
            ebitdaActual: 6820,
            ebitdaBudget: 5170,
            fcfActual: 5300,
          },
          memoryNodes: memoryNodes.filter((n) => n.isCached),
          applyMemory: memoryEnabled,
        }),
      });
      const data = await response.json();
      if (data.executiveOverview) {
        onUpdateSummary({
          executiveOverview: data.executiveOverview,
          keyHeadwinds: data.keyHeadwinds || summaryData.keyHeadwinds,
          keyTailwinds: data.keyTailwinds || summaryData.keyTailwinds,
          cfoRecommendations: data.cfoRecommendations || summaryData.cfoRecommendations,
        });
        setOverviewText(data.executiveOverview);
      }
    } catch (err) {
      console.error('Error generating summary:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSignOff = (role: 'cfo' | 'controller') => {
    if (role === 'cfo') {
      onUpdateSummary({
        signOffStatus: {
          ...summaryData.signOffStatus,
          cfoSigned: !summaryData.signOffStatus.cfoSigned,
          signedDate: new Date().toISOString(),
        },
      });
    } else {
      onUpdateSummary({
        signOffStatus: {
          ...summaryData.signOffStatus,
          controllerSigned: !summaryData.signOffStatus.controllerSigned,
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Executive KPI Scorecard Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Revenue */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Total Revenue</span>
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +4.0% vs Plan
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
            {formatCurrency(32450, currency)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Budget: {formatCurrency(31200, currency)}</span>
            <span className="text-slate-400">YoY: +15.5%</span>
          </div>
        </div>

        {/* Gross Margin */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Gross Margin</span>
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +160 bps
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
            74.2%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Budget: 72.6%</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">AWS EDP Impact</span>
          </div>
        </div>

        {/* Adjusted EBITDA */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Adjusted EBITDA</span>
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +31.9%
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
            {formatCurrency(6820, currency)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Margin: 21.0%</span>
            <span>Flow-Through: 132%</span>
          </div>
        </div>

        {/* Free Cash Flow & Ending Cash */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Ending Cash & FCF</span>
            <span className="inline-flex items-center text-emerald-600 dark:text-emerald-400 font-semibold gap-0.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 18.4 Mo Runway
            </span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1 font-mono">
            {formatCurrency(42150, currency)}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
            <span>Q3 FCF: +{formatCurrency(5300, currency)}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Tied Out</span>
          </div>
        </div>

      </div>

      {/* Main Narrative Card: Executive Overview with Memory Context */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Executive CFO Commentary & Board Pack Narrative
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Synthesized across all financial statements using active historical context vectors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isEditingOverview ? (
              <button
                onClick={handleSaveOverview}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" /> Save Narrative
              </button>
            ) : (
              <button
                onClick={() => setIsEditingOverview(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit Narrative
              </button>
            )}

            <button
              id="btn-regenerate-exec-summary"
              onClick={handleRegenerateSummary}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Regenerate with AI'}</span>
            </button>
          </div>
        </div>

        {/* Narrative Box */}
        {isEditingOverview ? (
          <textarea
            rows={8}
            value={overviewText}
            onChange={(e) => setOverviewText(e.target.value)}
            className="w-full text-xs p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-indigo-500 text-slate-900 dark:text-white leading-relaxed font-normal"
          />
        ) : (
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed space-y-3 whitespace-pre-line">
            {summaryData.executiveOverview}
          </div>
        )}

        {/* Historical Context Notice Pill */}
        <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300">
            <BrainCircuit className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>
              Memory Context Active: Injected <strong>{memoryNodes.filter(n => n.isCached).length} prior period context nodes</strong> (AWS EDP, R&D Hiring Lag, SaaS Summit Timing).
            </span>
          </div>
          <button
            onClick={onOpenMemoryDrawer}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
          >
            Inspect Vectors &rarr;
          </button>
        </div>
      </div>

      {/* EBITDA Variance Waterfall Bridge */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Adjusted EBITDA Variance Bridge (Plan vs Actual: +$1.65M)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct waterfall walkthrough of revenue uplift, cloud EDP rebates, and operational timing drivers
            </p>
          </div>
          <button
            onClick={() => onSelectTab('variance_bridge')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Full Waterfall View &rarr;
          </button>
        </div>

        {/* Visual Waterfall Bars */}
        <div className="space-y-2.5 pt-2">
          {bridgeItems.map((b, idx) => {
            const isBase = b.type === 'base' || b.type === 'total';
            const isPos = b.amount > 0 && !isBase;
            const isNeg = b.amount < 0 && !isBase;

            return (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <div className="w-56 truncate font-medium text-slate-800 dark:text-slate-200">
                  {b.name}
                </div>
                
                {/* Horizontal Bar Graphic */}
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-lg h-6 overflow-hidden flex items-center px-2 relative">
                  <div
                    className={`h-4 rounded-md transition-all ${
                      isBase
                        ? 'bg-slate-700 dark:bg-slate-300'
                        : isPos
                        ? 'bg-emerald-500'
                        : 'bg-rose-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(10, (Math.abs(b.amount) / 6820) * 100))}%`,
                    }}
                  />
                  <span className="absolute right-3 text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300">
                    {b.description}
                  </span>
                </div>

                <div className="w-24 text-right font-mono font-bold text-slate-900 dark:text-white">
                  {isPos ? `+${formatCurrency(b.amount, currency)}` : isNeg ? `-${formatCurrency(Math.abs(b.amount), currency)}` : formatCurrency(b.amount, currency)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Headwinds & Tailwinds Dual Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Tailwinds Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-emerald-200 dark:border-emerald-950/60 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>Key Tailwinds & Structural Levers</span>
          </div>
          <ul className="space-y-2">
            {summaryData.keyTailwinds.map((tw, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>{tw}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Headwinds Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/90 border border-amber-200 dark:border-amber-950/60 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
            <TrendingDown className="w-4 h-4" />
            <span>Operational Headwinds & Friction</span>
          </div>
          <ul className="space-y-2">
            {summaryData.keyHeadwinds.map((hw, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{hw}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* CFO Recommendations & Board Sign-off */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          FP&A Leadership Recommendations & Sign-Off Block
        </h3>

        <div className="space-y-2">
          {summaryData.cfoRecommendations.map((rec, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">0{idx + 1}.</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>

        {/* Sign-off Stamped Badges */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase text-slate-400">
                Chief Financial Officer Sign-Off
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {summaryData.signOffStatus.cfoName}
              </div>
              <div className="text-[10px] text-slate-500">
                Status: {summaryData.signOffStatus.cfoSigned ? 'Digitally Signed & Certified' : 'Pending CFO Review'}
              </div>
            </div>
            <button
              onClick={() => toggleSignOff('cfo')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                summaryData.signOffStatus.cfoSigned
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{summaryData.signOffStatus.cfoSigned ? 'Signed' : 'Sign Off'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold uppercase text-slate-400">
                VP & Corporate Controller Tie-Out
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {summaryData.signOffStatus.controllerName}
              </div>
              <div className="text-[10px] text-slate-500">
                Status: {summaryData.signOffStatus.controllerSigned ? 'Tied Out to General Ledger' : 'Pending Controller Sign-off'}
              </div>
            </div>
            <button
              onClick={() => toggleSignOff('controller')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                summaryData.signOffStatus.controllerSigned
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{summaryData.signOffStatus.controllerSigned ? 'Certified' : 'Certify'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
