import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  FileText, 
  Sparkles, 
  Database, 
  BrainCircuit, 
  Download,
  UserCheck
} from 'lucide-react';
import { AuditLogEntry, PeriodType, EntityType } from '../types';
import { INITIAL_AUDIT_TRAIL } from '../data/initialData';
import { downloadCSV } from '../utils/financialUtils';

interface AuditTrailViewProps {
  logs?: AuditLogEntry[];
  period: PeriodType;
  entity: EntityType;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  logs = INITIAL_AUDIT_TRAIL,
  period,
  entity,
}) => {
  const handleExportLogs = () => {
    const rows = [
      ['Timestamp', 'User / Subsystem', 'Action', 'Target Object', 'Category', 'Details'],
      ...logs.map((l) => [l.timestamp, l.user, l.action, l.target, l.badge, l.details]),
    ];
    downloadCSV(`AutoPack_Audit_Trail_${period.replace(/\s+/g, '_')}.csv`, rows);
  };

  const getBadgeStyle = (badge: AuditLogEntry['badge']) => {
    switch (badge) {
      case 'AI Update':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Approval':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'Cache Sync':
        return 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
      case 'Ingestion':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Governance & Audit Trail Compliance Log
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable lineage log of raw trial balance ingestions, historical memory injections, AI commentary generations, and executive sign-offs.
          </p>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 border border-slate-200 dark:border-slate-600 transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (.CSV)</span>
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Timestamp (UTC)</th>
              <th className="py-3 px-3">Actor / Subsystem</th>
              <th className="py-3 px-3">Action</th>
              <th className="py-3 px-3">Target Scope</th>
              <th className="py-3 px-3">Category</th>
              <th className="py-3 px-4">Audit Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                  {log.user}
                </td>
                <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {log.action}
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                  {log.target}
                </td>
                <td className="py-3 px-3">
                  <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getBadgeStyle(log.badge)}`}>
                    {log.badge}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                  {log.details}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
