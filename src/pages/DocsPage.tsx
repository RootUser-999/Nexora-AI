import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';

export function DocsPage() {
  const { activeBusiness } = useApp();
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const endpoints = [
    {
      group: 'Authentication',
      method: 'POST',
      path: '/api/auth/login',
      description: 'Authenticate user and return JWT bearer token and permissions.',
      payload: '{\n  "email": "demo@nexora.local",\n  "role": "owner"\n}',
      response: '{\n  "token": "jwt_nexora_...",\n  "user": { "id": "usr_1", "role": "owner" },\n  "business": { "id": "biz_nexora_labs" }\n}'
    },
    {
      group: 'Dashboard',
      method: 'GET',
      path: '/api/dashboard',
      description: 'Aggregate executive KPIs: 30-day revenue expansion, orders, low-stock count, and recent orders.',
      params: '?businessId=biz_nexora_labs',
      response: '{\n  "metrics": { "totalRevenue": 24850, "revenueChangePercent": 18.4, "totalOrders": 48 },\n  "recentOrders": [...]\n}'
    },
    {
      group: 'AI Business Intelligence',
      method: 'POST',
      path: '/api/ai/chat',
      description: 'Submit natural language query to Gemini 3.8 Flash with server-side injected business calculations.',
      payload: '{\n  "prompt": "How much revenue did we generate this month?",\n  "businessId": "biz_nexora_labs"\n}',
      response: '{\n  "message": {\n    "role": "assistant",\n    "content": "Nexora Labs generated $24,850.00 across 48 orders (+18.4% vs last month)..."\n  },\n  "source": "gemini-3.8-flash"\n}'
    },
    {
      group: 'AI Executive Reports',
      method: 'POST',
      path: '/api/ai/report',
      description: 'Synthesize comprehensive executive performance report using live database context.',
      payload: '{\n  "type": "monthly",\n  "businessId": "biz_nexora_labs"\n}',
      response: '{\n  "title": "Monthly Executive Report",\n  "generatedAt": "2026-10-05T09:00:00Z",\n  "content": "### Executive Performance Overview..."\n}'
    },
    {
      group: 'Customers CRM',
      method: 'GET',
      path: '/api/customers',
      description: 'List, filter, and search corporate customer accounts with AI lifetime insights.',
      params: '?businessId=biz_nexora_labs&status=active&search=veloce',
      response: '{\n  "customers": [\n    { "id": "cust_1", "name": "David Kowalski", "totalSpending": 14200, "status": "active" }\n  ],\n  "total": 1\n}'
    },
    {
      group: 'Products & SKUs',
      method: 'GET',
      path: '/api/products',
      description: 'Retrieve product catalog with cost margins, inventory levels, and stock alert status.',
      params: '?businessId=biz_nexora_labs&category=Hardware',
      response: '{\n  "products": [\n    { "id": "prod_1", "sku": "NXR-E100", "price": 499, "stock": 42, "status": "in_stock" }\n  ]\n}'
    },
    {
      group: 'Inventory Restock',
      method: 'POST',
      path: '/api/inventory/restock',
      description: 'Record incoming supplier restock shipment with automatic inventory movement logging.',
      payload: '{\n  "productId": "prod_3",\n  "quantity": 25,\n  "reason": "PO-8941 quarterly shipment"\n}',
      response: '{\n  "product": { "id": "prod_3", "stock": 31, "status": "in_stock" },\n  "movement": { "type": "restock", "quantity": 25 }\n}'
    },
    {
      group: 'Commercial Invoices',
      method: 'POST',
      path: '/api/invoices',
      description: 'Generate commercial Net 30 invoice with automated sales tax calculations.',
      payload: '{\n  "customerId": "cust_1",\n  "subtotal": 3450,\n  "description": "Enterprise Technology Delivery"\n}',
      response: '{\n  "id": "inv_111",\n  "invoiceNumber": "INV-2025111",\n  "subtotal": 3450,\n  "tax": 293.25,\n  "total": 3743.25,\n  "status": "pending"\n}'
    }
  ];

  const copyCurl = (path: string, method: string, payload?: string) => {
    let curl = `curl -X ${method} "http://localhost:3000${path}" \\\n  -H "Authorization: Bearer jwt_nexora_sample" \\\n  -H "Content-Type: application/json"`;
    if (payload) {
      curl += ` \\\n  -d '${payload.replace(/\n\s*/g, ' ')}'`;
    }
    navigator.clipboard.writeText(curl);
    setCopiedEndpoint(path);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">OpenAPI & REST Architecture</h1>
          <p className="text-xs text-slate-400">
            Interactive OpenAPI 3.0 specification for Nexora AI SaaS platform endpoints
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
          <Terminal className="w-3.5 h-3.5" />
          <span>Base URL: /api</span>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="space-y-6">
        {endpoints.map((ep, idx) => (
          <div key={idx} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                  ep.method === 'POST' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-sky-400 bg-sky-500/10 border-sky-500/20'
                }`}>
                  {ep.method}
                </span>
                <span className="font-mono text-xs font-semibold text-white">{ep.path}</span>
                {ep.params && <span className="font-mono text-[11px] text-slate-500">{ep.params}</span>}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider">{ep.group}</span>
                <button
                  onClick={() => copyCurl(ep.path, ep.method, ep.payload)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  {copiedEndpoint === ep.path ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEndpoint === ep.path ? 'Copied cURL' : 'Copy cURL'}</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{ep.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {ep.payload && (
                <div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold mb-1">Request Body</div>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 overflow-x-auto">
                    {ep.payload}
                  </pre>
                </div>
              )}
              <div className={ep.payload ? '' : 'md:col-span-2'}>
                <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold mb-1">Response Sample (200 OK)</div>
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-emerald-400/90 overflow-x-auto">
                  {ep.response}
                </pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
