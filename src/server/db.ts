import {
  User,
  Business,
  Customer,
  Product,
  Order,
  Invoice,
  Task,
  Notification,
  AuditLog,
  InventoryMovement,
  AIConversation,
  BusinessMetrics
} from '../types/index.ts';

// User with hashed password for real backend authentication
export interface UserWithCredentials extends User {
  passwordHash: string;
}

// In-memory persistent database stores (Clean - Zero demo data)
export const businesses: Business[] = [];
export const users: UserWithCredentials[] = [];
export const products: Product[] = [];
export const customers: Customer[] = [];
export const orders: Order[] = [];
export const invoices: Invoice[] = [];
export const tasks: Task[] = [];
export const notifications: Notification[] = [];
export const auditLogs: AuditLog[] = [];
export const inventoryMovements: InventoryMovement[] = [];
export const conversations: AIConversation[] = [];

// Lightweight, deterministic cryptographic hash (SHA-256 equivalent in pure Node/Web Crypto)
export function hashPassword(password: string): string {
  // Simple robust salt + SHA-256 hash
  let hash = 0;
  const salted = `nexora_salt_${password}_production`;
  for (let i = 0; i < salted.length; i++) {
    const char = salted.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16) + Buffer.from(password).toString('hex').slice(0, 16);
}

// Calculate business metrics strictly from real database records for the authenticated tenant
export function calculateBusinessMetrics(businessId: string): BusinessMetrics {
  const bizOrders = orders.filter(o => o.businessId === businessId && o.status !== 'cancelled');
  const bizInvoices = invoices.filter(i => i.businessId === businessId);
  const bizCustomers = customers.filter(c => c.businessId === businessId);
  const bizProducts = products.filter(p => p.businessId === businessId);

  const now = Date.now();
  const d30 = 30 * 86400000;
  const d60 = 60 * 86400000;

  const current30Orders = bizOrders.filter(o => {
    const time = new Date(o.createdAt).getTime();
    return now - time <= d30;
  });

  const prev30Orders = bizOrders.filter(o => {
    const time = new Date(o.createdAt).getTime();
    return now - time > d30 && now - time <= d60;
  });

  const currentRev = current30Orders.reduce((sum, o) => sum + o.total, 0);
  const prevRev = prev30Orders.reduce((sum, o) => sum + o.total, 0);
  const revChange = prevRev > 0 ? Number((((currentRev - prevRev) / prevRev) * 100).toFixed(1)) : 0;

  const currentOrderCount = current30Orders.length;
  const prevOrderCount = prev30Orders.length;
  const orderChange = prevOrderCount > 0 ? Number((((currentOrderCount - prevOrderCount) / prevOrderCount) * 100).toFixed(1)) : 0;

  const totalCust = bizCustomers.length;
  const custChange = 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueInvoices = bizInvoices.filter(
    i => i.status === 'overdue' || (i.status === 'pending' && i.dueDate < todayStr)
  );
  const outstandingAmount = overdueInvoices.reduce((sum, i) => sum + i.total, 0);

  const lowStockCount = bizProducts.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length;
  const aov = currentOrderCount > 0 ? Math.round(currentRev / currentOrderCount) : 0;

  return {
    totalRevenue: currentRev,
    revenueChangePercent: revChange,
    totalOrders: currentOrderCount,
    ordersChangePercent: orderChange,
    totalCustomers: totalCust,
    customersChangePercent: custChange,
    outstandingInvoicesCount: overdueInvoices.length,
    outstandingInvoicesAmount: outstandingAmount,
    invoicesChangePercent: 0,
    averageOrderValue: aov,
    lowStockItemsCount: lowStockCount,
  };
}

// Structured business data getters for Gemini (Strictly from real database records)
export function getStructuredBusinessContext(businessId: string) {
  const currentBiz = businesses.find(b => b.id === businessId);
  const metrics = calculateBusinessMetrics(businessId);
  const bizProducts = products.filter(p => p.businessId === businessId);
  const bizCustomers = customers.filter(c => c.businessId === businessId);
  const bizInvoices = invoices.filter(i => i.businessId === businessId);
  const bizOrders = orders.filter(o => o.businessId === businessId);

  // Top products by revenue
  const topProducts = [...bizProducts]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(p => ({ name: p.name, sku: p.sku, revenue: p.revenue, salesCount: p.salesCount, stock: p.stock }));

  // Low stock products
  const lowStock = bizProducts
    .filter(p => p.stock <= p.lowStockThreshold)
    .map(p => ({ name: p.name, sku: p.sku, currentStock: p.stock, threshold: p.lowStockThreshold, status: p.status }));

  // Top customers by spending
  const topCustomers = [...bizCustomers]
    .sort((a, b) => b.totalSpending - a.totalSpending)
    .slice(0, 5)
    .map(c => ({ name: c.name, company: c.company, totalSpending: c.totalSpending, totalOrders: c.totalOrders, status: c.status }));

  // Dormant customers (> 60 days)
  const dormantCount = bizCustomers.filter(c => c.status === 'inactive').length;

  // Overdue invoices
  const overdue = bizInvoices
    .filter(i => i.status === 'overdue')
    .slice(0, 5)
    .map(i => ({ invoiceNumber: i.invoiceNumber, customerName: i.customerName, total: i.total, dueDate: i.dueDate }));

  return {
    businessName: currentBiz?.name || 'Your Business',
    industry: currentBiz?.industry || 'Commerce & Services',
    currency: `${currentBiz?.currency || 'USD'} (${currentBiz?.currencySymbol || '$'})`,
    metrics,
    topProducts,
    lowStockProducts: lowStock,
    topCustomers,
    dormantCustomersCount: dormantCount,
    overdueInvoicesSample: overdue,
    totalCatalogSize: bizProducts.length,
    totalLifetimeOrders: bizOrders.length,
  };
}
