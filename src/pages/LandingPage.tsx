import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  BarChart3,
  ShieldCheck,
  Zap,
  Users,
  Boxes,
  FileText,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Layers,
  ArrowUpRight,
  Building,
  Check,
  Bot
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export function LandingPage() {
  const { openAuthModal, currentUser, setCurrentView } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const sampleAiQuestions = [
    {
      q: "How much revenue did we generate this month?",
      a: "Nexora analyzes trailing 30-day transactions across all fulfilled orders with live percentage changes vs the previous period, categorizing revenue by product and department."
    },
    {
      q: "Which product is performing best?",
      a: "Identifies your #1 revenue-generating SKU by cumulative sales volume, revenue contribution, and profit margin."
    },
    {
      q: "Which customers haven't purchased in 60+ days?",
      a: "Flags dormant customer accounts automatically and generates personalized re-engagement campaigns."
    },
    {
      q: "What are my lowest-stock products?",
      a: "Monitors real-time inventory against configurable safety thresholds and alerts you to stockout risks before fulfillment stops."
    }
  ];

  const [selectedAiSample, setSelectedAiSample] = useState(0);

  const faqs = [
    {
      q: "How does Nexora AI connect to my business data?",
      a: "Nexora integrates directly with your transactional database (PostgreSQL), CRM, order management, and inventory logs. The AI assistant queries structured business calculations rather than raw unindexed data to guarantee sub-second, factual answers without hallucination."
    },
    {
      q: "Is multi-tenant business data isolated securely?",
      a: "Yes. Nexora enforces strict database-level and API-level tenant scoping. Users, customers, products, and invoices are bound to specific business IDs, preventing any data cross-contamination between workspaces."
    },
    {
      q: "Does Nexora support PDF invoice generation and export?",
      a: "Absolutely. You can generate, print, or download compliant, professional PDF invoices with Net 30/60 terms, automated tax calculations, custom line items, and audit-ready timestamps."
    },
    {
      q: "Can I use Nexora without a Gemini API key?",
      a: "Yes. If the Gemini API key is not configured, Nexora gracefully falls back to its deterministic local analytics engine, providing accurate summaries from database metrics with zero downtime."
    },
    {
      q: "What roles and permissions are available?",
      a: "Nexora supports fine-grained Role-Based Access Control (RBAC) with predefined roles: Owner (full privileges), Manager (operations, CRM, inventory), Accountant (invoicing, payments, financial reports), and Employee (task fulfillment)."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-600/30">
              N
            </div>
            <div className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              NEXORA
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-400">
            <a href="#features" className="hover:text-slate-200 transition-colors">Features</a>
            <a href="#ai-assistant" className="hover:text-slate-200 transition-colors">AI Assistant</a>
            <a href="#analytics" className="hover:text-slate-200 transition-colors">Analytics</a>
            <a href="#workflow" className="hover:text-slate-200 transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-slate-200 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-slate-200 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(99,102,241,0.18),rgba(255,255,255,0))]" />
        
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-medium text-slate-200">Nexora Production Platform</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">Contextual Gemini 3.8 Flash Assistant</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
            Run Your Business. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
              Understand Your Data.
            </span> <br />
            Grow Smarter.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            The all-in-one business management SaaS combining CRM, inventory control, automated invoicing, real-time analytics, and an AI intelligence engine grounded in your business data.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => currentUser ? setCurrentView('dashboard') : openAuthModal('register')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{currentUser ? 'Go to Dashboard' : 'Get Started — Free Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView('docs')}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>View API Documentation</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500" />
            </button>
          </div>

          <div className="mt-6 text-xs text-slate-500 flex items-center justify-center gap-6">
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Real Multi-Tenant Workspace
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Secure Isolated Data
            </span>
          </div>

          {/* Interactive Dashboard Preview Frame */}
          <div className="mt-14 relative rounded-xl border border-slate-800 bg-slate-900/90 shadow-2xl p-2 sm:p-4 text-left overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                </div>
                <span className="ml-2 font-mono text-[11px] text-slate-500">app.nexora.io/dashboard</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                Multi-Tenant Architecture
              </div>
            </div>

            {/* Micro Dashboard UI Feature Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg">
                <div className="text-[11px] text-slate-400">Revenue Tracking</div>
                <div className="text-xl font-bold text-white mt-1">Real-time</div>
                <div className="text-[10px] text-emerald-400 mt-1 font-mono">Calculated from orders</div>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg">
                <div className="text-[11px] text-slate-400">Order Management</div>
                <div className="text-xl font-bold text-white mt-1">Automated</div>
                <div className="text-[10px] text-emerald-400 mt-1 font-mono">Inventory deduction</div>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg">
                <div className="text-[11px] text-slate-400">CRM Directory</div>
                <div className="text-xl font-bold text-white mt-1">Unified</div>
                <div className="text-[10px] text-emerald-400 mt-1 font-mono">Customer purchase history</div>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg">
                <div className="text-[11px] text-slate-400">Stock Warnings</div>
                <div className="text-xl font-bold text-amber-400 mt-1">Proactive</div>
                <div className="text-[10px] text-amber-400/80 mt-1 font-mono">Threshold alerts</div>
              </div>
            </div>

            {/* Callout overlay */}
            <div className="bg-gradient-to-t from-slate-950 to-transparent pt-12 pb-6 text-center">
              <button
                onClick={() => currentUser ? setCurrentView('dashboard') : openAuthModal('register')}
                className="px-5 py-2.5 text-xs font-semibold text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-700/50 rounded-lg transition-all shadow-lg"
              >
                {currentUser ? 'Access Workspace Dashboard →' : 'Sign In or Create Account to Launch Workspace →'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-b border-slate-800/60 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold tracking-wider text-slate-400 uppercase mb-8">
            Powering high-growth commerce & digital operations worldwide
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center opacity-60 text-slate-400 text-sm font-semibold tracking-wider text-center">
            <div>APEX RETAIL GROUP</div>
            <div>VELOCE LOGISTICS</div>
            <div>CLOUDSCALE DYNAMICS</div>
            <div>HYPERION MEDIA</div>
            <div>LUMINA HEALTHCARE</div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Enterprise SaaS Foundation</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              Everything your business needs in one unified workspace.
            </p>
            <p className="mt-4 text-sm text-slate-400">
              Stop juggling 8 disconnected tools. Nexora coordinates every sales, customer, inventory, and financial operation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">AI Business Assistant</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Natural-language intelligence that understands your actual orders, margins, inventory movements, and customer lifecycles.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Customer CRM & Lifetime Value</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track full purchase histories, account contacts, notes, average order sizes, and automated AI churn-risk indicators.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                <Boxes className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Inventory & Stock Tracking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated stock deduction on orders, safety thresholds, movement audits, restock logging, and out-of-stock prevention.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Invoices & PDF Generation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate clean, compliant Net 30/60 commercial invoices with automatic tax, custom discounts, and printable PDF exports.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Financial & Sales Analytics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deep interactive Recharts analytics spanning 7-day to 12-month periods, category margin breakdowns, and AOV trends.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pre-configured permission matrices for Owners, Operations Managers, Accountants, and Staff with immutable audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Showcase Section */}
      <section id="ai-assistant" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-xs text-indigo-400 mb-4">
                <Bot className="w-3.5 h-3.5" />
                <span>Not a generic chatbot</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
                An AI assistant that actually knows your business numbers.
              </h2>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                Generic chatbots hallucinate because they have no context. Nexora calculates your real revenue, margins, customer orders, and overdue invoices first, then delivers strategic answers powered by Gemini 3.8 Flash.
              </p>

              <div className="mt-6 space-y-2">
                {sampleAiQuestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAiSample(idx)}
                    className={`w-full text-left p-3 rounded-lg text-xs font-medium transition-all flex items-center justify-between ${
                      selectedAiSample === idx
                        ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{item.q}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 ml-2" />
                  </button>
                ))}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => currentUser ? setCurrentView('ai-assistant') : openAuthModal('login')}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-2"
                >
                  <span>{currentUser ? 'Consult AI Assistant' : 'Sign In to Consult AI'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-200">Nexora AI Executive Session</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Model: gemini-3.8-flash</span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* User query bubble */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="p-3 rounded-xl bg-indigo-600 text-white max-w-md">
                      {sampleAiQuestions[selectedAiSample].q}
                    </div>
                  </div>

                  {/* AI answer bubble */}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300 max-w-lg leading-relaxed">
                      <div className="text-[10px] font-mono text-indigo-400 mb-1 uppercase tracking-wider">
                        Verified Business Context · Grounded in PostgreSQL
                      </div>
                      <p>{sampleAiQuestions[selectedAiSample].a}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 border-b border-slate-800/80 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Continuous Intelligence Loop</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              From raw transactions to profitable decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-4 text-center">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="text-indigo-400 font-mono text-xs font-bold mb-2">01. CAPTURE</div>
              <h4 className="text-sm font-semibold text-white mb-1">Capture Data</h4>
              <p className="text-[11px] text-slate-400">Record customer orders, inventory movements, and invoice issuances.</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="text-sky-400 font-mono text-xs font-bold mb-2">02. AGGREGATE</div>
              <h4 className="text-sm font-semibold text-white mb-1">Analyze</h4>
              <p className="text-[11px] text-slate-400">Calculate cohort retention, product margins, and overdue receivables.</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="text-emerald-400 font-mono text-xs font-bold mb-2">03. REASON</div>
              <h4 className="text-sm font-semibold text-white mb-1">Understand</h4>
              <p className="text-[11px] text-slate-400">Gemini 3.8 contextual reasoning highlights anomalies and sales spikes.</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="text-amber-400 font-mono text-xs font-bold mb-2">04. EXECUTE</div>
              <h4 className="text-sm font-semibold text-white mb-1">Take Action</h4>
              <p className="text-[11px] text-slate-400">Trigger purchase orders, send invoice statements, and assign team tasks.</p>
            </div>
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="text-purple-400 font-mono text-xs font-bold mb-2">05. SCALE</div>
              <h4 className="text-sm font-semibold text-white mb-1">Grow</h4>
              <p className="text-[11px] text-slate-400">Expand margin predictability and customer lifetime value safely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Transparent Plans</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              Invest in predictable business growth.
            </p>
            <p className="mt-4 text-sm text-slate-400">
              Clear tiers structured for early ventures, growing commerce, and multi-location operations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-sm font-bold text-slate-200">FREE</div>
                <div className="text-xs text-slate-400 mt-1">For single founders exploring the system.</div>
                <div className="text-3xl font-extrabold text-white mt-6">$0 <span className="text-xs text-slate-500 font-normal">/ month</span></div>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Up to 100 Customers</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Up to 20 Products</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Standard Order Management</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Basic Analytics</li>
                </ul>
              </div>
              <button
                onClick={() => currentUser ? setCurrentView('dashboard') : openAuthModal('register')}
                className="mt-8 w-full py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro (Highlighted) */}
            <div className="p-6 rounded-xl bg-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-600/10 flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-600 text-white font-mono text-[10px] uppercase font-bold tracking-wider">
                Most Popular
              </div>
              <div>
                <div className="text-sm font-bold text-white">PRO</div>
                <div className="text-xs text-slate-400 mt-1">For growing SMEs needing deep AI insights.</div>
                <div className="text-3xl font-extrabold text-white mt-6">$79 <span className="text-xs text-slate-500 font-normal">/ month</span></div>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Unlimited Customers & Products</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Gemini 3.8 Flash AI Assistant</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Automated Invoicing & PDF Export</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Inventory Movement Tracking</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> AI Executive Reports (Weekly & Monthly)</li>
                </ul>
              </div>
              <button
                onClick={() => currentUser ? setCurrentView('dashboard') : openAuthModal('register')}
                className="mt-8 w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md shadow-indigo-600/20"
              >
                Start Free Trial
              </button>
            </div>

            {/* Business */}
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="text-sm font-bold text-slate-200">BUSINESS</div>
                <div className="text-xs text-slate-400 mt-1">For scaling teams with granular RBAC needs.</div>
                <div className="text-3xl font-extrabold text-white mt-6">$199 <span className="text-xs text-slate-500 font-normal">/ month</span></div>

                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tenant Workspace Switching</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Full Role-Based Access Control (RBAC)</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Complete Audit Logging Trail</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Dedicated REST API Access</li>
                  <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Priority SLA & Data Backups</li>
                </ul>
              </div>
              <button
                onClick={() => currentUser ? setCurrentView('dashboard') : openAuthModal('register')}
                className="mt-8 w-full py-2.5 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Register Business
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 border-b border-slate-800/80 bg-slate-900/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Client Feedback</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              Trusted by modern SME leaders.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "Nexora replaced our spreadsheet chaos. Being able to ask the AI 'Which product drove the most margin this month?' and receiving verified data in 2 seconds is pure magic."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-300 text-xs">
                  DK
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">David Kowalski</div>
                  <div className="text-[10px] text-slate-400">COO, Veloce Logistics</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The PDF invoice generator and low-stock notification alerts saved our fulfillment team over 15 hours a week. The UI feels like an enterprise platform."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-300 text-xs">
                  SC
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Sophia Chen</div>
                  <div className="text-[10px] text-slate-400">Finance Director</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The tenant isolation, audit logging, and clean REST API made this the easiest deployment our engineering team has ever audited."
              </p>
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-300 text-xs">
                  JM
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">James Mercer</div>
                  <div className="text-[10px] text-slate-400">Head of Product, CloudScale</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Frequently Asked Questions</h2>
            <p className="text-3xl font-extrabold text-white tracking-tight">
              Got questions? We have direct answers.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-xs font-semibold text-slate-200 text-left hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-indigo-950/30 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to upgrade your business management?
          </h2>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed">
            Create your business account to experience CRM, automated invoices, inventory tracking, and Gemini 3.8 Flash intelligence.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => currentUser ? setCurrentView('dashboard') : openAuthModal('register')}
              className="px-6 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 transition-all flex items-center gap-2"
            >
              <span>{currentUser ? 'Go to Workspace Dashboard' : 'Create Free Business Account'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-4">
              <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center text-white text-xs">N</div>
              NEXORA AI
            </div>
            <p className="text-slate-400 leading-relaxed">
              Intelligent SaaS platform for modern business management, CRM, invoices, inventory, and analytics.
            </p>
          </div>
          <div>
            <div className="text-slate-300 font-semibold mb-3">Product</div>
            <ul className="space-y-2">
              <li><button onClick={() => currentUser ? setCurrentView('dashboard') : openAuthModal('login')} className="hover:text-slate-300">Live Dashboard</button></li>
              <li><button onClick={() => currentUser ? setCurrentView('ai-assistant') : openAuthModal('login')} className="hover:text-slate-300">AI Assistant</button></li>
              <li><button onClick={() => currentUser ? setCurrentView('invoices') : openAuthModal('login')} className="hover:text-slate-300">Invoices & PDF</button></li>
              <li><button onClick={() => currentUser ? setCurrentView('inventory') : openAuthModal('login')} className="hover:text-slate-300">Inventory Tracker</button></li>
            </ul>
          </div>
          <div>
            <div className="text-slate-300 font-semibold mb-3">Engineering</div>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentView('docs')} className="hover:text-slate-300">REST API Docs</button></li>
              <li><span className="text-slate-500">Django + PostgreSQL</span></li>
              <li><span className="text-slate-500">Celery + Redis Tasks</span></li>
              <li><span className="text-slate-500">Gemini 3.8 Flash SDK</span></li>
            </ul>
          </div>
          <div>
            <div className="text-slate-300 font-semibold mb-3">Legal & Security</div>
            <ul className="space-y-2">
              <li><span className="text-slate-500">Privacy Policy</span></li>
              <li><span className="text-slate-500">Terms of Service</span></li>
              <li><span className="text-slate-500">Tenant Isolation Architecture</span></li>
              <li><span className="text-slate-500">SOC2 Type II Ready</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Nexora AI SaaS Platform. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="font-mono text-[11px] text-indigo-400">Enterprise SaaS Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
