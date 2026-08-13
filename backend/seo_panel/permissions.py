from rest_framework.permissions import BasePermission

SEO_TEAM_GROUP = 'SEO Team'


class IsSEOTeamMember(BasePermission):
    """Allows superusers, or staff who belong to the 'SEO Team' group.

    Everyone else (including anonymous requests and unrelated staff/API
    users) is refused — this is the sole gate on every seo_panel endpoint.
    """

    def has_permission(self, request, view):
        user = request.user
        if not (user and user.is_authenticated):
            return False
        if user.is_superuser:
            return True
        return user.is_staff and user.groups.filter(name=SEO_TEAM_GROUP).exists()
