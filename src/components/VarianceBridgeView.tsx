import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BrainCircuit, 
  Layers, 
  Sliders, 
  Filter,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { VarianceBridgeItem, HistoricalMemoryNode, CurrencyType, PeriodType, EntityType } from '../types';
import { INITIAL_EBITDA_BRIDGE } from '../data/initialData';
import { formatCurrency } from '../utils/financialUtils';

interface VarianceBridgeViewProps {
  period: PeriodType;
  entity: EntityType;
  currency: CurrencyType;
  memoryNodes: HistoricalMemoryNode[];
  onOpenMemoryDrawer: () => void;
}

export const VarianceBridgeView: React.FC<VarianceBridgeViewProps> = ({
  period,
  entity,
  currency,
  memoryNodes,
  onOpenMemoryDrawer,
}) => {
  const [items, setItems] = useState<VarianceBridgeItem[]>(INITIAL_EBITDA_BRIDGE);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  const totalPositive = items.filter(i => i.type === 'positive').reduce((sum, i) => sum + i.amount, 0);
  const totalNegative = items.filter(i => i.type === 'negative').reduce((sum, i) => sum + Math.abs(i.amount), 0);
  const netVariance = totalPositive - totalNegative;

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            EBITDA Variance Bridge & Structural Walkthrough
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Reconciliation from Plan EBITDA of {formatCurrency(5170, currency)} to Actual EBITDA of {formatCurrency(6820, currency)} (+{formatCurrency(netVariance, currency)} favorable).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] font-semibold text-slate-400 uppercase">Net Favorable Walk</div>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(netVariance, currency)} (+31.9%)
            </div>
          </div>
          <button
            onClick={onOpenMemoryDrawer}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100"
          >
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <span>5 Memory Anchors</span>
          </button>
        </div>
      </div>

      {/* Variance Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500">Gross Favorable Drivers</div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
            +{formatCurrency(totalPositive, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Revenue uplift ($1.25M) + R&D lag ($340k) + Cloud EDP ($240k)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500">Gross Unfavorable Drivers</div>
          <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-1">
            -{formatCurrency(totalNegative, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Event pull-forward ($260k) + Sales commission accelerators ($230k)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
          <div className="text-xs text-slate-500">Operating Flow-Through Rate</div>
          <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">
            132.0%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            High operating leverage exceeding 100% target baseline
          </div>
        </div>
      </div>

      {/* Interactive Waterfall Walk Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Step-by-Step Bridge Analysis
          </h3>
          <span className="text-xs text-slate-400">
            Click any row to inspect historical context driver
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map((item, index) => {
            const isBase = item.type === 'base' || item.type === 'total';
            const isPos = item.type === 'positive';
            const isNeg = item.type === 'negative';
            const matchedMemory = item.historicalRef ? memoryNodes.find(m => m.id === item.historicalRef) : null;

            return (
              <div
                key={index}
                onClick={() => setSelectedDriver(selectedDriver === item.name ? null : item.name)}
                className={`p-4 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  selectedDriver === item.name
                    ? 'bg-indigo-50/60 dark:bg-indigo-950/40'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {item.name}
                    </span>
                    {matchedMemory && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        <BrainCircuit className="w-2.5 h-2.5 text-indigo-500" />
                        Memory: {matchedMemory.period}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-48 hidden md:block bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isBase ? 'bg-slate-700 dark:bg-slate-300' : isPos ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(15, (Math.abs(item.amount) / 6820) * 100))}%` }}
                    />
                  </div>

                  <div className="text-right font-mono font-bold text-xs min-w-[80px]">
                    <span
                      className={
                        isBase
                          ? 'text-slate-900 dark:text-white'
                          : isPos
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }
                    >
                      {isPos ? `+${formatCurrency(item.amount, currency)}` : isNeg ? `-${formatCurrency(Math.abs(item.amount), currency)}` : formatCurrency(item.amount, currency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
