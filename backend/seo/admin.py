from django.contrib import admin

from core.admin import image_preview
from core.admin_site import cms_admin_site
from seo.models import Redirect, SEOMeta


class SEOMetaInline(admin.StackedInline):
    model = SEOMeta
    can_delete = False
    fieldsets = (
        ('General SEO', {
            'fields': ('seo_title', 'meta_description', 'focus_keyword', 'canonical_url', 'meta_robots'),
        }),
        ('Social Sharing', {
            'fields': ('og_title', 'og_description', 'og_image', 'og_image_preview', 'og_url'),
        }),
        ('Schema', {
            'fields': ('schema_type', 'custom_schema_json'),
        }),
        ('Sitemap', {
            'fields': ('include_in_sitemap',),
        }),
        ('Content SEO', {
            'fields': ('author_name', 'author_bio', 'author_image', 'author_image_preview', 'word_count'),
            'description': 'Author fields apply to blog-type pages only.',
        }),
    )
    readonly_fields = ('og_image_preview', 'author_image_preview')

    def og_image_preview(self, obj):
        return image_preview(obj, 'og_image')

    def author_image_preview(self, obj):
        return image_preview(obj, 'author_image')


@admin.register(Redirect, site=cms_admin_site)
class RedirectAdmin(admin.ModelAdmin):
    list_display = ('old_path', 'new_path', 'redirect_type', 'is_active', 'created_at')
    list_filter = ('redirect_type', 'is_active')
    list_editable = ('is_active',)
    search_fields = ('old_path', 'new_path')
    readonly_fields = ('created_at',)
