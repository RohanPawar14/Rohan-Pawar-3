import React, { useState } from 'react';
import { 
  X, 
  BrainCircuit, 
  Sparkles, 
  Plus, 
  Tag, 
  Calendar, 
  Layers, 
  Trash2, 
  CheckCircle2, 
  Search, 
  ArrowRight,
  TrendingUp,
  FileText,
  Lightbulb,
  Cpu,
  RefreshCw,
  Sliders
} from 'lucide-react';
import { HistoricalMemoryNode } from '../types';

interface HistoricalMemoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  memoryNodes: HistoricalMemoryNode[];
  onAddMemoryNode: (node: HistoricalMemoryNode) => void;
  onDeleteMemoryNode: (id: string) => void;
  onToggleNodeCache: (id: string) => void;
  memoryEnabled: boolean;
  onToggleMemoryEnabled: (enabled: boolean) => void;
  onSelectAccountFilter?: (account: string) => void;
}

export const HistoricalMemoryDrawer: React.FC<HistoricalMemoryDrawerProps> = ({
  isOpen,
  onClose,
  memoryNodes,
  onAddMemoryNode,
  onDeleteMemoryNode,
  onToggleNodeCache,
  memoryEnabled,
  onToggleMemoryEnabled,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isParsing, setIsParsing] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPeriod, setNewPeriod] = useState('Q2 2026');
  const [newCategory, setNewCategory] = useState<HistoricalMemoryNode['category']>('Cloud Infra');
  const [newNarrative, setNewNarrative] = useState('');
  const [newImpact, setNewImpact] = useState('+$150k timing impact');
  const [newAccounts, setNewAccounts] = useState('Hosting & Cloud Infrastructure, R&D');
  const [newTags, setNewTags] = useState('Cost-Optimization, Prior-Quarter');

  if (!isOpen) return null;

  const categories = ['All', 'Headcount', 'Cloud Infra', 'Revenue Recognition', 'Vendor Contracts', 'FX & Macro', 'M&A & Restructuring'];

  const filteredNodes = memoryNodes.filter((node) => {
    const matchesCategory = selectedCategory === 'All' || node.category === selectedCategory;
    const matchesSearch = 
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.narrativeText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.appliesToAccounts.some(acc => acc.toLowerCase().includes(searchQuery.toLowerCase())) ||
      node.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleParseWithAI = async () => {
    if (!newNarrative.trim()) return;
    setIsParsing(true);
    try {
      const response = await fetch('/api/ai/parse-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: newNarrative, period: newPeriod }),
      });
      const data = await response.json();
      if (data.memoryNode) {
        setNewTitle(data.memoryNode.title || newTitle);
        setNewCategory(data.memoryNode.category || newCategory);
        setNewImpact(data.memoryNode.impactEstimate || newImpact);
        if (data.memoryNode.appliesToAccounts) {
          setNewAccounts(data.memoryNode.appliesToAccounts.join(', '));
        }
        if (data.memoryNode.tags) {
          setNewTags(data.memoryNode.tags.join(', '));
        }
      }
    } catch (err) {
      console.error('Error parsing narrative:', err);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSaveNode = () => {
    if (!newTitle.trim() || !newNarrative.trim()) return;
    const node: HistoricalMemoryNode = {
      id: `mem-${Date.now()}`,
      period: newPeriod,
      title: newTitle,
      category: newCategory,
      narrativeText: newNarrative,
      impactEstimate: newImpact,
      appliesToAccounts: newAccounts.split(',').map((s) => s.trim()).filter(Boolean),
      tags: newTags.split(',').map((s) => s.trim()).filter(Boolean),
      timestamp: new Date().toISOString(),
      isCached: true,
      author: 'FP&A Analyst',
    };
    onAddMemoryNode(node);
    setIsAddingNew(false);
    // Reset Form
    setNewTitle('');
    setNewNarrative('');
  };

  const loadPresetNarrative = (type: string) => {
    setIsAddingNew(true);
    if (type === 'hiring_freeze') {
      setNewPeriod('Q1-Q2 2026');
      setNewTitle('Engineering Hiring Pause & Requisition Lag');
      setNewCategory('Headcount');
      setNewNarrative('Instituted a temporary 60-day freeze on senior R&D roles in May, resulting in 14 open requisitions pushing compensation expenses out to Q4.');
      setNewImpact('+$340k OPEX timing favorability');
      setNewAccounts('Research & Development, Salaries & Benefits, Engineering Payroll');
      setNewTags('Hiring, Headcount, Timing');
    } else if (type === 'aws_savings') {
      setNewPeriod('Q2 2026');
      setNewTitle('AWS 3-Year Enterprise Discount Program (EDP)');
      setNewCategory('Cloud Infra');
      setNewNarrative('Committed to 3-year EDP with AWS delivering 18% tier discount and $180k quarterly compute credit rebates.');
      setNewImpact('+$180k/qtr COGS savings');
      setNewAccounts('Hosting & Cloud Infrastructure, COGS, R&D Compute');
      setNewTags('AWS, Cloud, EDP, Infrastructure');
    } else if (type === 'event_timing') {
      setNewPeriod('Q1 2026');
      setNewTitle('SaaS Summit Annual Conference Q3 Pull-Forward');
      setNewCategory('Vendor Contracts');
      setNewNarrative('Shifted annual customer flagship conference from November to September, pulling forward $260k of event marketing expenses into Q3 actuals.');
      setNewImpact('-$260k S&M timing variance');
      setNewAccounts('Sales & Marketing, Events & Sponsorships');
      setNewTags('Marketing, Conference, Timing');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 transition-all">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Historical Context Caching Engine
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    Defensibility Core
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Maintains continuous AI memory of prior period decisions, contract restructuring, and operational timing drivers.
                </p>
              </div>
            </div>

            {/* Master Toggle Banner */}
            <div className="mt-4 flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${memoryEnabled ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse' : 'bg-slate-400'}`} />
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {memoryEnabled ? 'AI Memory Vector Cache: ACTIVE' : 'AI Memory Vector Cache: DISABLED'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {memoryNodes.filter(n => n.isCached).length} active context anchors currently informing variance calculations
                  </div>
                </div>
              </div>
              <button
                id="btn-toggle-memory-master"
                onClick={() => onToggleMemoryEnabled(!memoryEnabled)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  memoryEnabled 
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {memoryEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Quick Presets Bar */}
          {!isAddingNew && (
            <div className="bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-900/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Quick Ingest Prior Narratives:
                </span>
                <button
                  id="btn-add-custom-narrative"
                  onClick={() => setIsAddingNew(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" /> Custom Narrative
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => loadPresetNarrative('aws_savings')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors shadow-2xs"
                >
                  + AWS 3-Yr EDP Memo (Q2)
                </button>
                <button
                  onClick={() => loadPresetNarrative('hiring_freeze')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors shadow-2xs"
                >
                  + R&D Hiring Pause (Q1)
                </button>
                <button
                  onClick={() => loadPresetNarrative('event_timing')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 transition-colors shadow-2xs"
                >
                  + SaaS Summit Timing (Q1)
                </button>
              </div>
            </div>
          )}

          {/* Add New Narrative Form */}
          {isAddingNew && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-500/30 shadow-lg space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Ingest Prior Period Operational Narrative
                </h3>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Origin Period
                  </label>
                  <select
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="Q2 2026">Q2 2026</option>
                    <option value="Q1 2026">Q1 2026</option>
                    <option value="FY25 Annual Close">FY25 Annual Close</option>
                    <option value="Prior Month Memo">Prior Month Memo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Driver Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                  >
                    <option value="Cloud Infra">Cloud Infra</option>
                    <option value="Headcount">Headcount</option>
                    <option value="Revenue Recognition">Revenue Recognition</option>
                    <option value="Vendor Contracts">Vendor Contracts</option>
                    <option value="FX & Macro">FX & Macro</option>
                    <option value="M&A & Restructuring">M&A & Restructuring</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Title / Narrative Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. AWS 3-Year Enterprise Discount Program"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Unstructured Narrative / Memo Excerpt
                  </label>
                  <button
                    type="button"
                    onClick={handleParseWithAI}
                    disabled={isParsing || !newNarrative.trim()}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 disabled:opacity-50"
                  >
                    <Sparkles className={`w-3 h-3 ${isParsing ? 'animate-spin' : ''}`} />
                    {isParsing ? 'Extracting with Gemini...' : 'Auto-Extract Entities'}
                  </button>
                </div>
                <textarea
                  rows={3}
                  placeholder="Paste raw board minutes, CFO memo, or contract details here..."
                  value={newNarrative}
                  onChange={(e) => setNewNarrative(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-normal leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Quantified Impact Estimate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +$180k/qtr OPEX savings"
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Target Accounts / Cost Centers
                  </label>
                  <input
                    type="text"
                    placeholder="Hosting & Cloud, R&D"
                    value={newAccounts}
                    onChange={(e) => setNewAccounts(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-memory-node"
                  type="button"
                  onClick={handleSaveNode}
                  disabled={!newTitle.trim() || !newNarrative.trim()}
                  className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50"
                >
                  Index into Memory Cache
                </button>
              </div>
            </div>
          )}

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search cached narratives, accounts, or drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Memory Nodes List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>Indexed Context Nodes ({filteredNodes.length})</span>
              <span>Vector Dimension: 1536</span>
            </div>

            {filteredNodes.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                <BrainCircuit className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No matching historical context</p>
                <p className="text-xs text-slate-400 mt-1">Try broadening your search or ingest a prior period memo above.</p>
              </div>
            ) : (
              filteredNodes.map((node) => (
                <div
                  key={node.id}
                  className={`p-4 rounded-xl border transition-all ${
                    node.isCached && memoryEnabled
                      ? 'bg-white dark:bg-slate-800/90 border-indigo-200 dark:border-indigo-900/60 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/50 dark:border-indigo-800/50">
                          {node.period}
                        </span>
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {node.category}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {node.impactEstimate}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                        {node.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => onToggleNodeCache(node.id)}
                        className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors ${
                          node.isCached
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                        }`}
                        title="Toggle memory injection for this node"
                      >
                        {node.isCached ? 'Active In Cache' : 'Bypassed'}
                      </button>
                      <button
                        onClick={() => onDeleteMemoryNode(node.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700"
                        title="Delete node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed bg-slate-50/80 dark:bg-slate-900/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                    "{node.narrativeText}"
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 flex-wrap gap-2">
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3 text-slate-400" />
                      <span>Applies to:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {node.appliesToAccounts.join(', ')}
                      </span>
                    </div>
                    {node.author && (
                      <span className="text-[10px] text-slate-400">
                        Logged by: {node.author}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span>Semantic Embeddings: gemini-embedding-2</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-lg hover:bg-slate-800"
          >
            Apply Context & Close
          </button>
        </div>

      </div>
    </div>
  );
};
