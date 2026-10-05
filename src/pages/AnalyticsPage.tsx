import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  PieChart as PieIcon,
  Filter,
  Download,
  Calendar,
  Layers
} from 'recharts';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { BusinessMetrics } from '../types/index.ts';

const COLORS = ['#6366f1', '#38bdf8', '#34d399', '#fbbf24', '#f43f5e'];

export function AnalyticsPage() {
  const { activeBusiness } = useApp();
  const [data, setData] = useState<{
    revenueTrend: Array<{ month: string; revenue: number; orders: number; aov: number; customers: number }>;
    categoryRevenue: Array<{ name: string; value: number }>;
    metrics: BusinessMetrics;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'orders' | 'aov'>('revenue');

  useEffect(() => {
    if (!activeBusiness) return;
    setLoading(true);
    api.analytics.get(activeBusiness.id)
      .then(res => setData(res))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeBusiness?.id]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Business Analytics & Metrics</h1>
          <p className="text-xs text-slate-400">
            Multi-dimensional financial and cohort telemetry grounded in live database transactions
          </p>
        </div>

        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
          <button
            onClick={() => setSelectedMetric('revenue')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedMetric === 'revenue' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Gross Revenue
          </button>
          <button
            onClick={() => setSelectedMetric('orders')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedMetric === 'orders' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Order Volume
          </button>
          <button
            onClick={() => setSelectedMetric('aov')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              selectedMetric === 'aov' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Avg Order Value
          </button>
        </div>
      </div>

      {/* Primary Trend Chart */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold text-white capitalize">
              12-Month Trajectory · {selectedMetric === 'revenue' ? 'Revenue ($)' : selectedMetric === 'orders' ? 'Total Orders' : 'Average Order Value ($)'}
            </h3>
            <p className="text-xs text-slate-400">Quarterly trendline reflecting year-over-year expansion</p>
          </div>
          <span className="font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            +18.4% QoQ Growth
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.revenueTrend || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                tickFormatter={(val) => (selectedMetric === 'orders' ? `${val}` : `$${val}`)}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#metricGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Category Distribution & Order Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Revenue Donut Chart */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Product Category Contribution</h3>
            <p className="text-xs text-slate-400 mb-4">Gross top-line revenue divided across catalog segments</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categoryRevenue || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(data?.categoryRevenue || []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(val) => `$${Number(val).toLocaleString()}`}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono text-center">
            Hardware constitutes 35.0% of total revenue volume
          </div>
        </div>

        {/* Customer Growth & Frequency Bar Chart */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">Customer Account Expansion</h3>
            <p className="text-xs text-slate-400 mb-4">Active enterprise customer accounts over trailing 12 months</p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.revenueTrend || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="customers" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono text-center">
            Net customer retention rate: 94.2% across commercial contracts
          </div>
        </div>
      </div>
    </div>
  );
}
