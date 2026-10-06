from django.db import models
import uuid

from django.db import models
from django.core.exceptions import PermissionDenied
import threading
import uuid

# Thread-local storage to track active business per request
_thread_locals = threading.local()

def set_current_business(business):
    """Sets the active tenant business on thread-local storage."""
    _thread_locals.business = business

def get_current_business():
    """Gets the active tenant business from thread-local storage."""
    return getattr(_thread_locals, 'business', None)

def clear_current_business():
    """Clears the tenant context."""
    if hasattr(_thread_locals, 'business'):
        del _thread_locals.business


class Business(models.Model):
    """Core tenant model representing a business workspace."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    legal_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    currency = models.CharField(max_length=10, default='USD')
    currency_symbol = models.CharField(max_length=5, default='$')
    timezone = models.CharField(max_length=50, default='America/New_York')
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=8.5)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100, default='United States')
    plan = models.CharField(
        max_length=20,
        choices=[('free', 'Free'), ('pro', 'Pro'), ('business', 'Business')],
        default='business'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Businesses'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.currency})"


class BusinessMembership(models.Model):
    """Represents a user's role and membership within a specific business tenant."""
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('manager', 'Manager'),
        ('accountant', 'Accountant'),
        ('employee', 'Employee'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='memberships')
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'business')
        indexes = [
            models.Index(fields=['user', 'business']),
            models.Index(fields=['business', 'role']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.business.name} ({self.role})"


class TenantQuerySet(models.QuerySet):
    """Ensures QuerySets filter automatically by active tenant."""
    def filter_by_tenant(self, business=None):
        biz = business or get_current_business()
        if biz:
            return self.filter(business=biz)
        return self


class TenantManager(models.Manager):
    """
    Manager that automatically isolates database queries by tenant.
    Prevents cross-tenant data leakage.
    """
    def get_queryset(self):
        qs = TenantQuerySet(self.model, using=self._db)
        biz = get_current_business()
        if biz:
            return qs.filter(business=biz)
        return qs


class TenantAwareModel(models.Model):
    """
    Abstract base model that enforces multi-tenant tenant isolation.
    Every tenant-owned model (Customer, Product, Order, Invoice, Task) inherits from this.
    """
    business = models.ForeignKey(
        Business,
        on_delete=models.CASCADE,
        related_name="%(app_label)s_%(class)s_set",
        db_index=True
    )

    objects = TenantManager()
    all_objects = models.Manager()  # For administrative / migration cross-tenant operations

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        # Automatically assign active tenant if not set
        if not hasattr(self, 'business') or not self.business_id:
            current_biz = get_current_business()
            if current_biz:
                self.business = current_biz
            else:
                raise PermissionDenied("Cannot save tenant-scoped model without an active business context.")
        super().save(*args, **kwargs)

