import type { IncomingMessage, ServerResponse } from 'http';
import {
  businesses,
  users,
  customers,
  products,
  orders,
  invoices,
  tasks,
  notifications,
  auditLogs,
  inventoryMovements,
  conversations,
  hashPassword,
  calculateBusinessMetrics,
  getStructuredBusinessContext,
  UserWithCredentials
} from './db.ts';
import { askBusinessAssistant, generateAIReport } from './ai.ts';
import { Business, Customer, Product, Order, Invoice, Task, Notification, AuditLog } from '../types/index.ts';

// Helper to parse JSON body from incoming Node.js request stream
function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Helper to send JSON response
function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Business-ID');
  res.end(JSON.stringify(data));
}

// Authenticate user from Bearer token
function getAuthUser(req: IncomingMessage): { user: UserWithCredentials; business: Business } | null {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  // Token structure: jwt_nexora_<timestamp>_<userId>
  const parts = token.split('_');
  if (parts.length < 4) return null;
  const userId = parts.slice(3).join('_');

  const user = users.find(u => u.id === userId);
  if (!user) return null;

  const business = businesses.find(b => b.id === user.businessId);
  if (!business) return null;

  return { user, business };
}

export async function apiMiddleware(req: IncomingMessage, res: ServerResponse, next?: () => void) {
  const url = req.url || '';

  // Only handle /api/ routes
  if (!url.startsWith('/api')) {
    if (next) return next();
    return;
  }

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Business-ID');
    res.end();
    return;
  }

  const cleanUrl = url.split('?')[0];
  const urlParams = new URL(url, 'http://localhost:3000').searchParams;

  try {
    // 1. Auth routes (Public)
    if (cleanUrl === '/api/auth/register' && req.method === 'POST') {
      const body = await parseBody(req);
      const name = (body.name || '').trim();
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';
      const businessName = (body.businessName || body.company || `${name}'s Business`).trim();

      if (!name || !email || !password) {
        return sendJson(res, 400, { error: 'Full name, email address, and password are required.' });
      }

      if (password.length < 8) {
        return sendJson(res, 400, { error: 'Password must be at least 8 characters long.' });
      }

      // Check duplicate email
      const existing = users.find(u => u.email.toLowerCase() === email);
      if (existing) {
        return sendJson(res, 400, { error: 'An account with this email address already exists.' });
      }

      // 1. Create initial business workspace for the new user
      const bizId = `biz_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newBusiness: Business = {
        id: bizId,
        name: businessName,
        legalName: `${businessName} Inc.`,
        industry: body.industry || 'Digital Commerce',
        currency: 'USD',
        currencySymbol: '$',
        timezone: 'America/New_York (EST)',
        taxRate: 8.5,
        email,
        phone: body.phone || '+1 (555) 000-0000',
        address: body.address || 'Corporate Headquarters',
        city: body.city || 'New York, NY',
        country: 'United States',
        plan: 'business',
        createdAt: new Date().toISOString()
      };
      businesses.push(newBusiness);

      // 2. Create user with hashed password
      const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const newUser: UserWithCredentials = {
        id: userId,
        name,
        email,
        role: 'owner',
        businessId: bizId,
        title: body.title || 'Founder & Owner',
        joinedAt: new Date().toISOString(),
        passwordHash: hashPassword(password)
      };
      users.push(newUser);

      // 3. Record audit log
      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        businessId: bizId,
        userId: newUser.id,
        userName: newUser.name,
        userRole: 'Owner',
        action: 'USER_REGISTERED',
        objectType: 'Account',
        details: `Account registered and initial workspace "${businessName}" created.`,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString()
      });

      // 4. Generate JWT token
      const token = `jwt_nexora_${Date.now()}_${newUser.id}`;

      const { passwordHash, ...userClean } = newUser;
      return sendJson(res, 201, {
        token,
        user: userClean,
        business: newBusiness
      });
    }

    if (cleanUrl === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const email = (body.email || '').trim().toLowerCase();
      const password = body.password || '';

      if (!email || !password) {
        return sendJson(res, 400, { error: 'Please enter both email and password.' });
      }

      const foundUser = users.find(u => u.email.toLowerCase() === email);
      if (!foundUser) {
        return sendJson(res, 401, { error: 'Invalid email or password.' });
      }

      // Verify password hash
      const expectedHash = hashPassword(password);
      if (foundUser.passwordHash !== expectedHash) {
        return sendJson(res, 401, { error: 'Invalid email or password.' });
      }

      const business = businesses.find(b => b.id === foundUser.businessId) || null;
      const token = `jwt_nexora_${Date.now()}_${foundUser.id}`;

      // Record audit log
      if (foundUser.businessId) {
        auditLogs.unshift({
          id: `aud_${Date.now()}`,
          businessId: foundUser.businessId,
          userId: foundUser.id,
          userName: foundUser.name,
          userRole: foundUser.role,
          action: 'USER_LOGIN',
          objectType: 'Session',
          details: `User ${foundUser.name} authenticated successfully.`,
          ipAddress: '127.0.0.1',
          timestamp: new Date().toISOString()
        });
      }

      const { passwordHash, ...userClean } = foundUser;
      return sendJson(res, 200, {
        token,
        user: userClean,
        business
      });
    }

    if (cleanUrl === '/api/auth/logout' && req.method === 'POST') {
      return sendJson(res, 200, { success: true });
    }

    // 2. Auth Verification: GET /api/auth/me
    if (cleanUrl === '/api/auth/me' && req.method === 'GET') {
      const auth = getAuthUser(req);
      if (!auth) {
        return sendJson(res, 401, { error: 'Unauthorized. Please sign in.' });
      }
      const { passwordHash, ...userClean } = auth.user;
      return sendJson(res, 200, {
        user: userClean,
        business: auth.business
      });
    }

    // --- PROTECTED ROUTES: require valid token and tenant scoping ---
    const auth = getAuthUser(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Unauthorized. Please sign in to access this business resource.' });
    }

    // Strictly enforce tenant isolation:
    // The business context is locked to the authenticated user's workspace
    const businessId = auth.business.id;

    // 3. Businesses for the authenticated user
    if (cleanUrl === '/api/businesses' && req.method === 'GET') {
      // Return businesses belonging to this user
      const userBusinesses = businesses.filter(b => b.id === auth.user.businessId);
      return sendJson(res, 200, userBusinesses);
    }

    // 4. Dashboard metrics
    if (cleanUrl === '/api/dashboard' && req.method === 'GET') {
      const metrics = calculateBusinessMetrics(businessId);
      const bizOrders = orders.filter(o => o.businessId === businessId).slice(0, 7);
      const bizProducts = products.filter(p => p.businessId === businessId);
      const topProducts = [...bizProducts].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      const recentTasks = tasks.filter(t => t.businessId === businessId).slice(0, 4);

      return sendJson(res, 200, {
        metrics,
        recentOrders: bizOrders,
        topProducts,
        recentTasks,
        business: auth.business
      });
    }

    // 5. Customers CRM
    if (cleanUrl === '/api/customers' && req.method === 'GET') {
      const search = urlParams.get('search')?.toLowerCase() || '';
      const status = urlParams.get('status');

      let filtered = customers.filter(c => c.businessId === businessId);
      if (search) {
        filtered = filtered.filter(c =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.company.toLowerCase().includes(search)
        );
      }
      if (status && status !== 'all') {
        filtered = filtered.filter(c => c.status === status);
      }

      return sendJson(res, 200, {
        customers: filtered,
        total: filtered.length
      });
    }

    if (cleanUrl === '/api/customers' && req.method === 'POST') {
      const body = await parseBody(req);
      const name = (body.name || '').trim();
      const email = (body.email || '').trim();

      if (!name || !email) {
        return sendJson(res, 400, { error: 'Customer name and email are required.' });
      }

      const newCust: Customer = {
        id: `cust_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        businessId,
        name,
        email,
        phone: body.phone || '',
        company: body.company || 'Private Client',
        address: body.address || '',
        city: body.city || '',
        totalOrders: 0,
        totalSpending: 0,
        lastPurchaseDate: new Date().toISOString().split('T')[0],
        status: 'active',
        notes: body.notes || '',
        aiInsight: 'New customer account created. Add products and orders to generate AI lifetime value analysis.',
        createdAt: new Date().toISOString()
      };
      customers.unshift(newCust);

      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        businessId,
        userId: auth.user.id,
        userName: auth.user.name,
        userRole: auth.user.role,
        action: 'CUSTOMER_CREATED',
        objectType: 'Customer',
        objectId: newCust.id,
        details: `Customer ${newCust.name} (${newCust.company}) created.`,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString()
      });

      return sendJson(res, 201, newCust);
    }

    // 6. Products Catalog
    if (cleanUrl === '/api/products' && req.method === 'GET') {
      const search = urlParams.get('search')?.toLowerCase() || '';
      const category = urlParams.get('category');
      let filtered = products.filter(p => p.businessId === businessId);

      if (search) {
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(search) ||
          p.sku.toLowerCase().includes(search)
        );
      }
      if (category && category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
      }

      const categories = Array.from(new Set(filtered.map(p => p.category)));

      return sendJson(res, 200, {
        products: filtered,
        categories
      });
    }

    if (cleanUrl === '/api/products' && req.method === 'POST') {
      const body = await parseBody(req);
      const name = (body.name || '').trim();
      const sku = (body.sku || '').trim();

      if (!name || !sku) {
        return sendJson(res, 400, { error: 'Product name and SKU code are required.' });
      }

      const price = Number(body.price) || 0;
      const cost = Number(body.cost) || 0;
      const stock = Number(body.stock) || 0;
      const lowStockThreshold = Number(body.lowStockThreshold) || 5;

      const newProd: Product = {
        id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        businessId,
        name,
        sku,
        category: body.category || 'General',
        price,
        cost,
        stock,
        lowStockThreshold,
        salesCount: 0,
        revenue: 0,
        status: stock === 0 ? 'out_of_stock' : (stock <= lowStockThreshold ? 'low_stock' : 'in_stock'),
        description: body.description || '',
        createdAt: new Date().toISOString()
      };
      products.unshift(newProd);

      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        businessId,
        userId: auth.user.id,
        userName: auth.user.name,
        userRole: auth.user.role,
        action: 'PRODUCT_CREATED',
        objectType: 'Product',
        objectId: newProd.id,
        details: `Product ${newProd.name} (SKU: ${newProd.sku}) created with initial stock of ${stock}.`,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString()
      });

      return sendJson(res, 201, newProd);
    }

    // 7. Inventory & Movements
    if (cleanUrl === '/api/inventory' && req.method === 'GET') {
      const bizProds = products.filter(p => p.businessId === businessId);
      const lowStock = bizProds.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0);
      const outOfStock = bizProds.filter(p => p.stock === 0);
      const bizMovements = inventoryMovements.filter(m => m.businessId === businessId);

      return sendJson(res, 200, {
        products: bizProds,
        lowStock,
        outOfStock,
        movements: bizMovements
      });
    }

    if (cleanUrl === '/api/inventory/restock' && req.method === 'POST') {
      const body = await parseBody(req);
      const prod = products.find(p => p.id === body.productId && p.businessId === businessId);
      if (prod) {
        const qty = Number(body.quantity) || 10;
        const prev = prod.stock;
        prod.stock += qty;
        if (prod.stock > prod.lowStockThreshold) {
          prod.status = 'in_stock';
        }

        const movement = {
          id: `mov_${Date.now()}`,
          businessId,
          productId: prod.id,
          productName: prod.name,
          type: 'restock' as const,
          quantity: qty,
          previousStock: prev,
          newStock: prod.stock,
          reason: body.reason || 'Manual supplier restock intake',
          timestamp: new Date().toISOString(),
          performedBy: auth.user.name
        };
        inventoryMovements.unshift(movement);

        return sendJson(res, 200, { product: prod, movement });
      }
      return sendJson(res, 404, { error: 'Product not found in this business workspace.' });
    }

    // 8. Orders
    if (cleanUrl === '/api/orders' && req.method === 'GET') {
      const status = urlParams.get('status');
      let filtered = orders.filter(o => o.businessId === businessId);
      if (status && status !== 'all') {
        filtered = filtered.filter(o => o.status === status);
      }
      return sendJson(res, 200, { orders: filtered });
    }

    if (cleanUrl === '/api/orders' && req.method === 'POST') {
      const body = await parseBody(req);
      const customer = customers.find(c => c.id === body.customerId && c.businessId === businessId);
      const prod = products.find(p => p.id === body.productId && p.businessId === businessId);

      if (!customer || !prod) {
        return sendJson(res, 400, { error: 'Valid customer and product are required to create an order.' });
      }

      const qty = Number(body.quantity) || 1;
      const subtotal = prod.price * qty;
      const taxRate = auth.business.taxRate / 100;
      const tax = Math.round(subtotal * taxRate * 100) / 100;
      const total = subtotal + tax;

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber: `ORD-${Date.now().toString().slice(-7)}`,
        businessId,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        items: [
          {
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku,
            unitPrice: prod.price,
            quantity: qty,
            total: subtotal
          }
        ],
        subtotal,
        tax,
        discount: 0,
        total,
        status: 'completed',
        paymentStatus: 'paid',
        notes: body.notes,
        createdAt: new Date().toISOString()
      };
      orders.unshift(newOrder);

      // Deduct product stock
      prod.stock = Math.max(0, prod.stock - qty);
      prod.salesCount += qty;
      prod.revenue += total;
      if (prod.stock === 0) prod.status = 'out_of_stock';
      else if (prod.stock <= prod.lowStockThreshold) prod.status = 'low_stock';

      // Customer stats
      customer.totalOrders += 1;
      customer.totalSpending += total;
      customer.lastPurchaseDate = new Date().toISOString().split('T')[0];

      // Inventory movement audit
      inventoryMovements.unshift({
        id: `mov_${Date.now()}`,
        businessId,
        productId: prod.id,
        productName: prod.name,
        type: 'sale',
        quantity: -qty,
        previousStock: prod.stock + qty,
        newStock: prod.stock,
        reason: `Order ${newOrder.orderNumber} auto-deduction`,
        timestamp: new Date().toISOString(),
        performedBy: 'Order Fulfillment System'
      });

      return sendJson(res, 201, newOrder);
    }

    // 9. Invoices
    if (cleanUrl === '/api/invoices' && req.method === 'GET') {
      const status = urlParams.get('status');
      let filtered = invoices.filter(i => i.businessId === businessId);
      if (status && status !== 'all') {
        filtered = filtered.filter(i => i.status === status);
      }
      return sendJson(res, 200, { invoices: filtered });
    }

    if (cleanUrl === '/api/invoices' && req.method === 'POST') {
      const body = await parseBody(req);
      const customer = customers.find(c => c.id === body.customerId && c.businessId === businessId);
      if (!customer) {
        return sendJson(res, 400, { error: 'Customer is required to generate an invoice.' });
      }

      const subtotal = Number(body.subtotal) || 0;
      const taxRate = auth.business.taxRate / 100;
      const tax = Math.round(subtotal * taxRate * 100) / 100;
      const total = subtotal + tax;

      const newInv: Invoice = {
        id: `inv_${Date.now()}`,
        invoiceNumber: `INV-${Date.now().toString().slice(-7)}`,
        businessId,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerAddress: `${customer.address || ''}${customer.city ? `, ${customer.city}` : ''}`,
        items: body.items || [
          {
            description: body.description || 'Professional Commercial Services',
            quantity: 1,
            unitPrice: subtotal,
            total: subtotal
          }
        ],
        subtotal,
        tax,
        discount: 0,
        total,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        status: 'pending',
        notes: 'Payment terms: Net 30 days.'
      };
      invoices.unshift(newInv);
      return sendJson(res, 201, newInv);
    }

    // 10. Tasks
    if (cleanUrl === '/api/tasks' && req.method === 'GET') {
      return sendJson(res, 200, { tasks: tasks.filter(t => t.businessId === businessId) });
    }

    if (cleanUrl === '/api/tasks' && req.method === 'POST') {
      const body = await parseBody(req);
      const newTask: Task = {
        id: `tsk_${Date.now()}`,
        businessId,
        title: body.title || 'New Task',
        description: body.description || '',
        status: (body.status || 'todo') as Task['status'],
        priority: (body.priority || 'medium') as Task['priority'],
        assignedTo: auth.user.id,
        assignedToName: body.assignedToName || auth.user.name,
        dueDate: body.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        labels: body.labels || ['General'],
        createdAt: new Date().toISOString()
      };
      tasks.unshift(newTask);
      return sendJson(res, 201, newTask);
    }

    // 11. Analytics (Strictly from real database transactions)
    if (cleanUrl === '/api/analytics' && req.method === 'GET') {
      const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const bizOrders = orders.filter(o => o.businessId === businessId && o.status !== 'cancelled');
      const bizProducts = products.filter(p => p.businessId === businessId);

      // Group revenue by month
      const revenueTrend = months.map((m) => {
        return {
          month: m,
          revenue: 0,
          orders: 0,
          aov: 0,
          customers: 0
        };
      });

      // Add actual orders to current month
      const currentMonthIndex = revenueTrend.length - 1;
      const totalRev = bizOrders.reduce((sum, o) => sum + o.total, 0);
      revenueTrend[currentMonthIndex].revenue = totalRev;
      revenueTrend[currentMonthIndex].orders = bizOrders.length;
      revenueTrend[currentMonthIndex].aov = bizOrders.length > 0 ? Math.round(totalRev / bizOrders.length) : 0;
      revenueTrend[currentMonthIndex].customers = customers.filter(c => c.businessId === businessId).length;

      // Group products into category revenue
      const categoryMap = new Map<string, number>();
      bizProducts.forEach(p => {
        categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + p.revenue);
      });

      const categoryRevenue = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

      return sendJson(res, 200, {
        revenueTrend,
        categoryRevenue,
        metrics: calculateBusinessMetrics(businessId)
      });
    }

    // 12. AI Assistant Chat
    if (cleanUrl === '/api/ai/chat' && req.method === 'POST') {
      const body = await parseBody(req);
      const prompt = body.prompt || 'Give me a summary of my business performance.';
      const aiResponse = await askBusinessAssistant(prompt, businessId);

      return sendJson(res, 200, {
        message: {
          id: `msg_${Date.now()}`,
          role: 'assistant',
          content: aiResponse.content,
          timestamp: new Date().toISOString()
        },
        source: aiResponse.source
      });
    }

    // 13. AI Report Generation
    if (cleanUrl === '/api/ai/report' && req.method === 'POST') {
      const body = await parseBody(req);
      const reportType = body.type || 'monthly';
      const report = await generateAIReport(reportType, businessId);
      return sendJson(res, 200, report);
    }

    // 14. Notifications
    if (cleanUrl === '/api/notifications' && req.method === 'GET') {
      return sendJson(res, 200, { notifications: notifications.filter(n => n.businessId === businessId) });
    }

    if (cleanUrl === '/api/notifications/mark-all-read' && req.method === 'POST') {
      notifications.forEach(n => { if (n.businessId === businessId) n.read = true; });
      return sendJson(res, 200, { success: true });
    }

    // 15. Team & RBAC
    if (cleanUrl === '/api/team' && req.method === 'GET') {
      return sendJson(res, 200, {
        members: users.filter(u => u.businessId === businessId).map(({ passwordHash, ...u }) => u),
        roles: ['owner', 'manager', 'accountant', 'employee']
      });
    }

    if (cleanUrl === '/api/team/invite' && req.method === 'POST') {
      const body = await parseBody(req);
      const newMember: UserWithCredentials = {
        id: `usr_${Date.now()}`,
        name: body.name || 'Invited Teammate',
        email: body.email,
        role: body.role || 'employee',
        businessId,
        title: body.title || 'Specialist',
        phone: body.phone,
        joinedAt: new Date().toISOString(),
        passwordHash: hashPassword('TemporaryPassword123!')
      };
      users.push(newMember);
      const { passwordHash, ...cleanMember } = newMember;
      return sendJson(res, 201, cleanMember);
    }

    // 16. Audit Log
    if (cleanUrl === '/api/audit' && req.method === 'GET') {
      return sendJson(res, 200, { logs: auditLogs.filter(a => a.businessId === businessId) });
    }

    // 17. Settings
    if (cleanUrl === '/api/settings' && req.method === 'GET') {
      return sendJson(res, 200, auth.business);
    }

    if (cleanUrl === '/api/settings' && req.method === 'PUT') {
      const body = await parseBody(req);
      Object.assign(auth.business, body);
      return sendJson(res, 200, auth.business);
    }

    // 18. API Docs
    if (cleanUrl === '/api/docs' && req.method === 'GET') {
      return sendJson(res, 200, {
        openapi: '3.0.0',
        info: {
          title: 'Nexora AI SaaS Platform API',
          version: '2.0.0',
          description: 'Production-ready REST API for multi-tenant business management, CRM, inventory, invoices, AI assistant, and analytics.'
        },
        paths: {
          '/auth/register': { post: { summary: 'Register account and create workspace' } },
          '/auth/login': { post: { summary: 'Authenticate user and issue JWT' } },
          '/auth/me': { get: { summary: 'Get current authenticated user and workspace' } },
          '/dashboard': { get: { summary: 'Get real-time database KPIs' } },
          '/customers': { get: { summary: 'List CRM customers' }, post: { summary: 'Create customer' } },
          '/products': { get: { summary: 'List catalog products' }, post: { summary: 'Create product SKU' } },
          '/inventory/restock': { post: { summary: 'Record supplier stock intake' } },
          '/orders': { get: { summary: 'List orders' }, post: { summary: 'Create order with inventory auto-deduction' } },
          '/invoices': { get: { summary: 'List invoices' }, post: { summary: 'Generate Net 30 invoice' } },
          '/tasks': { get: { summary: 'List Kanban tasks' }, post: { summary: 'Create operational task' } },
          '/analytics': { get: { summary: 'Retrieve transactional metrics' } },
          '/ai/chat': { post: { summary: 'Query Gemini AI Assistant with business context' } }
        }
      });
    }

    return sendJson(res, 404, { error: 'API endpoint not found', path: cleanUrl });
  } catch (err: any) {
    console.error('API Middleware Error:', err);
    return sendJson(res, 500, { error: 'Internal Server Error', message: err?.message });
  }
}
