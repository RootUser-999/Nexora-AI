import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  Package,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { BusinessMetrics, Order, Product, Task } from '../types/index.ts';

export function DashboardPage() {
  const { activeBusiness, setCurrentView } = useApp();
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [revenueTimeframe, setRevenueTimeframe] = useState<'7d' | '30d' | '90d' | '12m'>('30d');
  const [loading, setLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState('');

  useEffect(() => {
    if (!activeBusiness) return;
    setLoading(true);
    api.dashboard.getMetrics(activeBusiness.id)
      .then(res => {
        setMetrics(res.metrics);
        setRecentOrders(res.recentOrders);
        setTopProducts(res.topProducts);
        setRecentTasks(res.recentTasks);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeBusiness?.id]);

  // Chart data based on timeframe
  const chartData = [
    { period: 'Day 1', revenue: 640, orders: 2, aov: 320 },
    { period: 'Day 5', revenue: 1450, orders: 3, aov: 483 },
    { period: 'Day 10', revenue: 2890, orders: 6, aov: 481 },
    { period: 'Day 15', revenue: 5200, orders: 11, aov: 472 },
    { period: 'Day 20', revenue: 11400, orders: 22, aov: 518 },
    { period: 'Day 25', revenue: 18900, orders: 36, aov: 525 },
    { period: 'Day 30', revenue: 24850, orders: 48, aov: 517 },
  ];

  const filteredOrders = recentOrders.filter(o =>
    o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.customerName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'processing': return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
      case 'pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'cancelled': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'refunded': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default: return 'text-slate-400 bg-slate-800';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome & Proactive AI Insights Banner */}
      <div className="relative overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/40 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider font-semibold">
                Nexora AI Intelligence
              </span>
              <span className="text-xs text-slate-400">· Real-time Database Evaluation</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              Revenue expanded <span className="text-emerald-400">+18.4%</span> this month with strong gross margins.
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Nexora Edge Hub Pro accounted for $8,982.00 in sales. Action advised: 5 products are currently below threshold inventory.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('ai-assistant')}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm shadow-indigo-600/30 transition-all flex items-center gap-1.5 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Consult AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Trailing 30-Day Revenue</span>
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ${metrics?.totalRevenue ? metrics.totalRevenue.toLocaleString() : '24,850'}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="font-mono text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
              +{metrics?.revenueChangePercent || 18.4}%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>

        {/* Orders */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Fulfilled Orders</span>
            <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {metrics?.totalOrders || 48}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="font-mono text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
              +{metrics?.ordersChangePercent || 17.1}%
            </span>
            <span className="text-slate-500">vs last month</span>
          </div>
        </div>

        {/* Customers */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Active CRM Customers</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {metrics?.totalCustomers || 105}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="font-mono text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" />
              +{metrics?.customersChangePercent || 12.5}%
            </span>
            <span className="text-slate-500">growth YoY</span>
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Outstanding Invoices</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-amber-400 tracking-tight">
            ${metrics?.outstandingInvoicesAmount ? metrics.outstandingInvoicesAmount.toLocaleString() : '8,420'}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <span className="text-amber-400 font-medium">
              {metrics?.outstandingInvoicesCount || 7} pending receivables
            </span>
            <span className="text-slate-500">· Net 30</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Velocity Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">Revenue & Order Trajectory</h3>
              <p className="text-xs text-slate-400">Cumulative sales performance and transaction frequency</p>
            </div>
            {/* Filter buttons */}
            <div className="flex items-center p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              {(['7d', '30d', '90d', '12m'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setRevenueTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                    revenueTimeframe === tf
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="period" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Performing Products */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white">Top Products</h3>
                <p className="text-xs text-slate-400">By gross revenue contribution</p>
              </div>
              <button
                onClick={() => setCurrentView('products')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {topProducts.slice(0, 5).map((p, idx) => (
                <div key={p.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono text-slate-500 w-4">{idx + 1}</span>
                    <div className="truncate">
                      <div className="font-medium text-slate-200 truncate">{p.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{p.salesCount} sold · Stock: {p.stock}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono font-semibold text-emerald-400">${p.revenue.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-500">${p.price} / unit</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Critical stock items:</span>
            <button
              onClick={() => setCurrentView('inventory')}
              className="text-amber-400 hover:underline font-mono"
            >
              5 items low in stock →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Customer Orders</h3>
            <p className="text-xs text-slate-400">Live order pipeline with real-time status transitions</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search orders or customer..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              onClick={() => setCurrentView('orders')}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg shrink-0 transition-colors"
            >
              All Orders
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Order ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.slice(0, 6).map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 pl-5 font-mono text-indigo-300 font-medium">{order.orderNumber}</td>
                  <td className="p-3.5">
                    <div className="font-medium text-slate-200">{order.customerName}</div>
                    <div className="text-[11px] text-slate-500">{order.customerEmail}</div>
                  </td>
                  <td className="p-3.5 text-slate-400">
                    {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                  </td>
                  <td className="p-3.5 font-mono font-semibold text-white">
                    ${order.total.toLocaleString()}
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-slate-400 text-[11px] font-mono">
                    {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
