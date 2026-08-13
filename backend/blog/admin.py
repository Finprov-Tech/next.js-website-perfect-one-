from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from blog.models import Author, BlogCategory, BlogPost, BlogPostSection
from core.admin import AltTextWarningMixin, image_preview
from core.admin_site import cms_admin_site
from seo.admin import SEOMetaInline


@admin.register(BlogCategory, site=cms_admin_site)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'display_order')
    list_editable = ('display_order',)
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Author, site=cms_admin_site)
class AuthorAdmin(AltTextWarningMixin, admin.ModelAdmin):
    list_display = ('name', 'role', 'photo_preview')
    search_fields = ('name', 'role')
    readonly_fields = ('photo_preview',)
    alt_text_image_field = 'photo'
    alt_text_alt_field = 'photo_alt'
    fields = ('name', 'role', 'bio', 'photo', 'photo_preview', 'photo_alt')

    def photo_preview(self, obj):
        return image_preview(obj, 'photo')


class BlogPostSectionInline(admin.TabularInline):
    model = BlogPostSection
    extra = 1
    fields = ('heading', 'body', 'display_order', 'is_active')


@admin.register(BlogPost, site=cms_admin_site)
class BlogPostAdmin(AltTextWarningMixin, SimpleHistoryAdmin):
    list_display = ('title', 'category', 'status', 'is_featured', 'published_date', 'updated_at')
    list_filter = ('status', 'category', 'is_featured')
    list_editable = ('status', 'is_featured')
    search_fields = ('title', 'excerpt', 'slug')
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ('created_at', 'updated_at', 'cover_image_preview')
    autocomplete_fields = ('category', 'author')
    inlines = [BlogPostSectionInline, SEOMetaInline]
    alt_text_image_field = 'cover_image'
    alt_text_alt_field = 'cover_image_alt'
    fieldsets = (
        (None, {'fields': ('title', 'slug', 'category', 'status', 'is_featured', 'display_order')}),
        ('Content', {'fields': ('excerpt',)}),
        ('Byline', {'fields': ('author', 'published_date', 'read_time')}),
        ('Cover Image', {'fields': ('cover_image', 'cover_image_preview', 'cover_image_alt')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    def cover_image_preview(self, obj):
        return image_preview(obj, 'cover_image')
