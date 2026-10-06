import React, { useState, useEffect } from 'react';
import {
  History,
  Shield,
  Search,
  Filter,
  CheckCircle,
  Clock,
  Terminal,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { AuditLog } from '../types/index.ts';

export function AuditPage() {
  const { activeBusiness } = useApp();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!activeBusiness) return;
    setLoading(true);
    api.audit.list(activeBusiness.id)
      .then(res => setLogs(res.logs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeBusiness?.id]);

  const filteredLogs = logs.filter(l =>
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    l.userName.toLowerCase().includes(search.toLowerCase()) ||
    l.details.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Security & Operation Audit Log</h1>
          <p className="text-xs text-slate-400">
            Immutable chronological record of logins, transactions, updates, and configuration mutations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Append-Only Audit Stream
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search action, operator, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="text-xs text-slate-400 font-mono hidden sm:block">
          Scope: {activeBusiness?.name || 'Workspace'}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Timestamp</th>
                <th className="p-3.5">Action Event</th>
                <th className="p-3.5">Actor & Role</th>
                <th className="p-3.5">Target Entity</th>
                <th className="p-3.5">Audit Event Details</th>
                <th className="p-3.5 pr-5">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 pl-5 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans">
                    <div className="font-semibold text-slate-200">{log.userName}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.userRole}</div>
                  </td>
                  <td className="p-3.5 text-slate-300 font-sans">{log.objectType}</td>
                  <td className="p-3.5 font-sans text-slate-300 max-w-sm leading-relaxed">{log.details}</td>
                  <td className="p-3.5 pr-5 text-slate-500">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
