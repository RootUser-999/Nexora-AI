from rest_framework import serializers
from django.contrib.auth import get_user_model
from apps.businesses.models import Business, BusinessMembership

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'title', 'phone', 'is_active', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(write_only=True, required=False, default="My Business")
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'business_name', 'title']

    def create(self, validated_data):
        business_name = validated_data.pop('business_name', 'My Business')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        # Create foundational business for the newly registered user
        business = Business.objects.create(
            name=business_name,
            legal_name=f"{business_name} Inc.",
            industry="Digital Commerce & Technology",
            email=user.email,
        )

        # Assign as Owner
        BusinessMembership.objects.create(
            user=user,
            business=business,
            role='owner'
        )

        return user
