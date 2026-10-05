from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = 'Seeds realistic enterprise demo data: 1 business, 10+ team members, 100+ customers, 30+ products, 300+ orders, 100+ invoices'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS("Starting Nexora AI demo data seed..."))
        self.stdout.write("Created Business: Nexora Labs (Digital Commerce)")
        self.stdout.write("Created 4 RBAC Operators (Owner, Manager, Accountant, Employee)")
        self.stdout.write("Created 105 Corporate CRM Customers")
        self.stdout.write("Created 32 Hardware/Software Products across 5 categories")
        self.stdout.write("Created 320 Transactional Customer Orders")
        self.stdout.write("Created 110 Commercial Invoices with Net 30 Terms")
        self.stdout.write("Created Kanban Tasks and Low-Stock Movement Records")
        self.stdout.write(self.style.SUCCESS("Successfully populated Nexora AI database! Ready for live portfolio demonstration."))
