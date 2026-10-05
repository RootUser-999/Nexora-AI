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

// Initial Businesses
export const businesses: Business[] = [
  {
    id: 'biz_nexora_labs',
    name: 'Nexora Labs',
    legalName: 'Nexora Labs Inc.',
    industry: 'Digital Commerce & SaaS',
    currency: 'USD',
    currencySymbol: '$',
    timezone: 'America/New_York (EST)',
    taxRate: 8.5,
    email: 'contact@nexoralabs.io',
    phone: '+1 (555) 349-8200',
    address: '450 Lexington Avenue, Suite 1900',
    city: 'New York, NY 10017',
    country: 'United States',
    plan: 'business',
    createdAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 'biz_apex_retail',
    name: 'Apex Modern Living',
    legalName: 'Apex Living Global LLC',
    industry: 'Omnichannel Retail',
    currency: 'USD',
    currencySymbol: '$',
    timezone: 'America/Los_Angeles (PST)',
    taxRate: 7.25,
    email: 'operations@apexmodern.com',
    phone: '+1 (555) 890-4421',
    address: '9200 Wilshire Blvd, Suite 400',
    city: 'Beverly Hills, CA 90212',
    country: 'United States',
    plan: 'pro',
    createdAt: '2025-06-15T11:30:00Z',
  }
];

// Initial Users
export const users: User[] = [
  {
    id: 'usr_sarah_owner',
    name: 'Sarah Jenkins',
    email: 'demo@nexora.local',
    role: 'owner',
    businessId: 'biz_nexora_labs',
    title: 'Founder & CEO',
    phone: '+1 (555) 349-8201',
    joinedAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 'usr_alex_manager',
    name: 'Alex Rivera',
    email: 'alex.rivera@nexoralabs.io',
    role: 'manager',
    businessId: 'biz_nexora_labs',
    title: 'Operations Director',
    phone: '+1 (555) 349-8204',
    joinedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 'usr_marcus_accountant',
    name: 'Marcus Vance',
    email: 'marcus.vance@nexoralabs.io',
    role: 'accountant',
    businessId: 'biz_nexora_labs',
    title: 'Chief Financial Controller',
    phone: '+1 (555) 349-8208',
    joinedAt: '2025-02-15T14:20:00Z',
  },
  {
    id: 'usr_elena_employee',
    name: 'Elena Rostova',
    email: 'elena.rostova@nexoralabs.io',
    role: 'employee',
    businessId: 'biz_nexora_labs',
    title: 'Support & Fulfillment Lead',
    phone: '+1 (555) 349-8212',
    joinedAt: '2025-03-01T08:45:00Z',
  },
];

// Seed generator for 30+ products
const rawProducts = [
  { name: 'Nexora Edge Hub Pro', sku: 'NXR-E100', category: 'Hardware', price: 499, cost: 210, stock: 42, threshold: 15 },
  { name: 'UltraSync Wireless Gateway', sku: 'NXR-GW20', category: 'Hardware', price: 289, cost: 130, stock: 18, threshold: 12 },
  { name: 'Quantum Core IoT Sensor Node', sku: 'NXR-SN05', category: 'IoT Devices', price: 89, cost: 34, stock: 6, threshold: 15 }, // low stock
  { name: 'Nexora Enterprise Cloud Suite', sku: 'SFT-ENT-01', category: 'Software', price: 1200, cost: 80, stock: 999, threshold: 50 },
  { name: 'Team Productivity License (10 Users)', sku: 'SFT-TP-10', category: 'Software', price: 450, cost: 20, stock: 999, threshold: 50 },
  { name: 'Ergonomic Developer Desk Pad', sku: 'ACC-DP01', category: 'Accessories', price: 65, cost: 22, stock: 84, threshold: 20 },
  { name: 'Thermal Power Sensor Probe', sku: 'NXR-TP44', category: 'IoT Devices', price: 145, cost: 58, stock: 4, threshold: 10 }, // low stock
  { name: 'Thunderbolt 4 Smart Docking Station', sku: 'ACC-TB04', category: 'Hardware', price: 239, cost: 110, stock: 26, threshold: 10 },
  { name: 'OmniFlow API Connector Addon', sku: 'SFT-OF-01', category: 'Software', price: 320, cost: 15, stock: 999, threshold: 50 },
  { name: 'Industrial RFID Reader Barcode Scanner', sku: 'NXR-RF80', category: 'Hardware', price: 379, cost: 165, stock: 14, threshold: 8 },
  { name: 'Magnetic Acoustic Shielding Pod', sku: 'ACC-SH02', category: 'Accessories', price: 180, cost: 72, stock: 3, threshold: 8 }, // low stock
  { name: 'High-Speed NVMe Storage Vault 4TB', sku: 'HRD-NV04', category: 'Hardware', price: 420, cost: 215, stock: 31, threshold: 10 },
  { name: 'Realtime Fleet Telematics Dongle', sku: 'IOT-FL01', category: 'IoT Devices', price: 195, cost: 75, stock: 0, threshold: 10 }, // out of stock
  { name: 'Nexora AI Smart Assistant Extension', sku: 'SFT-AI-EXT', category: 'Software', price: 240, cost: 10, stock: 999, threshold: 50 },
  { name: 'Dual 4K DisplayPort Hub Splitter', sku: 'ACC-DP02', category: 'Accessories', price: 119, cost: 48, stock: 52, threshold: 15 },
  { name: 'Optic Fiber Transceiver 10Gbps', sku: 'NET-OP10', category: 'Networking', price: 85, cost: 32, stock: 78, threshold: 20 },
  { name: 'Managed PoE+ Switch 24-Port', sku: 'NET-SW24', category: 'Networking', price: 650, cost: 310, stock: 9, threshold: 10 }, // low stock
  { name: 'Rackmount UPS Power Backup 1500VA', sku: 'PWR-UP15', category: 'Hardware', price: 540, cost: 260, stock: 12, threshold: 6 },
  { name: 'Nexora Security Compliance Module', sku: 'SFT-SEC-01', category: 'Software', price: 890, cost: 40, stock: 999, threshold: 50 },
  { name: 'Wireless Precision Ergonomic Mouse', sku: 'ACC-WM01', category: 'Accessories', price: 79, cost: 28, stock: 110, threshold: 25 },
  { name: 'Mechanical Low-Profile Keyboard', sku: 'ACC-KB01', category: 'Accessories', price: 149, cost: 62, stock: 65, threshold: 20 },
  { name: 'Smart Environmental Monitor', sku: 'IOT-ENV-01', category: 'IoT Devices', price: 169, cost: 64, stock: 22, threshold: 10 },
  { name: 'Edge AI Vision Camera Module', sku: 'IOT-CAM-01', category: 'IoT Devices', price: 340, cost: 145, stock: 17, threshold: 8 },
  { name: 'Gigabit Mesh Router Node', sku: 'NET-MSH-01', category: 'Networking', price: 199, cost: 85, stock: 35, threshold: 12 },
  { name: 'Server Rack Cable Organizer Kit', sku: 'ACC-CB01', category: 'Accessories', price: 45, cost: 14, stock: 140, threshold: 30 },
  { name: 'SaaS Analytics Dashboard Pro Pack', sku: 'SFT-DSH-01', category: 'Software', price: 490, cost: 25, stock: 999, threshold: 50 },
  { name: 'Automated Backup Appliance 8TB', sku: 'HRD-BK08', category: 'Hardware', price: 780, cost: 390, stock: 11, threshold: 5 },
  { name: 'Industrial Temperature Probe Sensor', sku: 'IOT-TP02', category: 'IoT Devices', price: 115, cost: 44, stock: 5, threshold: 10 }, // low stock
  { name: 'High-Gain Directional Wi-Fi Antenna', sku: 'NET-ANT-01', category: 'Networking', price: 95, cost: 36, stock: 45, threshold: 15 },
  { name: 'Nexora Multi-Branch Sync Service', sku: 'SFT-MB-01', category: 'Software', price: 650, cost: 30, stock: 999, threshold: 50 },
  { name: 'Smart Electronic Shelf Tag Kit (50pc)', sku: 'IOT-ST50', category: 'IoT Devices', price: 590, cost: 240, stock: 8, threshold: 10 }, // low stock
  { name: 'Precision USB-C Power Meter Dongle', sku: 'ACC-PM01', category: 'Accessories', price: 55, cost: 18, stock: 92, threshold: 20 }
];

export const products: Product[] = rawProducts.map((p, idx) => {
  const salesCount = 15 + Math.floor((idx * 7) % 65);
  const revenue = salesCount * p.price;
  let status: Product['status'] = 'in_stock';
  if (p.stock === 0) status = 'out_of_stock';
  else if (p.stock <= p.threshold) status = 'low_stock';

  return {
    id: `prod_${idx + 1}`,
    businessId: 'biz_nexora_labs',
    name: p.name,
    sku: p.sku,
    category: p.category,
    price: p.price,
    cost: p.cost,
    stock: p.stock,
    lowStockThreshold: p.threshold,
    salesCount,
    revenue,
    status,
    description: `High-reliability commercial ${p.name.toLowerCase()} engineered for modern SME digital infrastructure.`,
    createdAt: '2025-01-15T10:00:00Z',
  };
});

// Seed 105 realistic customers
const firstNames = ['David', 'Elena', 'Marcus', 'Sophia', 'James', 'Aria', 'Liam', 'Chloe', 'Oliver', 'Zoe', 'Lucas', 'Maya', 'Ethan', 'Isabella', 'Alexander', 'Mia', 'Benjamin', 'Amelia', 'Henry', 'Harper', 'Sebastian', 'Evelyn', 'Jack', 'Abigail', 'Noah'];
const lastNames = ['Sterling', 'Chen', 'Vance', 'Dubois', 'Kowalski', 'Moretti', 'Nakamura', 'Patel', 'Mercer', 'Blackwood', 'Alvarez', 'Fischer', 'Thornton', 'Svensson', 'Kearney', 'Zhang', 'O\'Connor', 'Novak', 'Sinclair', 'Castillo'];
const companies = [
  'Veloce Logistics', 'Apex Retail Group', 'Hyperion Media', 'CloudScale Dynamics', 'Lumina Health',
  'Summit Fintech', 'Krypton Labs', 'Pinnacle Supply Co.', 'BlueHorizon Ventures', 'Stratis Engineering',
  'Orion Creative', 'NextGen Robotics', 'Aegis Security', 'Terraform Studio', 'Pulse Distribution'
];
const cities = ['New York, NY', 'Austin, TX', 'San Francisco, CA', 'Seattle, WA', 'Chicago, IL', 'Boston, MA', 'Denver, CO', 'Miami, FL', 'Atlanta, GA', 'San Diego, CA'];

export const customers: Customer[] = Array.from({ length: 105 }, (_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  const comp = companies[i % companies.length];
  const city = cities[i % cities.length];
  const ordersCount = 1 + ((i * 3 + 2) % 18);
  const avgOrder = 300 + ((i * 47) % 1200);
  const totalSpending = ordersCount * avgOrder;
  const daysAgo = (i * 4) % 180;
  const lastPurchase = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];

  let status: Customer['status'] = 'active';
  if (daysAgo > 75) status = 'inactive';
  if (ordersCount === 1 && daysAgo > 40) status = 'lead';

  let aiInsight = `Consistent quarterly purchaser. High affinity for ${products[i % products.length].category}. Predicted repeat purchase within 21 days.`;
  if (daysAgo > 60) {
    aiInsight = `Account dormant for ${daysAgo} days. Recommend automated reactivation workflow with 10% catalog discount.`;
  } else if (totalSpending > 8000) {
    aiInsight = `Top-tier enterprise VIP customer. Highest lifetime value in ${comp}. Recommend assigned VIP account manager check-in.`;
  }

  return {
    id: `cust_${i + 1}`,
    businessId: 'biz_nexora_labs',
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${comp.toLowerCase().replace(/[^a-z]/g, '')}.com`,
    phone: `+1 (555) ${100 + (i % 900)}-${2000 + i}`,
    company: comp,
    address: `${100 + (i * 12)} Innovation Way, Suite ${i + 10}`,
    city,
    totalOrders: ordersCount,
    totalSpending,
    lastPurchaseDate: lastPurchase,
    status,
    notes: `Primary procurement contact at ${comp}. Key requirements: high uptime and consolidated billing.`,
    aiInsight,
    createdAt: new Date(Date.now() - (250 + i * 2) * 86400000).toISOString(),
  };
});

// Seed 320 realistic orders over the past 12 months
export const orders: Order[] = Array.from({ length: 320 }, (_, i) => {
  const customer = customers[i % customers.length];
  const prod1 = products[i % products.length];
  const prod2 = products[(i * 3 + 7) % products.length];
  const qty1 = 1 + (i % 4);
  const qty2 = (i % 3 === 0) ? 1 + (i % 2) : 0;

  const items = [
    {
      productId: prod1.id,
      productName: prod1.name,
      sku: prod1.sku,
      unitPrice: prod1.price,
      quantity: qty1,
      total: prod1.price * qty1
    }
  ];

  if (qty2 > 0) {
    items.push({
      productId: prod2.id,
      productName: prod2.name,
      sku: prod2.sku,
      unitPrice: prod2.price,
      quantity: qty2,
      total: prod2.price * qty2
    });
  }

  const subtotal = items.reduce((acc, curr) => acc + curr.total, 0);
  const discount = (i % 5 === 0) ? Math.round(subtotal * 0.1) : 0;
  const taxable = subtotal - discount;
  const tax = Math.round(taxable * 0.085);
  const total = taxable + tax;

  const daysAgo = Math.floor((i / 320) * 360);
  const date = new Date(Date.now() - daysAgo * 86400000 - (i % 24) * 3600000).toISOString();

  let status: Order['status'] = 'completed';
  let paymentStatus: Order['paymentStatus'] = 'paid';

  if (daysAgo < 3) {
    status = (i % 2 === 0) ? 'pending' : 'processing';
    paymentStatus = (i % 2 === 0) ? 'pending' : 'paid';
  } else if (i % 31 === 0) {
    status = 'cancelled';
    paymentStatus = 'failed';
  } else if (i % 47 === 0) {
    status = 'refunded';
    paymentStatus = 'refunded';
  }

  return {
    id: `ord_${i + 1}`,
    orderNumber: `ORD-${2025000 + i + 1}`,
    businessId: 'biz_nexora_labs',
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    items,
    subtotal,
    tax,
    discount,
    total,
    status,
    paymentStatus,
    notes: i % 4 === 0 ? 'Expedited courier delivery requested. Leave with front desk.' : undefined,
    createdAt: date,
  };
});

// Seed 110 realistic invoices
export const invoices: Invoice[] = Array.from({ length: 110 }, (_, i) => {
  const customer = customers[(i * 2) % customers.length];
  const prod = products[(i * 4) % products.length];
  const daysAgo = (i * 3) % 150;
  const issueDate = new Date(Date.now() - daysAgo * 86400000).toISOString().split('T')[0];
  const dueDays = 30;
  const dueDate = new Date(Date.now() - (daysAgo - dueDays) * 86400000).toISOString().split('T')[0];

  const qty = 1 + (i % 5);
  const unitPrice = prod.price;
  const subtotal = qty * unitPrice;
  const tax = Math.round(subtotal * 0.085);
  const discount = (i % 6 === 0) ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount + tax;

  const now = new Date().toISOString().split('T')[0];
  let status: Invoice['status'] = 'paid';

  if (daysAgo < 20) {
    status = 'pending';
  } else if (dueDate < now && i % 4 === 0) {
    status = 'overdue';
  } else if (i % 25 === 0) {
    status = 'cancelled';
  }

  return {
    id: `inv_${i + 1}`,
    invoiceNumber: `INV-${2025000 + i + 1}`,
    businessId: 'biz_nexora_labs',
    customerId: customer.id,
    customerName: customer.name,
    customerEmail: customer.email,
    customerAddress: customer.address + ', ' + customer.city,
    items: [
      {
        description: prod.name + ' - Enterprise Delivery & License',
        quantity: qty,
        unitPrice,
        total: subtotal
      }
    ],
    subtotal,
    tax,
    discount,
    total,
    issueDate,
    dueDate,
    status,
    notes: 'Payment terms: Net 30 days. Wire transfer or ACH accepted. Thank you for choosing Nexora.'
  };
});

// Seed Tasks
export const tasks: Task[] = [
  {
    id: 'tsk_1',
    businessId: 'biz_nexora_labs',
    title: 'Audit Q3 low-stock alert thresholds for IoT sensor nodes',
    description: 'Review Quantum Core and Thermal Power sensor supply contracts before next sprint.',
    status: 'in_progress',
    priority: 'urgent',
    assignedTo: 'usr_alex_manager',
    assignedToName: 'Alex Rivera',
    dueDate: '2026-10-12',
    labels: ['Inventory', 'Suppliers'],
    createdAt: '2026-10-01T10:00:00Z',
  },
  {
    id: 'tsk_2',
    businessId: 'biz_nexora_labs',
    title: 'Reconcile 7 overdue enterprise invoices for Veloce Logistics',
    description: 'Verify payment receipt with Treasury and issue polite statement reminder.',
    status: 'todo',
    priority: 'high',
    assignedTo: 'usr_marcus_accountant',
    assignedToName: 'Marcus Vance',
    dueDate: '2026-10-14',
    labels: ['Finance', 'Invoices'],
    createdAt: '2026-10-02T11:00:00Z',
  },
  {
    id: 'tsk_3',
    businessId: 'biz_nexora_labs',
    title: 'Implement automated VIP reactivation email flow',
    description: 'Set up automated reminder sequence for customers inactive for 60+ days.',
    status: 'todo',
    priority: 'medium',
    assignedTo: 'usr_sarah_owner',
    assignedToName: 'Sarah Jenkins',
    dueDate: '2026-10-18',
    labels: ['CRM', 'Growth'],
    createdAt: '2026-10-02T15:30:00Z',
  },
  {
    id: 'tsk_4',
    businessId: 'biz_nexora_labs',
    title: 'Verify dispatch of 14 Edge Hub Pro systems for Apex Retail',
    description: 'Double check serial numbers and tracking links uploaded to orders portal.',
    status: 'completed',
    priority: 'medium',
    assignedTo: 'usr_elena_employee',
    assignedToName: 'Elena Rostova',
    dueDate: '2026-10-04',
    labels: ['Fulfillment', 'Hardware'],
    createdAt: '2026-09-28T09:00:00Z',
  },
  {
    id: 'tsk_5',
    businessId: 'biz_nexora_labs',
    title: 'Prepare quarterly tax & revenue summary report for board',
    description: 'Export sales reports and generate executive AI narrative summary.',
    status: 'in_progress',
    priority: 'high',
    assignedTo: 'usr_marcus_accountant',
    assignedToName: 'Marcus Vance',
    dueDate: '2026-10-20',
    labels: ['Finance', 'Executive'],
    createdAt: '2026-10-03T14:00:00Z',
  },
  {
    id: 'tsk_6',
    businessId: 'biz_nexora_labs',
    title: 'Update hardware warranty specifications in product catalog',
    description: 'Attach updated 3-year enterprise warranty PDF to all docking and hub products.',
    status: 'todo',
    priority: 'low',
    assignedTo: 'usr_elena_employee',
    assignedToName: 'Elena Rostova',
    dueDate: '2026-10-25',
    labels: ['Catalog', 'Documentation'],
    createdAt: '2026-10-04T12:00:00Z',
  }
];

// Seed Notifications
export const notifications: Notification[] = [
  {
    id: 'notif_1',
    businessId: 'biz_nexora_labs',
    title: 'Low Inventory Alert: 5 Products Critical',
    message: 'Quantum Core IoT Sensor Node and Realtime Fleet Telematics Dongle are below safety threshold.',
    type: 'inventory',
    read: false,
    createdAt: '2026-10-05T08:30:00Z',
    link: '/inventory',
  },
  {
    id: 'notif_2',
    businessId: 'biz_nexora_labs',
    title: 'New High-Value Order #ORD-2025319',
    message: 'Customer Apex Retail Group placed an order for $3,450.00.',
    type: 'order',
    read: false,
    createdAt: '2026-10-05T07:15:00Z',
    link: '/orders',
  },
  {
    id: 'notif_3',
    businessId: 'biz_nexora_labs',
    title: '7 Invoices Are Overdue',
    message: 'Totaling $8,420.00 across 4 corporate client accounts.',
    type: 'invoice',
    read: false,
    createdAt: '2026-10-04T16:00:00Z',
    link: '/invoices',
  },
  {
    id: 'notif_4',
    businessId: 'biz_nexora_labs',
    title: 'AI Growth Recommendation',
    message: 'Revenue increased 18.4% this month. Hardware Edge Hub Pro drove 42% of total margin.',
    type: 'ai',
    read: true,
    createdAt: '2026-10-03T09:00:00Z',
    link: '/ai-assistant',
  },
  {
    id: 'notif_5',
    businessId: 'biz_nexora_labs',
    title: 'Payment Received: $2,840.00',
    message: 'Invoice #INV-2025098 paid in full via ACH transfer.',
    type: 'payment',
    read: true,
    createdAt: '2026-10-02T13:45:00Z',
    link: '/invoices',
  }
];

// Seed Audit Logs
export const auditLogs: AuditLog[] = [
  {
    id: 'aud_1',
    businessId: 'biz_nexora_labs',
    userId: 'usr_sarah_owner',
    userName: 'Sarah Jenkins',
    userRole: 'Owner',
    action: 'USER_LOGIN',
    objectType: 'Session',
    details: 'Authenticated successfully via JWT demo session.',
    ipAddress: '198.51.100.42',
    timestamp: '2026-10-05T09:30:00Z',
  },
  {
    id: 'aud_2',
    businessId: 'biz_nexora_labs',
    userId: 'usr_alex_manager',
    userName: 'Alex Rivera',
    userRole: 'Manager',
    action: 'PRODUCT_UPDATED',
    objectType: 'Product',
    objectId: 'prod_1',
    details: 'Updated inventory threshold for Nexora Edge Hub Pro to 15.',
    ipAddress: '198.51.100.88',
    timestamp: '2026-10-05T08:15:00Z',
  },
  {
    id: 'aud_3',
    businessId: 'biz_nexora_labs',
    userId: 'usr_marcus_accountant',
    userName: 'Marcus Vance',
    userRole: 'Accountant',
    action: 'INVOICE_GENERATED',
    objectType: 'Invoice',
    objectId: 'inv_109',
    details: 'Generated and queued PDF invoice INV-2025109 for Apex Retail Group ($3,743.25).',
    ipAddress: '198.51.100.67',
    timestamp: '2026-10-04T15:20:00Z',
  },
  {
    id: 'aud_4',
    businessId: 'biz_nexora_labs',
    userId: 'usr_sarah_owner',
    userName: 'Sarah Jenkins',
    userRole: 'Owner',
    action: 'BUSINESS_SETTINGS_SAVED',
    objectType: 'Settings',
    details: 'Updated default invoice terms and tax calculation schema.',
    ipAddress: '198.51.100.42',
    timestamp: '2026-10-03T11:45:00Z',
  }
];

// Seed Inventory Movements
export const inventoryMovements: InventoryMovement[] = [
  {
    id: 'mov_1',
    businessId: 'biz_nexora_labs',
    productId: 'prod_1',
    productName: 'Nexora Edge Hub Pro',
    type: 'restock',
    quantity: 25,
    previousStock: 17,
    newStock: 42,
    reason: 'Monthly manufacturer restock delivery received',
    timestamp: '2026-10-03T10:00:00Z',
    performedBy: 'Alex Rivera'
  },
  {
    id: 'mov_2',
    businessId: 'biz_nexora_labs',
    productId: 'prod_3',
    productName: 'Quantum Core IoT Sensor Node',
    type: 'sale',
    quantity: -10,
    previousStock: 16,
    newStock: 6,
    reason: 'Fulfillment for order #ORD-2025310',
    timestamp: '2026-10-04T14:20:00Z',
    performedBy: 'System Auto-Deduction'
  },
  {
    id: 'mov_3',
    businessId: 'biz_nexora_labs',
    productId: 'prod_13',
    productName: 'Realtime Fleet Telematics Dongle',
    type: 'sale',
    quantity: -5,
    previousStock: 5,
    newStock: 0,
    reason: 'Fulfillment for order #ORD-2025315 - Stock Depleted',
    timestamp: '2026-10-04T17:40:00Z',
    performedBy: 'System Auto-Deduction'
  }
];

// AI Conversations
export const conversations: AIConversation[] = [
  {
    id: 'conv_1',
    businessId: 'biz_nexora_labs',
    title: 'Monthly Revenue & Margin Deep-Dive',
    updatedAt: '2026-10-05T09:15:00Z',
    messages: [
      {
        id: 'msg_1',
        role: 'user',
        content: 'How much revenue did we generate this month and how does it compare to last month?',
        timestamp: '2026-10-05T09:14:00Z',
      },
      {
        id: 'msg_2',
        role: 'assistant',
        content: `### Executive Performance Summary\n\nFor the current 30-day billing cycle, **Nexora Labs** generated **$24,850.00** across **48 fulfilled customer orders**, representing an **18.4% increase** over the preceding month ($20,975.00).\n\nKey drivers of this expansion:\n* **Hardware Edge Hub Pro** accounted for $8,982.00 (36.1% of total top-line revenue).\n* **Average Order Value (AOV)** rose from $445.00 to **$517.70** (+16.3%).\n* Enterprise client retention remained exceptional at **94.2%**.\n\n### Strategic Recommendation\nReplenish inventory for **Quantum Core IoT Sensor Nodes** immediately, as current run rate indicates stockout risk within 4 days.`,
        timestamp: '2026-10-05T09:15:00Z',
        structuredCard: {
          type: 'metric_comparison',
          title: 'Monthly Performance Comparison',
          items: [
            { label: 'Current 30 Days', value: '$24,850.00', trend: '+18.4%', isPositive: true },
            { label: 'Previous 30 Days', value: '$20,975.00' },
            { label: 'Net Profit Margin', value: '44.8%', trend: '+3.2%', isPositive: true },
            { label: 'Average Order Value', value: '$517.70', trend: '+16.3%', isPositive: true }
          ],
          highlight: 'Revenue growth exceeded Q3 forecast target of +12.0%.'
        }
      }
    ]
  }
];

// Helper calculations to provide structured data to Gemini and dashboard
export function calculateBusinessMetrics(businessId: string): BusinessMetrics {
  const bizOrders = orders.filter(o => o.businessId === businessId && o.status !== 'cancelled');
  const bizInvoices = invoices.filter(i => i.businessId === businessId);
  const bizCustomers = customers.filter(c => c.businessId === businessId);
  const bizProducts = products.filter(p => p.businessId === businessId);

  // Revenue in last 30 days vs previous 30 days
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

  const currentRev = current30Orders.reduce((sum, o) => sum + o.total, 0) || 24850;
  const prevRev = prev30Orders.reduce((sum, o) => sum + o.total, 0) || 20975;
  const revChange = prevRev > 0 ? Number((((currentRev - prevRev) / prevRev) * 100).toFixed(1)) : 18.4;

  const currentOrderCount = current30Orders.length || 48;
  const prevOrderCount = prev30Orders.length || 41;
  const orderChange = prevOrderCount > 0 ? Number((((currentOrderCount - prevOrderCount) / prevOrderCount) * 100).toFixed(1)) : 17.1;

  const totalCust = bizCustomers.length;
  const custChange = 12.5;

  const overdueInvoices = bizInvoices.filter(i => i.status === 'overdue' || (i.status === 'pending' && i.dueDate < new Date().toISOString().split('T')[0]));
  const outstandingAmount = overdueInvoices.reduce((sum, i) => sum + i.total, 0);

  const lowStockCount = bizProducts.filter(p => p.status === 'low_stock' || p.status === 'out_of_stock').length;
  const aov = currentOrderCount > 0 ? Math.round(currentRev / currentOrderCount) : 518;

  return {
    totalRevenue: currentRev,
    revenueChangePercent: revChange,
    totalOrders: currentOrderCount,
    ordersChangePercent: orderChange,
    totalCustomers: totalCust,
    customersChangePercent: custChange,
    outstandingInvoicesCount: overdueInvoices.length,
    outstandingInvoicesAmount: outstandingAmount,
    invoicesChangePercent: -8.5,
    averageOrderValue: aov,
    lowStockItemsCount: lowStockCount,
  };
}

// Structured business data getters for Gemini
export function getStructuredBusinessContext(businessId: string) {
  const metrics = calculateBusinessMetrics(businessId);
  const bizProducts = products.filter(p => p.businessId === businessId);
  const bizCustomers = customers.filter(c => c.businessId === businessId);
  const bizInvoices = invoices.filter(i => i.businessId === businessId);
  const bizOrders = orders.filter(o => o.businessId === businessId);

  // Top 5 products by revenue
  const topProducts = [...bizProducts]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
    .map(p => ({ name: p.name, sku: p.sku, revenue: p.revenue, salesCount: p.salesCount, stock: p.stock }));

  // Low stock products
  const lowStock = bizProducts
    .filter(p => p.stock <= p.lowStockThreshold)
    .map(p => ({ name: p.name, sku: p.sku, currentStock: p.stock, threshold: p.lowStockThreshold, status: p.status }));

  // Top 5 customers by spending
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
    businessName: 'Nexora Labs',
    industry: 'Digital Commerce & SaaS',
    currency: 'USD ($)',
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
