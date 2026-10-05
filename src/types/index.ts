export type UserRole = 'owner' | 'manager' | 'accountant' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  businessId: string;
  phone?: string;
  title?: string;
  joinedAt: string;
}

export interface Business {
  id: string;
  name: string;
  legalName: string;
  industry: string;
  currency: string;
  currencySymbol: string;
  timezone: string;
  taxRate: number; // percentage, e.g. 10 for 10%
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  plan: 'free' | 'pro' | 'business';
  createdAt: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpending: number;
  lastPurchaseDate: string;
  status: 'active' | 'inactive' | 'lead';
  notes?: string;
  aiInsight?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  lowStockThreshold: number;
  salesCount: number;
  revenue: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  imageUrl?: string;
  description?: string;
  createdAt: string;
}

export interface InventoryMovement {
  id: string;
  businessId: string;
  productId: string;
  productName: string;
  type: 'restock' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  timestamp: string;
  performedBy: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded';
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  dueDate: string;
  issueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  notes?: string;
}

export interface Task {
  id: string;
  businessId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string;
  assignedToName: string;
  assignedToAvatar?: string;
  dueDate: string;
  labels: string[];
  createdAt: string;
}

export interface Notification {
  id: string;
  businessId: string;
  title: string;
  message: string;
  type: 'inventory' | 'order' | 'invoice' | 'payment' | 'ai' | 'task';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  businessId: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  objectType: string;
  objectId?: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  structuredCard?: {
    type: 'metric_comparison' | 'warning' | 'recommendation' | 'product_leaderboard';
    title: string;
    items?: { label: string; value: string; trend?: string; isPositive?: boolean }[];
    highlight?: string;
  };
}

export interface AIConversation {
  id: string;
  businessId: string;
  title: string;
  messages: AIMessage[];
  updatedAt: string;
}

export interface BusinessMetrics {
  totalRevenue: number;
  revenueChangePercent: number;
  totalOrders: number;
  ordersChangePercent: number;
  totalCustomers: number;
  customersChangePercent: number;
  outstandingInvoicesCount: number;
  outstandingInvoicesAmount: number;
  invoicesChangePercent: number;
  averageOrderValue: number;
  lowStockItemsCount: number;
}
