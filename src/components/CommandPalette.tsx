import React, { useState, useEffect } from 'react';
import { Search, X, Users, Package, ShoppingCart, FileText, CheckSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { Customer, Product, Order, Invoice, Task } from '../types/index.ts';

export function CommandPalette() {
  const { isCommandPaletteOpen, setIsCommandPaletteOpen, setCurrentView, activeBusiness } = useApp();
  const [query, setQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (isCommandPaletteOpen && activeBusiness) {
      api.customers.list(activeBusiness.id).then(res => setCustomers(res.customers.slice(0, 5))).catch(() => {});
      api.products.list(activeBusiness.id).then(res => setProducts(res.products.slice(0, 5))).catch(() => {});
      api.orders.list(activeBusiness.id).then(res => setOrders(res.orders.slice(0, 5))).catch(() => {});
      api.invoices.list(activeBusiness.id).then(res => setInvoices(res.invoices.slice(0, 5))).catch(() => {});
      api.tasks.list(activeBusiness.id).then(res => setTasks(res.tasks.slice(0, 5))).catch(() => {});
    }
  }, [isCommandPaletteOpen, activeBusiness?.id]);

  if (!isCommandPaletteOpen) return null;

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.company.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    p.sku.toLowerCase().includes(query.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
    o.customerName.toLowerCase().includes(query.toLowerCase())
  );

  const navigateTo = (view: any) => {
    setCurrentView(view);
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command, customer, product, order, or invoice..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick navigation */}
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => navigateTo('dashboard')}
                className="flex items-center justify-between p-2 rounded-lg text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Dashboard Overview
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={() => navigateTo('ai-assistant')}
                className="flex items-center justify-between p-2 rounded-lg text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  AI Business Assistant
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={() => navigateTo('customers')}
                className="flex items-center justify-between p-2 rounded-lg text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  Customer Directory
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
              <button
                onClick={() => navigateTo('invoices')}
                className="flex items-center justify-between p-2 rounded-lg text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  Invoices & PDF Billing
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-sky-400" /> Customers
              </div>
              {filteredCustomers.map(c => (
                <button
                  key={c.id}
                  onClick={() => navigateTo('customers')}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                >
                  <div>
                    <span className="font-medium text-slate-200">{c.name}</span>
                    <span className="text-slate-500 ml-2">({c.company})</span>
                  </div>
                  <span className="text-slate-400 font-mono">${c.totalSpending.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}

          {/* Products */}
          {filteredProducts.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <Package className="w-3 h-3 text-emerald-400" /> Products
              </div>
              {filteredProducts.map(p => (
                <button
                  key={p.id}
                  onClick={() => navigateTo('products')}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                >
                  <div>
                    <span className="font-medium text-slate-200">{p.name}</span>
                    <span className="text-slate-500 ml-2 font-mono">[{p.sku}]</span>
                  </div>
                  <span className="text-slate-400 font-mono">${p.price}</span>
                </button>
              ))}
            </div>
          )}

          {/* Orders */}
          {filteredOrders.length > 0 && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                <ShoppingCart className="w-3 h-3 text-indigo-400" /> Recent Orders
              </div>
              {filteredOrders.map(o => (
                <button
                  key={o.id}
                  onClick={() => navigateTo('orders')}
                  className="w-full flex items-center justify-between p-2 rounded-lg text-left text-slate-300 hover:bg-slate-800/70 hover:text-white transition-colors"
                >
                  <div>
                    <span className="font-mono text-indigo-300 font-medium">{o.orderNumber}</span>
                    <span className="text-slate-400 ml-2">{o.customerName}</span>
                  </div>
                  <span className="font-mono text-emerald-400">${o.total.toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with cursor or click item</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400 text-[10px]">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
}
