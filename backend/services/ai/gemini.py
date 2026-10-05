import os
import google.generativeai as genai

class GeminiAIService:
    def __init__(self):
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.model_name = os.getenv('GEMINI_MODEL', 'gemini-3.8-flash')
        if self.api_key:
            genai.configure(api_key=self.api_key)

    def is_available(self) -> bool:
        return bool(self.api_key and self.api_key != "MY_GEMINI_API_KEY")

    def generate_business_insight(self, prompt: str, business_context: dict) -> str:
        if not self.is_available():
            return "Nexora Local Analytics Engine: AI key not configured. Using database metrics."

        system_instruction = f"""
You are Nexora AI, the executive COO & Business Analytics Assistant for {business_context.get('business_name')}.
Context:
- Trailing Revenue: ${business_context.get('total_revenue', 0):,}
- Active Customers: {business_context.get('total_customers', 0)}
- Overdue Invoices: {business_context.get('overdue_count', 0)}
- Low-Stock Products: {business_context.get('low_stock_count', 0)}

Provide precise, actionable, professional executive advice in clean Markdown format.
"""
        model = genai.GenerativeModel(
            model_name=self.model_name,
            system_instruction=system_instruction
        )
        response = model.generate_content(prompt)
        return response.text
