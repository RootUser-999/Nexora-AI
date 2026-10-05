import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  RefreshCw,
  Search,
  Package,
  History,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { Product, InventoryMovement } from '../types/index.ts';

export function InventoryPage() {
  const { activeBusiness } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [outOfStock, setOutOfStock] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [selectedProductForRestock, setSelectedProductForRestock] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(25);
  const [restockReason, setRestockReason] = useState('Quarterly manufacturer shipment');

  const loadInventory = () => {
    if (!activeBusiness) return;
    setLoading(true);
    api.inventory.get(activeBusiness.id)
      .then(res => {
        setProducts(res.products);
        setLowStock(res.lowStock);
        setOutOfStock(res.outOfStock);
        setMovements(res.movements);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInventory();
  }, [activeBusiness?.id]);

  const handleRestock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness || !selectedProductForRestock) return;

    try {
      await api.inventory.restock(activeBusiness.id, {
        productId: selectedProductForRestock.id,
        quantity: Number(restockQty),
        reason: restockReason
      });
      loadInventory();
      setIsRestockOpen(false);
      setSelectedProductForRestock(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openRestockModal = (p: Product) => {
    setSelectedProductForRestock(p);
    setIsRestockOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Inventory & Stock Tracking</h1>
          <p className="text-xs text-slate-400">
            Real-time multi-location warehouse balances with automatic low-stock order triggers
          </p>
        </div>

        <button
          onClick={() => {
            if (products.length > 0) openRestockModal(products[0]);
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Restock Intake</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Total Tracked SKUs</div>
            <div className="text-2xl font-bold text-white mt-1">{products.length}</div>
            <div className="text-[11px] text-slate-500 font-mono mt-0.5">Across 5 Categories</div>
          </div>
          <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Boxes className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Low Stock Warnings</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">{lowStock.length}</div>
            <div className="text-[11px] text-amber-400/80 font-mono mt-0.5">Below safe replenishment buffer</div>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Out of Stock Depletions</div>
            <div className="text-2xl font-bold text-rose-400 mt-1">{outOfStock.length}</div>
            <div className="text-[11px] text-rose-400/80 font-mono mt-0.5">Action: expedite supplier batch</div>
          </div>
          <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {lowStock.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Critical Stock Replenishment Required ({lowStock.length} Items)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {lowStock.map(p => (
              <div key={p.id} className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-slate-200">{p.name}</div>
                  <div className="text-[10px] text-amber-400 font-mono">Stock: {p.stock} (Min: {p.lowStockThreshold})</div>
                </div>
                <button
                  onClick={() => openRestockModal(p)}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px] transition-colors"
                >
                  Restock
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Stock Movements Log */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Inventory Movement Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-400">Chronological log of restocks, sale deductions, and adjustments</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-5">Product SKU & Name</th>
                <th className="p-3.5">Movement Type</th>
                <th className="p-3.5">Quantity Change</th>
                <th className="p-3.5">New Balance</th>
                <th className="p-3.5">Reason / Source</th>
                <th className="p-3.5">Operator</th>
                <th className="p-3.5 pr-5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {movements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 pl-5 font-medium text-slate-200">{m.productName}</td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${
                      m.type === 'restock'
                        ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                        : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                    }`}>
                      {m.type === 'restock' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {m.type}
                    </span>
                  </td>
                  <td className={`p-3.5 font-mono font-bold ${m.quantity > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity} units
                  </td>
                  <td className="p-3.5 font-mono text-white font-medium">{m.newStock} units</td>
                  <td className="p-3.5 text-slate-400">{m.reason}</td>
                  <td className="p-3.5 text-slate-300 font-medium">{m.performedBy}</td>
                  <td className="p-3.5 pr-5 text-slate-500 font-mono text-[11px]">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Intake Modal */}
      {isRestockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6">
            <button
              onClick={() => setIsRestockOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">Record Stock Restock</h3>

            <form onSubmit={handleRestock} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Product</label>
                <select
                  value={selectedProductForRestock?.id || ''}
                  onChange={(e) => {
                    const found = products.find(p => p.id === e.target.value);
                    if (found) setSelectedProductForRestock(found);
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Current: {p.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Intake Quantity (Units)</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reason / PO Reference</label>
                <input
                  type="text"
                  required
                  value={restockReason}
                  onChange={(e) => setRestockReason(e.target.value)}
                  placeholder="e.g. PO-8941 supplier delivery"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRestockOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg shadow-sm"
                >
                  Confirm Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
