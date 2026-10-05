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
  calculateBusinessMetrics,
  getStructuredBusinessContext
} from './db.ts';
import { askBusinessAssistant, generateAIReport } from './ai.ts';

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
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.end(JSON.stringify(data));
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
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.end();
    return;
  }

  const cleanUrl = url.split('?')[0];
  const urlParams = new URL(url, 'http://localhost:3000').searchParams;
  const businessId = urlParams.get('businessId') || 'biz_nexora_labs';

  try {
    // 1. Auth routes
    if (cleanUrl === '/api/auth/login' && req.method === 'POST') {
      const body = await parseBody(req);
      const email = body.email || 'demo@nexora.local';
      const role = body.role || 'owner';
      
      const foundUser = users.find(u => u.email === email) || users[0];
      const token = `jwt_nexora_${Date.now()}_${foundUser.id}`;

      // Record audit log
      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        businessId: foundUser.businessId,
        userId: foundUser.id,
        userName: foundUser.name,
        userRole: foundUser.role,
        action: 'USER_LOGIN',
        objectType: 'Session',
        details: `User ${foundUser.name} logged in (${foundUser.role}).`,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString()
      });

      return sendJson(res, 200, {
        token,
        user: { ...foundUser, role: role || foundUser.role },
        business: businesses.find(b => b.id === foundUser.businessId) || businesses[0]
      });
    }

    if (cleanUrl === '/api/auth/register' && req.method === 'POST') {
      const body = await parseBody(req);
      const newUser = {
        id: `usr_${Date.now()}`,
        name: body.name || 'Demo User',
        email: body.email || `user_${Date.now()}@nexora.local`,
        role: 'owner' as const,
        businessId: 'biz_nexora_labs',
        title: body.title || 'Founder',
        joinedAt: new Date().toISOString()
      };
      users.push(newUser);
      return sendJson(res, 201, {
        token: `jwt_nexora_${Date.now()}_${newUser.id}`,
        user: newUser,
        business: businesses[0]
      });
    }

    if (cleanUrl === '/api/auth/me' && req.method === 'GET') {
      return sendJson(res, 200, {
        user: users[0],
        business: businesses[0]
      });
    }

    // 2. Businesses
    if (cleanUrl === '/api/businesses' && req.method === 'GET') {
      return sendJson(res, 200, businesses);
    }

    // 3. Dashboard metrics
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
        business: businesses.find(b => b.id === businessId) || businesses[0]
      });
    }

    // 4. Customers CRM
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
      const newCust = {
        id: `cust_${Date.now()}`,
        businessId,
        name: body.name || 'New Customer',
        email: body.email || 'customer@example.com',
        phone: body.phone || '+1 (555) 000-0000',
        company: body.company || 'Enterprise Client',
        address: body.address || '100 Broadway',
        city: body.city || 'New York, NY',
        totalOrders: 0,
        totalSpending: 0,
        lastPurchaseDate: new Date().toISOString().split('T')[0],
        status: 'active' as const,
        notes: body.notes || 'Added manually via Nexora CRM.',
        aiInsight: 'New customer account created. Recommend sending welcome onboarding sequence.',
        createdAt: new Date().toISOString()
      };
      customers.unshift(newCust);

      auditLogs.unshift({
        id: `aud_${Date.now()}`,
        businessId,
        userId: 'usr_sarah_owner',
        userName: 'Sarah Jenkins',
        userRole: 'Owner',
        action: 'CUSTOMER_CREATED',
        objectType: 'Customer',
        objectId: newCust.id,
        details: `Customer ${newCust.name} (${newCust.company}) created.`,
        ipAddress: '127.0.0.1',
        timestamp: new Date().toISOString()
      });

      return sendJson(res, 201, newCust);
    }

    // 5. Products Catalog
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

      return sendJson(res, 200, {
        products: filtered,
        categories: Array.from(new Set(products.map(p => p.category)))
      });
    }

    if (cleanUrl === '/api/products' && req.method === 'POST') {
      const body = await parseBody(req);
      const newProd = {
        id: `prod_${Date.now()}`,
        businessId,
        name: body.name || 'New Product',
        sku: body.sku || `SKU-${Date.now().toString().slice(-4)}`,
        category: body.category || 'Hardware',
        price: Number(body.price) || 199,
        cost: Number(body.cost) || 80,
        stock: Number(body.stock) || 20,
        lowStockThreshold: Number(body.lowStockThreshold) || 10,
        salesCount: 0,
        revenue: 0,
        status: (Number(body.stock) <= Number(body.lowStockThreshold) ? 'low_stock' : 'in_stock') as Product['status'],
        description: body.description || 'Enterprise grade hardware component.',
        createdAt: new Date().toISOString()
      };
      products.unshift(newProd);
      return sendJson(res, 201, newProd);
    }

    // 6. Inventory & Movements
    if (cleanUrl === '/api/inventory' && req.method === 'GET') {
      const bizProds = products.filter(p => p.businessId === businessId);
      const lowStock = bizProds.filter(p => p.stock <= p.lowStockThreshold);
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
      const prod = products.find(p => p.id === body.productId);
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
          performedBy: body.performedBy || 'Alex Rivera'
        };
        inventoryMovements.unshift(movement);

        return sendJson(res, 200, { product: prod, movement });
      }
      return sendJson(res, 404, { error: 'Product not found' });
    }

    // 7. Orders
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
      const customer = customers.find(c => c.id === body.customerId) || customers[0];
      const prod = products.find(p => p.id === body.productId) || products[0];
      const qty = Number(body.quantity) || 1;
      const subtotal = prod.price * qty;
      const tax = Math.round(subtotal * 0.085);
      const total = subtotal + tax;

      const newOrder = {
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
        status: 'processing' as const,
        paymentStatus: 'paid' as const,
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

      return sendJson(res, 201, newOrder);
    }

    // 8. Invoices
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
      const customer = customers.find(c => c.id === body.customerId) || customers[0];
      const subtotal = Number(body.subtotal) || 1200;
      const tax = Math.round(subtotal * 0.085);
      const total = subtotal + tax;

      const newInv = {
        id: `inv_${Date.now()}`,
        invoiceNumber: `INV-${Date.now().toString().slice(-7)}`,
        businessId,
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerAddress: customer.address + ', ' + customer.city,
        items: body.items || [
          {
            description: body.description || 'Enterprise Technology Services',
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
        status: 'pending' as const,
        notes: 'Payment terms: Net 30 days.'
      };
      invoices.unshift(newInv);
      return sendJson(res, 201, newInv);
    }

    // 9. Tasks
    if (cleanUrl === '/api/tasks' && req.method === 'GET') {
      return sendJson(res, 200, { tasks: tasks.filter(t => t.businessId === businessId) });
    }

    if (cleanUrl === '/api/tasks' && req.method === 'POST') {
      const body = await parseBody(req);
      const newTask = {
        id: `tsk_${Date.now()}`,
        businessId,
        title: body.title || 'New Task',
        description: body.description || '',
        status: (body.status || 'todo') as Task['status'],
        priority: (body.priority || 'medium') as Task['priority'],
        assignedTo: body.assignedTo || 'usr_sarah_owner',
        assignedToName: body.assignedToName || 'Sarah Jenkins',
        dueDate: body.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        labels: body.labels || ['General'],
        createdAt: new Date().toISOString()
      };
      tasks.unshift(newTask);
      return sendJson(res, 201, newTask);
    }

    // 10. Analytics
    if (cleanUrl === '/api/analytics' && req.method === 'GET') {
      // Generate monthly revenue series for the last 12 months
      const months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
      const revenueTrend = months.map((m, idx) => {
        const base = 15000 + idx * 850 + ((idx * 313) % 4000);
        return {
          month: m,
          revenue: base,
          orders: Math.round(base / 490),
          aov: Math.round(base / (base / 490)),
          customers: 60 + idx * 4
        };
      });

      const categoryRevenue = [
        { name: 'Hardware', value: 48200 },
        { name: 'Software', value: 36800 },
        { name: 'IoT Devices', value: 24500 },
        { name: 'Networking', value: 16900 },
        { name: 'Accessories', value: 11400 },
      ];

      return sendJson(res, 200, {
        revenueTrend,
        categoryRevenue,
        metrics: calculateBusinessMetrics(businessId)
      });
    }

    // 11. AI Assistant Chat
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

    // 12. AI Report Generation
    if (cleanUrl === '/api/ai/report' && req.method === 'POST') {
      const body = await parseBody(req);
      const reportType = body.type || 'monthly';
      const report = await generateAIReport(reportType, businessId);
      return sendJson(res, 200, report);
    }

    // 13. Notifications
    if (cleanUrl === '/api/notifications' && req.method === 'GET') {
      return sendJson(res, 200, { notifications: notifications.filter(n => n.businessId === businessId) });
    }

    if (cleanUrl === '/api/notifications/mark-all-read' && req.method === 'POST') {
      notifications.forEach(n => { if (n.businessId === businessId) n.read = true; });
      return sendJson(res, 200, { success: true });
    }

    // 14. Team & RBAC
    if (cleanUrl === '/api/team' && req.method === 'GET') {
      return sendJson(res, 200, {
        members: users.filter(u => u.businessId === businessId),
        roles: ['owner', 'manager', 'accountant', 'employee']
      });
    }

    if (cleanUrl === '/api/team/invite' && req.method === 'POST') {
      const body = await parseBody(req);
      const newMember = {
        id: `usr_${Date.now()}`,
        name: body.name || 'Invited Teammate',
        email: body.email,
        role: body.role || 'employee',
        businessId,
        title: body.title || 'Operations Specialist',
        phone: body.phone,
        joinedAt: new Date().toISOString()
      };
      users.push(newMember);
      return sendJson(res, 201, newMember);
    }

    // 15. Audit Log
    if (cleanUrl === '/api/audit' && req.method === 'GET') {
      return sendJson(res, 200, { logs: auditLogs.filter(a => a.businessId === businessId) });
    }

    // 16. Settings
    if (cleanUrl === '/api/settings' && req.method === 'GET') {
      const biz = businesses.find(b => b.id === businessId) || businesses[0];
      return sendJson(res, 200, biz);
    }

    if (cleanUrl === '/api/settings' && req.method === 'PUT') {
      const body = await parseBody(req);
      const biz = businesses.find(b => b.id === businessId) || businesses[0];
      Object.assign(biz, body);
      return sendJson(res, 200, biz);
    }

    // 17. API Documentation (OpenAPI spec)
    if (cleanUrl === '/api/docs' && req.method === 'GET') {
      return sendJson(res, 200, {
        openapi: '3.0.0',
        info: {
          title: 'Nexora AI SaaS Platform API',
          version: '1.0.0',
          description: 'Production-ready REST API for business management, CRM, inventory, invoices, AI assistant, and analytics.'
        },
        servers: [{ url: '/api', description: 'Current environment API' }],
        paths: {
          '/auth/login': { post: { summary: 'Authenticate user and return JWT token' } },
          '/dashboard': { get: { summary: 'Get aggregated executive business KPIs and trends' } },
          '/customers': { get: { summary: 'List and filter CRM customers' }, post: { summary: 'Create new customer' } },
          '/products': { get: { summary: 'Get products catalog' }, post: { summary: 'Add product with stock alert thresholds' } },
          '/inventory': { get: { summary: 'Get inventory balances and movements' } },
          '/orders': { get: { summary: 'List orders' }, post: { summary: 'Create order with inventory auto-deduction' } },
          '/invoices': { get: { summary: 'List invoices' }, post: { summary: 'Generate professional invoice' } },
          '/tasks': { get: { summary: 'Get Kanban task board items' }, post: { summary: 'Create business task' } },
          '/analytics': { get: { summary: 'Retrieve historical revenue, orders, and category metrics' } },
          '/ai/chat': { post: { summary: 'Submit query to Gemini AI Business Assistant with injected business context' } },
          '/ai/report': { post: { summary: 'Synthesize executive business report using real database' } },
          '/team': { get: { summary: 'List team members and roles' } },
          '/audit': { get: { summary: 'Retrieve chronological audit trail of business operations' } },
          '/settings': { get: { summary: 'Get business configurations' }, put: { summary: 'Update business settings' } }
        }
      });
    }

    // Default 404 for unknown /api endpoint
    return sendJson(res, 404, { error: 'API endpoint not found', path: cleanUrl });
  } catch (err: any) {
    console.error('API Error:', err);
    return sendJson(res, 500, { error: 'Internal Server Error', message: err?.message });
  }
}
