from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Business, BusinessMembership
from .serializers import BusinessSerializer, BusinessMembershipSerializer
from .permissions import IsOwner, IsTenantMember

class BusinessViewSet(viewsets.ModelViewSet):
    """
    ViewSet for listing user-accessible businesses, creating a new business,
    or updating current business settings.
    """
    serializer_class = BusinessSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only return businesses where the user has active membership
        return Business.objects.filter(memberships__user=self.request.user, memberships__is_active=True)

    def perform_create(self, serializer):
        # Auto-create Owner membership upon business creation
        business = serializer.save()
        BusinessMembership.objects.create(
            user=self.request.user,
            business=business,
            role='owner'
        )

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsTenantMember])
    def members(self, request, pk=None):
        business = self.get_object()
        memberships = BusinessMembership.objects.filter(business=business).select_related('user')
        serializer = BusinessMembershipSerializer(memberships, many=True)
        return Response(serializer.data)
