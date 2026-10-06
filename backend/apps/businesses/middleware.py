from django.utils.deprecation import MiddlewareMixin
from django.core.exceptions import PermissionDenied
from .models import Business, BusinessMembership, set_current_business, clear_current_business

class TenantMiddleware(MiddlewareMixin):
    """
    Middleware that establishes the active tenant context for the request.
    Extracts business ID from:
    1. 'X-Business-ID' HTTP Header
    2. 'business_id' Query parameter
    3. User's primary active business membership
    """

    def process_request(self, request):
        clear_current_business()
        request.business = None

        business_id = request.headers.get('X-Business-ID') or request.GET.get('business_id')

        if request.user.is_authenticated:
            if business_id:
                try:
                    membership = BusinessMembership.objects.select_related('business').get(
                        user=request.user,
                        business_id=business_id,
                        is_active=True
                    )
                    request.business = membership.business
                    request.business_role = membership.role
                    set_current_business(membership.business)
                except BusinessMembership.DoesNotExist:
                    # User does not have access to requested business
                    raise PermissionDenied("You do not have authorization to access this business tenant.")
            else:
                # Default to user's first active business
                membership = BusinessMembership.objects.select_related('business').filter(
                    user=request.user,
                    is_active=True
                ).first()
                if membership:
                    request.business = membership.business
                    request.business_role = membership.role
                    set_current_business(membership.business)

    def process_response(self, request, response):
        clear_current_business()
        return response

    def process_exception(self, request, exception):
        clear_current_business()
        return None
