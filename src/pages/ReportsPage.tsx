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
  } | null>({
    title: 'Monthly Executive Business Report',
    generatedAt: new Date().toISOString(),
    content: `### Executive Performance Overview\n\nFor the active billing period, **Nexora Labs** delivered top-line revenue of **$24,850.00** across **48 fulfilled customer orders**, representing an **18.4% increase** over the preceding month ($20,975.00).\n\n### Core Department Findings\n* **Commercial Sales**: Nexora Edge Hub Pro (SKU: NXR-E100) led product revenue at $8,982.00.\n* **Accounts Receivable**: 7 invoices ($8,420.00) exceed standard Net 30 terms.\n* **Inventory Operations**: 5 products flagged below critical safety threshold, notably Quantum Core IoT Sensor Nodes (6 remaining).\n* **CRM & Retention**: 105 total active business accounts, with 18 accounts identified as dormant (>60 days).\n\n### Strategic Action Items\n1. Authorize supplier intake for high-turnover IoT nodes.\n2. Dispatch automated Net 30 statement reminders to overdue client accounts.\n3. Execute targeted VIP reactivation campaign with 10% catalog discount.`,
    source: 'gemini-3.8-flash'
  });
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
      {generatedReport && (
        <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                Nexora Verified Audit Document · {activeBusiness?.name || 'Nexora Labs'}
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
      )}
    </div>
  );
}
