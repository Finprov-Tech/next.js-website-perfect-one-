from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.contrib.auth.models import Group, User
from django.utils.html import format_html

from core.admin_site import cms_admin_site
from core.models import SiteSettings

cms_admin_site.register(User, UserAdmin)
cms_admin_site.register(Group, GroupAdmin)


def image_preview(obj, field_name='image', height=60):
    """Reusable readonly image-preview renderer for ModelAdmins."""
    file = getattr(obj, field_name, None)
    if not file:
        return '(no image)'
    return format_html('<img src="{}" style="height:{}px;object-fit:contain;" />', file.url, height)


@admin.register(SiteSettings, site=cms_admin_site)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('site_name',)
    fieldsets = (
        ('Branding', {'fields': ('site_name', 'site_logo', 'site_logo_preview', 'default_og_image', 'default_og_image_preview')}),
        ('Custom 404 Page', {'fields': ('custom_404_title', 'custom_404_message', 'custom_404_image', 'custom_404_image_preview')}),
    )
    readonly_fields = ('site_logo_preview', 'default_og_image_preview', 'custom_404_image_preview')

    def site_logo_preview(self, obj):
        return image_preview(obj, 'site_logo')

    def default_og_image_preview(self, obj):
        return image_preview(obj, 'default_og_image')

    def custom_404_image_preview(self, obj):
        return image_preview(obj, 'custom_404_image')

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
