import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Plus,
  Download,
  Upload,
  Filter,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  CheckCircle2,
  DollarSign,
  ChevronRight,
  ShoppingBag
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { Customer } from '../types/index.ts';

export function CustomersPage() {
  const { activeBusiness } = useApp();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Customer Form State
  const [newCust, setNewCust] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    notes: '',
  });

  const loadCustomers = () => {
    if (!activeBusiness) return;
    setLoading(true);
    api.customers.list(activeBusiness.id, {
      search: search || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined
    })
      .then(res => setCustomers(res.customers))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCustomers();
  }, [activeBusiness?.id, search, statusFilter]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness || !newCust.name || !newCust.email) return;

    try {
      const created = await api.customers.create(activeBusiness.id, newCust);
      setCustomers(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      setNewCust({ name: '', email: '', phone: '', company: '', address: '', city: '', notes: '' });
    } catch (err) {
      console.error(err);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    if (customers.length === 0) return;
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Total Orders', 'Total Spend', 'Status', 'Last Purchase'];
    const rows = customers.map(c => [
      `"${c.name}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      `"${c.company}"`,
      c.totalOrders,
      c.totalSpending,
      c.status,
      c.lastPurchaseDate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexora_customers_${activeBusiness?.id || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Customer CRM</h1>
          <p className="text-xs text-slate-400">
            Directory of {customers.length} business accounts with automated AI churn insights
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {['all', 'active', 'inactive', 'lead'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Customer & Company</th>
                <th className="p-3.5">Contact Details</th>
                <th className="p-3.5">Orders</th>
                <th className="p-3.5">Total Spending</th>
                <th className="p-3.5">Last Purchase</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {customers.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setSelectedCustomer(c)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 pl-5">
                    <div className="font-semibold text-slate-200">{c.name}</div>
                    <div className="text-[11px] text-indigo-400 font-medium">{c.company}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-slate-300">{c.email}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{c.phone}</div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">{c.totalOrders}</td>
                  <td className="p-3.5 font-mono font-semibold text-emerald-400">
                    ${c.totalSpending.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                    {c.lastPurchaseDate}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border capitalize ${
                        c.status === 'active'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : c.status === 'inactive'
                          ? 'text-slate-400 bg-slate-800 border-slate-700'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3.5 pr-5 text-right">
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 ml-auto">
                      <span>View</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 pb-4 border-b border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-lg font-bold text-indigo-400">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedCustomer.name}</h3>
                <div className="text-xs text-indigo-400 font-medium">{selectedCustomer.company}</div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span>{selectedCustomer.address}, {selectedCustomer.city}</span>
                </div>
              </div>
            </div>

            {/* AI Customer Insight Card */}
            {selectedCustomer.aiInsight && (
              <div className="my-4 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] font-bold text-indigo-300 uppercase font-mono tracking-wider">
                    AI Customer Intelligence
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {selectedCustomer.aiInsight}
                  </p>
                </div>
              </div>
            )}

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 my-4">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Total Spending</div>
                <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
                  ${selectedCustomer.totalSpending.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Lifetime Orders</div>
                <div className="text-base font-bold text-white font-mono mt-0.5">
                  {selectedCustomer.totalOrders}
                </div>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Last Purchase</div>
                <div className="text-xs font-semibold text-slate-300 font-mono mt-1">
                  {selectedCustomer.lastPurchaseDate}
                </div>
              </div>
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-xs py-2 border-t border-slate-800 text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedCustomer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>{selectedCustomer.phone}</span>
              </div>
              {selectedCustomer.notes && (
                <div className="mt-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800/80">
                  <div className="text-[10px] text-slate-500 font-semibold mb-1">ACCOUNT NOTES</div>
                  <p className="text-slate-400">{selectedCustomer.notes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">Add New Customer</h3>

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Vance"
                  value={newCust.name}
                  onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="david@company.com"
                    value={newCust.email}
                    onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 234-5678"
                    value={newCust.phone}
                    onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="Veloce Logistics"
                    value={newCust.company}
                    onChange={(e) => setNewCust({ ...newCust, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">City, State</label>
                  <input
                    type="text"
                    placeholder="New York, NY"
                    value={newCust.city}
                    onChange={(e) => setNewCust({ ...newCust, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Procurement Notes</label>
                <textarea
                  rows={2}
                  placeholder="Key billing instructions or client preferences..."
                  value={newCust.notes}
                  onChange={(e) => setNewCust({ ...newCust, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg shadow-sm"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
