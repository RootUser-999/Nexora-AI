from rest_framework import serializers
from .models import Business, BusinessMembership

class BusinessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Business
        fields = [
            'id', 'name', 'legal_name', 'industry', 'currency', 'currency_symbol',
            'timezone', 'tax_rate', 'email', 'phone', 'address', 'city', 'country',
            'plan', 'is_active', 'created_at', 'updated_at'
        ]

class BusinessMembershipSerializer(serializers.ModelSerializer):
    business = BusinessSerializer(read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = BusinessMembership
        fields = ['id', 'user', 'user_email', 'user_name', 'business', 'role', 'is_active', 'joined_at']
