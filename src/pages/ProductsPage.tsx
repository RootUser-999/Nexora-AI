import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  ArrowUpDown,
  Tag,
  DollarSign,
  Boxes,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { api } from '../services/api.ts';
import { Product } from '../types/index.ts';

export function ProductsPage() {
  const { activeBusiness, setCurrentView } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [newProd, setNewProd] = useState({
    name: '',
    sku: '',
    category: 'Hardware',
    price: 199,
    cost: 85,
    stock: 25,
    lowStockThreshold: 10,
    description: '',
  });

  const loadProducts = () => {
    if (!activeBusiness) return;
    api.products.list(activeBusiness.id, {
      search: search || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined
    })
      .then(res => {
        setProducts(res.products);
        setCategories(res.categories);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadProducts();
  }, [activeBusiness?.id, search, selectedCategory]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness || !newProd.name || !newProd.sku) return;

    try {
      const created = await api.products.create(activeBusiness.id, newProd);
      setProducts(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      setNewProd({
        name: '',
        sku: '',
        category: 'Hardware',
        price: 199,
        cost: 85,
        stock: 25,
        lowStockThreshold: 10,
        description: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Product Catalog</h1>
          <p className="text-xs text-slate-400">
            {products.length} commercial hardware and software SKUs with automated margin calculation
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('inventory')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>Manage Inventory</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => {
          const margin = p.price > 0 ? Math.round(((p.price - p.cost) / p.price) * 100) : 0;
          return (
            <div
              key={p.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {p.sku}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-2 leading-snug">{p.name}</h3>
                    <div className="text-[11px] text-indigo-400 font-medium mt-0.5">{p.category}</div>
                  </div>

                  <span
                    className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${
                      p.status === 'out_of_stock'
                        ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                        : p.status === 'low_stock'
                        ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                        : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    }`}
                  >
                    {p.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                    <div className="text-[10px] text-slate-500">Price</div>
                    <div className="font-mono font-bold text-white mt-0.5">${p.price}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                    <div className="text-[10px] text-slate-500">Cost</div>
                    <div className="font-mono font-semibold text-slate-300 mt-0.5">${p.cost}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950/60 border border-slate-800/60">
                    <div className="text-[10px] text-slate-500">Margin</div>
                    <div className="font-mono font-semibold text-emerald-400 mt-0.5">{margin}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>In Stock: <strong className="text-white">{p.stock}</strong> units</span>
                  <span>Sold: <strong className="text-slate-200">{p.salesCount}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-4">Add Product SKU</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UltraSync Fiber Node"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="NXR-FN01"
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Hardware">Hardware</option>
                    <option value="Software">Software</option>
                    <option value="IoT Devices">IoT Devices</option>
                    <option value="Networking">Networking</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    min={1}
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={newProd.cost}
                    onChange={(e) => setNewProd({ ...newProd, cost: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    min={0}
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Low-Stock Alert Threshold</label>
                  <input
                    type="number"
                    min={1}
                    value={newProd.lowStockThreshold}
                    onChange={(e) => setNewProd({ ...newProd, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="Technical specifications and warranty terms..."
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
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
