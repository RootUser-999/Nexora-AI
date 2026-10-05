import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  DollarSign,
  Package,
  X,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { Order, Customer, Product } from '../types/index.ts';

export function OrdersPage() {
  const { activeBusiness } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Order Form
  const [newOrderCustomerId, setNewOrderCustomerId] = useState('');
  const [newOrderProductId, setNewOrderProductId] = useState('');
  const [newOrderQty, setNewOrderQty] = useState(1);
  const [newOrderNotes, setNewOrderNotes] = useState('');

  const loadData = () => {
    if (!activeBusiness) return;
    setLoading(true);
    api.orders.list(activeBusiness.id, statusFilter !== 'all' ? statusFilter : undefined)
      .then(res => setOrders(res.orders))
      .catch(console.error)
      .finally(() => setLoading(false));

    api.customers.list(activeBusiness.id).then(res => {
      setCustomers(res.customers);
      if (res.customers.length > 0 && !newOrderCustomerId) {
        setNewOrderCustomerId(res.customers[0].id);
      }
    }).catch(console.error);

    api.products.list(activeBusiness.id).then(res => {
      setProducts(res.products);
      if (res.products.length > 0 && !newOrderProductId) {
        setNewOrderProductId(res.products[0].id);
      }
    }).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [activeBusiness?.id, statusFilter]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness || !newOrderCustomerId || !newOrderProductId) return;

    try {
      const created = await api.orders.create(activeBusiness.id, {
        customerId: newOrderCustomerId,
        productId: newOrderProductId,
        quantity: Number(newOrderQty),
        notes: newOrderNotes
      });
      setOrders(prev => [created, ...prev]);
      setIsCreateModalOpen(false);
      setNewOrderNotes('');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium border text-emerald-400 bg-emerald-500/10 border-emerald-500/20 capitalize">Completed</span>;
      case 'processing':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium border text-sky-400 bg-sky-500/10 border-sky-500/20 capitalize">Processing</span>;
      case 'pending':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium border text-amber-400 bg-amber-500/10 border-amber-500/20 capitalize">Pending</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium border text-rose-400 bg-rose-500/10 border-rose-500/20 capitalize">Cancelled</span>;
      case 'refunded':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium border text-purple-400 bg-purple-500/10 border-purple-500/20 capitalize">Refunded</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Order Management</h1>
          <p className="text-xs text-slate-400">
            {orders.length} transaction orders processed with automated inventory deductions
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          {['all', 'completed', 'processing', 'pending', 'cancelled', 'refunded'].map((st) => (
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

      {/* Orders Table */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Order ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Purchased Items</th>
                <th className="p-3.5">Subtotal</th>
                <th className="p-3.5">Tax (8.5%)</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Order Status</th>
                <th className="p-3.5 pr-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 pl-5 font-mono text-indigo-300 font-medium">{order.orderNumber}</td>
                  <td className="p-3.5">
                    <div className="font-semibold text-slate-200">{order.customerName}</div>
                    <div className="text-[11px] text-slate-500">{order.customerEmail}</div>
                  </td>
                  <td className="p-3.5 text-slate-300 max-w-xs truncate">
                    {order.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">${order.subtotal.toLocaleString()}</td>
                  <td className="p-3.5 font-mono text-slate-400">${order.tax}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">${order.total.toLocaleString()}</td>
                  <td className="p-3.5">{getStatusBadge(order.status)}</td>
                  <td className="p-3.5 pr-5 font-mono text-slate-500 text-[11px]">
                    {new Date(order.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <span className="font-mono text-indigo-400 text-sm font-bold">{selectedOrder.orderNumber}</span>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </div>
              </div>
              {getStatusBadge(selectedOrder.status)}
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Customer Information</div>
                <div className="font-semibold text-slate-200">{selectedOrder.customerName}</div>
                <div className="text-slate-400">{selectedOrder.customerEmail}</div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Itemized Breakdown</div>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-950/40 border border-slate-800/80">
                      <div>
                        <div className="font-medium text-slate-200">{item.productName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">Qty: {item.quantity} × ${item.unitPrice}</div>
                      </div>
                      <div className="font-mono font-semibold text-white">${item.total.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax (8.5%):</span>
                  <span>${selectedOrder.tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white font-bold pt-1.5 border-t border-slate-800 text-sm">
                  <span>Total Amount:</span>
                  <span className="text-emerald-400">${selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-2.5 rounded bg-slate-950/60 border border-slate-800/80 text-slate-400 text-[11px]">
                  <strong>Notes:</strong> {selectedOrder.notes}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg"
              >
                Close Order View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Order Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">Create Commercial Order</h3>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Customer</label>
                <select
                  value={newOrderCustomerId}
                  onChange={(e) => setNewOrderCustomerId(e.target.value)}
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
                <label className="block text-slate-400 mb-1">Select Product SKU</label>
                <select
                  value={newOrderProductId}
                  onChange={(e) => setNewOrderProductId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — ${p.price} (Stock: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Order Quantity</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={newOrderQty}
                  onChange={(e) => setNewOrderQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Shipping & Handling Notes</label>
                <textarea
                  rows={2}
                  value={newOrderNotes}
                  onChange={(e) => setNewOrderNotes(e.target.value)}
                  placeholder="Carrier instructions or courier tracking notes..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
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
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
