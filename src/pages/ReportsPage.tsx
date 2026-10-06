import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Sparkles,
  Download,
  Copy,
  Printer,
  Calendar,
  Check,
  RefreshCw,
  FileText,
  TrendingUp,
  Boxes,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';

export function ReportsPage() {
  const { activeBusiness } = useApp();
  const [reportType, setReportType] = useState<'monthly' | 'weekly' | 'sales' | 'inventory' | 'customer'>('monthly');
  const [generatedReport, setGeneratedReport] = useState<{
    title: string;
    generatedAt: string;
    content: string;
    source: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerateReport = async () => {
    if (!activeBusiness) return;
    setLoading(true);
    try {
      const res = await api.ai.generateReport(reportType, activeBusiness.id);
      setGeneratedReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (generatedReport) {
      navigator.clipboard.writeText(generatedReport.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Executive Business Reports</h1>
          <p className="text-xs text-slate-400">
            Synthesized AI executive intelligence and departmental audit summaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Report Generator Controls */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'monthly', label: 'Monthly Summary' },
            { id: 'weekly', label: 'Weekly Flash' },
            { id: 'sales', label: 'Sales & Revenue' },
            { id: 'inventory', label: 'Inventory Audit' },
            { id: 'customer', label: 'Customer Cohort' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setReportType(type.id as any)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                reportType === type.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all shrink-0"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{loading ? 'Synthesizing with Gemini...' : 'Generate AI Report'}</span>
        </button>
      </div>

      {/* Report Sheet View */}
      {generatedReport ? (
        <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                Nexora Verified Audit Document · {activeBusiness?.name || 'Workspace'}
              </span>
              <h2 className="text-lg font-bold text-white mt-1">{generatedReport.title}</h2>
            </div>
            <div className="text-right text-[11px] text-slate-400 font-mono">
              <div>Generated: {new Date(generatedReport.generatedAt).toLocaleString()}</div>
              <div className="text-indigo-400">Engine: {generatedReport.source}</div>
            </div>
          </div>

          <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap">
            {generatedReport.content}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Confidential Executive Document · Not for unauthorized public distribution</span>
            <span className="font-mono">Document ID: NXR-REP-{Date.now().toString().slice(-6)}</span>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-500 text-xs">
          Select a report type above and click "Generate AI Report" to synthesize executive intelligence from your live database.
        </div>
      )}
    </div>
  );
}
