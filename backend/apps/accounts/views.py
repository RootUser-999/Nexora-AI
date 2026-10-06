from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer
from apps.businesses.models import BusinessMembership

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        membership = BusinessMembership.objects.select_related('business').filter(user=user).first()

        return Response({
            'user': UserSerializer(user).data,
            'business': {
                'id': str(membership.business.id),
                'name': membership.business.name,
                'role': membership.role,
            } if membership else None,
            'token': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        memberships = BusinessMembership.objects.filter(user=user, is_active=True).select_related('business')
        active_membership = getattr(request, 'business', None)

        return Response({
            'user': UserSerializer(user).data,
            'memberships': [
                {
                    'business_id': str(m.business.id),
                    'business_name': m.business.name,
                    'role': m.role,
                }
                for m in memberships
            ],
            'active_business': {
                'id': str(request.business.id),
                'name': request.business.name,
                'role': request.business_role,
            } if hasattr(request, 'business') and request.business else None,
        })
