import { GoogleGenAI } from "@google/genai";
import { getStructuredBusinessContext } from "./db.ts";

// Initialize server-side Gemini client with required headers
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

export async function askBusinessAssistant(
  prompt: string,
  businessId: string
) {
  const structuredData = getStructuredBusinessContext(businessId);
  const ai = getGeminiClient();

  // If the account has no records yet, provide real onboarding guidance
  const hasData = structuredData.totalLifetimeOrders > 0 || structuredData.totalCatalogSize > 0 || structuredData.metrics.totalCustomers > 0;

  if (!hasData) {
    return {
      content: `### Business Intelligence Notice\n\n**${structuredData.businessName}** does not have enough transaction activity recorded yet for a financial or operational analysis.\n\nTo unlock automated performance insights, revenue tracking, and inventory alerts:\n* **Create products** in your Product Catalog\n* **Add customers** to your CRM directory\n* **Record your first orders & invoices**\n\nOnce live records exist in your workspace, I will deliver strategic recommendations grounded in your actual numbers.`,
      source: "nexora-engine",
    };
  }

  const systemInstruction = `You are Nexora AI, the executive AI Business Management Assistant for ${
    structuredData.businessName
  } (${structuredData.industry}).
You possess full verified analytical context of the business database:
- 30-Day Revenue: $${structuredData.metrics.totalRevenue.toLocaleString()} (${
    structuredData.metrics.revenueChangePercent >= 0 ? "+" : ""
  }${structuredData.metrics.revenueChangePercent}% vs prior month)
- 30-Day Orders: ${structuredData.metrics.totalOrders} orders
- Average Order Value (AOV): $${structuredData.metrics.averageOrderValue}
- Total Customers: ${structuredData.metrics.totalCustomers} (Inactive/Dormant: ${structuredData.dormantCustomersCount})
- Outstanding/Overdue Invoices: ${structuredData.metrics.outstandingInvoicesCount} invoices totaling $${structuredData.metrics.outstandingInvoicesAmount.toLocaleString()}
- Low Stock Alerts: ${structuredData.metrics.lowStockItemsCount} products below safety inventory threshold
- Top Products: ${JSON.stringify(structuredData.topProducts)}
- Low Stock Items: ${JSON.stringify(structuredData.lowStockProducts)}
- Top Customers: ${JSON.stringify(structuredData.topCustomers)}
- Overdue Invoices: ${JSON.stringify(structuredData.overdueInvoicesSample)}

Guidelines for your response:
1. Always base your numbers and insights directly on the verified context above. Never fabricate data.
2. Structure your response with clean Markdown: use clear bold headings, bullet points, numbers, and percentage comparisons.
3. Provide concrete, actionable business recommendations (e.g. inventory restocks, customer outreach, invoice collections).
4. Tone: Senior COO / VP of Analytics—concise, data-driven, strategic, and professional.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.6,
        },
      });

      const responseText = response.text || "";
      return {
        content: responseText,
        source: "gemini-3.8-flash",
      };
    } catch (error) {
      console.warn("Gemini API call failed, using high-fidelity fallback:", error);
    }
  }

  // Graceful deterministic fallback grounded strictly in real database records
  return {
    content: generateFallbackBusinessResponse(prompt, structuredData),
    source: "local-engine",
  };
}

export async function generateAIReport(
  reportType: "daily" | "weekly" | "monthly" | "sales" | "inventory" | "customer",
  businessId: string
) {
  const structuredData = getStructuredBusinessContext(businessId);
  const prompt = `Generate an executive ${reportType.toUpperCase()} performance report for ${
    structuredData.businessName
  } based on current database records. Include key metrics, trends, warnings, and recommended actions.`;

  const result = await askBusinessAssistant(prompt, businessId);
  return {
    title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Executive Report`,
    generatedAt: new Date().toISOString(),
    content: result.content,
    source: result.source,
  };
}

function generateFallbackBusinessResponse(prompt: string, data: ReturnType<typeof getStructuredBusinessContext>): string {
  const lower = prompt.toLowerCase();

  if (lower.includes("revenue") || lower.includes("sales") || lower.includes("earn")) {
    return `### Revenue Performance Overview

**${data.businessName}** generated **$${data.metrics.totalRevenue.toLocaleString()}** over the trailing 30 days.

* **Orders Processed**: ${data.metrics.totalOrders}
* **Average Order Value (AOV)**: $${data.metrics.averageOrderValue.toFixed(2)}
* **Catalog Size**: ${data.totalCatalogSize} products

${data.topProducts.length > 0 ? `* **Top Performing Product**: ${data.topProducts[0].name} ($${data.topProducts[0].revenue.toLocaleString()})` : "No products recorded yet."}`;
  }

  if (lower.includes("product") || lower.includes("stock") || lower.includes("inventory")) {
    if (data.lowStockProducts.length === 0) {
      return `### Inventory Audit\n\nAll products in **${data.businessName}** are currently at or above healthy safety thresholds (${data.totalCatalogSize} total products tracked).`;
    }
    const lowStockList = data.lowStockProducts.map(p => `* **${p.name}** (SKU: \`${p.sku}\`): **${p.currentStock} units** remaining (Threshold: ${p.threshold})`).join("\n");
    return `### Inventory & Stock Audit\n\nCurrently, **${data.lowStockProducts.length} items** are flagged at or below safety stock levels:\n\n${lowStockList}\n\n**Action**: Authorize replenishment to avoid stockout.`;
  }

  if (lower.includes("customer") || lower.includes("client") || lower.includes("crm")) {
    return `### Customer Base Health\n\n* **Active Accounts**: ${data.metrics.totalCustomers}\n* **Dormant Accounts (>60 days)**: ${data.dormantCustomersCount}\n\n${data.topCustomers.length > 0 ? `* **Top Account**: **${data.topCustomers[0].name}** ($${data.topCustomers[0].totalSpending.toLocaleString()} spend across ${data.topCustomers[0].totalOrders} orders)` : "No customer purchase history recorded yet."}`;
  }

  if (lower.includes("invoice") || lower.includes("overdue") || lower.includes("receivable")) {
    return `### Accounts Receivable Status\n\n* **Overdue Invoices**: ${data.metrics.outstandingInvoicesCount}\n* **Outstanding Balance**: $${data.metrics.outstandingInvoicesAmount.toLocaleString()}\n\nRecommended: Send statement reminders to collect overdue accounts.`;
  }

  return `### Operating Snapshot for ${data.businessName}

* **30-Day Revenue**: $${data.metrics.totalRevenue.toLocaleString()}
* **Orders**: ${data.metrics.totalOrders}
* **Active Accounts**: ${data.metrics.totalCustomers}
* **Catalog Items**: ${data.totalCatalogSize}
* **Pending Overdue**: $${data.metrics.outstandingInvoicesAmount.toLocaleString()}

Ask any specific question about your sales trends, inventory, or overdue invoices.`;
}
