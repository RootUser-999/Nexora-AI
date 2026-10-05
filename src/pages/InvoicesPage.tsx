import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Printer,
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  X,
  Building,
  Mail,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { Invoice, Customer } from '../types/index.ts';

export function InvoicesPage() {
  const { activeBusiness } = useApp();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sendSuccessToast, setSendSuccessToast] = useState(false);

  // New Invoice Form
  const [newInvCustomerId, setNewInvCustomerId] = useState('');
  const [newInvDescription, setNewInvDescription] = useState('Enterprise Cloud Infrastructure & Sensor Node Delivery');
  const [newInvAmount, setNewInvAmount] = useState(2400);

  const loadInvoices = () => {
    if (!activeBusiness) return;
    setLoading(true);
    api.invoices.list(activeBusiness.id, statusFilter !== 'all' ? statusFilter : undefined)
      .then(res => setInvoices(res.invoices))
      .catch(console.error)
      .finally(() => setLoading(false));

    api.customers.list(activeBusiness.id).then(res => {
      setCustomers(res.customers);
      if (res.customers.length > 0 && !newInvCustomerId) {
        setNewInvCustomerId(res.customers[0].id);
      }
    }).catch(console.error);
  };

  useEffect(() => {
    loadInvoices();
  }, [activeBusiness?.id, statusFilter]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness || !newInvCustomerId) return;

    try {
      const created = await api.invoices.create(activeBusiness.id, {
        customerId: newInvCustomerId,
        subtotal: Number(newInvAmount),
        description: newInvDescription
      });
      setInvoices(prev => [created, ...prev]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendInvoice = () => {
    setSendSuccessToast(true);
    setTimeout(() => setSendSuccessToast(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter(i =>
    i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
    i.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium border text-emerald-400 bg-emerald-500/10 border-emerald-500/20 capitalize">Paid</span>;
      case 'pending':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium border text-amber-400 bg-amber-500/10 border-amber-500/20 capitalize">Pending</span>;
      case 'overdue':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium border text-rose-400 bg-rose-500/10 border-rose-500/20 capitalize">Overdue</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium border text-slate-400 bg-slate-800 border-slate-700 capitalize">Cancelled</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {sendSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 p-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle className="w-4 h-4" />
          <span>Invoice successfully queued and dispatched to client email!</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Invoice Management & Billing</h1>
          <p className="text-xs text-slate-400">
            {invoices.length} commercial Net 30/60 invoices with automated PDF rendering and payment tracking
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Generate Invoice</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by invoice # or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {['all', 'paid', 'pending', 'overdue', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-medium capitalize transition-colors whitespace-nowrap ${
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

      {/* Invoices Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Invoice Number</th>
                <th className="p-3.5">Customer & Account</th>
                <th className="p-3.5">Issue Date</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Payment Status</th>
                <th className="p-3.5 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvoices.map((inv) => (
                <tr
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 pl-5 font-mono text-indigo-300 font-medium">{inv.invoiceNumber}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-200">{inv.customerName}</div>
                    <div className="text-[11px] text-slate-500">{inv.customerEmail}</div>
                  </td>
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">{inv.issueDate}</td>
                  <td className="p-3.5 font-mono text-slate-400 text-[11px]">{inv.dueDate}</td>
                  <td className="p-3.5 font-mono font-bold text-white">${inv.total.toLocaleString()}</td>
                  <td className="p-3.5">{getStatusBadge(inv.status)}</td>
                  <td className="p-3.5 pr-5 text-right">
                    <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                      View PDF →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Professional PDF / Print Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100">
            {/* Top Toolbar (Hidden during print) */}
            <div className="no-print flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-indigo-400 font-bold">{selectedInvoice.invoiceNumber}</span>
                {getStatusBadge(selectedInvoice.status)}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSendInvoice}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Client</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Download PDF</span>
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="bg-slate-950 rounded-xl p-8 border border-slate-800 text-slate-200">
              {/* Invoice Header */}
              <div className="flex justify-between items-start pb-8 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 font-bold text-lg text-white mb-2">
                    <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">N</div>
                    {activeBusiness?.legalName || 'Nexora Labs Inc.'}
                  </div>
                  <div className="text-xs text-slate-400 space-y-0.5 leading-relaxed">
                    <div>{activeBusiness?.address || '450 Lexington Avenue, Suite 1900'}</div>
                    <div>{activeBusiness?.city || 'New York, NY 10017'}</div>
                    <div>Email: {activeBusiness?.email || 'billing@nexoralabs.io'}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold tracking-tight text-white font-mono">INVOICE</div>
                  <div className="text-xs text-indigo-400 font-mono font-semibold mt-1">{selectedInvoice.invoiceNumber}</div>
                  <div className="text-xs text-slate-400 mt-2">
                    <div>Issue Date: <strong className="text-slate-200 font-mono">{selectedInvoice.issueDate}</strong></div>
                    <div>Due Date: <strong className="text-slate-200 font-mono">{selectedInvoice.dueDate}</strong> (Net 30)</div>
                  </div>
                </div>
              </div>

              {/* Billed To */}
              <div className="py-6 border-b border-slate-800 text-xs">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-semibold mb-2">Billed To</div>
                <div className="font-bold text-white text-sm">{selectedInvoice.customerName}</div>
                <div className="text-slate-300 mt-1">{selectedInvoice.customerAddress}</div>
                <div className="text-slate-400 font-mono mt-0.5">{selectedInvoice.customerEmail}</div>
              </div>

              {/* Line items table */}
              <div className="py-6">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="py-2.5">Description</th>
                      <th className="py-2.5 text-center">Qty</th>
                      <th className="py-2.5 text-right">Unit Price</th>
                      <th className="py-2.5 text-right pr-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {selectedInvoice.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 text-slate-200 font-medium">{item.description}</td>
                        <td className="py-3 text-center font-mono text-slate-300">{item.quantity}</td>
                        <td className="py-3 text-right font-mono text-slate-300">${item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 text-right font-mono font-semibold text-white pr-2">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculation Summary */}
              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <div className="w-64 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>${selectedInvoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Tax ({activeBusiness?.taxRate || 8.5}%):</span>
                    <span>${selectedInvoice.tax.toLocaleString()}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Discount:</span>
                      <span>-${selectedInvoice.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white font-bold pt-2 border-t border-slate-800 text-sm">
                    <span>Total Due:</span>
                    <span className="text-emerald-400">${selectedInvoice.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment instructions */}
              <div className="mt-8 pt-6 border-t border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
                <div className="font-semibold text-slate-300 mb-1">WIRE TRANSFER / ACH PAYMENT DETAILS</div>
                <div>Bank Name: Silicon Valley Commercial Bank, N.A.</div>
                <div>Routing (ABA): 121000358 · Account #: 8941-2094-1100</div>
                <div className="mt-2 text-slate-500 italic">{selectedInvoice.notes}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">Generate Commercial Invoice</h3>

            <form onSubmit={handleCreateInvoice} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Customer *</label>
                <select
                  value={newInvCustomerId}
                  onChange={(e) => setNewInvCustomerId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Line Item Description</label>
                <input
                  type="text"
                  required
                  value={newInvDescription}
                  onChange={(e) => setNewInvDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Subtotal Amount ($)</label>
                <input
                  type="number"
                  min={10}
                  required
                  value={newInvAmount}
                  onChange={(e) => setNewInvAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Tax rate applied automatically ({activeBusiness?.taxRate || 8.5}%). Payment terms default to Net 30.
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg shadow-sm"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
