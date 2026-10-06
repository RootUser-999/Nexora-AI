from rest_framework import permissions

class IsTenantMember(permissions.BasePermission):
    """Verifies that the authenticated user is an active member of the active business."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request, 'business', None) is not None
        )

class IsOwner(permissions.BasePermission):
    """Requires Owner role."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request, 'business_role', None) == 'owner'
        )

class IsManagerOrAbove(permissions.BasePermission):
    """Requires Manager or Owner role."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request, 'business_role', None) in ('owner', 'manager')
        )

class IsAccountantOrAbove(permissions.BasePermission):
    """Requires Accountant, Manager, or Owner role."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            getattr(request, 'business_role', None) in ('owner', 'manager', 'accountant')
        )
