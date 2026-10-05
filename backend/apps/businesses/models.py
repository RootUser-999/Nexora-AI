from django.db import models
import uuid

class Business(models.Model):
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
    plan = models.CharField(max_length=20, choices=[('free', 'Free'), ('pro', 'Pro'), ('business', 'Business')], default='business')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class BusinessMembership(models.Model):
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('manager', 'Manager'),
        ('accountant', 'Accountant'),
        ('employee', 'Employee'),
    ]
    user = models.ForeignKey('accounts.User', on_delete=models.CASCADE, related_name='memberships')
    business = models.ForeignKey(Business, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employee')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'business')
