# Nexora AI — AI-Powered Business Management SaaS

Nexora AI is an enterprise-grade, multi-tenant business management and intelligence platform tailored for digital commerce, scaling SMEs, and distributed operational teams.

Built with a modern full-stack architecture combining a robust REST API layer, PostgreSQL relational schemas, Celery background queues, and deep server-side Google Gemini 3.8 Flash intelligence, Nexora unifies CRM, real-time inventory control, commercial billing, task execution, and proactive executive analytics into a single high-performance SaaS platform.

---

## 🌟 Key Capabilities

### 1. Executive AI Business Assistant
* **Database-Grounded Reasoning**: Unlike generic chatbots, Nexora aggregates live transactional data (`calculateBusinessMetrics`, product margin distributions, customer order frequency, overdue Net 30 balances) before invoking Google's `gemini-3.8-flash` model.
* **Proactive Strategic Cards**: Produces structured comparative performance cards, KPI trajectories, and replenishment alerts directly in the conversation canvas.
* **Deterministic Fallback Engine**: If an external AI provider key is unavailable or rate-limited, the local analytical intelligence engine delivers accurate, verified database metrics with zero downtime.

### 2. Multi-Tenant Business Architecture
* **Strict Tenant Isolation**: Every customer, product, order, invoice, and task record is hard-scoped to a specific `business_id`.
* **Workspace Switcher**: Seamlessly switch between business workspaces (e.g. *Nexora Labs* vs. *Apex Modern Living*) with instant contextual state recalibration.

### 3. Comprehensive CRM (Customer Management)
* Directory of 100+ pre-seeded enterprise customer profiles.
* Automated customer lifetime value (LTV), total purchase volume, and recency tracking.
* AI-generated customer affinity scores and churn risk predictions.
* CSV export and import capabilities.

### 4. Products & Real-Time Inventory Control
* Full SKU catalog management with automated unit cost margin calculation.
* Real-time stock movement audit log tracking manual restocks, sales deductions, and vendor deliveries.
* Automatic low-stock safety threshold triggers and urgent dashboard alerts.

### 5. Transactional Order Management
* Multi-item order creation with automatic product stock deduction.
* Sales tax (8.5%) and discretionary commercial discount calculation.
* Complete order lifecycle transitions (`Pending` → `Processing` → `Completed` → `Cancelled` / `Refunded`).

### 6. Commercial Invoicing & PDF Engine
* Itemized Net 30/60 billing with ACH wire transfer details.
* Dedicated print-optimized and downloadable PDF invoice views.
* Payment status tracking (`Paid`, `Pending`, `Overdue`, `Cancelled`).

### 7. Interactive Kanban & Task System
* Lightweight agile project management with Kanban board and tabular list views.
* Priority levels (`Low`, `Medium`, `High`, `Urgent`) and assignee coordination.

### 8. Financial & Cohort Analytics
* Interactive Recharts data visualizations: 12-month revenue trajectory, order volume velocity, and category revenue distribution.
* Period filtering across 7-day, 30-day, 90-day, and 12-month horizons.

### 9. Role-Based Access Control (RBAC) & Audit Trails
* Pre-configured roles: **Owner** (unrestricted), **Manager** (operations & catalog), **Accountant** (billing & invoices), and **Employee** (order fulfillment & tasks).
* Immutable chronological audit trail recording timestamps, client IP addresses, actor identities, and mutation events.

---

## 🏗 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Recharts, Lucide Icons, Motion |
| **Backend** | Python 3.11, Django 5.x, Django REST Framework, SimpleJWT, Celery, Redis |
| **Database** | PostgreSQL 15, Multi-tenant foreign key scoping, Relational constraints |
| **AI Intelligence** | Google Gemini API (`@google/genai` TypeScript SDK on server / `google-generativeai` Python service), Model: `gemini-3.8-flash` |
| **DevOps** | Docker, Docker Compose, Multi-stage builds |

---

## 🚀 Quick Start Guide

### Option 1: Live Interactive Node/Vite Environment (Current Applet)

The repository is configured to launch the full-stack interactive client and REST middleware automatically:

```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev
```

Visit `http://localhost:3000` to interact with the SaaS application. Click **"Explore Demo"** for instant 1-click access to the pre-seeded *Nexora Labs* environment.

### Option 2: Docker Compose (Full-Stack Django + Postgres + Redis + Celery)

```bash
# Clone the repository
git clone https://github.com/your-username/nexora-ai-saas.git
cd nexora-ai-saas

# Configure environment variables
cp .env.example .env

# Build and start all multi-container services
docker compose up --build
```

---

## 🔑 Demo Account Credentials

A pre-populated demo environment is available out of the box:

* **Email**: `demo@nexora.local`
* **Role**: `Owner` (Full access)
* **Pre-Seeded Data**:
  * 1 Primary Business (*Nexora Labs Inc.*)
  * 105 Corporate CRM Customers
  * 32 Commercial Product SKUs
  * 320 Customer Orders
  * 110 Commercial Invoices
  * Active Kanban tasks and low-stock replenishment alerts

You can also simulate different RBAC permissions dynamically by selecting **Role** in the top navigation bar.

---

## 📡 REST API Reference

The platform provides OpenAPI 3.0 documented REST endpoints:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/login` | `POST` | Authenticate user & issue JWT access token |
| `/api/dashboard` | `GET` | Retrieve aggregated KPIs and recent order records |
| `/api/customers` | `GET` / `POST` | List, filter, or create customer CRM records |
| `/api/products` | `GET` / `POST` | Query catalog SKUs or add inventory items |
| `/api/inventory/restock`| `POST` | Intake incoming vendor replenishment shipments |
| `/api/orders` | `GET` / `POST` | Query order pipelines or generate customer orders |
| `/api/invoices` | `GET` / `POST` | Retrieve or generate Net 30 printable invoices |
| `/api/tasks` | `GET` / `POST` | Kanban sprint tasks management |
| `/api/analytics` | `GET` | Multi-period revenue, AOV, and category metrics |
| `/api/ai/chat` | `POST` | Inquire with Gemini AI Assistant using business data |
| `/api/ai/report` | `POST` | Synthesize executive operational performance report |
| `/api/audit` | `GET` | View chronological security and mutation audit trail |

Visit `/api/docs` in the app navigation for the interactive Swagger-like endpoint explorer and copyable cURL snippets.

---

## 🔒 Security & Tenant Isolation

1. **Object-Level Tenant Scoping**: All queries filter strictly by `business_id` in database operations.
2. **Safe Prompt Injection Prevention**: No passwords, tokens, or raw unindexed relational tables are passed to Gemini AI. Only verified numerical aggregations are transmitted.
3. **Environment Security**: Sensitive keys (`SECRET_KEY`, `GEMINI_API_KEY`, database credentials) are managed exclusively through environment variables.
