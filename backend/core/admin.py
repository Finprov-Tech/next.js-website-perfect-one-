from django.contrib import admin, messages
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


class AltTextWarningMixin:
    """Non-blocking `messages.warning` when an image is set but its alt text is blank.

    Field names default to the MediaFieldsMixin convention (`image`/`image_alt`);
    override `alt_text_image_field`/`alt_text_alt_field` per ModelAdmin for models
    that name theirs differently (e.g. `avatar`/`avatar_alt`, `logo`/`logo_alt`).
    """

    alt_text_image_field = 'image'
    alt_text_alt_field = 'image_alt'

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        image = getattr(obj, self.alt_text_image_field, None)
        alt_text = getattr(obj, self.alt_text_alt_field, '')
        if image and not alt_text:
            messages.warning(
                request,
                f'"{obj}" has an image set on "{self.alt_text_image_field}" but no alt text on '
                f'"{self.alt_text_alt_field}" — add one for accessibility and SEO.',
            )


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
