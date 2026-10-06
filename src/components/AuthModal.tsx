import React, { useState } from 'react';
import { X, Lock, Mail, Building, User, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { api } from '../services/api.ts';
import { useApp } from '../context/AppContext.tsx';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const { setCurrentUser, setActiveBusiness, setCurrentView, triggerRefresh } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerBusinessName, setRegisterBusinessName] = useState('');
  const [registerIndustry, setRegisterIndustry] = useState('Digital Commerce');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.auth.login(loginEmail, loginPassword);
      localStorage.setItem('nexora_token', res.token);
      setCurrentUser(res.user);
      setActiveBusiness(res.business);
      triggerRefresh();
      onClose();
      setCurrentView('dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.auth.register({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        businessName: registerBusinessName || `${registerName}'s Business`,
        industry: registerIndustry,
      });
      localStorage.setItem('nexora_token', res.token);
      setCurrentUser(res.user);
      setActiveBusiness(res.business);
      triggerRefresh();
      onClose();
      setCurrentView('dashboard');
    } catch (err: any) {
      setError(err.message || 'Account registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-600/30">
            N
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              NEXORA <span className="text-[10px] font-mono text-indigo-400 px-1 py-0.2 rounded bg-indigo-500/20 border border-indigo-500/30">AI</span>
            </div>
            <div className="text-[11px] text-slate-400">Enterprise Business Management SaaS</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 mb-6 text-xs">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 font-medium border-b-2 text-center transition-colors ${
              mode === 'login'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2.5 font-medium border-b-2 text-center transition-colors ${
              mode === 'register'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="executive@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1.5 font-medium">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 text-center text-slate-500 text-[11px]">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(null); }}
                className="text-indigo-400 hover:underline font-medium"
              >
                Create business account
              </button>
            </div>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Work Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="sarah@acme.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Password * (min. 8 characters)</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="••••••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Business / Company Name *</label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Acme Global Logistics"
                  value={registerBusinessName}
                  onChange={(e) => setRegisterBusinessName(e.target.value)}
                  className="w-full pl-9.5 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Industry Sector</label>
              <select
                value={registerIndustry}
                onChange={(e) => setRegisterIndustry(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="Digital Commerce">Digital Commerce & Retail</option>
                <option value="Logistics & Supply">Logistics & Supply Chain</option>
                <option value="Manufacturing & Hardware">Manufacturing & Hardware</option>
                <option value="Technology & SaaS">Technology & SaaS</option>
                <option value="Professional Services">Professional Consulting</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Business Workspace...' : 'Launch Workspace as Owner'}</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <div className="pt-2 text-center text-slate-500 text-[11px]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className="text-indigo-400 hover:underline font-medium"
              >
                Sign in here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
