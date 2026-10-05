import React, { useState, useEffect } from 'react';
import {
  Settings,
  Building,
  CreditCard,
  Shield,
  Bot,
  Bell,
  Save,
  Check,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { Business } from '../types/index.ts';

export function SettingsPage() {
  const { activeBusiness, setActiveBusiness, businesses } = useApp();
  const [activeTab, setActiveTab] = useState<'business' | 'ai' | 'billing' | 'security'>('business');
  const [formData, setFormData] = useState<Partial<Business>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (activeBusiness) {
      setFormData({
        name: activeBusiness.name,
        legalName: activeBusiness.legalName,
        industry: activeBusiness.industry,
        currency: activeBusiness.currency,
        currencySymbol: activeBusiness.currencySymbol,
        timezone: activeBusiness.timezone,
        taxRate: activeBusiness.taxRate,
        email: activeBusiness.email,
        phone: activeBusiness.phone,
        address: activeBusiness.address,
        city: activeBusiness.city,
        plan: activeBusiness.plan,
      });
    }
  }, [activeBusiness?.id]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness) return;

    try {
      const updated = await api.settings.update(activeBusiness.id, formData);
      setActiveBusiness(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">Workspace & Business Settings</h1>
        <p className="text-xs text-slate-400">
          Configure financial preferences, legal entities, Gemini AI parameters, and subscription tiers
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('business')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'business'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Business Profile
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'ai'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          AI Intelligence Engine
        </button>
        <button
          onClick={() => setActiveTab('billing')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'billing'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Subscription & Billing
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 font-medium border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Security & JWT
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Business settings successfully persisted to PostgreSQL database!</span>
        </div>
      )}

      {/* Business Profile Tab */}
      {activeTab === 'business' && (
        <form onSubmit={handleSave} className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Business Public Brand Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Registered Legal Entity Name</label>
              <input
                type="text"
                value={formData.legalName || ''}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry || ''}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Accounting Currency</label>
              <select
                value={formData.currency || 'USD'}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Default Sales Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.taxRate || 8.5}
                onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Billing Support Email</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Telephone Contact</label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Headquarters Street Address</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">City, State & Postal Code</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Business Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* AI Intelligence Tab */}
      {activeTab === 'ai' && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Architecture & Context Ingestion</span>
          </div>

          <p className="text-slate-400 leading-relaxed">
            Nexora AI is powered by the modern <strong>@google/genai SDK</strong> targeting <strong>gemini-3.8-flash</strong>.
            Before any prompt is evaluated, Nexora executes structured database queries calculating 30-day revenue expansion, inventory anomalies, and overdue receivables.
          </p>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px]">
            <div className="text-slate-400">Current AI Model: <strong className="text-indigo-300">gemini-3.8-flash</strong></div>
            <div className="text-slate-400">SDK Provider: <strong className="text-slate-200">@google/genai (v2.4.0)</strong></div>
            <div className="text-slate-400">Telemetry User-Agent: <strong className="text-slate-200">aistudio-build</strong></div>
            <div className="text-slate-400">High-Availability Mode: <strong className="text-emerald-400">Deterministic Fallback Enabled</strong></div>
          </div>

          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
            <strong>Security Invariant:</strong> The AI engine operates strictly server-side. No sensitive authentication tokens, database connection strings, or plain-text credentials are ever included in prompt context.
          </div>
        </div>
      )}

      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-6 text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="text-sm font-bold text-white">Current Active Subscription: <span className="uppercase text-indigo-400 font-mono">BUSINESS TIER</span></div>
              <div className="text-slate-400 mt-0.5">Multi-tenant enterprise license active with priority Gemini AI quotas</div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px]">
              Active & In Good Standing
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-bold text-slate-300">Free Tier</div>
              <div className="text-slate-500 mt-1">Single founder testing</div>
              <div className="text-lg font-bold text-white mt-3">$0/mo</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800">
              <div className="font-bold text-slate-300">Pro Tier</div>
              <div className="text-slate-500 mt-1">Growing commerce team</div>
              <div className="text-lg font-bold text-white mt-3">$79/mo</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-950 border-2 border-indigo-500 relative">
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded bg-indigo-600 text-white font-mono text-[9px] uppercase font-bold">Current</span>
              <div className="font-bold text-indigo-300">Business Tier</div>
              <div className="text-slate-400 mt-1">Full RBAC & AI Reports</div>
              <div className="text-lg font-bold text-white mt-3">$199/mo</div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-white text-sm">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Authentication & Tenant Isolation Architecture</span>
          </div>

          <div className="space-y-2 text-slate-300 leading-relaxed">
            <p>
              Nexora implements JWT bearer authorization with strict object-level database isolation.
              Every customer, product, order, invoice, and task record is indexed with a foreign key to its owning business.
            </p>
            <p>
              Cross-tenant data exposure is strictly prohibited at both the Django REST Framework viewset level and the database schema level.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400">
            <div>Algorithm: HS256 JWT</div>
            <div>Access Token Lifetime: 60 minutes</div>
            <div>Refresh Token Rotation: Enabled</div>
            <div>CORS Allowed Origins: Configured via environment variable</div>
          </div>
        </div>
      )}
    </div>
  );
}
