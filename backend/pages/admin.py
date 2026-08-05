from django.contrib import admin
from simple_history.admin import SimpleHistoryAdmin

from core.admin_site import cms_admin_site
from pages.models import Page, PageType
from seo.admin import SEOMetaInline


@admin.register(PageType, site=cms_admin_site)
class PageTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'created_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at',)


@admin.register(Page, site=cms_admin_site)
class PageAdmin(SimpleHistoryAdmin):
    list_display = ('name', 'slug', 'page_type', 'status', 'is_homepage', 'module_count', 'updated_at')
    list_filter = ('page_type', 'status', 'is_homepage')
    list_editable = ('status',)
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('created_at', 'updated_at')
    inlines = [SEOMetaInline]
    fieldsets = (
        (None, {'fields': ('name', 'slug', 'page_type', 'is_homepage', 'status')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at')}),
    )

    MODULE_RELATED_NAMES = (
        'banner_set', 'scrollsection_set', 'credentials_set', 'coursesection_set',
        'whyfinprovsection_set', 'placementsection_set',
        'cta_set', 'testimonial_set', 'partnerlogo_set', 'faqitem_set',
    )

    @admin.display(description='Modules')
    def module_count(self, obj):
        return sum(getattr(obj, name).count() for name in self.MODULE_RELATED_NAMES)
