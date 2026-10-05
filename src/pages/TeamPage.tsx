import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Plus,
  Mail,
  UserCheck,
  Check,
  X,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { UserRole } from '../types/index.ts';

export function TeamPage() {
  const { activeBusiness } = useApp();
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'manager' as UserRole,
    title: 'Operations Manager'
  });

  const loadTeam = () => {
    if (!activeBusiness) return;
    setLoading(true);
    api.team.list(activeBusiness.id)
      .then(res => setMembers(res.members))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTeam();
  }, [activeBusiness?.id]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness || !inviteForm.email) return;

    try {
      const added = await api.team.invite(activeBusiness.id, inviteForm);
      setMembers(prev => [...prev, added]);
      setIsInviteOpen(false);
      setInviteForm({
        name: '',
        email: '',
        role: 'manager',
        title: 'Operations Manager'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20">Owner</span>;
      case 'manager':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20">Manager</span>;
      case 'accountant':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">Accountant</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded uppercase font-medium text-slate-400 bg-slate-800 border border-slate-700">Employee</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Team Members & Access Control</h1>
          <p className="text-xs text-slate-400">
            Role-Based Access Control (RBAC) governance for {members.length} active workspace operators
          </p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Invite Member</span>
        </button>
      </div>

      {/* Team table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Member Name</th>
                <th className="p-3.5">Email Address</th>
                <th className="p-3.5">Designation</th>
                <th className="p-3.5">Assigned Role</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5">Member Since</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 pl-5 font-semibold text-slate-200">{m.name}</td>
                  <td className="p-3.5 font-mono text-slate-400">{m.email}</td>
                  <td className="p-3.5 text-slate-300">{m.title || 'Specialist'}</td>
                  <td className="p-3.5">{getRoleBadge(m.role)}</td>
                  <td className="p-3.5">
                    <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 font-mono text-slate-500 text-[11px]">
                    {new Date(m.joinedAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Permission Matrix Section */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-1">Role-Based Access Control (RBAC) Governance Matrix</h3>
        <p className="text-xs text-slate-400 mb-6">Enforced object-level permission schemas across the application</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="py-2.5">Platform Module</th>
                <th className="py-2.5 text-center">Owner</th>
                <th className="py-2.5 text-center">Manager</th>
                <th className="py-2.5 text-center">Accountant</th>
                <th className="py-2.5 text-center">Employee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-center">
              <tr>
                <td className="py-3 text-left font-medium text-slate-200">Customer CRM & Contacts</td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><Check className="w-4 h-4 text-slate-500 mx-auto" /></td>
                <td><Check className="w-4 h-4 text-slate-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 text-left font-medium text-slate-200">Products & Inventory Control</td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><span className="text-slate-600 font-mono text-[10px]">Read-Only</span></td>
                <td><span className="text-slate-600 font-mono text-[10px]">Read-Only</span></td>
              </tr>
              <tr>
                <td className="py-3 text-left font-medium text-slate-200">Invoices, Billing & Payments</td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
              </tr>
              <tr>
                <td className="py-3 text-left font-medium text-slate-200">AI Intelligence & Executive Summaries</td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><span className="text-slate-600 font-mono text-[10px]">Scoped</span></td>
              </tr>
              <tr>
                <td className="py-3 text-left font-medium text-slate-200">Billing Subscriptions & Business Settings</td>
                <td><Check className="w-4 h-4 text-emerald-400 mx-auto" /></td>
                <td><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                <td><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
                <td><X className="w-4 h-4 text-rose-500 mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6">
            <button
              onClick={() => setIsInviteOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">Invite Team Member</h3>

            <form onSubmit={handleInvite} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Adams"
                  value={inviteForm.name}
                  onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="rachel@nexoralabs.io"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">RBAC Role</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="manager">Manager</option>
                    <option value="accountant">Accountant</option>
                    <option value="employee">Employee</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={inviteForm.title}
                    onChange={(e) => setInviteForm({ ...inviteForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg shadow-sm"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
