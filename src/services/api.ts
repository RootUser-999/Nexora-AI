// Centralized API client for Nexora AI SaaS
import {
  Customer,
  Product,
  Order,
  Invoice,
  Task,
  Notification,
  AuditLog,
  Business,
  BusinessMetrics,
  UserRole
} from '../types/index.ts';

const BASE_URL = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('nexora_token');
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || errorBody.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, role?: UserRole) =>
      request<{ token: string; user: any; business: Business }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      }),
    register: (name: string, email: string, title?: string) =>
      request<{ token: string; user: any; business: Business }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, title }),
      }),
    me: () => request<{ user: any; business: Business }>('/auth/me'),
  },

  businesses: {
    list: () => request<Business[]>('/businesses'),
  },

  dashboard: {
    getMetrics: (businessId: string) =>
      request<{
        metrics: BusinessMetrics;
        recentOrders: Order[];
        topProducts: Product[];
        recentTasks: Task[];
        business: Business;
      }>(`/dashboard?businessId=${encodeURIComponent(businessId)}`),
  },

  customers: {
    list: (businessId: string, params?: { search?: string; status?: string }) => {
      const searchParams = new URLSearchParams({ businessId });
      if (params?.search) searchParams.set('search', params.search);
      if (params?.status) searchParams.set('status', params.status);
      return request<{ customers: Customer[]; total: number }>(`/customers?${searchParams.toString()}`);
    },
    create: (businessId: string, data: Partial<Customer>) =>
      request<Customer>(`/customers?businessId=${encodeURIComponent(businessId)}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  products: {
    list: (businessId: string, params?: { search?: string; category?: string }) => {
      const searchParams = new URLSearchParams({ businessId });
      if (params?.search) searchParams.set('search', params.search);
      if (params?.category) searchParams.set('category', params.category);
      return request<{ products: Product[]; categories: string[] }>(`/products?${searchParams.toString()}`);
    },
    create: (businessId: string, data: Partial<Product>) =>
      request<Product>(`/products?businessId=${encodeURIComponent(businessId)}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  inventory: {
    get: (businessId: string) =>
      request<{
        products: Product[];
        lowStock: Product[];
        outOfStock: Product[];
        movements: any[];
      }>(`/inventory?businessId=${encodeURIComponent(businessId)}`),
    restock: (businessId: string, data: { productId: string; quantity: number; reason?: string }) =>
      request<{ product: Product; movement: any }>(`/inventory/restock?businessId=${encodeURIComponent(businessId)}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  orders: {
    list: (businessId: string, status?: string) => {
      const searchParams = new URLSearchParams({ businessId });
      if (status && status !== 'all') searchParams.set('status', status);
      return request<{ orders: Order[] }>(`/orders?${searchParams.toString()}`);
    },
    create: (businessId: string, data: { customerId: string; productId: string; quantity: number; notes?: string }) =>
      request<Order>(`/orders?businessId=${encodeURIComponent(businessId)}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  invoices: {
    list: (businessId: string, status?: string) => {
      const searchParams = new URLSearchParams({ businessId });
      if (status && status !== 'all') searchParams.set('status', status);
      return request<{ invoices: Invoice[] }>(`/invoices?${searchParams.toString()}`);
    },
    create: (businessId: string, data: Partial<Invoice>) =>
      request<Invoice>(`/invoices?businessId=${encodeURIComponent(businessId)}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  tasks: {
    list: (businessId: string) => request<{ tasks: Task[] }>(`/tasks?businessId=${encodeURIComponent(businessId)}`),
    create: (businessId: string, data: Partial<Task>) =>
      request<Task>(`/tasks?businessId=${encodeURIComponent(businessId)}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  analytics: {
    get: (businessId: string) =>
      request<{
        revenueTrend: Array<{ month: string; revenue: number; orders: number; aov: number; customers: number }>;
        categoryRevenue: Array<{ name: string; value: number }>;
        metrics: BusinessMetrics;
      }>(`/analytics?businessId=${encodeURIComponent(businessId)}`),
  },

  ai: {
    chat: (prompt: string, businessId: string) =>
      request<{
        message: { id: string; role: 'assistant'; content: string; timestamp: string };
        source: string;
      }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt, businessId }),
      }),
    generateReport: (type: string, businessId: string) =>
      request<{
        title: string;
        generatedAt: string;
        content: string;
        source: string;
      }>('/ai/report', {
        method: 'POST',
        body: JSON.stringify({ type, businessId }),
      }),
  },

  notifications: {
    list: (businessId: string) =>
      request<{ notifications: Notification[] }>(`/notifications?businessId=${encodeURIComponent(businessId)}`),
    markAllRead: (businessId: string) =>
      request<{ success: boolean }>(`/notifications/mark-all-read?businessId=${encodeURIComponent(businessId)}`, {
        method: 'POST',
      }),
  },

  team: {
    list: (businessId: string) =>
      request<{ members: any[]; roles: string[] }>(`/team?businessId=${encodeURIComponent(businessId)}`),
    invite: (businessId: string, data: { name: string; email: string; role: string; title?: string }) =>
      request<any>(`/team/invite?businessId=${encodeURIComponent(businessId)}`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  audit: {
    list: (businessId: string) =>
      request<{ logs: AuditLog[] }>(`/audit?businessId=${encodeURIComponent(businessId)}`),
  },

  settings: {
    get: (businessId: string) =>
      request<Business>(`/settings?businessId=${encodeURIComponent(businessId)}`),
    update: (businessId: string, data: Partial<Business>) =>
      request<Business>(`/settings?businessId=${encodeURIComponent(businessId)}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
  },

  docs: {
    getSpec: () => request<any>('/docs'),
  },
};
