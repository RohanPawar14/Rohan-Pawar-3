import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  FileText, 
  Database, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { IngestionValidationCheck } from '../types';
import { INITIAL_VALIDATION_CHECKS } from '../data/initialData';

interface DataIngestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIngestComplete: (datasetName: string) => void;
}

export const DataIngestionModal: React.FC<DataIngestionModalProps> = ({
  isOpen,
  onClose,
  onIngestComplete,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState<string>('NetSuite_TB_Q3_2026_Consolidated.csv');
  const [validationChecks, setValidationChecks] = useState<IngestionValidationCheck[]>(INITIAL_VALIDATION_CHECKS);
  const [hasCompleted, setHasCompleted] = useState(true);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  const simulationSteps = [
    'Parsing file header & computing SHA-256 integrity checksum...',
    'Resolving 1,420 ERP ledger accounts against SaaS COA taxonomy...',
    'Performing multi-currency spot FX conversion & intercompany netting...',
    'Executing GAAP general ledger balance test (Debits == Credits)...',
    'Reconciling Retained Earnings rollforward and balance sheet tie-out...',
  ];

  const runIngestionSimulation = (datasetName: string) => {
    setSelectedPreset(datasetName);
    setIsProcessing(true);
    setHasCompleted(false);
    setCurrentStep(0);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= simulationSteps.length - 1) {
          clearInterval(stepInterval);
          setIsProcessing(false);
          setHasCompleted(true);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
  };

  const handleApply = () => {
    onIngestComplete(selectedPreset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-all">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Trial Balance & GL Ingestion Pipeline
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Automated multi-stage validation, COA harmonization, and zero-variance tie-out checks.
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">

          {/* Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Select Sample ERP Trial Balance Source:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => runIngestionSimulation('NetSuite_TB_Q3_2026_Consolidated.csv')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPreset === 'NetSuite_TB_Q3_2026_Consolidated.csv'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
                  NetSuite Q3 Consolidated
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  1,420 accounts • $168.5M debits
                </div>
              </button>

              <button
                type="button"
                onClick={() => runIngestionSimulation('SAP_S4HANA_Global_Q3_TB.csv')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPreset === 'SAP_S4HANA_Global_Q3_TB.csv'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  SAP S/4HANA Global TB
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Multi-entity • EUR/GBP FX normalized
                </div>
              </button>

              <button
                type="button"
                onClick={() => runIngestionSimulation('Workday_Adaptive_Q3_TB.csv')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedPreset === 'Workday_Adaptive_Q3_TB.csv'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  Workday Adaptive TB
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Direct GL export with department tags
                </div>
              </button>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files[0];
              if (file) {
                runIngestionSimulation(file.name);
              }
            }}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              dragActive
                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-900/40'
            }`}
          >
            <UploadCloud className="w-10 h-10 text-indigo-500 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Drag & Drop Trial Balance (.csv, .xlsx, .txt)
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Supports standard ERP ledger formats (NetSuite, SAP, Oracle, Workday, QuickBooks, Xero)
            </p>
            <div className="mt-3">
              <label
                htmlFor="file-upload"
                className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-2xs"
              >
                Browse Computer
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) runIngestionSimulation(file.name);
                }}
              />
            </div>
          </div>

          {/* Processing / Progress State */}
          {isProcessing && (
            <div className="p-5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 space-y-3 animate-fadeIn">
              <div className="flex items-center justify-between text-xs font-semibold text-indigo-950 dark:text-indigo-200">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  Running Ingestion Pipeline: Phase {currentStep + 1} of 5
                </span>
                <span>{Math.round(((currentStep + 1) / 5) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-indigo-200 dark:bg-indigo-900 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
                />
              </div>
              <p className="text-xs font-mono text-indigo-700 dark:text-indigo-300">
                &gt; {simulationSteps[currentStep]}
              </p>
            </div>
          )}

          {/* Validation Checklist Engine */}
          {hasCompleted && !isProcessing && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Automated Audit Validation Engine (5/5 Checks Passed)
                </h3>
                <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Zero Discrepancies
                </span>
              </div>

              <div className="space-y-2">
                {validationChecks.map((check) => (
                  <div
                    key={check.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {check.name}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                          {check.details}
                        </div>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 shrink-0 bg-white dark:bg-slate-900 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                      {check.metric}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Source: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{selectedPreset}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              id="btn-apply-ingested-tb"
              onClick={handleApply}
              disabled={isProcessing}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>Apply to Financial Pack</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
