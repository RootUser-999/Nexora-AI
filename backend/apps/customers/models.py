from django.db import models
import uuid
from apps.businesses.models import TenantAwareModel

class Customer(TenantAwareModel):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('lead', 'Lead'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50, blank=True)
    company = models.CharField(max_length=255, blank=True)
    address = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    total_orders = models.PositiveIntegerField(default=0)
    total_spending = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    last_purchase_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    notes = models.TextField(blank=True)
    ai_insight = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['business', 'status']),
            models.Index(fields=['business', 'total_spending']),
        ]

    def __str__(self):
        return f"{self.name} ({self.company})"
