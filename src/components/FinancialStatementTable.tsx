import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Edit3, 
  Check, 
  RotateCw, 
  BrainCircuit, 
  SlidersHorizontal,
  Info,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { LineItem, HistoricalMemoryNode, CurrencyType, TonePreference, PeriodType, EntityType, DepartmentType } from '../types';
import { formatCurrency, formatVariance, formatPercent } from '../utils/financialUtils';

interface FinancialStatementTableProps {
  title: string;
  statementType: 'pnl' | 'balance_sheet' | 'cash_flow';
  items: LineItem[];
  currency: CurrencyType;
  period: PeriodType;
  entity: EntityType;
  department: DepartmentType;
  memoryNodes: HistoricalMemoryNode[];
  memoryEnabled: boolean;
  onUpdateCommentary: (itemId: string, newText: string, driver?: string) => void;
  onOpenMemoryDrawer: () => void;
  onSelectCitation?: (citationId: string) => void;
}

export const FinancialStatementTable: React.FC<FinancialStatementTableProps> = ({
  title,
  statementType,
  items,
  currency,
  period,
  entity,
  department,
  memoryNodes,
  memoryEnabled,
  onUpdateCommentary,
  onOpenMemoryDrawer,
}) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({
    'pnl-1': true,
    'pnl-2': true,
    'pnl-4': true,
    'bs-1': true,
    'bs-2': true,
    'bs-4': true,
    'bs-5': true,
    'bs-6': true,
    'cf-1': true,
    'cf-2': true,
    'cf-3': true,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<TonePreference>('board_level');
  const [varianceThreshold, setVarianceThreshold] = useState<number>(0); // in $k or % filter
  const [onlyShowWithVariances, setOnlyShowWithVariances] = useState<boolean>(false);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStartEdit = (item: LineItem) => {
    setEditingId(item.id);
    setEditText(item.commentary || '');
  };

  const handleSaveEdit = (itemId: string) => {
    onUpdateCommentary(itemId, editText);
    setEditingId(null);
  };

  const handleRegenerateCommentary = async (item: LineItem) => {
    setGeneratingId(item.id);
    try {
      const response = await fetch('/api/ai/variance-commentary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item,
          period,
          entity,
          department,
          memoryNodes: memoryNodes.filter((n) => n.isCached),
          tone: selectedTone,
          applyMemory: memoryEnabled,
        }),
      });
      const data = await response.json();
      if (data.commentary) {
        onUpdateCommentary(item.id, data.commentary, data.varianceDriver);
      }
    } catch (err) {
      console.error('Error regenerating commentary:', err);
    } finally {
      setGeneratingId(null);
    }
  };

  const renderTrafficLight = (item: LineItem) => {
    const isCost = ['cogs', 'opex', 'cash_out'].includes(item.accountType);
    const variance = item.variance;
    const isFavorable = isCost ? variance > 0 : variance > 0;
    const absPct = Math.abs(item.variancePct);

    if (absPct < 2.0 || variance === 0) {
      return (
        <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600 inline-block" title="Within normal ±2% budget tolerance" />
      );
    }
    if (isFavorable) {
      return (
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50 inline-block" title="Favorable variance" />
      );
    }
    if (absPct > 10) {
      return (
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50 inline-block" title="Material unfavorable variance (>10%)" />
      );
    }
    return (
      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs shadow-amber-500/50 inline-block" title="Moderate unfavorable variance" />
    );
  };

  const renderRow = (item: LineItem, isChild: boolean = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedRows[item.id];
    const { text: varText, isFavorable, isNeutral } = formatVariance(item.variance, item.accountType, currency);
    const isGenerating = generatingId === item.id;
    const isEditing = editingId === item.id;

    // Filter check
    if (onlyShowWithVariances && Math.abs(item.variance) < varianceThreshold) {
      return null;
    }

    return (
      <React.Fragment key={item.id}>
        <tr
          className={`border-b transition-colors ${
            item.isTotal
              ? 'bg-slate-100/90 dark:bg-slate-800/90 font-bold border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white'
              : item.isSubtotal
              ? 'bg-slate-50/70 dark:bg-slate-800/50 font-semibold border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100'
              : isChild
              ? 'bg-white/60 dark:bg-slate-900/60 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-300'
              : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
          }`}
        >
          {/* Status Traffic light */}
          <td className="py-2.5 pl-4 pr-1 text-center w-8">
            {!item.isHeader && renderTrafficLight(item)}
          </td>

          {/* Account Code & Description */}
          <td className="py-2.5 px-3">
            <div className="flex items-center gap-1.5" style={{ paddingLeft: `${(item.indent || 0) * 16}px` }}>
              {hasChildren ? (
                <button
                  onClick={() => toggleRow(item.id)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
                  aria-label="Toggle row details"
                >
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              ) : (
                <span className="w-5" />
              )}
              
              <span className="font-mono text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                {item.code}
              </span>
              <span className={`text-xs ${item.isTotal ? 'font-bold' : item.isSubtotal ? 'font-semibold' : 'font-normal'}`}>
                {item.name}
              </span>
              
              {item.varianceDriver && (
                <span className="hidden xl:inline-flex text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-medium ml-1.5">
                  {item.varianceDriver}
                </span>
              )}
            </div>
          </td>

          {/* Actual ($k) */}
          <td className="py-2.5 px-3 text-right font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
            {formatCurrency(item.actual, currency)}
          </td>

          {/* Budget ($k) */}
          <td className="py-2.5 px-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400">
            {formatCurrency(item.budget, currency)}
          </td>

          {/* Prior Period ($k) */}
          <td className="py-2.5 px-3 text-right font-mono text-xs text-slate-500 dark:text-slate-400 hidden md:table-cell">
            {formatCurrency(item.priorPeriod, currency)}
          </td>

          {/* $ Variance */}
          <td className="py-2.5 px-3 text-right font-mono text-xs font-semibold">
            <span
              className={
                isNeutral
                  ? 'text-slate-500'
                  : isFavorable
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }
            >
              {varText}
            </span>
          </td>

          {/* % Variance */}
          <td className="py-2.5 px-3 text-right font-mono text-xs font-medium">
            <span
              className={
                isNeutral
                  ? 'text-slate-500'
                  : isFavorable
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }
            >
              {formatPercent(item.variancePct)}
            </span>
          </td>

          {/* AI Variance Commentary & Historical Citations */}
          <td className="py-2.5 px-3 text-left">
            {isEditing ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full text-xs p-1.5 rounded bg-white dark:bg-slate-900 border border-indigo-500 text-slate-900 dark:text-white"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(item.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
                <button
                  onClick={() => handleSaveEdit(item.id)}
                  className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                  title="Save edit"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="group flex items-center justify-between gap-2">
                <div className="text-xs text-slate-600 dark:text-slate-300 leading-normal line-clamp-2">
                  <span>{item.commentary}</span>
                  
                  {/* Historical Memory Badges */}
                  {memoryEnabled && item.historicalCitations && item.historicalCitations.length > 0 && (
                    <span className="inline-flex items-center gap-1 ml-1.5">
                      {item.historicalCitations.map((citId) => {
                        const matched = memoryNodes.find((m) => m.id === citId);
                        return (
                          <button
                            key={citId}
                            onClick={onOpenMemoryDrawer}
                            className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100"
                            title={`Historical Memory Anchor: ${matched?.title || citId}`}
                          >
                            <BrainCircuit className="w-2.5 h-2.5 text-indigo-500" />
                            <span>[{matched?.period || 'Prior Context'}]</span>
                          </button>
                        );
                      })}
                    </span>
                  )}
                </div>

                {/* Inline Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Edit commentary"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => handleRegenerateCommentary(item)}
                    disabled={isGenerating}
                    className="p-1 text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                    title="Regenerate commentary with Gemini & Historical Memory"
                  >
                    <RotateCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            )}
          </td>
        </tr>

        {/* Recursive Children Rows */}
        {hasChildren && isExpanded && item.children!.map((child) => renderRow(child, true))}
      </React.Fragment>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Table Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
              ({period} • {entity} • in $000s)
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap text-xs">
          
          {/* Tone Selector */}
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="font-semibold text-[11px] text-slate-500">AI Tone:</span>
            <select
              aria-label="AI Commentary Tone"
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value as TonePreference)}
              className="text-xs py-1 px-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="board_level">Board Level (Concise)</option>
              <option value="cfo_detailed">CFO Analytical</option>
              <option value="auditor_defensive">Auditor GAAP Defensive</option>
            </select>
          </div>

          {/* Variance Filter Checkbox */}
          <label className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 cursor-pointer font-medium">
            <input
              type="checkbox"
              checked={onlyShowWithVariances}
              onChange={(e) => setOnlyShowWithVariances(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
            />
            <span>Filter Material Variances</span>
          </label>

          {/* Memory Status Pill */}
          <button
            onClick={onOpenMemoryDrawer}
            className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
          >
            <BrainCircuit className="w-3 h-3 text-indigo-500" />
            <span>{memoryEnabled ? 'Memory Context Injected' : 'Memory Disabled'}</span>
          </button>
        </div>
      </div>

      {/* Main Statement Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 pl-4 pr-1 w-8 text-center">Status</th>
                <th className="py-3 px-3 min-w-[260px]">Account & Description</th>
                <th className="py-3 px-3 text-right w-28">Actual</th>
                <th className="py-3 px-3 text-right w-28">Budget</th>
                <th className="py-3 px-3 text-right w-28 hidden md:table-cell">Prior</th>
                <th className="py-3 px-3 text-right w-28">$ Variance</th>
                <th className="py-3 px-3 text-right w-24">% Change</th>
                <th className="py-3 px-3 min-w-[340px]">Variance Driver & Historical Commentary</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => renderRow(item))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table Footer Notes */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Favorable
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> &lt;10% Variance
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> &gt;10% Material Unfavorable
          </span>
        </div>
        <span>GAAP / IFRS Reporting Framework Compliant</span>
      </div>

    </div>
  );
};
